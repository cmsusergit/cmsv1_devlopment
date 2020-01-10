//import axios from "axios"
//import config from "@/../static/test1.json";
//
//const apiObject=axios.create({
//    baseURL:config.db_configuration.baseURL
//})
import _ from 'lodash'
import apiObject from '@/dataserve/student_serve.js'
        const state = {
            userList: [],
            roleList:[]
        };

const getters = {
};
const
  mutations = {
    SET_USER_LIST: (state,dt) => {
        state.userList = dt;
    },
      SET_ROLE_LIST: (state,dt) => {
          state.roleList = dt;
      }
};
const actions = {
  unassign_role_user({commit},dt){
    const url1="/Userrolemappings/deleteRoleMapping"
    return new Promise(function(resolve, reject) {
      apiObject.post(url1,{ob:dt})
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
        })
    });
  },
  assign_role_user({commit},dt){
    const url1="/Userrolemappings/"
    dt.id=0
    return new Promise(function(resolve, reject) {
      apiObject.post(url1,dt)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
        })
    });
  },
    getRoleListForUserId({commit},id){
      const url1="/UserAccounts/"+id+"/userroles"
      return new Promise(function(resolve, reject) {
          apiObject.get(url1)
            .then(rr=>{
              resolve(rr.data)
            })
            .catch(error=>{
              console.log('****',error);
            })
      });
    },
    getUserAccountById:function({commit},id){
      return new Promise((resolve, reject) => {
          const url1 = '/UserAccounts/'+id;
          apiObject.get(url1).then(response => {
              resolve(response.data)
          }).catch(error => {
              reject(error)
          });
      })
    },
    load_user_list: function ( {commit}){
        return new Promise((resolve, reject) => {
            const url1 = '/UserAccounts';
            apiObject.get(url1).then(response => {
                commit('SET_USER_LIST', response.data)
                resolve(response.data)
            }).catch(error => {
                reject(error)
            });
        })
    },
    load_role_list: function ( {commit}){
        return new Promise((resolve, reject) => {
            const url1 = '/Userroles';
            apiObject.get(url1).then(response => {
                commit('SET_ROLE_LIST', response.data)
                resolve(response.data)
            }).catch(error => {
                reject(error)
            });
        })
    },
    add_user_account( {commit}, dt){
        return new Promise((resolve, reject) => {
            const url1 = "/UserAccounts";
            apiObject.post(url1,dt).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            });
        })
    },
    update_user_account( {commit},dt){
      return new Promise(function(resolve, reject) {
        const url1='/UserAccounts/'+dt.id
        apiObject.put(url1,dt).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject(error)
        });


      });
    },
    changePassword({commit},dt){
      return new Promise((resolve,reject)=>{
        const url1='/UserAccounts/change-password'
        apiObject.post(url1,dt)
          .then(rr=>{
            resolve(rr.data)
          })
          .catch(error=>{
            reject(error)
          })
      });
    },
    delete_user_account( {commit},id){
        const url1 = "/UserAccounts/" +id
        return new Promise((resolve, reject) => {
            apiObject.delete(url1).then(
                    response => {
                        resolve(response.data)
                    }
            ).catch(error => {
                reject(error)
            });
        });
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
