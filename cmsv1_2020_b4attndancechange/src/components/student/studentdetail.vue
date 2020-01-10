<template>
    <div class="has-background-white card-content" style="width:100%;">

      <div class="columns" :class="stuStat.Code==0?'has-background-danger':'has-background-success' ">
        <div class="column is-4">
            <b>Department:</b> {{deptName}}
        </div>
          <div class="column">
              <b>Course:</b> {{courseName}}
          </div>
          <div class="column">
              <b>Class:</b> {{className}}

          </div>
          <div class="column">
              <b>Batch:</b> {{batchName}}
          </div>
        <div v-if="stuStat" class="column">
          <b>Status:</b> &nbsp&nbsp {{stuStat.status}}
        </div>
      </div>
    </div>
</template>
<script>
import{find}from 'lodash'
  import config from '@/../static/test1.json'
  import {mapState} from 'vuex'
    export default {
        name: 'StudentDetail',
        props: [
            'studentInfo'
        ],
        data() {
            return {
              deptName:'',
              courseName:'',
              className:'',
              batchName:''
            }
        },
   computed:{
     ...mapState([//....
       'classList']),
            stuStat(){
              //
              // console.log(`****${JSON.stringify(this.studentInfo)}****`);
              return find(config.studentStatusList,{Code:this.studentInfo.stuStatus})
            }
          },

  methods: {
    getDeptNameById(id){
      this.$store.dispatch('deptStore/getDeptNameByID',id)
        .then(response=>{
          this.deptName=`${response.deptName}(${response.deptAlias})`
        })
        .catch(error=>{
          this.deptName=''
        })
    },
    getCourseNameById(id){
      this.$store.dispatch('courseStore/getCourseNameByID',id)
        .then(response=>{
          this.courseName=`${response.courseAlias}`
        })
        .catch(error=>{
          this.courseName=''
        })
    },
    getAllocationDetail(){
      this.$store.dispatch('studentStore/load_allocation_by_stuId',this.studentInfo.stuId)
        .then(rr=>{
          this.className=''
          this.batchName=''
          rr.map(record=>{
            this.className+=this.classList.find(ob=>ob.classId==record.classId).className+" "
            this.batchName+=this.$store.getters['classStore/batchNameById'](record.batchId).batchName+" "
          })
        })
        .catch(error=>{
        })
    }
    // getClassNameById(id){
    //   this.$store.dispatch('classStore/getClassNameById',id)
    //     .then(response=>{
    //       this.className=response.className
    //     })
    //     .catch(error=>{
    //       this.className=''
    //     })
    // },
    // getBatchNameById(id){
    //   this.$store.dispatch('classStore/getBatchNameById',id)
    //     .then(response=>{
    //       this.batchName=response.batchName
    //     })
    //     .catch(error=>{
    //       this.batchName=''
    //     })
    // }
  },
  mounted() {
    if(!this.studentInfo.fDeptId)
      this.$store.dispatch('load_class_list_by_dept', this.studentInfo.fDeptId);
    this.$store.dispatch('classStore/load_batch_list')
    this.getDeptNameById(this.studentInfo.fDeptId)
    this.getCourseNameById(this.studentInfo.fCourseId)
    this.getAllocationDetail()
    // this.getClassNameById(this.studentInfo.fClassId)
    // this.getBatchNameById(this.studentInfo.fBatchId)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .footrbox{
        background-color: floralwhite;
        padding:.4em;
        color:#224444;
        border-top:1px solid #224444;
    }
</style>
