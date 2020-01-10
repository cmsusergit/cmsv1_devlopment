<template>
  <div  class="has-text-centered has-background-white" style="font-size:100%;">

    <template v-if="recordInfo">
        <b>{{recordInfo.ttDay}},</b>
        <b>{{recordInfo.ttStartTime.substring(0,5)}} to {{recordInfo.ttEndTime.substring(0,5)}}</b><br/>
        {{subName}} <br/>
        {{locationName}},
        (Sem: {{recordInfo.ttSem}}),<br/>
        ({{recordInfo.ttLoadType}}),
        {{className}}


        <template v-if="recordInfo.fBatchId!==0 ">
          , {{batchName}}
        </template>
      </template>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name:"LoadDetail",
  props: ['recordId'],
  data(){
    return {
      recordInfo:'',
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

    loadRecordInfo() {
      console.log(this.recordId);
      this.$store.dispatch('ttStore/loadTTrecordById',this.recordId)
        .then(rr=>{
          this.recordInfo=rr
          console.log('****',JSON.stringify(rr));
          this.getFacultyById();
          this.getLocNameById();
          this.getSubAliasById();
          this.getClassNameById();
          this.getBatchNameById();
          this.$emit('loadDetailDone',this.recordInfo)
        })
        .catch(error=>{
          console.log('****',error);
        })
      },
    getSubAliasById(){
      this.$store.dispatch('subjectStore/getSubNameById',this.recordInfo.fSubjectId).
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
    recordId(v1,v2){
      this.loadRecordInfo()
    }
    // recordInfo(v1,v2){
    //   this.getFacultyById();
    //   this.getLocNameById();
    //   this.getSubAliasById();
    //   this.getClassNameById();
    //   this.getBatchNameById();
    // }
  },
  mounted() {
    this.loadRecordInfo()
  }
}
</script>
<style lang="css" scoped>
</style>
