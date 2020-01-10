<template>
    <div>

        <div class="dashboard is-radiusless box boxbg">
            <div class="level">

                <h1 class="level-left is-size-4 title">
                    <p v-if="!subjectId">Add subject</p>
                    <p v-else>Update Subject with ID: {{subjectId}}</p>
                </h1>
            </div>
            <div class="is-radiusless box" style="width:80vw;">

                <Subject :subjectInfo="subjectInfo"></Subject>
                <hr>
                <b-field grouped>
                  <b-field label="Theory" expanded >
                             <b-input v-model="subjectInfo.subjectTheory" type="number" min=0 max=8 required></b-input>
                         </b-field>
                  <b-field label="Practical" expanded>
                                <b-input v-model="subjectInfo.subjectPractical" type="number" min=0 max=20 required></b-input>
                            </b-field>
                            <b-field label="Tutorial" expanded>
                                       <b-input  v-model="subjectInfo.subjectTutorial" type="number" min=0 max=8 required></b-input>
                                   </b-field>
                   </b-field >
            </div>
            <div class="is-radiusless box">
              <button v-if="subjectId" @click="update()" style="width:15%" class="button is-info is-pulled-right">Update</button>
              <button v-else @click="save()" style="width:15%" class="button is-info is-pulled-right">Save</button>
              <div class="is-clearfix">
              </div>
            </div>
        </div>
        <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
        </b-loading>
    </div>
</template>
<script>
import Subject from '@/components/subject/subject'
import TeachingScheme from '@/components/subject/teaching_scheme'

import axios from "axios"
export default {
  name:"AddUpdateStudent",
  components:{
    Subject,
    TeachingScheme
  },
  data(){
    return {
      loading:false,
      subjectInfo:{subId:0,subType:'Regular'},
      teachingSchemeList:[],
      subjectId:null
    }
  },
  methods:{
      save(){
        this.$store.dispatch('subjectStore/ADD_SUBJECT_INFO',this.subjectInfo)
          .then(response=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Subject Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
              this.$router.push({name:"Subject"})
          }).catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
          })
      },
      update(){
        this.$store.dispatch('subjectStore/UPDATE_SUBJECT_INFO',this.subjectInfo)
          .then(response=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Subject Updated Successfully",
                    position: 'is-top',
                    type: 'is-success'
               });
              this.$router.push({name:"Subject"})
          }).catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
          })
      },
      populateSubjectById(){
        this.$store.dispatch('subjectStore/getSubjectById',this.subjectId)
          .then(rr=>{
            this.subjectInfo=rr
          })
          .catch(error=>{
            console.log('****',error);
          })
      }
  },
  mounted(){
    this.subjectId=this.$route.params.id;
    if(this.subjectId){
      this.populateSubjectById()
    }
  }


}
</script>
<style scoped>
    .boxbg{
        width:100%;
        background-color: lightgrey;

        color:#224444;
        height:100%;
    }
</style>
