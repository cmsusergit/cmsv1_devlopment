<template>
    <div style="width:100%;">

        <div class="dashboard is-radiusless box boxbg">
            <div class="level">

                <h1 class="level-left is-size-4 title">
                    <p v-if="!studentId">Add Student</p>

                    <p v-else>Update Student</p>
                </h1>
            </div>
            <div class="is-radiusless box">
                <b-tabs  position="is-centered" type="is-toggle" expanded>
                    <b-tab-item  label="Personal Info">
                      <PersonalInfo :studentInfo='studentInfo'></PersonalInfo>
                    </b-tab-item>
                    <b-tab-item label="Academic Info">
                        <AcademicInfo :academicInfo='studentInfo'></AcademicInfo>
                    </b-tab-item>
                    <b-tab-item label="Address Info">
                        <AddressInfo :addressInfo='studentInfo'></AddressInfo>
                    </b-tab-item>
<!--
                    <b-tab-item label="Upload Document">
                        <UploadDocument></UploadDocument>
                    </b-tab-item> -->
                    <b-tab-item label="Guardian Info">
                        <div v-for="(guardian,index) in guardianList" :key="index" class="is-radiusless box">
                          <div class="subtitle has-background-grey box has-text-white is-radiusless is-shadowless">
                              Guardian Information-{{index+1}}
                              <button @click="removeGuardian(index)" class="button is-pulled-right is-small is-outlined" v-show="guardianList.length>1">
                                <b-icon pack="fas" icon="times">
                                </b-icon>
                            </button>
                          </div>
                          <div>
                            <GuardianInfo :guardianInfo="guardian"></GuardianInfo>
                          </div>
                        </div>
                        <button @click="addGuardian()" class="button is-primary" style="margin-top:.5em">Add Guardian</button>
                    </b-tab-item>
                    <b-tab-item label="Past Academic Info">
                        <div v-for="(record,index) in pastAcademicInfoList" :key="index" class="is-radiusless box">
                          <div>

                            <button @click="removePastAcademicRecord(index)" class="button is-pulled-right is-small is-outlined"
                                    v-show="!(['SSC'].includes(record.course))">
                              <b-icon pack="fas" icon="times">
                              </b-icon>
                            </button>
                            <br>
                            <PastAcademicInfo :pastAcademicInfo="record"></PastAcademicInfo>
                          </div>
                        </div>
                        <button @click="addPastAcademicRecord()" class="button is-primary" style="margin-top:.5em">
                          Add Record
                        </button>
                    </b-tab-item>
                </b-tabs>
            </div>
            <div class="is-radiusless box">
              <button @click="save()" style="width:15%" class="button is-info is-pulled-right">Save</button>
              <div class="is-clearfix">
              </div>
            </div>
        </div>
        <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
        </b-loading>
    </div>
</template>
<script>
import PersonalInfo from '@/components/student/personalinfo'
import UploadDocument from '@/components/student/upload'
import AcademicInfo from '@/components/student/academicinfo'
import AddressInfo from '@/components/student/addressinfo'
import GuardianInfo from '@/components/student/guardianinfo'
import PastAcademicInfo from '@/components/student/pastacademicinfo'
import StudentPastAcademicInfo from '@/model/studentPastAcademic';
import GuardianDt from '@/model/guardianinfo';
import StudentInfo from '@/model/studentinfo'
import axios from "axios"
import config from "@/../static/test1.json"
export default {
  name:"AddUpdateStudent",
  components:{
    PersonalInfo,AcademicInfo,AddressInfo,GuardianInfo,
    PastAcademicInfo,
    UploadDocument
  },
  data(){
    return {
      loading:false,
      studentInfo:{},
      guardianList:[],
      pastAcademicInfoList:[
        new StudentPastAcademicInfo('SSC'),
        new StudentPastAcademicInfo('HSC')
      ],
      studentId:null,
    }
  },
  methods:{
    save(){
      this.saveStudentInfo();
    },
    addGuardian(){
      this.guardianList.push(new GuardianDt());
    },
    removeGuardian(index){
      this.guardianList.splice(index,1);
    },
    addPastAcademicRecord(){

      this.pastAcademicInfoList.push(new StudentPastAcademicInfo());
    },
    removePastAcademicRecord(index){
      this.pastAcademicInfoList.splice(index,1);
    },
    saveStudentInfo(){
        if(this.studentId){
          this.updateStudentInfo(this.studentId)
          return
        }
        else{
          this.studentInfo.stuDob=new Date(this.studentInfo.stuDob.getTime() + Math.abs(this.studentInfo.stuDob.getTimezoneOffset()*60000))
          this.studentInfo.stuAdmissiondate=new Date(this.studentInfo.stuAdmissiondate.getTime() + Math.abs(this.studentInfo.stuAdmissiondate.getTimezoneOffset()*60000))
          this.$store.dispatch("studentStore/add_student_info",this.studentInfo)
            .then(response=>{
              if(response.data){
                this.saveGuardianList(response.data.stuId)
              }
              else {
                console.log('****',response);
              }
            })
            .catch(error=>{
              this.loading = false;
              this.$buefy.toast.open({
                      duration: 5500,
                      message: error.response.data.error.message,
                      position: 'is-top',
                      type: 'is-danger'
                  });
            })
      }
    },
    saveGuardianList(id){
        const ob={
          studentId:id,
          guardianList:this.guardianList
        }
        this.$store.dispatch("studentStore/add_guardian_for_student",ob)
          .then(response=>{
              this.savePastAcademicList(id)
          })
          .catch(error=>{
            this.$store.dispatch("studentStore/remove_student_info",id)
            this.$buefy.toast.open({
                        duration: 5500,
                        message: error.response.data.error.message,
                        position: 'is-top',
                        type: 'is-danger'
                    })
            this.loading = false;
          })
    },
    savePastAcademicList(id){
        const ob={
          studentId:id,
          pastAcademicList:this.pastAcademicInfoList
        }
        this.$store.dispatch("studentStore/add_pastacademic_for_student",ob)
          .then(response=>{
            this.$buefy.toast.open({
                        duration: 5500,
                        message: "Student Created",
                        position: 'is-top',
                        type: 'is-success'
                    })
            this.loading = false;
            this.$router.push({name:"StudentManagement"})
          })
          .catch(error=>{
            this.$store.dispatch("studentStore/remove_student_info",id)
            this.$buefy.toast.open({
                        duration: 5500,
                        message: error.response.data.error.message,
                        position: 'is-top',
                        type: 'is-danger'
                    })
            this.loading = false;
          })
    },
  populateDt(){
      this.$store.dispatch("studentStore/get_student_by_id",this.studentId)
        .then(response=>{
          if(response.data)
            this.studentInfo=response.data
            this.studentInfo.stuAdmissiondate=new Date(response.data.stuAdmissiondate);
            this.studentInfo.stuDob=new Date(response.data.stuDob);
            this.$store.dispatch("studentStore/get_student_guardian_by_id",this.studentId)
              .then(rr=>{
                  if(rr.data && rr.data.length>0){
                    this.guardianList=rr.data
                    this.$store.dispatch("studentStore/get_student_pastacad_by_id",this.studentId)
                      .then(r1=>{
                          if(r1.data && r1.data.length>0){
                            this.pastAcademicInfoList=r1.data
                          }
                          else{
                            this.pastAcademicInfoList=new Array()
                            this.pastAcademicInfoList.push(new StudentPastAcademicInfo('SSC'))
                            this.pastAcademicInfoList.push(new StudentPastAcademicInfo('HSC'))
                          }
                      })
                      .catch(error=>{
                        this.$buefy.toast.open({
                          duration: 5500,
                          message: error.response.data.error.message,
                          position: 'is-top',
                          type: 'is-danger'
                        })
                      })
                  }
                  else{
                    this.guardianList=new Array();
                    this.guardianList.push(new GuardianDt())
                  }
              })
              .catch(error=>{
                this.$buefy.toast.open({
                  duration: 5500,
                  message: error.response.data.error.message,
                  position: 'is-top',
                  type: 'is-danger'
                })
              })
        })
        .catch(error=>{
          this.$buefy.toast.open({
            duration: 5500,
            message: error.response.data.error.message,
            position: 'is-top',
            type: 'is-danger'
          })
        })
    },
  // populateDt(){
  //     this.$store.dispatch("studentStore/get_student_by_id",this.studentId)
  //       .then(response=>{
  //         console.log('stage1');
  //         if(response.data){
  //           this.studentInfo=response.data
  //           this.studentInfo.stuAdmissiondate=new Date(response.data.stuAdmissiondate);
  //           this.studentInfo.stuDob=new Date(response.data.stuDob);
  //           return this.$store.dispatch("studentStore/get_student_guardian_by_id",this.studentId)
  //         }
  //       })
  //       .then(rr=>{
  //         console.log('stage2');
  //           if(rr.data && rr.data.length>0){
  //             this.guardianList=null
  //             this.guardianList=rr.data
  //             return this.$store.dispatch("studentStore/get_student_pastacad_by_id",this.studentId)
  //           }
  //           else{
  //             this.guardianList=new Array();
  //             this.guardianList.push(new GuardianDt())
  //           }
  //       })
  //       .then(r1=>{
  //         if(r1.data && r1.data.length >0){
  //           this.pastAcademicInfoList=r1.data
  //         }
  //       })
  //       .catch(error=>{
  //         this.$buefy.toast.open({
  //           duration: 5500,
  //           message: error.response.data.error.message,
  //           position: 'is-top',
  //           type: 'is-danger'
  //         })
  //       })
  //   },
    updateGuardianList(id){
      const ob={
        studentId:id,
        guardianList:this.guardianList
      }
      this.$store.dispatch("studentStore/update_guardian_for_student",ob)
        .then(rr=>{
            this.updatePastAcademicList(id)
            this.$buefy.toast.open({
                        duration: 5500,
                        message: "Student updated",
                        position: 'is-top',
                        type: 'is-success'
            })
            this.loading=false
            this.$router.push({name:'StudentManagement'})
        })
        .catch(error=>{
          this.$buefy.toast.open({
            duration: 5500,
            message: error.response.data.error.message,
            position: 'is-top',
            type: 'is-danger'
          })
          this.loading=false
        })
    },
    updatePastAcademicList(id){
      const ob={
        studentId:id,
        pastAcademicList:this.pastAcademicInfoList
      }
      console.log(JSON.stringify(ob));
      this.$store.dispatch("studentStore/update_pastacademic_for_student",ob)
        .then(rr=>{
          this.$buefy.toast.open({
                      duration: 5500,
                      message: "Student with Enrollment Id " + rr.data.stuEnroll + " Created",
                      position: 'is-top',
                      type: 'is-success'
          })
            this.loading=false
            this.$router.push({name:'StudentManagement'})
        })
        .catch(error=>{
          this.$buefy.toast.open({
            duration: 5500,
            message: error.response.data.error.message,
            position: 'is-top',
            type: 'is-danger'
          })
          this.loading=false
        })
    },
    updateStudentInfo(id){
        this.loading=true;
        this.studentInfo.stuDob=new Date(this.studentInfo.stuDob.getTime() + Math.abs(this.studentInfo.stuDob.getTimezoneOffset()*60000))
        this.studentInfo.stuAdmissiondate=new Date(this.studentInfo.stuAdmissiondate.getTime() + Math.abs(this.studentInfo.stuAdmissiondate.getTimezoneOffset()*60000))
        this.$store.dispatch("studentStore/update_student_info",this.studentInfo)
          .then(response => {
              this.updateGuardianList(id);
            }).catch(error=>{
            this.loading = false;
            this.$buefy.toast.open({
                    duration: 5500,
                    message: error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
            }
      );
    }
  },
  mounted(){
    this.studentId=this.$route.params.id;
    if(!this.studentId){
      this.studentInfo=new StudentInfo();
      this.guardianList=new Array();
      this.guardianList.push(new GuardianDt());
    }
    else{
      this.populateDt();
    }
  }
}
</script>
<style scoped>
    .boxbg{
        background-color: rgb(241,241,242);
        color:#224444;
    }
</style>
