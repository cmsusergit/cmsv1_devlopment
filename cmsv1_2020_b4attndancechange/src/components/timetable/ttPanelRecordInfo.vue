<template>
  <div class="" style="font-size:88%;">

    <strong>
       {{recordInfo.ttStartTime}} to {{recordInfo.ttEndTime}}
   </strong>
      {{recordInfo.ttrecordInfoType}}
   <br/>
        {{subName}} ,
        {{locationName}}
        (Sem: {{recordInfo.ttSem}})
   <br/>
        ({{recordInfo.ttLoadType}})
        {{className}}
        <template v-if="recordInfo.fBatchId!==0 ">

          , {{batchName}}
        </template>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name:"TtRecordInfo",
  props: ['recordInfo'],
  data(){
    return {className:'',batchName:'',
      subName:'',
      locationName:''
    }
  },
  computed:{
  },
  methods: {
    getSubNameById(){
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
        return
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
    }
  },
  watch:{
    recordInfo(v1,v2){
        this.getLocNameById();
        this.getSubNameById();
        this.getClassNameById();
        this.getBatchNameById();
    }
  },
  mounted() {
    this.getLocNameById();
    this.getSubNameById();
    this.getClassNameById();
    this.getBatchNameById();
  }
}
</script>
<style lang="css" scoped>
</style>
