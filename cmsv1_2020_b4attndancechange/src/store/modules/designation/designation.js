import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  designationList:[]
};
const getters = {
  designationById:(state)=>(id)=>{
    return state.designationList.find(tt=>tt.desgId==id)
  },
};


const mutations = {
SET_DESIGNATION_LIST:(state,dt)=>{
  state.designationList=dt;
},
UPDATE_DESIGNATION:(state,dt)=>{
  // const temp=_.find(state.designationList,ob=>{
  //   return ob.locId==dt.locId;
  // });
  // console.log('----',JSON.stringify(temp));
},
ADD_DESIGNATION:(state,dt)=>{
  state.designationList.push(dt);
},

  REMOVE_DESIGNATION:(state,id)=>{
    if(state.designationList.length==1){
      state.designationList=[]
      return;
    }
    state.designationList=_.remove(state.designationList,(ob)=>{
      return !(ob.desgId==id)
    })
  }
};
const actions = {
load_desg_list:({commit})=>{
  const url1 = '/EmpDesignations';
  console.log(url1);
  apiObject.get(url1).then(response=>{
    commit('SET_DESIGNATION_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
getDesignationById({commit},id){
        const url1 = '/EmpDesignations/'+id;
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
update_designation:({commit},dt)=>{
      const url1 = '/EmpDesignations/'+dt.desgId;
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,dt)
          .then(rr=>{
            commit('UPDATE_DESIGNATION',rr.data)
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          });
    });
},
add_designation:({commit},dt)=>{
      const url1 = '/EmpDesignations';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
      .then(rr=>{
        commit('ADD_DESIGNATION',rr.data)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
remove_designation:({commit},id)=>{
      const url1 = '/EmpDesignations/'+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
      .then(rr=>{
        commit('REMOVE_DESIGNATION',id)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
}}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
