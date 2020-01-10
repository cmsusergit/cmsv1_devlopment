import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  proxyReportAssignedToList:null,
  proxyReportAssignedByList:null,
  proxyAssignedList:null,
  proxyPendingList:null,
  proxyList:null
};
const getters = {


  proxyList:state=>{
    return state.proxyList
  },
  proxyReportAssignedByList:state=>{
    return state.proxyReportAssignedByList
  },
  proxyReportAssignedToList:state=>{
    return state.proxyReportAssignedToList
  },
  proxyAssignedList:state=>{
    return state.proxyAssignedList
  },
  proxyPendingList:state=>{
    return state.proxyPendingList
  }
};
const mutations = {
    SET_PROXYREPORT_ASSIGNEDBYLIST:(state,dt)=>{
      state.proxyReportAssignedByList=dt
    },
    SET_PROXYREPORT_ASSIGNEDTOLIST:(state,dt)=>{
      state.proxyReportAssignedToList=dt
    },
    SET_PROXY_LIST:(state,dt)=>{
      state.proxyList=dt
    },
    SET_ASSIGNED_PROXY_LIST:(state,dt)=>{
      state.proxyAssignedList=dt
    },
    SET_PENDING_PROXY_LIST:(state,dt)=>{
      state.proxyPendingList=dt
    },
    ADD_PROXY:(state,dt)=>{
      state.proxyList.push(dt)
    }
};
const actions = {
  approveProxy({commit},id){
    const url1='/ProxyInfos/'+id
    const ob={
      isApproved:1
    }
    return new Promise((resolve,reject)=>{
      apiObject.patch(url1,ob)
          .then(rr=>{
            resolve(rr)
          })
          .catch(error=>{
            reject(error)
          })
    });
  },
  disapproveProxy({commit},id){
    const url1='/ProxyInfos/'+id
    const ob={
      isApproved:0
    }
    return new Promise((resolve,reject)=>{
      apiObject.patch(url1,ob)
          .then(rr=>{
            resolve(rr)
          })
          .catch(error=>{
            reject(error)
          })
    });
  },
  load_pending_proxy_list_by_dept({commit},deptId){
    const dt=new Date()
    const ob={
      where:{
        fOwnerDeptid:deptId,
        proxyDate:{gt:new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()-5)}
      }
    }
    const url1='/ProxyInfos/?filter='+JSON.stringify(ob)
    return new Promise((resolve,reject)=>{
      apiObject.get(url1)
        .then(rr=>{

          commit('SET_PENDING_PROXY_LIST',rr.data)
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
    });
  },
  get_faculty_dept({commit},id){
    const ob={fields:{deptId:1}}
    const url1='/EmpProfiles/'+id+"?filter="+JSON.stringify(ob)
    return new Promise((resolve, reject)=>{
      apiObject.get(url1)
          .then(rr=>{
            if(rr.data)
              resolve(rr.data.deptId)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
    });
  },
  completeProxy({commit},id){
    const url1='/ProxyInfos/'+id
    const ob={
      isCompleted:1
    }
    return new Promise((resolve,reject)=>{
      apiObject.patch(url1,ob)
          .then(rr=>{
            resolve(rr)
          })
          .catch(error=>{
            reject(error)
          })
    });
  },
  load_proxy_by_id:({commit},id)=>{
    const url1 = '/ProxyInfos/'+id;
    return new Promise((resolve,reject)=>{
      apiObject.get(url1)
      .then(rr=>{
            resolve(rr.data)
      })
      .catch(error=>{
        reject(error)
        console.log('****',error);
      })
    })

  },
  save_proxy_detail:({commit},dt)=>{
      const url1 = '/ProxyInfos/';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
        .then(rr=>{
              commit('ADD_PROXY',rr.data)
              resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        });
    });
},
update_proxy_detail({commit,dispatch},dt){
  const url1='/ProxyInfos/'+dt.proxyId
  return new Promise((resolve, reject)=>{
    apiObject.put(url1,dt)
      .then(rr=>{
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      })
  });
},
delete_proxy_detail({commit},id){
  const url1='/ProxyInfos/'+id
  return new Promise((resolve,reject)=>{
    apiObject.delete(url1)
      .then(rr=>{
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      })
  });
},
load_assigned_proxy_list:({commit},assignedFacultyId)=>{
      const dt=new Date()
      const ob={
        where:{
          isCompleted:0,
          fFacultyid:assignedFacultyId,
          proxyDate:{gt:new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()-5)},
          isApproved:true
      }}
      const url1 = '/ProxyInfos?filter='+JSON.stringify(ob);
      console.log(`----${url1}----`);
      return new Promise((resolve,reject)=>{
        apiObject.get(url1)
          .then(rr=>{
            if(rr.data){
              commit('SET_ASSIGNED_PROXY_LIST',rr.data)
              resolve(rr.data)
            }
          })
          .catch(error=>{
              console.log('****',error);
              reject(error)
            })
      })
},
load_proxy_list:({commit},ownerId)=>{
      const dt=new Date()
      const ob={
        where:{
          fOwnerid:ownerId,proxyDate:{gt:new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()-5)}
      }}
      const url1 = '/ProxyInfos?filter='+JSON.stringify(ob);
      console.log(`----${url1}----`);
      return new Promise((resolve,reject)=>{
        apiObject.get(url1)
          .then(rr=>{
            if(rr.data){
              commit('SET_PROXY_LIST',rr.data)
              resolve(rr.data)
            }
          })
            .catch(error=>{
              console.log('****',error);
              reject(error)
            })
      })
    },

  load_proxyreport_assignedby_list:({commit},ob)=>{
          const url1 = '/ProxyInfos/getProxyAssignedByList';
          console.log(`----${url1}----`);
          return new Promise((resolve,reject)=>{
            apiObject.post(url1,ob)
              .then(rr=>{
                if(rr.data){
                  commit('SET_PROXYREPORT_ASSIGNEDBYLIST',rr.data)
                  resolve(rr.data)
                }
              })
                .catch(error=>{
                  console.log('****',error);
                  reject(error)
                })
          })
  },
  load_proxyreport_assignedto_list:({commit},ob)=>{
          const url1 = '/ProxyInfos/getProxyAssignedToList';
          console.log(`----${url1}----`);
          return new Promise((resolve,reject)=>{
            apiObject.post(url1,ob)
              .then(rr=>{
                if(rr.data){
                  commit('SET_PROXYREPORT_ASSIGNEDTOLIST',rr.data)
                  resolve(rr.data)
                }
              })
                .catch(error=>{
                  console.log('****',error);
                  reject(error)
                })
          })
  }
}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
