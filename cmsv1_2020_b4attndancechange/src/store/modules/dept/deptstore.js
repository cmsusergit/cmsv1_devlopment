import apiObject from '@/dataserve/student_serve.js'
const state = {

};
const getters = {
};
const mutations = {
};
const actions = {
ADD_DEPT_INFO({commit},deptInfo){
  return new Promise((resolve,reject)=>{
    const url1="/DepartmentInfos"

    deptInfo.deptId=0;
    apiObject.post(url1,deptInfo).then(response => {
        resolve(response.data)
    }).catch(error => {
        reject(error)
        }
    );
  })},
  REMOVE_DEPT_INFO({commit,rootState},id){
    return new Promise((resolve,reject)=>{
      const url1="/DepartmentInfos/"+id;
      return apiObject.delete(url1).then(response => {
          resolve(response.data)
      }).catch(error => {
          reject(error)
          }
      );
    })},
  UPDATE_DEPT_INFO({commit},deptInfo){
    return new Promise((resolve,reject)=>{
      const url1="/DepartmentInfos/"+deptInfo.deptId;
      return apiObject.put(url1,deptInfo).then(response => {
          resolve(response.data)
      }).catch(error => {
          reject(error)
          }
      );
    })},
  getDeptNameByID:({commit},id)=>{
    const url1='/DepartmentInfos/'+id
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
  }
}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
