import config from "@/../static/test1.json";
import {findIndex} from 'lodash'

import apiObject from '@/dataserve/student_serve.js'
const state = {
  studentList:[],
  allocatedStudentList:[],
  error:null,
  loading:false
};
const getters = {


  getAllocatedStudentList:state=>{
    return state.allocatedStudentList
  },
  getStudentCount:state=>deptId=>{
    console.log(state.studentList.length);
    return _.countBy(state.studentList,{fDeptId:deptId})
  },
  getStudentList:state=>{
    return state.studentList
  }
};

const mutations = {
  SET_STUDENT_LIST:(state,dt)=>{
    state.studentList=dt;
  },
  SET_ALLOCATED_STUDENT_LIST:(state,dt)=>{
      state.allocatedStudentList=dt;
    },
  REMOVE_STUDENT:(state,id)=>{
    state.studentList.splice(findIndex(state.studentList,{stuId:id}),1)
  }
};
const actions = {
  load_allocated_student_list:function(context,ob){
        let url1='/StudentAllocations/getAllocatedStudentList/'
        state.loading=true
        apiObject.post(url1,ob).then(response => {
                context.commit('SET_ALLOCATED_STUDENT_LIST',response.data)
                state.loading=false
            }).catch(error => {
              state.loading=false;
              context.commit('SET_ALLOCATED_STUDENT_LIST',[])
              state.error=error;
            });
  },
  load_allocation_by_stuId:({commit},id)=>{
    const url1='/StudentInfos/'+id+'/studentAllocations'
    return new Promise((resolve, reject)=>{
      apiObject.get(url1).then(response => {
                resolve(response.data)
            })
            .catch(error=>{
                console.log('****',error);
                reject(error)
            })
    });
  },
  load_student_list_by_class_batch:function(context,ob){
        let url1='/StudentAllocations/getAllocatedStudentList/'
        state.loading=true
        apiObject.post(url1,ob).then(response => {
                const list1=response.data.studentList
                let mergedList=[]
                if(!list1)
                  return
                list1.map(ob=>{
                  if(ob && ob.studentInfo)
                    mergedList.push(ob.studentInfo)
                })
                mergedList=_.uniqBy(mergedList,'stuEnroll')
                context.commit('SET_STUDENT_LIST',mergedList)
                state.loading=false
            }).catch(error => {
              state.loading=false;
              context.commit('SET_STUDENT_LIST',[])
              state.error=error;
            });
  },
  load_student_list:function(context,listBy){
              let url1 = '/StudentInfos?filter=';
              if(listBy){
                let temp=new Array();
                if(listBy.dept!=='All'){
                  temp.push({fDeptId:listBy.dept});
                }
                if(listBy.course!=='All'){
                  temp.push({fCourseId:listBy.course});
                }
                if(listBy.sem!=='All'){
                  temp.push({fcurrsem:listBy.sem});
                }
                // if(listBy.class!=='All'){
                //   temp.push({fClassId:listBy.class});
                // }
                if(listBy.sem!=='All'){
                  temp.push({fcurrsem:listBy.sem});
                }
                if(temp.length!=0){
                  const ob={where:{and:temp}};
                  url1+=JSON.stringify(ob)
                }
              }
            state.loading=true
            console.log(`----${url1}----`);
            apiObject.get(url1).then(response => {
                context.commit('SET_STUDENT_LIST',response.data)
                state.loading=false
            }).catch(error => {
              state.loading=false;
              state.error=error;
            });
  },

  load_student_attend_list:function({commit},listBy){
    let url1 = '/StudentInfos?filter=';
      const ob={where:listBy};
      url1+=JSON.stringify(ob);
      console.log('----',url1);
      return new Promise((resolve,reject)=>{
        apiObject.get(url1).then(response => {
          commit('SET_STUDENT_LIST',response.data);
          resolve(response.data);
      }).catch(error => {
          console.log('****',error);
            reject(error);
      });});
  },

  add_pastacademic_for_student({commit},ob){
      const url1="/StudentInfos/"+ob.studentId+"/studentPastAcadrecords"
      console.log('****',url1);
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,ob.pastAcademicList)
        .then(response=>{
          resolve(response)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      })
  },
  add_guardian_for_student({commit},ob){
      const url1="/StudentInfos/"+ob.studentId+"/studentGuardianInfos"
      console.log('****',url1);
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,ob.guardianList)
        .then(response=>{
          resolve(response)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      })
  },
  add_student_info({commit},studentinfo){
    const url1="/StudentInfos"
    console.log('****',url1);
    return new Promise((resolve,reject)=>{
      apiObject.post(url1,studentinfo)
      .then(response=>{
        resolve(response)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      })
    })
  },

  update_guardian_for_student({commit},ob){
      const url1="/StudentInfos/"+ob.studentId+"/studentGuardianInfos"
      console.log('****',url1);
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
          .then(rr=>{
            apiObject.post(url1,ob.guardianList)
            .then(response=>{
              resolve(response)
            })
            .catch(error=>{
              console.log('****',error);
              reject(error)
            })
          })
          .catch(error=>{
            console.log('****',error)
            reject(error)
          })
      })
  },


  update_pastacademic_for_student({commit},ob){
      const url1="/StudentInfos/"+ob.studentId+"/studentPastAcadrecords"
      console.log('****',url1);
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
          .then(rr=>{
            apiObject.post(url1,ob.pastAcademicList)
            .then(response=>{
              resolve(response)
            })
            .catch(error=>{
              console.log('****',error);
              reject(error)
            })
          })
          .catch(error=>{
            console.log('****',error)
            reject(error)
          })
      })
  },


  update_student_info({commit},studentInfo){
    const id= studentInfo.stuId
    const url1="/StudentInfos/"+id
    console.log('****',url1);
    return new Promise(function(resolve, reject) {
         apiObject.put(url1,studentInfo)
          .then(rr=>{
            resolve(rr.data)
          })
        .catch(error=>{
            console.log('****',error);
            reject(error)
          })
        });
  },
  remove_student_info({commit},id){
      const url1="/StudentInfos/"+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1+"/studentGuardianInfos/").
        then(response=>{
          apiObject.delete(url1)
              .then(rr=>{
                resolve(rr)
                commit('REMOVE_STUDENT',id)
              })
              .catch(error=>{
                console.log('****',error);
                reject(error);
              })
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      })
  },
  remove_student_photo({commit},path){
    apiObject.delete('/containers/student_photo/files/'+path)
      .then(rr=>{
        console.log('****',rr);
      })
      .catch(error=>{
        console.log('****',error);
      })
  },
  get_student_by_id({commit},id){
      const url1="/StudentInfos/"+id;
      console.log('****',url1);
      return new Promise((resolve, reject)=>{
        return apiObject.get(url1)
          .then(response=>{
            resolve(response)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
      });
  },
  get_student_by_code({commit},enroll){
    const ob={where:{stuEnroll:enroll}}
      const url1="/StudentInfos/findOne?filter="+JSON.stringify(ob);
      console.log('****',url1);
      return new Promise((resolve, reject)=>{
        return apiObject.get(url1)
          .then(response=>{
            resolve(response.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
      });
  },
  get_student_guardian_by_id({commit},id){
      const url1="/StudentInfos/"+id+"/studentGuardianInfos";
      return new Promise((resolve, reject)=>{
        apiObject.get(url1)
          .then(response=>{
            resolve(response)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
      });
  },
  get_student_pastacad_by_id({commit},id){
      const url1="/StudentInfos/"+id+"/studentPastAcadrecords";
      return new Promise((resolve, reject)=>{
        apiObject.get(url1)
          .then(response=>{
            resolve(response)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
      });
  },
  saveStudentAcadProg({commit},dt){
    const url1="/StudentAcadProgresses";
    return new Promise((resolve, reject)=>{
      apiObject.post(url1,dt)
        .then(response=>{
          resolve(response)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      });
  },
  saveAllocatedStudentList({commit},studentList){
    const url1="/StudentAllocations/"
    return new Promise(function(resolve, reject) {
        apiObject.post(url1,studentList).then(response=>{
          resolve(response.data)
        })
        .catch(error=>{
          reject(error)
        })
    });
  },

  async deallocateStudent({commit},dt){
    const url1="/StudentAllocations/deallocateStudent"
    return new Promise(function(resolve, reject) {
        apiObject.post(url1,dt).then(response=>{
          resolve(response.data)
        })
        .catch(error=>{
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
