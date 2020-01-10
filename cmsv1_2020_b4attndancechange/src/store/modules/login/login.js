import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  userRoleList:localStorage.getItem('userRole'),
  loggedInUser:null|localStorage.getItem('loggedInUser'),
  credential:null,
  roleList:[]
};
const getters = {
  getRoleList:state=>{
    return state.userRoleList
  },
  isGuest:(state)=>{
    return (state.userRoleList && JSON.parse(state.userRoleList).length==0)
  },
  isAuthorizedRole:(state)=>(roleName)=>{
    return _.find(JSON.parse(state.userRoleList),{roleName:roleName})
  },
  isLoggedIn:state=>{
    state.credential=localStorage.getItem('credential')
    return state.credential
  },
  getLoggedInUserId:state=>{
    return state.loggedInUser
  },
  isAuthorizedRoleList:(state)=>(roleNameList)=>{
    let rv=false
    roleNameList.map(ob=>{
      if(_.find(JSON.parse(state.userRoleList),{roleName:ob}))
        rv=true
    })
    return rv
  }
};
const mutations = {
  CHANGE_USER_ROLE:(state,dt)=> {
    state.userRoleList=dt
    localStorage.setItem('userRole',dt)
  },
SET_CREDENTIAL:(state,credential)=>{
  localStorage.setItem('credential',credential)
  state.credential=credential
},
REMOVE_CREDENTIAL:(state)=>{
  localStorage.clear()
  state.credential=null
},
SET_LOGGEDIN_USER:(state,user)=>{
  localStorage.setItem('loggedInUser',user)
  state.loggedInUser=user
},
REMOVE_LOGGEDIN_USER:(state)=>{
  localStorage.clear()
  state.loggedInUser=null
}
};
const actions = {
  changeRole:({commit},dt)=>{
    commit('changeRole',dt)
  },
  login:({commit,dispatch},user)=>{
      const url1 = '/UserAccounts/login';
      return new Promise((resolve,reject)=>{
        return apiObject.post(url1,user)
        .then(rr=>{
          commit('SET_CREDENTIAL',rr.data.id)
          commit('SET_LOGGEDIN_USER',rr.data.userId)
          const urlRole='/UserAccounts/'+rr.data.userId
          if(rr.data.id)
            apiObject.defaults.headers.common.Authorization=rr.data.id
            dispatch('userAccountStore/getRoleListForUserId',rr.data.userId,{root:true})
            .then(response=>{
              commit('CHANGE_USER_ROLE',JSON.stringify(response))
            })
            .catch(error=>{
              console.log('****',error);
            })
        //   apiObject.get(urlRole)
        //   .then(response=>{
        //       commit('CHANGE_USER_ROLE CHANGE_USER_ROLE',response.data.roleList)
        //     })
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          commit('REMOVE_CREDENTIAL')
          commit('REMOVE_LOGGEDIN_USER')
          reject(error)
        });
      })
    },
    signUp:({commit},user)=>{
      const url1='/UserAccounts/'
      console.log(`****${JSON.stringify(user)}****`);
      return new Promise(function(resolve, reject) {
        return apiObject.post(url1,user)
        .then(rr=>{
          if(user.emailVerify){
            const urlVerify=`/UserAccounts/${rr.data.id}/verify`
            console.log('****',urlVerify);
            apiObject.post(urlVerify)
              .then(r1=>{
                resolve(rr.data)
              })
              .catch(error=>{
                apiObject.delete(`/UserAccounts/${rr.data.id}`)
                console.log('****',error);
                reject(error)
              })
          }
          else{
              resolve(rr.data)
          }
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      });
    },
    getLoggedInUser:({commit},id)=>{
        const url1="/UserAccounts/"+id
        return apiObject.get(url1)
    },
    logout:({commit})=>{
      const url1='/UserAccounts/logout'
      apiObject.post(url1)
      .then(rr=>{
        commit('REMOVE_CREDENTIAL')
        commit('REMOVE_LOGGEDIN_USER')
      })
      .catch(error=>{
        console.log('****',error);
        commit('REMOVE_CREDENTIAL')
        commit('REMOVE_LOGGEDIN_USER')
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
