<template>
  <div class="">

      <div style="margin-bottom:1em;overflow:auto;">
      <table class="tt table is-bordered is-narrow" style="overflow:auto;width:100%;">

        <thead class="has-background-light has-text-weight-bold">
          <th>Enrollment</th>
          <th>StudentName</th>
          <th v-for="(dt, ii) in columnNameList" :key="ii">
            <b-tooltip type='is-info' v-if="dt.proxy!=-1" :label='getFacultyNameById(dt.proxy)' position='is-bottom'>
              <p class="has-background-grey test has-text-white" style="writing-mode:vertical-rl;">{{new Date(dt.date).toLocaleDateString()}}</p>

            </b-tooltip>
              <p v-else style="writing-mode:vertical-rl;" class="test">{{new Date(dt.date).toLocaleDateString()}}</p>
          </th>
          <th style="width:50px">Present(%)</th>
        </thead >
         <tr v-for="(v1,v2,indx,ii) in tableContent" :key="v2">
           <td>{{v2}}</td>
           <td>{{studentNameList[indx]}}</td>
           <td v-for="(record,ii) in v1.list" :key="ii" style="width:40px;text-align:center">
             <p v-if="record.present" class="has-background-success">P</p>
             <p v-else class="has-background-danger">A</p>
           </td>
           <td :class="v1.percentage<75?'has-background-danger':''" style="width:50px">
             {{v1.percentage}}%
           </td>
        </tr>
        <tr class="has-background-light has-text-weight-bold">
          <td>Total Present</td>
          <td>-</td>
          <td v-for="(total,t1) in totalList" :key="t1">
            <button @click="openContentCovered(total.content)" class="button is-info">{{total.count?total.count:0}}</button>
          </td>
          <td>-</td>
        </tr>
      </table>
        <p class="is-size-7 has-text-danger">* Press Total Present to Open Content Covered</p>
    </div>
    <div v-if="contentCovered" class="is-radiusless box">
        <p class="subtitle has-text-weight-bold">Content Covered:
        <button @click="contentCovered=''" class="button is-danger is-small is-radiusless is-pulled-right">x</button>
        </p>
        <p>{{contentCovered}}</p>
        <div class="is-clearfix"></div>
    </div>
  </div>
</template>
<script>
import facultyMxn from '@/mixin/faculty'
import {mapState} from 'vuex'
export default {
  name:"AttendanceReport",
  props: ['ttScheduleId'],
  data(){
    return {
      contentCovered:'',
      test1:''
    }
  },
  mixins: [facultyMxn],
  watch:{
    ttScheduleId(value){
      this.reportTest(value)
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
    openContentCovered(v1){
      this.contentCovered=v1;
    },
    reportTest(id){
         this.$store.dispatch('attendanceStore/getAttdnReport',id)
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
              const d1=new Date(t1)
              const d2=new Date(t2)
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
                csDateConducted:ob.csDateConducted,
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
          tempR[v2]={list:v1,percentage:((count/v1.length)*100).toFixed(1)}
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
    this.reportTest(this.ttScheduleId)
  }
}
</script>
<style lang="css" scoped>
.test{
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
}
</style>
