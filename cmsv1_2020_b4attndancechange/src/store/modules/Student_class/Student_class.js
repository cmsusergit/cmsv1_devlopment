import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  allBatchList:[],
  batchList:[],
  classList:[]
};
const getters = {
  batchNameById:state=>id=>{
      return state.allBatchList.find(tt=>tt.batchId==id)
  },

  classNameById:state=>id=>{
    return state.classList.find(tt=>tt.classId==id)
  }
};
const mutations = {
SET_CLASS_LIST:(state,dt)=>{
  state.classList=dt; 
},
UPDATE_CLASS:(state,dt)=>{
  // const temp=_.find(state.classList,ob=>{
  //   return ob.locId==dt.locId;
  // });
  // console.log('----',JSON.stringify(temp));
},
ADD_CLASS:(state,dt)=>{
  state.classList.push(dt);
},
REMOVE_CLASS:(state,id)=>{
},
SET_BATCH_LIST:(state,dt)=>{
    state.batchList=dt
  },



SET_ALLBATCH_LIST:(state,dt)=>{
      state.allBatchList=dt
    }
};
const actions = {
load_class_list:({commit})=>{
  const url1 = '/StudentClassInfos';
  apiObject.get(url1).then(response=>{
    commit('SET_CLASS_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
load_batch_list:({commit})=>{
  const url1 = '/StudentBatchInfos';
  apiObject.get(url1).then(response=>{
    commit('SET_ALLBATCH_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
load_batch_list_by_classid:({commit},classId)=>{

  const url1 = `/StudentClassInfos/${classId}/studentBatchInfos/`;
  apiObject.get(url1).then(response=>{
    commit('SET_BATCH_LIST',response.data)
  }).catch(error=>{
      commit('SET_BATCH_LIST',null)
    console.log(error);
  })
},
getClassNameById({commit},id){
  const url1="/StudentClassInfos/"+id
  return new Promise(function(resolve, reject) {
    apiObject.get(url1)
    .then(response=>{
      resolve(response.data)
    })
    .catch(error=>{
      reject(error)
    })
  });
},

getBatchNameById({commit},id){
  const url1="/StudentBatchInfos/"+id
  return new Promise(function(resolve, reject) {
    apiObject.get(url1)
    .then(response=>{
      resolve(response.data)
    })
    .catch(error=>{
      reject(error)
    })
  });
},
update_class:({commit,dispatch},dt)=>{
      const url1 = '/StudentClassInfos/'+dt.classId;
      console.log('****',url1);
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,dt)
          .then(rr=>{
            dispatch('load_class_list')
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          });
    });
},
add_class:({commit,dispatch},dt)=>{
      const url1 = '/StudentClassInfos';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
      .then(rr=>{
        dispatch('load_class_list')
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
remove_class:({commit,dispatch},id)=>{
      const url1 = '/StudentClassInfos/'+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
        .then(rr=>{
          dispatch('load_class_list')
          resolve(rr.data)
          })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
update_batch:({commit,dispatch},dt)=>{
      const url1 = '/StudentBatchInfos/'+dt.batchId;
      console.log('****',url1);
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,dt)
          .then(rr=>{
            dispatch('load_batch_list')
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          });
    });
},
add_batch:({commit,dispatch},dt)=>{
      const url1 = '/StudentBatchInfos';
      return new Promise((resolve,reject)=>{
       apiObject.post(url1,dt)
      .then(rr=>{
        dispatch('load_batch_list')
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
remove_batch:({commit,dispatch},id)=>{
      const url1 = '/StudentBatchInfos/'+id;
      return new Promise((resolve,reject)=>{
      apiObject.delete(url1)
      .then(rr=>{
        dispatch('load_batch_list')
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
