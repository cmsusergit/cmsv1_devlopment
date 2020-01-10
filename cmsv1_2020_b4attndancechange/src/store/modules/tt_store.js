import config from "@/../static/test1.json";
import apiObject from '@/dataserve/student_serve.js'

import _ from 'lodash'
import { TTModel, TTRecordModel } from "./timetable.js";

const state = {
    busyFacultyList:null,
    timeTblSlotNameList: config.dt_list.time_slot_name,
    timeTblDayList: config.dt_list.rowh,
    timeTblSlotList: config.dt_list.slot_list,
    timeTblDt: new TTModel(),

    classTimeTblDt: new TTModel(),
    locationTimeTblDt: new TTModel(),
    timeTblId: null,
    subjectListByFaculty:null
};

const  getters = {
    busyFacultyList:state=>{return state.busyFacultyList},
    subjectListByFaculty:state=>{return state.subjectListByFaculty},
    timeTblDt:state=>{
      return state.timeTblDt
    },
    getTtblMatrix:state=>{
      let timeTblList=new Array(state.timeTblDayList.length)
      for (let ii = 0; ii < timeTblList.length; ii++) {
        timeTblList[ii]=new Array(state.timeTblSlotList.length)
        for (var indx = 0; indx < timeTblList[ii].length; indx++) {
          timeTblList[ii][indx]=new TTRecordModel()
          timeTblList[ii][indx].ttDay=state.timeTblDayList[ii]
          timeTblList[ii][indx].ttStartTime=state.timeTblSlotList[indx].startTime
          timeTblList[ii][indx].ttEndTime=state.timeTblSlotList[indx].endTime
        }
      }
      for (let ii = 0;ii<timeTblList.length;ii++) {
        for (let indx = 0; indx < timeTblList[ii].length; indx++) {
          _.forEach(state.timeTblDt.timeTableList,(ttRecord,indx1)=>{
            const tt=ttRecord.ttStartTime.substring(0,ttRecord.ttStartTime.lastIndexOf(":"));
            if((timeTblList[ii][indx].ttDay==ttRecord.ttDay)&&(timeTblList[ii][indx].ttStartTime==tt)){
              timeTblList[ii].splice(indx,ttRecord.ttDuration,ttRecord)
              timeTblList[ii][indx].ttStartTime=tt;
              timeTblList[ii][indx].ttEndTime=ttRecord.ttEndTime.substring(0,ttRecord.ttEndTime.lastIndexOf(":"));
            }
          });
        }
      }
      return timeTblList;
    },
    getLocationTtblMatrix:state=>{
      let timeTblList=new Array(state.timeTblDayList.length)
      for (let ii = 0; ii < timeTblList.length; ii++) {
        timeTblList[ii]=new Array(state.timeTblSlotList.length)
        for (var indx = 0; indx < timeTblList[ii].length; indx++) {
          timeTblList[ii][indx]=new TTRecordModel()
          timeTblList[ii][indx].ttDay=state.timeTblDayList[ii]
          timeTblList[ii][indx].ttStartTime=state.timeTblSlotList[indx].startTime
          timeTblList[ii][indx].ttEndTime=state.timeTblSlotList[indx].endTime
        }
      }
      for (let ii = 0;ii<timeTblList.length;ii++) {
        for (let indx = 0; indx < timeTblList[ii].length; indx++) {
          _.forEach(state.locationTimeTblDt.timeTableList,(ttRecord,indx1)=>{
            const tt=ttRecord.ttStartTime.substring(0,ttRecord.ttStartTime.lastIndexOf(":"));
            if((timeTblList[ii][indx].ttDay==ttRecord.ttDay)&&(timeTblList[ii][indx].ttStartTime==tt)){
              timeTblList[ii].splice(indx,ttRecord.ttDuration,ttRecord)
              timeTblList[ii][indx].ttStartTime=tt;
              timeTblList[ii][indx].ttEndTime=ttRecord.ttEndTime.substring(0,ttRecord.ttEndTime.lastIndexOf(":"));
            }
          });
        }
      }
      return timeTblList;
    },
     getClassTtblMatrix:state=>{
            let timeTblList=new Array(state.timeTblDayList.length)
            for (let ii = 0; ii < timeTblList.length; ii++) {
              timeTblList[ii]=new Array(state.timeTblSlotList.length)
              for (var indx = 0; indx < timeTblList[ii].length; indx++) {
                let tempRecord= new TTRecordModel()
                tempRecord.ttDay=state.timeTblDayList[ii]
                tempRecord.ttStartTime=state.timeTblSlotList[indx].startTime
                tempRecord.ttEndTime=state.timeTblSlotList[indx].endTime
                timeTblList[ii][indx]=tempRecord;
            }
            }
            for (let ii = 0;ii<timeTblList.length;ii++) {
              for (let indx = 0; indx < timeTblList[ii].length; indx++) {
                   let count=0;
                _.forEach(state.classTimeTblDt.timeTableList,(ttRecord,indx1)=>{
                  const tt=ttRecord.ttStartTime.substring(0,ttRecord.ttStartTime.lastIndexOf(":"));
                  if((timeTblList[ii][indx].ttDay==ttRecord.ttDay)&&(timeTblList[ii][indx].ttStartTime==tt)){
                      count=count+1
                      if(count==1){
                          timeTblList[ii].splice(indx, ttRecord.ttDuration, ttRecord)
                          timeTblList[ii][indx].ttStartTime=tt;
                          timeTblList[ii][indx].ttEndTime=ttRecord.ttEndTime.substring(0,ttRecord.ttEndTime.lastIndexOf(":"));
                      }
                      else if(count==2){
                          const temp1=timeTblList[ii][indx]
                          timeTblList[ii][indx].loadList=new Array()
                          timeTblList[ii][indx].loadList.push(_.pick(temp1,['ttId','fClassId','ttLoadType','ttSem','fFacultyId','fLocationId','fBatchId','fSubjectId']))
                          timeTblList[ii][indx].loadList.push(_.pick(ttRecord,['ttId','fClassId','ttLoadType','ttSem','fFacultyId','fLocationId','fBatchId','fSubjectId']))
                      }
                     else{
                         timeTblList[ii][indx].loadList.push(_.pick(ttRecord,['ttId','fClassId','ttLoadType','ttSem','fFacultyId','fLocationId','fBatchId','fSubjectId']))
                     }
                      console.log(`!!!!${count}----${JSON.stringify(timeTblList[ii][indx])}!!!!`)
                  }
                });
              }

            }
            return timeTblList;
    }
};


const  mutations = {
    LOAD_BUSY_FACULTY_LIST(state,dt){state.busyFacultyList=dt},
    LOAD_TT_RECORDLIST(state, dt) {
        state.timeTblDt.timeTableList = dt;
    },
    SAVE_TIMETBLDT(state, dt) {
        state.timeTblDt = dt;
    },
    LOAD_CLASS_TT_RECORDLIST(state, dt) {
        state.classTimeTblDt.timeTableList = dt;
    },
    LOAD_LOCATION_TT_RECORDLIST(state, dt) {
        state.locationTimeTblDt.timeTableList = dt;
    },
    UPDATE_TT_RECORD(state,dt) {
        for (let indx = 0; indx < state.timeTblDt.timeTableList.length; indx++)
        {
            if (state.timeTblDt.timeTableList[indx].ttId !== dt.ttId) {
            } else {
                state.timeTblDt.timeTableList[indx] = dt;
                return;
            }
        }
    },
    DELETE_TT_RECORD(state, dt) {
        for (let indx = 0; indx < state.timeTblDt.timeTableList.length; indx++)
        {
            if (state.timeTblDt.timeTableList[indx].ttId !== dt.ttId) {
            } else {
                state.timeTblDt.timeTableList.splice(indx,1);
                return;
            }
        }
    },
    SET_FACULTYLISTBYFACULTY(state,dt){
      state.subjectListByFaculty=dt.subjectList
    },
    SAVE_TT_RECORD(state, dt) {
        state.timeTblDt.timeTableList.push(dt);
    },
    SAVE_TIMETABLE_ID(state, id) {
        state.timeTblId = id;
    }
};
const  actions = {
  loadBusyFacultyList({commit,dispatch},dt){
    const temp={loadDetail:dt}
    const url1='/TimeTableInfos/getBusyFacultyList'
    return new Promise(function(resolve, reject) {
      apiObject.post(url1,temp)
        .then(rr=>{
          let response=new Array()
          rr.data.facultyList.map(record=>{
            record.timetableRecordInfos.map(tt=>{
              response.push(tt.fFacultyId)
            })
          })
          commit('LOAD_BUSY_FACULTY_LIST',response)
          resolve(response)
        })
        .catch(error=>{
          commit('LOAD_BUSY_FACULTY_LIST',null)
          console.log('****',error);
          reject(error)
        })
    });
  },
  saveTimeTable({commit,dispatch}, dt) {
        const ob = {
            timetableId: 0,
            fAyearInfoId: dt.academicYear,
            timetableDeptId: dt.dept,
            timetableEffectiveDate: new Date()
        };
        const url1 = "/TimeTableInfos";
        return new Promise((resolve, reject) => {
            apiObject.post(url1, ob)
                    .then(rr => {
                        resolve(rr);
                    })
                    .catch(error => {
                        reject(error);
                    });
        });
    },
    saveTimeTblRecord(context, record) {
        const url1 = "/TimetableRecordInfos/";
        record.load.ttId = 0;
        record.load.fTimetableId = record.timeTblId;
        console.log("----", record.load);
        return new Promise((resolve, reject) => {
            apiObject.post(url1, record.load)
                    .then(rr => {
                        context.commit("SAVE_TT_RECORD", rr.data);
                        return resolve(rr);
                    })
                    .catch(error => {
                        return reject(error);
                    });
        });
    },
    updateTimeTblRecord(context, record) {
        const url1 = "/TimetableRecordInfos/" + record.ttId;
        return new Promise((resolve, reject) => {
            apiObject.put(url1, record)
                    .then(rr => {
                        console.log(`****${JSON.stringify(rr.data)}****`)
                        context.commit("UPDATE_TT_RECORD", rr.data);
                        return resolve(rr);
                    })
                    .catch(error => {
                        return reject(error);
                    });
        });
    },
    deleteTimeTblRecord(context,dt){
        const url1 = "/TimetableRecordInfos/" + dt.ttId;
        return new Promise((resolve, reject) => {
            apiObject.delete(url1)
                    .then(rr => {
                        context.commit("DELETE_TT_RECORD", dt);
                        return resolve(rr);
                    })
                    .catch(error => {
                        return reject(error);
                    });
        });
    },
    deleteTimeTable({commit},id){
      const url1='/TimeTableInfos/'+id
      return new Promise((resolve, reject) => {
        const urlTt=url1+"/timetableRecordInfos"
        apiObject.delete(urlTt)
        .then(rr => {
          apiObject.delete(url1)
            .then(r1 => {
                resolve(r1);
              })
              .catch(error=>{
                reject(error)
              })
        })
        .catch(error=>{
            reject(error)
        })
      })
    },
    getTimeTableId(context, ob) {
        const searchBy = {where: {
                timetableDeptId: ob.dept,
                fAyearInfoId: ob.aYearId
            }
        };
        const url1 = "/TimeTableInfos?filter=" + JSON.stringify(searchBy);
        console.log(url1);
        return new Promise((resolve, reject) => {
            apiObject.get(url1)
                    .then(rr => {
                        return resolve(rr);
                    })
                    .catch(error => {
                        return reject(error);
                    });
        });
    },
    loadTTblRecordList(context, dt) {
        const ob = {where: {fFacultyId: dt.facultyId}};
        const url1 = "/TimeTableInfos/" + dt.tblId + "/timetableRecordInfos/?filter=" + JSON.stringify(ob);
        console.log(url1);
        return new Promise((resolve, reject) => {
            apiObject.get(url1)
                    .then(rr => {
                        context.commit("LOAD_TT_RECORDLIST", rr.data);
                        return resolve(rr);
                    })
                    .catch(error => {
                        context.commit("LOAD_TT_RECORDLIST", null);
                        return reject(error);
                    });
        });
    },
    loadTTblRecordListByLocation(context, dt) {
        const url1 = "/TimeTableInfos/getTTRecordListByLocation/" + dt.locationId +"/"+dt.ayid;
        return new Promise((resolve, reject) => {
            apiObject.get(url1)
                    .then(rr => {
                      let unionList=[]
                      if(rr.data.ttRecordList.length>0){
                          rr.data.ttRecordList.map(ob=>{
                            unionList=_.union(unionList,ob.timetableRecordInfos)
                          })
                        }
                        context.commit("LOAD_LOCATION_TT_RECORDLIST", unionList);
                        return resolve(rr);
                    })
                    .catch(error => {
                        context.commit("LOAD_LOCATION_TT_RECORDLIST", null);
                        return reject(error);
                    });
        });
    },
    loadTTblRecordListByCl(context, dt) {
//        const ob = {where: {
//          and:[
//            {fClassId: dt.classId}
//        ]
//      }}
//
//
//      if(dt.batchId!=-1){
//        ob.where.and.push({or:[{fBatchId:dt.batchId},{fBatchId:'-'}]})
//      }
//      const url1="/timetableRecordInfos?filter="+JSON.stringify(ob)

        const url1 = "/TimeTableInfos/getTTRecordListByClassID/"+dt.classId+"/"+dt.ayId+"/"+dt.batchId ;
        console.log(url1);
        return new Promise((resolve, reject) => {
            apiObject.get(url1)
                    .then(rr => {
                        let unionList=[]
                      if(rr.data.ttRecordList.length>0){
                          rr.data.ttRecordList.map(ob=>{
                            unionList=_.union(unionList,ob.timetableRecordInfos)
                          })
                        }
                        context.commit("LOAD_CLASS_TT_RECORDLIST", unionList);
                        return resolve(rr);
                    })
                    .catch(error => {
                         context.commit("LOAD_CLASS_TT_RECORDLIST", null);
                        return reject(error);
                    });
        });
    },
    loadTTrecordById({commit},id)
    {
        const url1 = "/TimetableRecordInfos/"+id
        console.log(url1);
        return new Promise((resolve, reject) => {
            apiObject.get(url1)
                    .then(rr => {
                        return resolve(rr.data);
                    })
                    .catch(error => {
                        return reject(error);
                    });
      })
    },





    loadSubjectListByFaculty({commit},detail){
      const url1="/TimeTableInfos/getSubjectListForFaculty"
      apiObject.post(url1,{detail:detail})
        .then(rr=>{
          commit('SET_FACULTYLISTBYFACULTY',rr.data)
        })
        .catch(error=>{
          commit('SET_FACULTYLISTBYFACULTY',null)
        })
    }
};
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
//const state={
//    timeTblSlotNameList:config.dt_list.time_slot_name,
//    timeTblDayList: config.dt_list.rowh,
//    timeTblSlotList: config.dt_list.slot_list,
//    timeTblDt: new TTModel(),
//  };
//const  getters={};
//const  mutations= {
//    SAVE_TIMETBLDT(state, dt) {
//      state.timeTblDt = dt;
//    }
//  };
//const convertFromTTModel=function(dt){
//    let dtOb=JSON.parse(JSON.stringify(dt));
//    _.forEach(dtOb.timeTblDt.timeTableList,(temp)=>{
//        _.remove(temp,(tt)=>{
//            return tt.ttLoadType=='Free'
//          });
//        });
//    return dtOb;
//};
//const convertToTTModel=function(ttrecord){
//    console.log(ttrecord);
//    let tempOb1=new TTModel()
//    _.forEach(ttrecord,(tempDtob,index)=>{
//        _.forEach(tempOb1.timeTableList,(ob,index)=>{
//              _.map(ob,(ttRecord1,ii)=>{
//                if(ttRecord1){
//                  const tempst1=tempDtob.ttStartTime.split(':');
//                  const tempst1_1=tempst1[0]+":"+tempst1[1]
//                  if(ttRecord1.ttDay==tempDtob.ttDay &&ttRecord1.ttStartTime==tempst1_1){
//                    tempOb1.timeTableList[index].splice(ii,tempDtob.ttDuration,tempDtob)
//                  }}
//                })
//             });
//    });
//    return tempOb1;
//};
//const  actions= {
//  async  saveTimeTblDt(context, dt) {
//      context.commit("SAVE_TIMETBLDT", dt.timeTblDt);
//      const tt=convertFromTTModel(dt);
//      console.log(JSON.stringify(tt));
////      await utility.getTimeTableId(tt.timeTblDt)
////      .then(rr=>{
////        tt.timeTblDt.academicYear=rr
////      })
////      .catch(ee=>{
////          console.log(ee);
////        });
////       _.forEach(tt.timeTblDt.timeTableList,temp=>{
////        if(temp.length>0){
////          console.log(tt.timeTblDt.academicYear,tt.timeTblDt.dept);
////          _.forEach(temp,ttRecord1=>{
////              ttRecord1.ttId=0;
////              ttRecord1.fTimetableId=0;
////              ttRecord1.fLocationId=1;
////              ttRecord1.fSubjectId=1;
////              apiObject.post('TimeTableInfos/1/timetableRecordInfos',ttRecord1)
////                .then(response=>{
////                  //
////                  //console.log('****',response);
////                })
////                .catch(error=>{
////                  console.log('****',error);
////                });
////            });
////        }
////      });
//      /*
//      convertToTTModel(tt);
//      let dtOb=JSON.parse(JSON.stringify(dt));
//      _.forEach(dtOb.timeTblDt.timeTableList,(temp)=>{
//          _.remove(temp,(tt)=>{
//              return tt.loadType=='Free'
//            });
//      });
//      let tempOb1=new TTModel()
//        _.forEach(dtOb.timeTblDt.timeTableList,(tempDtob,index)=>{
//          if(tempDtob.length>0){
//            _.forEach(tempDtob,(dt,dtii)=>{
//                _.map(tempOb1.timeTableList[index],(ob,ii)=>{
//                  if(ob){
//                    if(ob.startTime==dt.startTime){
//                      tempOb1.timeTableList[index].splice(dtii,dt.duration,dt)
//                    }
//                  }
//                });
//            });
//          }
//        });
//*/
//},
//loadTimeTblDt(context){
//        apiObject.get('TimeTableInfos/1/timetableRecordInfos')
//        .then(response=>{
//          _.forEach(response.data,(tt)=>{
//              utility.getSubjectAlias(tt)
//              utility.getLocation(tt)
//          });
//          const temp1=convertToTTModel(response.data);
//          context.commit("SAVE_TIMETBLDT", temp1);
//        })
//        .catch(error=>{
//          console.log('****',error);
//        })
//    }};
//
//const utility={
//  getTimeTableId(ttOb){
//    const fieldList={where:{ayBatchYear:ttOb.academicYear},fields:{ayId:1}}
//    const ayidurl1="/AcademicYearInfos?filter="+JSON.stringify(fieldList);
//    return new Promise((resolve,reject)=>{
//        apiObject.get(ayidurl1)
//        .then(rr=>{
//          return resolve(rr.data[0].ayId);
//        })
//        .catch(error=>{
//          return reject(error);
//        })});
//  },
//  getSubjectAlias(ob){
//      const fieldList={fields:{subAlias:1}}
//      const subjecturl1="/SubjectInfos/"+ob.fSubjectId+"?filter"+JSON.stringify(fieldList);
//      apiObject.get(subjecturl1).then(rr=>{
//          ob.fSubjectId=rr.data.subAlias
//      }).catch(error=>{
//        console.log('****',error);
//      });
//  },
//  getLocation(ob){
//    const fieldList={fields:{locName:1}}
//    const url1="/TtLocationInfos/"+ob.fLocationId+"?filter"+JSON.stringify(fieldList);
//    apiObject.get(url1).then(rr=>{
//        ob.fLocationId=rr.data.locName
//    }).catch(error=>{
//      console.log('****',error);
//    });
//  }
//}
//export default {
//  namespaced:true,
//  state,
//  getters,
//  mutations,
//  actions
//}
