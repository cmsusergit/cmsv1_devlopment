<template>
  <div>

      <div v-if='isChart' style="margin-bottom:1em;overflow:auto;" class="is-radiusless is-clearfix box">
        <button @click='exportToSVG' class="button is-info is-small is-radiusless is-pulled-right">Export to SVG</button>
        <div style="overflow:auto;width:100%;">
          <vue-frappe ref='chart1' id='chart1' :title='chartTitle' :valuesOverPoints='true'  :colors="['#24d170','#ff2870']" type="axis-mixed" :labels="chartLabel" :dataSets="chartDt"></vue-frappe>
        </div>
        <table class="table is-bordered is-fullwidth">
          <thead>
            <th>Sr.</th>
            <th>Date</th>

            <th>Present</th>
            <th>Absent</th>
            <th>Total</th>
            <th>Content Covered</th>
            <th></th>
          </thead>
          <tr :key="indx" v-for="(record,indx) in tableDt">
            <td width="50">{{indx+1}}</td>
            <td width="170">{{record.date}}</td>
            <td width="50" class="has-text-centered">
              <p class='tag is-success is-radiusless' style="width:100%;">{{record.presentCount}}</p>
            </td>
            <td width="50" class="has-text-centered">
                <p class='tag is-danger is-radiusless' style="width:100%;">{{record.absentCount}}</p>
            </td>
            <td class="has-text-centered" width="50">
                <p class='tag is-radiusless' style="width:100%;">{{record.presentCount+record.absentCount}}</p>
            </td>
            <td>{{record.content}}</td>
            <td class="has-text-centered">
              <b-tooltip label="Click to Open Detailed Report" type="is-danger" position='is-left'>
                <button @click="recordSelected(record)" class="button is-radiusless is-info is-small">Detail</button>
              </b-tooltip></td>
          </tr>
        </table>
        <p v-if="studentAttndTblDt && studentAttndTblDt.length>0" class="tag is-radiusless is-size-5" style="width:100%;">{{selectedSchedule.date}}</p>
        <table v-if="studentAttndTblDt && studentAttndTblDt.length>0" class="table is-bordered is-fullwidth">
            <thead>
              <th>Sr.</th>
              <th>Enrollment</th>
              <th>Student Name</th>
              <th>Attendace</th>
            </thead>
            <tr :key="indx" v-for="(record,indx) in studentAttndTblDt">
              <td>{{indx+1}}</td>
              <td>{{record.fstudenrollId}}</td>
              <td><p v-if="studentNameList && studentNameList[indx]">{{studentNameList[indx]}}</p></td>
              <td class="has-text-centered" width="50">
                <div class="tag is-radiusless is-small" :class="record.attPresent?'is-success':'is-danger' " style="width:100%">{{record.attPresent?'P':'A'}}</div>
              </td>
            </tr>
          </table>
        </div>
    <div v-else class="is-radiusless box"><p class="is-size-5 has-text-danger">Data Not Found</p></div>
<!--
    <b-modal :active.sync='isAttendanceDetailOpen'>
        <AttendanceDetail :attendanceDetail='currentAttendanceDetail'/>
    </b-modal> -->
  </div>
</template>
<script>
import facultyMxn from '@/mixin/faculty'
import AttendanceDetail from '@/components/attendance/attendance_detail'
import {mapState} from 'vuex'
export default {
  name:"AttendanceReport",
  props: ['ayId',
  'facultyId',
  'loadType',
  'batchId',
  'classId',
  'ttSubjectId'],
  components: {
    AttendanceDetail
  },
  data(){
    return {
      tableDt:[],
      selectedSchedule:'',
      chartDt:[],
      isAttendanceDetailOpen:false,
      currentAttendanceDetail:{},
      test1:'',
      isChart:false,
      chartTitle:'',
      chartLabel:[],
    }
  },
  mixins: [facultyMxn],
  watch:{
    ayId(value){ this.reportTest()},
    classId(value){
      this.reportTest()
    },
    ttSubjectId(value){
      this.reportTest()
    },
    loadType(){
      this.reportTest()
    },
    facultyId(){
      this.reportTest()
    },
    batchId(){
      this.reportTest()
    }
  },



  computed:{
    ...mapState({//....
      studentNameList:state=>state.attendanceStore.studentNameList
    }),
    totalList(){
      return this.getTotalList()
    },
    columnNameList(){
      return this.getDtList()
    },
    tableContent(){
      return this.getContentDt();
    },
    studentNameList(){
      return this.$store.getters['attendanceStore/studentNameList']
    },
    studentAttndTblDt(){
      let tempList=this.$store.getters['attendanceStore/attndList']
      if(!tempList)return;
      tempList=_.sortBy(tempList,['fstudenrollId'])
      let stuEnrollList=[]
      tempList.map(ob=>{
        stuEnrollList.push({stuEnroll:ob.fstudenrollId})
      })
      this.$store.dispatch('attendanceStore/getStuNameByEnrollment',{enrollment:stuEnrollList})
      return tempList
    }
  },
  methods: {
    recordSelected(ob){
      this.selectedSchedule=ob
      this.$store.dispatch('attendanceStore/getAttdnListByCSID',ob.csId)
    },
    exportToSVG(){
      this.$refs.chart1.export()
    },
    // openDetailedReport(v1){
    //   this.currentAttendanceDetail=v1
    //   this.isAttendanceDetailOpen=this.currentAttendanceDetail?true:false
    // },


    reportTest(){
      const ob={
        ayId:this.ayId,
        loadDetail:{
          fClassId:this.classId,
          fFacultyId:this.facultyId,
          fSubjectId:this.ttSubjectId,
          ttLoadType:this.loadType,
          fBatchId:this.batchId
        }
      }
      this.$store.dispatch('attendanceStore/getStudentAttdByFaculty',ob)
      .then(response=>{
          let tempList=[]
          response.map(rr=>{
            rr.timetableRecordInfos.map(ttRecord=>{
              ttRecord.ddClassSchedules.map(scheduleRecord=>{
                scheduleRecord.attndanceInfos.map(tempRecord=>{
                  let record={
                    csId:scheduleRecord.csId,
                    date:scheduleRecord.csDateConducted,
                    content:scheduleRecord.csContentCovered,
                    enrollment:tempRecord.fstudenrollId,
                    present:tempRecord.attPresent
                  }
                  tempList.push(record)
                })
              })
            })
          })
          this.test1=_.groupBy(tempList,'date')
          _.forEach(this.test1,rr=>{
             rr.count=_.countBy(rr,pp=>{return pp.present==1})
           })
          this.chartDt=[]
          this.chartLabel=[]
          let tempChartDt=[]
          _.forEach(this.test1,(rr=>{
              tempChartDt.push({csId:rr[0].csId,content:rr[0].content,date:rr[0].date,presentCount:rr.count.true?rr.count.true:0,absentCount:rr.count.false?rr.count.false:0})
          }))
          if(tempChartDt.length>0){
              this.isChart=true
              this.tableDt=[]
              this.chartTitle='Attendance For '+this.getFacultyNameById(this.facultyId)
              tempChartDt=_.sortBy(tempChartDt,['date'])
              let presentValue=[]
              let absentValue=[]
              tempChartDt.map(oo=>{
                this.tableDt.push({csId:oo.csId,content:oo.content,date:new Date(oo.date).toDateString(),presentCount:oo.presentCount,absentCount:oo.absentCount})
                this.chartLabel.push(new Date(oo.date).toDateString())
                presentValue.push(oo.presentCount)
                absentValue.push(oo.absentCount)
              })
              this.chartDt.push({chartType:'bar',name:'Present',values:presentValue})
              this.chartDt.push({chartType:'bar',name:'Absent',values:absentValue})
            }
            else{
              this.isChart=false
            }
        })
      .catch(error=>{
           console.log('****',error);
         });
    },
    getContentDt(){
      // const result = _.flatMap(this.test1,(dt)=>{
      //   return _.map(dt, ob => {
      //     return ob.attndanceInfos.map(record=>
      //         {
      //         return {
      //           fproxyfacultyid:ob.fproxyfacultyid,
      //           csDateConducted:ob.csDateConducted,
      //           csContentCovered:ob.csContentCovered,
      //           enrollment:record.fstudenrollId,
      //           present:record.attPresent
      //         }
      //       })
      //   });
      // });
      // let tempR=[]
      // _.map(result,ob=>{
      //   tempR=_.union(tempR,ob);
      // })
      // tempR=_.groupBy(tempR,ob=>{
      //   return ob.enrollment
      // })
      // _.forEach(tempR,(v1,v2)=>{
      //     let count=0;
      //     v1.map(ob=>{
      //         if(ob.present)
      //           count++;
      //     });
      //     const vv=v1.sort((t1,t2)=>{
      //       const d1=new Date(t1.csDateConducted)
      //       const d2=new Date(t2.csDateConducted)
      //       return (d1<d2)?-1:1;
      //     });
      //     tempR[v2]={list:v1,totalCount:v1.length,presentCount:count,percentage:((count/v1.length)*100).toFixed(1)}
      // })
      // const ordered = {};
      // const enrollmentList={enrollment:[]}
      // Object.keys(tempR).sort().forEach(function(key) {
      //   enrollmentList.enrollment.push({stuEnroll:key})
      //   ordered[key] = tempR[key];
      // });
      // this.$store.dispatch('attendanceStore/getStuNameByEnrollment',enrollmentList)
      // return ordered;
    }
},
mounted() {
    this.reportTest(this.ttSubjectId)
  }
}
</script>

<style lang="css" scoped>
.tt:hover{
    opacity:0.8;
    border:1px solid grey;
}
/* .test{
  padding:.2em;
  transform: rotate(-180.0deg);
}
table{
  overflow-x: auto;
}
thead th,
tr td{
  position: sticky;
}

thead th:last-child{
  background-color: rgb(220,241,255);
  border:1px solid grey;
}
table tr td:last-child{
  background-color: white;
  border:1px solid grey;
}
table thead th:last-child,
table tr td:last-child{
    top:auto;
    right:0;
}
table thead th:first-child{
  background-color: rgba(220,241,255);
  border:1px solid grey;
}
table tr td:first-child{
  background-color: white;
  border: 1px solid grey;
}
table thead th:first-child,
table tr td:first-child{
  left:0;
  z-index: 1;
} */
</style>
