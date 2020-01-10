<template>
  <div class="">

    <div v-if="isContent" class="has-background-danger has-text-white level" style="border-bottom:1px solid lightgrey;">
          <p style="padding-left:1em;width:50%;" class="level-left">{{ttLoadType}}</p>
          <button @click="openDetailedReport(content)" class="button is-info is-radiusless level-item">{{content.percentage}} [{{content.presentCount}}/{{content.totalCount}}]</button>
    </div>
    <b-modal :active.sync='isAttendanceDetailOpen'>
        <AttendanceDetail :attendanceDetail='currentAttendanceDetail'/>
    </b-modal>
</div>
</template>

<script>
import AttendanceDetail from '@/components/attendance/attendance_detail'
import {mapState} from 'vuex'
export default {
  name:"AttendanceReport",
  props: ['ayId',
  'ttLoadType',
  'ttSubjectId',
  'selectedStudent'],
  components: {
    AttendanceDetail
  },
  data(){
    return {
      content:{list:[]},
      isAttendanceDetailOpen:false,
      currentAttendanceDetail:{},
      test1:''
    }
  },
  watch:{
    ttSubjectId(){
      this.reportTest()
    },
    ayId(){
      this.reportTest()
    },
    selectedStudent(){
      this.reportTest()
    },
    ttLoadType(){
      this.reportTest()
    }
  },
  computed:{

    isContent(){
      return this.content.list.length>0
    }
  },
  methods: {
    openDetailedReport(v1){
      this.currentAttendanceDetail=v1
      this.isAttendanceDetailOpen=this.currentAttendanceDetail?true:false
    },
    reportTest(){
      if(!this.selectedStudent||!this.ayId||!this.ttLoadType||!this.ttSubjectId)
        return;
      const ob={
        loadDetail:{
          ayId:this.ayId,
          ttLoadType:this.ttLoadType,
          fSubjectId:this.ttSubjectId
        },
        stuEnroll:this.selectedStudent.stuEnroll
      }
      this.$store.dispatch('attendanceStore/getStudentAttdnReportBySubject',ob)
      .then(response=>{
          this.test1=response
          this.content.list=[]
          let count=0
          _.flatMap(this.test1,ob=>{
            _.flatMap(ob,temp=>{
                temp.attndanceInfos.map(record=>
                  {


                  if(record.attPresent==1)count++;
                  this.content.list.push({
                    fproxyfacultyid:temp.fproxyfacultyid,
                    csDateConducted:temp.csDateConducted,
                    csContentCovered:temp.csContentCovered,
                    enrollment:record.fstudenrollId,
                    present:record.attPresent
                  })
                })
            })
          })
          this.content.list=_.sortBy(this.content.list,['csDateConducted'])
          this.content.presentCount=count
          this.content.totalCount=this.content.list.length
          this.content.percentage=(this.content.list.length!=0)?((count/this.content.list.length)*100).toFixed(1):0
      })
      .catch(error=>{
           console.log('****',error);
         });
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
          tempR[v2]={list:v1,totalCount:v1.length,count:count,percentage:((count/v1.length)*100).toFixed(1)}

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
}
}
</script>
<style lang="css" scoped>
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
