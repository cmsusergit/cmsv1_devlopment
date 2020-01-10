<template>
  <div class="">

      <div style="margin-bottom:1em;overflow:auto;">
      <table class="table is-fullwidth is-bordered">
        <thead class="has-background-light has-text-weight-bold">
          <th>Enrollment</th>
          <th>StudentName</th>
          <!-- <th v-for="(dt, ii) in columnNameList" :key="ii">
            <b-tooltip type='is-info' v-if="dt.proxy!=-1" :label='getFacultyNameById(dt.proxy)' position='is-bottom'>
              <p class="has-background-grey test has-text-white" style="writing-mode:vertical-rl;">{{new Date(dt.date).toLocaleDateString()}}</p>
            </b-tooltip>

           <p v-else style="writing-mode:vertical-rl;" class="test">{{new Date(dt.date).toLocaleDateString()}}</p>
          </th> -->
          <th style="width:50px">Present(%)</th>
        </thead>
         <tr v-for="(v1,v2,indx,ii) in tableContent" :key="v2">
           <td>{{v2}}</td>
           <td>{{studentNameList[indx]}}</td>
           <td class="has-text-centered">
             <b-tooltip type="is-info"  position="is-left" square multilined label="Click to Open Detailed Report">
               <div @click="openDetailedReport(v1)" style="cursor:pointer;" class="tt tag is-radiusless is-medium" :class="v1.percentage<75?'is-danger':'is-success' ">
                 {{v1.percentage}}%
              </div>
              <p class="tag is-radiusless is-medium">[{{v1.presentCount}}/{{v1.totalCount}}]</p>
            </b-tooltip>
           </td>
       </tr>
      </table>
    </div>
    <b-modal :active.sync='isAttendanceDetailOpen'>
        <AttendanceDetail :attendanceDetail='currentAttendanceDetail'/>
    </b-modal>
  </div>
</template>
<script>
import facultyMxn from '@/mixin/faculty'
import AttendanceDetail from '@/components/attendance/attendance_detail'
import {mapState} from 'vuex'
export default {
  name:"AttendanceReport",
  props: ['ayId',
  'loadType',
  'batchId',
  'classId',
  'ttSubjectId'],
  components: {
    AttendanceDetail
  },
  data(){
    return {
      isAttendanceDetailOpen:false,
      currentAttendanceDetail:{},
      test1:''
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
      batchId(){
        this.reportTest()
      }
  },
  computed:{
   //....
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
    }
  },
  methods: {
    openDetailedReport(v1){
      this.currentAttendanceDetail=v1
      this.isAttendanceDetailOpen=this.currentAttendanceDetail?true:false
    },
    reportTest(){
      const ob={
        ayId:this.ayId,
        fClassId:this.classId,
        fSubjectId:this.ttSubjectId,
        ttLoadType:this.loadType,
        fBatchId:this.batchId
      }
      this.$store.dispatch('attendanceStore/getAttdByForClasswiseReport',ob)
      .then(response=>{
          this.test1=response
        })
      .catch(error=>{

           console.log('****',error);
         });
    },



    getTotalList(){
      let dtwiseOb=[]
      _.forEach(this.test1.ddClassSchedules,ob=>{
          dtwiseOb.push({content:ob.csContentCovered,date:ob.csDateConducted,count:_.countBy(ob.attndanceInfos,{attPresent:1}).true});
        })
        return dtwiseOb.sort((t1,t2)=>{
            const d1=new Date(t1.date)
            const d2=new Date(t2.date)
            return (d1<d2)?-1:1;
          });
    },
    getDtList(){
          let temp1=[]
          _.map(this.test1.ddClassSchedules,(d1)=>{
              temp1.push({date:d1.csDateConducted,proxy:d1.fproxyfacultyid})
            })
            temp1=temp1.sort((t1,t2)=>{
              const d1=new Date(t1.date)
              const d2=new Date(t2.date)
              return (d1<d2)?-1:1;
            });
            return temp1;
    },
    getContentDt(){
      const result = _.flatMap(this.test1,(dt)=>{
        return _.map(dt, ob => {
          return ob.attndanceInfos.map(record=>
              {
              return {
                fproxyfacultyid:ob.fproxyfacultyid,
                csDateConducted:ob.csDateConducted,
                csContentCovered:ob.csContentCovered,
                enrollment:record.fstudenrollId,
                present:record.attPresent
              }
            })
        });
      });
      let tempR=[]
      _.map(result,ob=>{
        tempR=_.union(tempR,ob);
      })
      tempR=_.groupBy(tempR,ob=>{
        return ob.enrollment
      })
      _.forEach(tempR,(v1,v2)=>{
          let count=0;
          v1.map(ob=>{
              if(ob.present)
                count++;
          });
          const vv=v1.sort((t1,t2)=>{
            const d1=new Date(t1.csDateConducted)
            const d2=new Date(t2.csDateConducted)
            return (d1<d2)?-1:1;
          });
          tempR[v2]={list:v1,totalCount:v1.length,presentCount:count,percentage:((count/v1.length)*100).toFixed(1)}
      })
      const ordered = {};
      const enrollmentList={enrollment:[]}
      Object.keys(tempR).sort().forEach(function(key) {
        enrollmentList.enrollment.push({stuEnroll:key})
        ordered[key] = tempR[key];
      });
      this.$store.dispatch('attendanceStore/getStuNameByEnrollment',enrollmentList)
      return ordered;
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
