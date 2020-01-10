import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  circularList:[]
};
const getters = {
};
const mutations = {
SET_CIRCULAR_LIST:(state,dt)=>{
  state.circularList=dt;
},

ADD_CICRULAR:(state,dt)=>{
  state.circularList.push(dt);
},
  REMOVE_CIRCULAR:(state,id)=>{
    if(state.circularList.length==1){

      state.circularList=[]
      return;
    }
    state.circularList=_.remove(state.circularList,(ob)=>{
      return ob.circId==id
    })
  }
};
const actions = {
load_circular_list:({commit})=>{
  const url1 = '/Circulars';
  apiObject.get(url1).then(response=>{
    commit('SET_CIRCULAR_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
getCircularNameByID:({commit},id)=>{
  const url1='/Circulars/'+id
  return new Promise((resolve, reject)=>{
    apiObject.get(url1)
    .then(response=>{
      resolve(response.data)
    })
    .catch(error=>{
      console.log('****',error);
      reject(error)
    })
  });
},
update_circular:({commit},dt)=>{
      const url1 = '/Circulars/'+dt.circId;
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
add_circular:({commit},dt)=>{
      const url1 = '/Circulars';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
      .then(rr=>{
        commit('ADD_CICRULAR',rr.data)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
remove_circular_file:({commit},fileName)=>{
    const url1="/containers/circulars/files/"+fileName
    apiObject.delete(url1)
      .then(rr=>{
      })
      .catch(error=>{
        console.log('****',error);
      })
},
remove_circular:({commit},id)=>{
      const url1 = '/Circulars/'+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
        .then(rr=>{
          commit('REMOVE_CIRCULAR',id)
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
