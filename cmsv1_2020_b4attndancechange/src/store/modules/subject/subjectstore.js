import _ from 'lodash'
import apiObject from '@/dataserve/student_serve.js'
        const state = {
            subjectList: [],
            subjectNameList: [],
            loading: false,
        };
const getters = {
  getSubjectById:state=>id=>{
    return state.subjectList.find(tt=>tt.subId==id)
  }
};

const
  mutations = {
    SET_SUBJECT_LIST: (state,dt) => {
        state.subjectList = dt
    },
    SET_SUBJECT_NAME_LIST: (state, {dt}) => {
        state.subjectNameList = dt;
    }
};
const actions = {
    LOAD_SUBJECT_LIST: function ( {commit}){
        return new Promise((resolve, reject) => {
            const url1 = '/SubjectInfos';
            state.loading = true
            apiObject.get(url1).then(response => {
                commit('SET_SUBJECT_LIST', response.data)
                state.loading = false
                resolve(response.data)
            }).catch(error => {
                state.loading = false;
                reject(error)
            });
        })
    },
    getSubNameById({commit},id){
            const temp = {
                fields: {subName: 1}
            };
            const url1 = '/SubjectInfos/'+id+'?filter=' + JSON.stringify(temp);
            console.log(url1);
            return new Promise((resolve,reject)=>{
              apiObject.get(url1).then(rr => {
                resolve(rr.data.subName)
              }).catch(error => {
                console.log('****',error);
                reject(error)
              });
            }
          );    },
          getSubjectById({commit},id){
                  const url1 = '/SubjectInfos/'+id;
                  return new Promise((resolve,reject)=>{
                    apiObject.get(url1).then(rr => {
                      resolve(rr.data)
                    }).catch(error => {
                      reject(error)
                    });
                  }
                );
        },
        getSubjectName({commit},id){
          return new Promise((resolve, reject) => {
            const temp = {
                fields: {subName: 1}
            };
            const url1 = '/SubjectInfos/'+id+'?filter=' + JSON.stringify(temp);
            console.log(url1);
            apiObject.get(url1).then(rr => {
                resolve(rr)
            }).catch(error => {
                reject(error)
            });
        });
    },
    getSubAliasById({commit},id){
            const temp = {
                fields: {subAlias: 1}
            };
            const url1 = '/SubjectInfos/'+id+'?filter=' + JSON.stringify(temp);
            console.log(url1);
            return new Promise((resolve,reject)=>{
              apiObject.get(url1).then(rr => {
                resolve(rr.data.subAlias)
              }).catch(error => {
                console.log('****',error);
                reject(error)
              });
            }
          );},
    getSubjectNameList({commit}){
        return new Promise((resolve, reject) => {
            const temp = {
                fields: {subId:1,subName: 1}
            };
            const url1 = '/SubjectInfos?filter=' + JSON.stringify(temp);
            console.log(url1);
            apiObject.get(url1).then(rr => {
                resolve(rr)
            }).catch(error => {
                reject(error)
            });
        });
    },
    getSubjectId( {commit}, record){
        return new Promise((resolve, reject) => {
            const temp = {
                where: {subjectDept: record.deptName,subName:record.subName},
                fields: {subId: 1}
            }
            const url1 = '/SubjectInfos?filter=' + JSON.stringify(temp);
            console.log(url1);
            apiObject.get(url1).then(rr => {
                resolve(rr)
            }).catch(error => {
                reject(error)
            });
        });
    },
    load_subject_name_by_dept( {commit}, dept){
        return new Promise((resolve, reject) => {
            const temp = {
                where: {subjectDept: dept},
                fields: {subName: 1}
            }
            const url1 = '/SubjectInfos?filter=' + JSON.stringify(temp);
            console.log(url1);
            state.loading = true
            apiObject.get(url1).then(rr => {
                let temp = []
                for (let indx = 0; indx < rr.data.length; indx++)
                    temp.push(rr.data[indx].subName);
                commit('SET_SUBJECT_NAME_LIST', {dt: temp})
                state.loading = false
                resolve(temp)
            }).catch(error => {
                state.loading = false;
                reject(error)
            });
        });
    },
    load_subject_by_dept( {commit}, dept){
          let url1 = '/SubjectInfos'
          if(dept!=-1){
              const temp = {
                  where: {subjectDept: dept}
              }
              url1+='?filter=' + JSON.stringify(temp);
            }
            apiObject.get(url1).then(rr => {
                commit('SET_SUBJECT_LIST', rr.data)
            }).catch(error => {
              console.log('****',error)
            });
    },
    load_subject_for_ttable( {commit}, ob){
            const temp = {
                where: {
                  subjectDept:ob.dept,
                  subjectCourse:ob.course,
                  subjectSem:ob.sem
                }
            }
            const url1 = '/SubjectInfos?filter=' + JSON.stringify(temp);
            console.log(`%%%%${url1}%%%%`);
            apiObject.get(url1).then(rr => {
                commit('SET_SUBJECT_LIST', rr.data)
            }).catch(error => {
              console.log('****',error)
            });
    },
    load_subject_for_loadcalc( {commit}, dt){
            const temp = {
                where: {
                  subjectDept: dt.dept,
                  subjectCourse:dt.course,
                  subjectSem:dt.sem
                }
            }
            const url1 = '/SubjectInfos?filter=' + JSON.stringify(temp);
            apiObject.get(url1).then(rr => {
                commit('SET_SUBJECT_LIST', rr.data)
            }).catch(error => {
              console.log('****',error)
            });
    },
    ADD_SUBJECT_INFO( {commit}, subjectInfo){
        return new Promise((resolve, reject) => {
            const url1 = "/SubjectInfos";
            apiObject.post(url1, subjectInfo).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            });
        })
    },
    UPDATE_SUBJECT_INFO( {commit}, subjectInfo){
      return new Promise(function(resolve, reject) {
        const url1='/SubjectInfos/'+subjectInfo.subId
        apiObject.put(url1, subjectInfo).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject(error)
        });
      });


    },
    DELETE_SUBJECT_INFO( {commit}, subjectId){
        state.loading = true
        const url1 = "/SubjectInfos/" + subjectId
        return new Promise((resolve, reject) => {
            apiObject.delete(url1).then(
                    response => {
                        state.loading = false
                        resolve(response.data)
                    }
            ).catch(error => {
                state.loading = false
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
