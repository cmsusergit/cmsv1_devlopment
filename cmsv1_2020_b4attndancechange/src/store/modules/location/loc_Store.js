import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  allLocationList:[],
  locationList:[]
};
const getters = {
  getLocationById:state=>id=>{
    return state.allLocationList.find(location=>location.locId==id)
  }
};
const mutations = {
SET_LOC_LIST:(state,dt)=>{
  state.locationList=dt
},
SET_ALLLOCATION_LIST:(state,dt)=>{
  state.allLocationList=dt
},
UPDATE_LOCATION:(state,dt)=>{
  // const temp=_.find(state.locationList,ob=>{
  //   return ob.locId==dt.locId;
  // });
  // console.log('----',JSON.stringify(temp));
},
ADD_LOCATION:(state,dt)=>{
  state.locationList.push(dt);
},

  REMOVE_LOCATION:(state,id)=>{
    if(state.locationList.length==1){

      state.locationList=[]
      return;
    }
    state.locationList=_.remove(state.locationList,(ob)=>{
      return !(ob.locId==id)
    })
    console.log('----',state.locationList);
  }
};
const actions = {
load_loc_list:({commit})=>{
  const url1 = '/TtLocationInfos';

  console.log(url1);
  apiObject.get(url1).then(response=>{
    commit('SET_ALLLOCATION_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
load_loc_list_dept:({commit},deptId)=>{
  const ob={
    where:{
      fDeptId:deptId
    }
  }
  const url1 = '/TtLocationInfos?filter='+JSON.stringify(ob);
  console.log(url1);
  apiObject.get(url1).then(response=>{
    commit('SET_LOC_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
getLocNameById({commit},id){
        const temp = {
            fields: {locName: 1}
        };

        const url1 = '/TtLocationInfos/'+id+'?filter=' + JSON.stringify(temp);
        console.log(url1);
        return new Promise((resolve,reject)=>{
          apiObject.get(url1).then(rr => {
            resolve(rr.data.locName)
          }).catch(error => {
            console.log('****',error);
            reject(error)
          });
        }
      );
},

update_location:({commit},dt)=>{
      const url1 = '/TtLocationInfos/'+dt.locId;
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,dt)
          .then(rr=>{
            commit('UPDATE_LOCATION',rr.data)
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          });
    });
},
add_location:({commit},dt)=>{
      const url1 = '/TtLocationInfos';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
      .then(rr=>{
        commit('ADD_LOCATION',rr.data)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
remove_location:({commit},id)=>{
      const url1 = '/TtLocationInfos/'+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
      .then(rr=>{
        commit('REMOVE_LOCATION',id)
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
