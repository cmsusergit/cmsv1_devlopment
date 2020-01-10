import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  lpList:[],
  lessonPlan:''
};
const getters = {
  getLessonPlanList:(state)=>{
    return state.lpList
  },


  getLessonPlan:(state)=>{
    return state.lessonPlan
  }
};
const mutations = {
SET_LESSONPLAN_LIST:(state,dt)=>{
    state.lpList=dt;
  },
SET_LESSONPLAN:(state,dt)=>{
  state.lessonplan=dt;
}
};

const actions = {
  add_lessonplan:({commit},dt)=>{
    const url1='/LpIds/'
    new Promise(function(resolve, reject) {
        apiObject.post(url1,dt)
          .then(rr=>{
            commit('SET_LESSONPLAN',rr.data)
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error)
            reject(error)
          })
    });
  },
  load_lessonplan_list:({commit},inputOb)=>{
    const ob={where:{ayId:inputOb.ayId,facultyId:inputOb.facultyId}}
    const url1='/LpIds?filter='+JSON.stringify(ob)
    apiObject.get(url1)
      .then(response=>{
        commit('SET_LESSONPLAN_LIST',response.data)
      })
      .catch(error=>{
        console.log('****',error)
        commit('SET_LESSONPLAN_LIST',null)
      })
  },
  load_lessonplan:({commit},dt)=>{
    const ob={
      where:dt
    }
    const url1 = '/LpIds?filter='+JSON.stringify(ob);
    console.log(url1);
    return new Promise((resolve,reject)=>{
      apiObject.get(url1).then(response=>{
        commit('SET_LESSONPLAN',response.data)
        resolve(response.data[0])
      }).catch(error=>{
      console.log('****',error);
      reject(error)
      })
    });
},
load_lessonplan_topic:({commit},unitId)=>{
  const url1 = '/LpUnits/'+unitId+'/lpTopics';
  console.log(url1);
  return new Promise((resolve,reject)=>{
    apiObject.get(url1).then(response=>{
      resolve(response.data)
  }).catch(error=>{
    console.log(error);
    reject(error)
  })
})
},
load_lessonplan_unit:({commit},lpId)=>{
  const url1 = '/LpIds/'+lpId+'/lpUnits';
  console.log(url1);
  return new Promise((resolve,reject)=>{
    apiObject.get(url1).then(response=>{
      resolve(response.data)
  }).catch(error=>{
    console.log(error);
    reject(error)
  })
});
},
add_lp_topic:({commit},dt)=>{
  const url1='/LpTopics/'
  dt.topicId=0
  return new Promise(function(resolve, reject) {
      apiObject.post(url1,dt)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          reject(error)
          console.log('****',error);
        })
    });
   },
   update_lp_topic:({commit},dt)=>{
     dt.onlinePost=dt.onlinePost==true?1:0
     const url1='/LpTopics/'+dt.topicId
     console.log('----',JSON.stringify(dt))
     return new Promise(function(resolve, reject) {
         apiObject.put(url1,dt)
           .then(rr=>{
             resolve(rr.data)
           })
           .catch(error=>{
             reject(error)
             console.log('****',error);
           })
       });
      },
add_lessonplan_unit:({commit},dt)=>{
  const url1='/LpUnits/'
  dt.unitId=0
  return new Promise(function(resolve, reject) {
      apiObject.post(url1,dt)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          reject(error)
          console.log('****',error);
        })

    });
   },
   edit_lessonplan_unit:({commit},dt)=>{
     const url1='/LpUnits/'+dt.unitId
     return new Promise(function(resolve, reject) {
         apiObject.put(url1,dt)
           .then(rr=>{
             resolve(rr.data)
           })
           .catch(error=>{
             reject(error)
             console.log('****',error);
           })

       });
      },
   remove_lp_topic:({commit},id)=>{
      const url1='/LpTopics/'+id
      return new Promise(function(resolve, reject) {
        apiObject.delete(url1)
          .then(rr=>{
            resolve(rr.data)
          })
          .catch(error=>{
            reject(error)
            console.log('****',error);
          })
        });
  },
   remove_lessonplan_unit:({commit},id)=>{
      const url1='/LpUnits/'+id
      const urltopic=url1+'/lpTopics'
      return new Promise(function(resolve, reject) {
        apiObject.delete(urltopic)
          .then(rr=>{
            apiObject.delete(url1)
            .then(tt=>{
                resolve(rr.data)
              })
            .catch(error=>{
              console.log('****',error);
              reject(error)
            })
          })
          .catch(error=>{
            reject(error)
            console.log('****',error);
          })
        });
    },

    updateReference({commit},inOb){
      const url1='/LpIds/'+inOb.lpId
      const ob={
        refBook:inOb.refBook
      }
      return new Promise((resolve,reject)=>{
        apiObject.patch(url1,ob)
            .then(rr=>{
              resolve(rr)
            })
            .catch(error=>{
              reject(error)
            })
      })
    },
    getScheduleListForReport({commit},ob){
      const url1='/DdClassSchedules/getScheduleListForReport'
      return new Promise(function(resolve, reject) {
          apiObject.post(url1,{detail:ob})
            .then(rr=>{
              resolve(rr.data.scheduleList)
            })
            .catch(error=>{
              console.log('****',error);
              reject(error)
            })
      });
    }
}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
