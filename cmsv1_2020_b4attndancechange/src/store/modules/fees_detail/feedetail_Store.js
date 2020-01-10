import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  feesCount:[],
  studentFeesDetailList:[],
  categoryList:[],
  studentFeesDetail:[]
};
const getters = {
  feesCount:state=>{return state.feesCount},
  categoryList:state=>{return state.categoryList},

  studentFeesDetailList:state=>{return state.studentFeesDetailList},
  studentFeesDetailList:state=>flag=>{

    if(flag==1)
      return _.filter(state.studentFeesDetailList,ob=>ob.feesInfos.length==0)
    else
      return _.filter(state.studentFeesDetailList,ob=>ob.feesInfos.length>0)
  },
  studentFeesDetail:state=>{return state.studentFeesDetail}
};
const mutations = {
  SET_FEES_COUNT:(state,dt)=>{
    state.feesCount=dt;
  },
  SET_STUDENTFEESDETAIL_LIST:(state,dt)=>{
    state.studentFeesDetailList=dt;
  },
SET_STUDENT_FEESDETAIL:(state,dt)=>{
  state.studentFeesDetail=dt;
},
SET_CATEGORY_LIST:(state,dt)=>{
  state.categoryList=dt;
}
};
const actions = {
  load_student_feesdetail:({commit},id)=>{
  const ob={
    where:{fStuId:id}
  }
  const url1 = '/FeesInfos?filter='+JSON.stringify(ob);
  apiObject.get(url1).then(response=>{
    commit('SET_STUDENT_FEESDETAIL',response.data)
  }).catch(error=>{
    commit('SET_STUDENT_FEESDETAIL',null)
    console.log(error);
  })
},
incr_fees_count:({commit},ob)=>{

},
load_fees_count:({commit},id)=>{
  const query={where:{fAyId:id}}
  const url1 = '/FeesCounts/?filter='+JSON.stringify(query)
  apiObject.get(url1)
    .then(response=>{
    commit('SET_FEES_COUNT',response.data)
    }).catch(error=>{
      commit('SET_FEES_COUNT',null)
      console.log(error);
    })
},
  load_studentfeesdetail_list:({commit})=>{
    const url1 = '/StudentInfos/getStudentFeesDetail'
    apiObject.get(url1).then(response=>{
      commit('SET_STUDENTFEESDETAIL_LIST',response.data.studentList)
    }).catch(error=>{
      commit('SET_STUDENTFEESDETAIL_LIST',null)
      console.log(error);
    })
  },
  add_fees_collection_detail:({commit},dt)=>{
  const url1='/FeesInfos'
    return new Promise((resolve, reject)=>{
      dt.dt.feesReceiptDate=new Date(dt.dt.feesReceiptDate.getTime() + Math.abs(dt.dt.feesReceiptDate.getTimezoneOffset()*60000))
      apiObject.post(url1,dt.dt)
      .then(response=>{
        const query={id:dt.count.id,fAyId:dt.count.fAyId}
        const url1='FeesCounts/update?where='+JSON.stringify(query)
        apiObject.post(url1,dt.count)
          .then(rr=>{
          }).catch(error=>{
            console.log('****',error);
          })
        resolve(response.data)
      })
      .catch(error=>{
        reject(error)
        console.log('****',error)
      })
    });
},
edit_fees_collection_detail:({commit},dt)=>{
  const url1='/FeesInfos'
  return new Promise((resolve, reject)=>{
    dt.feesReceiptDate=new Date(dt.feesReceiptDate.getTime() + Math.abs(dt.feesReceiptDate.getTimezoneOffset()*60000))
    apiObject.put(url1,dt)
      .then(response=>{
        resolve(response.data)
      })
      .catch(error=>{
        reject(error)
        console.log('****',error)
      })
    });
},
load_category_list:({commit},id)=>{
  const url1 = '/FeesCategories'
  apiObject.get(url1).then(response=>{
    commit('SET_CATEGORY_LIST',response.data)
  }).catch(error=>{
    commit('SET_CATEGORY_LIST',null)
    console.log(error);
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
