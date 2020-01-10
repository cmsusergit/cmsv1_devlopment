import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  loadCalc:null,
  loadCalcInOther:null,
  loadCalcByOther:null,
  loadCalcDetail:[]
};
const getters = {
  getLoadCalculation:(state)=>{
    return state.loadCalc

  },
    getLoadCalculationByOther:(state)=>{
        return state.loadCalcByOther
      },
    getLoadCalculationInOther:(state)=>{
      return state.loadCalcInOther
    },
  getLoadCalcDetail:(state)=>{
    return state.loadCalcDetail
  }
};
const mutations = {
SET_LOADCALC:(state,dt)=>{
  state.loadCalc=dt;
},
SET_LOADCALCBYOTHER:(state,dt)=>{
  state.loadCalcByOther=dt;
},
SET_LOADCALCINOTHER:(state,dt)=>{
  state.loadCalcInOther=dt;
},
SET_LOADCALC_DETAIL:(state,dt)=>{
  state.loadCalcDetail=dt;
},
};
const actions = {
  add_load_calculation:({commit},dt)=>{
  const url1='/Loadcalcs/'
  return new Promise(function(resolve, reject) {
      apiObject.post(url1,dt)
        .then(rr=>{
          commit('SET_LOADCALC',rr.data)
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        })
      });
    },
    load_dept_calculation_in_other:({commit},ob)=>{
      const url1="/Loadcalcs/getOtherDeptCalculation/"
      apiObject.post(url1,{ob:ob}).then(rr=>{
        commit('SET_LOADCALCINOTHER',rr.data.loadCalculation)
      })
      .catch(error=>{
        commit('SET_LOADCALCINOTHER',null)
        console.log('****',error)
      })
    },






    load_dept_calculation_by_other:({commit},ob)=>{
      const url1="/Loadcalcs/getByOtherDeptCalculation/"
      apiObject.post(url1,{ob:ob}).then(rr=>{
        commit('SET_LOADCALCBYOTHER',rr.data.loadCalculation)
      })
      .catch(error=>{
        commit('SET_LOADCALCBYOTHER',null)
        console.log('****',error)
      })
    },
    load_dept_calculation:({commit},ob)=>{
      const url1="/Loadcalcs/getCalculation/"
      apiObject.post(url1,{ob:ob}).then(rr=>{
        commit('SET_LOADCALC',rr.data.loadCalculation)
      })
      .catch(error=>{
        commit('SET_LOADCALC',null)
        console.log('****',error)
      })
    },
    remove_load_calculation:({commit},id)=>{
    const url1='/Loadcalcs/'+id+'/loadcalcDepts'
    return new Promise(function(resolve, reject) {
        apiObject.delete(url1)
          .then(rr=>{
            commit('SET_LOADCALC_DETAIL',null)
            const url1_1='/LoadCalcs/'+id
            apiObject.delete(url1_1).then(rr=>{
                commit('SET_LOADCALC',null)
                resolve(rr.data)
            })
            .catch(error=>{
              console.log('****',error)
              reject(error)
            })
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
        });
      },


    load_load_Calc_detail({commit},dt){
      const url1=`/Loadcalcs/${dt}/loadcalcDepts`
      console.log('----',url1);
      return new Promise(function(resolve, reject) {
          apiObject.get(url1,dt)
            .then(rr=>{
              commit('SET_LOADCALC_DETAIL',rr.data)
              resolve(rr.data)
            })
            .catch(error=>{
              console.log('****',error);
              reject(error)
            })
          });
    },
  add_load_calc_detail:({commit},dt)=>{
    const url1=`/Loadcalcs/${dt[0].lcId}/loadcalcDepts`
    console.log('----',url1);
    return new Promise(function(resolve, reject) {
        apiObject.post(url1,dt)
          .then(rr=>{
            commit('SET_LOADCALC_DETAIL',rr.data)
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          })
        });
      },
      remove_load_calc_detail:({commit},id)=>{
        const url1=`/loadcalcDepts/${id}`
        return new Promise(function(resolve, reject) {
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
load_load_calculation:({commit},dt)=>{
    const ob={
      where:dt
    }
    const url1 = '/Loadcalcs?filter='+JSON.stringify(ob);
    console.log(url1);
    return new Promise((resolve,reject)=>{
      return apiObject.get(url1).then(response=>{
        commit('SET_LOADCALC',response.data)
        resolve(response.data[0])
    }).catch(error=>{
      console.log(error);
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
