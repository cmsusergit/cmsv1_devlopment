<template lang="html"> 
  <div class="is-radiusless box">

<b-field grouped>
    <b-field label="Course Name" expanded>
      <b-input v-model="courseInfo.courseName" required></b-input>
    </b-field>
    <b-field label="Course Alias" expanded>
      <b-input v-model="courseInfo.courseAlias" required></b-input>
    </b-field>
    </b-field>
    <!-- <b-field label="Description" expanded>
      <b-input v-model="CourseInfos.locDescription" type="textarea" required></b-input>
    </b-field> -->
    <div class="level level-right">
      <button @click="addCourse" class="button is-radiusless  is-primary level-item">Add Course</button>
      <button v-if="courseInfo.courseName!=='' " @click="updateCourse" class="button is-radiusless is-primary level-item">Update Course</button>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
    </b-loading>
  </div>
</template>
<script>

import {mapState} from 'vuex'
export default {
  name: 'AddCourse',
  props: ['courseInfo'],
  data() {
      return {
        loading:false,
      }
  },
  methods:{
      addCourse(){
        if(this.courseInfo.courseName!==''){
          this.$buefy.dialog.confirm({
                    message: 'This Will Add New Course,Really want to Continue?',
                    onConfirm: () => {
                      this.addCourse1();
                    }
                })
        }
        else{
          this.addCourse1();
        }
},

addCourse1(){
        this.loading=true;

        this.courseInfo.courseId=0;
        this.$store.dispatch('courseStore/add_course',this.courseInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Course Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Error in Adding Course\n"+error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
                this.loading=false;
          });
      },
      updateCourse(){
        this.loading=true;
        this.$store.dispatch('courseStore/update_course',this.courseInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Course Updated Successfully",
                    position: 'is-top',type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Error in Adding Course\n"+error.response.data.error.message,
                    position: 'is-top',type: 'is-danger'
                });
                this.loading=false;
          });
      }
  },
  created(){
  }
}
</script>
<style lang="css" scoped>
</style>
