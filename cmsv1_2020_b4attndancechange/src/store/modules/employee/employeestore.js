import config from "@/../static/test1.json";
import apiObject from '@/dataserve/student_serve.js'
const state = {
  employeeList:[],
  educationDetail:[],
  facultyList:[],
  currentEmployee:null,
  facultyListForProxy:[]
};
const getters = {
    facultyNameById:(state)=>(id)=>{
      return state.facultyList.find(tt=>tt.empId==id)

    },
    employeeCountByDept:(state)=>(deptId)=>{
      return _.countBy(state.employeeList,{deptId:deptId})
    },
    employeeEducationList:state=>{
      return state.educationDetail
    },
    getCurrentEmployee:(state)=>{
      return state.currentEmployee
    },
    getFacultyListForProxy:(state)=>{
      return state.facultyListForProxy
    }
};
const mutations = {
  SET_EMPLOYEE_LIST:(state,dt)=>{
    state.employeeList=dt;
  },
  SET_EDUCATIONDETAIL:(state,dt)=>{
      state.educationDetail=dt;
  },
  SET_FACULTYLIST:(state,dt)=>{
    state.facultyList=dt
  },
  REMOVE_EMPLOYEE:(state,id)=>{
    state.employeeList.splice(findIndex(state.employeeList,{empId:id}),1)
  },
  SET_CURRENT_EMPLOYEE:(state,dt)=>{
      state.currentEmployee=dt
  },
  SET_FACULTYLIST_PROXY:(state,dt)=>{
    state.facultyListForProxy=dt
  }
};
const actions = {
  load_employee_list:function(context){
    let url1 = '/EmpProfiles';
    return new Promise(function(resolve, reject) {
      apiObject.get(url1).then(response => {
        context.commit('SET_EMPLOYEE_LIST',response.data)
        resolve(response.data)
      }).catch(error => {
          console.log('****',error);
          reject(error)
      });
    });
  },
  load_employee_education_list:({commit},empId)=>{
    const url1="/EmpProfiles/"+empId+"/empEducationDetails"
    return new Promise(function(resolve, reject) {
        apiObject.get(url1).
          then(rr=>{
            commit('SET_EDUCATIONDETAIL',rr.data)
            resolve(rr.data)
          })
          .catch(error=>{console.log('****',error);})
      });
  },
    add_employee_personal:({commit},dt)=>{
      const url1='/EmpProfiles'
      return new Promise((resolve, reject)=>{
        apiObject.post(url1,dt)
        .then(rr=>{
          resolve(rr)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      });

    },
    add_employee_education_info:({commit},dt)=>{
        const url1='/EmpProfiles/'+dt.empId+'/empEducationDetails'
        return new Promise((resolve, reject)=>{
          apiObject.post(url1,dt)
          .then(rr=>{
            resolve(rr)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
        });
      },
    get_employee_by_id:({commit},id)=>{
        const url1="/EmpProfiles/"+id;
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
    get_employee_by_code:({commit},code)=>{
         const ob={
           where:{empCode:code}
         }
        const url1="/EmpProfiles/findOne?filter=" + JSON.stringify(ob)
        console.log('****',url1);

        return new Promise((resolve, reject)=>{
          return apiObject.get(url1)
            .then(response=>{
              commit('SET_CURRENT_EMPLOYEE',response.data)
              console.log('----',JSON.stringify(response.data));
              resolve(response.data)
            })
            .catch(error=>{
              console.log('****',error);
              commit('SET_CURRENT_EMPLOYEE',null)
              reject(error)
            })
        });
    },
    get_empeducation_by_id:({commit},id)=>{
        const url1=`/EmpProfiles/${id}/empEducationDetails`
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
    remove_employee_personal:({commit,dispatch},id)=>{
        const url1="/EmpProfiles/"+id;
        return new Promise((resolve,reject)=>{
          apiObject.delete(url1+"/empEducationDetails/").
          then(response=>{
            apiObject.delete(url1)
                .then(rr=>{
                  resolve(rr)
                  dispatch('load_employee_list')
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
    update_employee_personal:({commit},employeeProfile)=>{
      const id= employeeProfile.empId
      const url1="/EmpProfiles/"+id
      console.log('****',url1);
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,employeeProfile)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      })
    },
    update_empeducation_for_employee:({commit},ob)=>{
      const url1="/EmpProfiles/"+ob.empId+"/empEducationDetails"
        console.log('****',url1);
        return new Promise((resolve,reject)=>{
          apiObject.delete(url1)
            .then(rr=>{
              apiObject.post(url1,ob.educationList)
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
    load_proxyfacultylist_by_dept:({commit},dept)=>{
        let ob={
          where:{
              isTeaching:1,
              deptId:dept
            }
        }
        const url1='EmpProfiles?filter='+JSON.stringify(ob)

        apiObject.get(url1)
          .then(rr=>{
            commit('SET_FACULTYLIST_PROXY',rr.data)
          })
          .catch(error=>{
              commit('SET_FACULTYLIST_PROXY',null)

              console.log('****',error);
          })
    },
    load_facultylist_by_dept:({commit},dept)=>{
        let ob={
          where:{
              isTeaching:1
            }
        }
        if(dept!=-1){
            ob.where.deptId=dept
        }
        const url1='/EmpProfiles?filter='+JSON.stringify(ob)
        return new Promise(function(resolve, reject) {
            apiObject.get(url1)
              .then(response=>{
                commit('SET_FACULTYLIST',response.data)
                resolve(response.data)
              })
              .catch(error=>{
                console.log('****',error);
                reject(error)
              })
            });
    },
}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
