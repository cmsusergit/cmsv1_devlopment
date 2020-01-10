import config from "@/../static/test1.json"
export class TTModel {
  constructor() {
    this.dept = "";
    this.pFacultyId = "";
    this.timeTableList=[];
//    let temp=new TTRecordModel();
//    temp.ttDay="MO";
//    temp.ttStartTime="10:00";
//    temp.ttEndTime="11:00";
//    temp.ttLoadType="Theory";
//    temp.fSubjectId="OOPC";
//    temp.fLocationId="LAB-F1"
//    this.timeTableList.push(temp);
//     let temp1=new TTRecordModel();
//    temp1.ttDay="MO";
//    temp1.ttStartTime="02:45";
//    temp1.ttEndTime="04:45";
//    temp1.ttLoadType="Practical";
//    temp1.fSubjectId="OOPC";
//    temp1.fLocationId="LAB-F2"
//    this.timeTableList.push(temp1);
//    this.timeTableList = new Array(config.dt_list.rowh.length);
//    for (let ii = 0; ii < this.timeTableList.length; ii++) {
//      this.timeTableList[ii] = new Array(config.dt_list.slot_list.length);
//
//      for (let indx = 0; indx < this.timeTableList[ii].length; indx++) {
//        this.timeTableList[ii][indx] = new TTRecordModel();
//        this.timeTableList[ii][indx].ttDay = config.dt_list.rowh[ii];
////        let t1=config.dt_list.colh[indx].replace(/\s/g,'');
////
////        const tt = t1.split("to");
////        this.timeTableList[ii][indx].ttStartTime = tt[0];
////        this.timeTableList[ii][indx].ttEndTime = tt[1];
//        this.timeTableList[ii][indx].ttStartTime =config.dt_list.slot_list[indx].startTime;
//        this.timeTableList[ii][indx].ttEndTime = config.dt_list.slot_list[indx].endTime;
//      }
//    }
    this.academicYear = "1";
  }
}
export class TTRecordModel {
  constructor() {
    this.ttDay = "";
    this.fFacultyId = "";
    this.fDeptId = "";
    this.fCourseId = "";
    this.fClassId = "";
    this.fBatchId = "";
    this.fLocationId = null;
    this.ttStartTime = "";
    this.ttEndTime = "";
    this.ttDuration = 1;
    this.ttLoadType = "";
    this.ttSem = 1;
    this.fSubjectId = null;
  }
}
//
// module.exports = {
//   TTModel: TimeTable,
//   TTRecordModel: TimeTableRecord
// };
