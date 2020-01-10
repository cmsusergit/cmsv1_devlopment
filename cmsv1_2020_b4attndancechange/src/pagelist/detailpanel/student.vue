<template>
    <div class="is-radiusless box tile is-vertical" style="width:100%;height:100%;">

<!--
        <div class="is-fullwidth is-clearfix">
            <button @click="exportToPDF" style="margin-bottom:1em;" class="button is-radiusless is-info is-pulled-right">Export to PDF</button>
        </div> -->
        <div id="profile" v-if="studentInfo" class="tile is-radiusless box" style="height:100%">
          <figure class="image is-128x128" style="margin-right:1em;">

            <img v-if="image" :src='image' alt="Image !Found" style="border:1px solid;">
          </figure>

          <div class="tile">
            <table class="table is-bordered is-fullwidth" style="font-size:1em">
              <tr>
                  <td colspan="8" class="has-background-grey has-text-white subtitle">Personal Detail</td>
              </tr>
              <tr>
                <td colspan="4">
                  Student Enrollment: {{studentInfo.stuEnroll}}
                </td>
                <td colspan="4">
                  Student CollegeID: {{studentInfo.stuCollegeId}}
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  Student Name: {{studentInfo.stuTitle}} {{studentInfo.stuFirstname}} {{studentInfo.stuMiddlename}} {{studentInfo.stuLastname}}
                </td>

                <td colspan="4">Gender: {{studentInfo.stuGender}}</td>
              </tr>
              <tr>
                <td colspan="8"> Student's Father Name:
                  {{studentInfo.studentFatherFname}} {{studentInfo.studentFatherMname}} {{studentInfo.studentFatherLname}}
                </td>
              </tr>
              <tr>
                <td colspan="4">Father Occupation:
                  {{studentInfo.studentFatherOccupation}}
                </td>

                <td colspan="4"> Student's Father Contact:
                  {{studentInfo.studentFatherContact}}
                </td>
              </tr>
              <tr>
                <td colspan="8"> Student's Mother Name:
                  {{studentInfo.studentMotherFname}} {{studentInfo.studentMotherMname}} {{studentInfo.studentMotherLname}}
                </td>
              </tr>
              <tr>
                <td colspan="4">Permanant Address:<br/>
                  {{studentInfo.stuPerAddress}}, <br/>
                  {{studentInfo.stuPerCity}}, <br/>
                  {{studentInfo.stuPerState}},{{studentInfo.stuPerCountry}} -
                  {{studentInfo.stuPerPincode}}
                </td>
                <td colspan="4">Current Address:<br/>
                  {{studentInfo.stuCurrAddress}}, <br/>
                  {{studentInfo.stuCurrCity}}, <br/>
                  {{studentInfo.stuCurrState}},{{studentInfo.stuCurrCountry}} -
                  {{studentInfo.stuCurrPincode}}
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  Email: {{studentInfo.stuEmail}}
                </td>
                <td colspan="4">
                  Contact: {{studentInfo.stuMobile}}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  Blood Group : {{studentInfo.stuBloodgroup}}
                </td>
                <td colspan="2">
                  Nationality: {{studentInfo.stuNationality}}
                </td>
                <td colspan="2">
                  Category : {{studentInfo.stuCategory}}
                </td>
                <td colspan="2">
                  Religion: {{studentInfo.stuReligion}}
                </td>
              </tr>
              <tr>
                <td colspan="4">Birth Date: {{new Date(studentInfo.stuDob).toLocaleDateString()}}</td>

                <td colspan="4">Admission Date: {{new Date(studentInfo.stuAdmissiondate).toLocaleDateString()}}</td>
              </tr>
              <tr>
                <td class="subtitle has-background-grey has-text-white" colspan="8">Academic Detail</td>
              </tr>
              <tr>
                <td colspan="4">
                  Department: {{deptName}}
                </td>
                <td colspan="4">
                  Course: {{courseName}}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  Current Sem: {{studentInfo.fcurrsem}}
                </td>
                <td colspan="2">
                  Class: {{className1}}
                </td>
                <td colspan="2">
                  Batch: {{batchName}}
                </td>
                <td colspan="2">
                  Status: {{studentInfo.stuStatus}}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
</template>
<script>
import html2pdf from 'html2pdf.js'
import { mapState} from 'vuex';
import config from '@/../static/test1.json'
    export default {
        name: 'StudentDetail',
        components: {
        },
        data() {
            return {
                studentInfo:null,
                image:null,
                deptName:'',
                courseName:'',
                className1:'',
                batchName:''
            }
        },
        methods: {
          exportToPDF(){
            const element = document.getElementById('profile');
            var option = {
              filename:'profile.pdf',
              image:{ type: 'jpeg', quality: 1 },
              html2canvas:{ scale:2,useCORS:true },
              jsPDF:{ unit: 'in',format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(element).set(option).save();
          },
          getDeptNameById(id){
            this.$store.dispatch('deptStore/getDeptNameByID',id)
              .then(response=>{
                this.deptName=`${response.deptName}(${response.deptAlias})`
              })
              .catch(error=>{
                this.deptName=''
              })
          },
          getBatchNameById(id){
            if(id==0){
              this.batchName='-'
              return
            }
            this.$store.dispatch('classStore/getBatchNameById',id)
              .then(response=>{
                this.batchName=response.batchName
              })
              .catch(error=>{
                this.batchName=''
              })
          },
          getCourseNameById(id){
            this.$store.dispatch('courseStore/getCourseNameByID',id)
              .then(response=>{
                this.courseName=`${response.courseName}(${response.courseAlias})`
              })
              .catch(error=>{
                this.courseName=''
              })
          },
          getClassNameById(id){
            this.$store.dispatch('classStore/getClassNameById',id)
              .then(response=>{
                this.className1=response.className
              })
              .catch(error=>{
                this.className1=''
              })
          },
        },
        mounted(){
          this.$store.dispatch('studentStore/get_student_by_id',this.$route.params.id)
            .then(rr=>{
                this.studentInfo=rr.data
                this.getDeptNameById(rr.data.fDeptId)
                this.image=config.db_configuration.baseURL+'/containers/student_photo/download/'+this.studentInfo.stuPhoto
                this.getCourseNameById(rr.data.fCourseId)
                this.getClassNameById(rr.data.fClassId)
                this.getBatchNameById(rr.data.fBatchId)
            })
            .catch(error=>{
              console.log('****',error);
            })
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .boxv{
        background-color: white;
        color:#224444;
    }
</style>
