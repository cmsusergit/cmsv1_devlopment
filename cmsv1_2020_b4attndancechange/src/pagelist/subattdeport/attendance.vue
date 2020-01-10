<template>
  <div class="is-radiusless box">

      <div style="overflow-x:auto">
      <table class="table is-fullwidth is-bordered">
        <tr class="has-background-light has-text-weight-bold">
          <th>Enrollment</th>
          <th>StudentName</th>

          <th v-for="(dt, ii) in columnNameList" :key="ii">
            <p style="writing-mode:vertical-rl;" class="test">{{new Date(dt).toLocaleDateString()}}</p>
          </th>
          <th style="width:50px">Present(%)</th>
        </tr>
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









            <button @click="openContentCovered(total.content)" class="button is-info">{{total.count}}</button>
          </td>
          <td>-</td>
        </tr>
      </table>
        <p class="is-size-7 has-text-danger">* Press Total Present to Open Content Covered</p>
    </div>
    <div v-if="contentCovered" class="is-radiusless box">
        <p class="subtitle">Content Covered:</p>
        <p>{{contentCovered}}</p>
    </div>
  </div>
</template>
<script>
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
          dtwiseOb.push({content:ob.csContentCovered,date:ob.csDateConducted,count:_.countBy(ob.attndanceInfos,{attPresent:true}).true});
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
              temp1.push(d1.csDateConducted)
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
</style>
