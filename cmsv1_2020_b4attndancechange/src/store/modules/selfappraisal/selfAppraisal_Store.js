import apiObject from '@/dataserve/student_serve.js'
import {findIndex} from 'lodash'

const state = {
  deptResultSummaryList:[],
  deptSummaryList:[],
  teachingRecordList:[]
};
const getters = {
  getTeachingRecordList:state=>{
    return state.teachingRecordList
  },

  deptResultSummaryList:state=>{return state.deptResultSummaryList},
  deptSummaryList:state=>{return state.deptSummaryList}
};
const mutations = {
    ADD_TEACHING_RECORD_LIST(state,dt){
      state.teachingRecordList.push(dt)
    },
    REMOVE_TEACHING_RECORD(state,dt){
      if(state.teachingRecordList.length==1)
        state.teachingRecordList=[]
      state.teachingRecordList.splice(findIndex(state.teachingRecordList,{id:dt}),1)
    },
    SET_TEACHING_RECORD_LIST(state,dt){
      state.teachingRecordList=dt
    },
    SET_DEPTRESULTSUMMARYLIST(state,dt){
      state.deptResultSummaryList=dt
    },
    SET_DEPTSUMMARYLIST(state,dt){
      state.deptSummaryList=dt
    }
};
const actions = {
load_param_list:({commit},ob)=>{
  return new Promise(function(resolve, reject) {
    const temp={where:{apiMetaSection:ob.sectionId,apiMetaType:ob.apiMetaType,apiMetaAyid:ob.ayId}}
    const url1 = '/ApiMeta?filter='+JSON.stringify(temp);
    console.log(`!!!!${url1}!!!!`);
     apiObject.get(url1).then(response=>{
      resolve(response.data)
    }).catch(error=>{
      reject(error)
      console.log(error);
    })
  });
},
load_apiparam_forprincipal_list:({commit},ob)=>{
  return new Promise(function(resolve, reject) {
    const url1 = '/ApiParamPrincipals'
     apiObject.get(url1).then(response=>{
      resolve(response.data)
    }).catch(error=>{
      reject(error)
      console.log(error);
    })
  });
},
load_apiparam_forhod_list:({commit},ob)=>{
  return new Promise(function(resolve, reject) {
    const url1 = '/ApiParamHods'
     apiObject.get(url1).then(response=>{
      resolve(response.data)
    }).catch(error=>{
      reject(error)
      console.log(error);
    })
  });
},
remove_apiemployee:({commit},id)=>{
  return new Promise(function(resolve, reject) {
    const url1='/ApiEmployees/'+id
    apiObject.delete(url1).then(rr=>{resolve(rr.data)}).catch(error=>{reject(error)})
  });
},
loadProofFileList:({commit},empCode)=>{
    const url1='/apicontainers/'+empCode+'/files'
    return new Promise(function(resolve, reject) {
      apiObject.get(url1).then(rr=>{
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error)
        reject(error)
      })
    });
},
save_apiemployee:({commit},ob)=>{
  return new Promise(function(resolve, reject) {
    const url1='/ApiEmployees'
    apiObject.post(url1,ob).then(response=>{
      resolve(response.data)
    })
    .then(error=>{
      reject(error)
    })
  });
},
getApprovedMetaDt:({commit},dt)=>{
  return new Promise(function(resolve, reject) {
    console.log('++++',dt.sectionId);
      const url1="/ApiEmployees/getTotalApprovedScore/"+dt.empCode
      apiObject.get(url1)
        .then(rr=>{
          let result=0
          if(rr.data && rr.data.scoreList){
              rr.data.scoreList.map(ob=>{
                if(!dt.sectionId || ob.apiMeta.apiMetaSection==dt.sectionId)
                  result+=ob.apiMeta.apiMetaPerpt
              })
          }
          resolve(result)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
  });
},
approve_apiemployee:({commit},ob)=>{
  return new Promise(function(resolve, reject) {
    const url1='/ApiEmployees/'+ob.id
    apiObject.patch(url1,ob).then(rr=>{resolve(rr.data)}).catch(error=>{reject(error)})
  });
},
load_apiemployeelist:({commit},ob)=>{
  const temp={
    where:{
        apiAyearId:ob.apiAyearId,
        apiEmpCode:ob.apiEmpCode
    }
  }
  const url1='/ApiEmployees?filter='+JSON.stringify(temp)
  return new Promise(function(resolve, reject) {
    apiObject.get(url1)
      .then(rr=>{
        resolve(rr.data)
      })
      .catch(error=>{
        reject(error)
      })
  });
},

submitReportPrincipal:({commit},list)=>{
  const url1="/ApiObservationPrincipals"
  return new Promise((resolve, reject)=>{
      apiObject.post(url1,list)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
  });
},
submitReportHOD:({commit},list)=>{
  const url1="/ApiObservationHods"
  return new Promise((resolve, reject)=>{
      apiObject.post(url1,list)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
  });
},
getReportByHODForEmployee:({commit},ob)=>{
    const url1="/ApiObservationHods/getReportByHODForEmployee/"+ob.ayId+"/"+ob.empId
    return new Promise((resolve, reject)=>{
      apiObject.get(url1)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
    });
},
getReportByPrincipalForEmployee:({commit},ob)=>{
    const url1="/ApiObservationPrincipals/getReportByPrincipalForEmployee/"+ob.ayId+"/"+ob.empId
    return new Promise((resolve, reject)=>{
      apiObject.get(url1)
        .then(rr=>{
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
    });
},
save_apiteaching_perfomance:({commit},ob)=>{
  return new Promise(function(resolve, reject) {
    const url1='/ApiTeachings'
    apiObject.post(url1,ob).then(response=>{
      resolve(response.data)
      commit('ADD_TEACHING_RECORD_LIST',response.data)
    })
    .then(error=>{
      reject(error)
    })
  });
},
load_teaching_record_list:({commit},ob)=>{
  return new Promise(function(resolve, reject) {
    const temp={where:{fEmpId:ob.fEmpId,fAyId:ob.fAyId}}
    const url1 = '/ApiTeachings?filter='+JSON.stringify(temp);
     apiObject.get(url1).then(response=>{
      commit('SET_TEACHING_RECORD_LIST',response.data)
      resolve(response.data)
    }).catch(error=>{
      reject(error)
      console.log(error);
    })
  });
},
remove_teaching_record:({commit},id)=>{
  return new Promise(function(resolve, reject) {
    const url1='/ApiTeachings/'+id
    apiObject.delete(url1).then(rr=>{
      commit('REMOVE_TEACHING_RECORD',id)
      resolve(rr.data)

    }).catch(error=>{reject(error)})
  });
},
loadDeptSummaryList:({commit},deptId)=>{
  const url1='/ApiEmployees/getDeptSummary/'+deptId
  apiObject.get(url1)
    .then(rr=>{
      commit('SET_DEPTSUMMARYLIST',rr.data.scoreList)
    })
    .catch(error=>{
      commit('SET_DEPTSUMMARYLIST',null)
    })
},
loadDeptResultSummaryList:({commit},deptId)=>{
  const url1='/EmpProfiles/getDeptSummary/'+deptId
  apiObject.get(url1)
    .then(rr=>{




      commit('SET_DEPTRESULTSUMMARYLIST',rr.data.scoreList)
    })
    .catch(error=>{
      commit('SET_DEPTRESULTSUMMARYLIST',null)
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
