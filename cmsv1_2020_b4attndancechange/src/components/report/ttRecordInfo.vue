<template>


  <div class="has-text-centered has-background-light" style="height:8.2em;font-size:88%;">
        <template v-if="!facultyTT">
          {{facultyName}} <br/>
        </template>
        {{subName}} ,
        <template v-if="!locationTT">
        {{locationName}} <br/>
        </template>
        (Sem: {{recordInfo.ttSem}})
   <br/>
        ({{recordInfo.ttLoadType}})
        <br/>

        <template v-if="!classTT"> {{className}}</template>
        <template v-if="recordInfo.fBatchId!==0 ">
            <template v-if="!classTT">,</template>
            {{batchName}}
        </template>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name:"TtRecordInfo",
  props: ['recordInfo','facultyTT',
            'locationTT','classTT'],
  data(){
    return {
      facultyName:'',
      subName:'',
      batchName:'',
      className:'',
      locationName:''
    }
  },
  computed:{
  },
  methods: {
    getSubAliasById(){
      this.$store.dispatch('subjectStore/getSubAliasById',this.recordInfo.fSubjectId).
        then(rr=>{
          this.subName=rr
        })
        .catch(error=>{
          console.log('****',error);
        });
    },
    getBatchNameById(){
      if(this.recordInfo.fBatchId==0)
        return;
      this.$store.dispatch('classStore/getBatchNameById',this.recordInfo.fBatchId)
        .then(response=>{
          this.batchName=response.batchName
        })
        .catch(error=>{
          this.batchName=''
        })
    },
    getClassNameById(){
      this.$store.dispatch('classStore/getClassNameById',this.recordInfo.fClassId).
        then(rr=>{
          this.className=rr.className
        })
        .catch(error=>{
          console.log('****',error);
        });
    },
    getLocNameById(){
      this.$store.dispatch('locStore/getLocNameById',this.recordInfo.fLocationId).
        then(rr=>{
          this.locationName=rr
        })
        .catch(error=>{
          console.log('****',error);
        });
    },
    getFacultyById(){
      this.$store.dispatch('employeeStore/get_employee_by_id',this.recordInfo.fFacultyId)
          .then(rr=>{
            this.facultyName=rr.data.firstName.charAt(0)+rr.data.middleName.charAt(0)+rr.data.lastName.charAt(0)
          })
          .catch(error=>{
            console.log('****',error);
          })
    }
  },
  watch:{
    recordInfo(v1,v2){
      this.getFacultyById();
      this.getLocNameById();
      this.getSubAliasById();
      this.getClassNameById();
      this.getBatchNameById();
    }
  },
  mounted() {
    this.getFacultyById();
    this.getLocNameById();
    this.getSubAliasById();
    this.getClassNameById();
    this.getBatchNameById();
  }
}
</script>
<style lang="css" scoped>
</style>
