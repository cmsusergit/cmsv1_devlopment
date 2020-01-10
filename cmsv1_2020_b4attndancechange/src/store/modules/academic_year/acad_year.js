import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  acadyearList:[]
};
const getters = {
  getAcademicyearById:state=>id=>{
    return state.acadyearList.find(tt=>tt.ayId==id)
  }
};


const mutations = {
SET_AY_LIST:(state,dt)=>{
  state.acadyearList=dt

},

ADD_AYEAR:(state,dt)=>{
  state.acadyearList.push(dt);
},
REMOVE_AYEAR:(state,id)=>{
    if(state.acadyearList.length==1){
      state.acadyearList=[]
      return;
    }
    state.acadyearList=_.remove(state.acadyearList,(ob)=>{
      return ob.ayId!=id
    })
  }
};
const actions = {
load_academicyear_list:({commit})=>{
  const url1 = '/AcademicYearInfos';
  console.log(url1);
  apiObject.get(url1).then(response=>{
    commit('SET_AY_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
getAcademiyearById({commit},id){
        const url1 = '/AcademicYearInfos/'+id;
        console.log(url1);
        return new Promise((resolve,reject)=>{
          apiObject.get(url1).then(rr => {
            resolve(rr.data)
          }).catch(error => {
            console.log('****',error);
            reject(error)
          });
        }
      );
},
getCurrentAcademiyearId({commit}){
        const ob={where:{isCurrent:true}}
        const url1 = '/AcademicYearInfos/findOne?filter='+JSON.stringify(ob);
        return new Promise((resolve,reject)=>{
          apiObject.get(url1).then(rr => {
            resolve(rr.data)
          }).catch(error => {
            console.log('****',error);
            reject(error)
          });
        }
      );
},
update_academic_year:({commit},dt)=>{
      const url1 = '/AcademicYearInfos/'+dt.ayId;
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,dt)
          .then(rr=>{
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          });
    });
},
add_academic_year:({commit},dt)=>{
      const url1 = '/AcademicYearInfos';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
      .then(rr=>{
        commit('ADD_AYEAR',rr.data)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
remove_academic_year:({commit},id)=>{
      const url1 = '/AcademicYearInfos/'+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
      .then(rr=>{
        commit('REMOVE_AYEAR',id)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
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
