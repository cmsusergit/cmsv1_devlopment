<template>
    <div class="is-radiusless box tile is-vertical" style="width:100%;height:100%;">
<!--
      <div class="is-fullwidth is-clearfix">
          <button @click="exportToPDF" style="margin-bottom:1em;" class="button is-radiusless is-info is-pulled-right">Export to PDF</button>
      </div> -->
        <div id='emp_profile' v-if="employeeInfo" class="tile is-radiusless box" style="height:100%">
          <figure class="image is-128x128" style="margin-right:1em;">
            <img v-if="image" :src="image" alt="Image !Found" style="border:1px solid">
          </figure>



          <div class="tile">
            <table class="table is-bordered is-fullwidth" style="font-size:1em">
              <tr>
                <td colspan="8" class="has-background-grey has-text-white subtitle has-text-weight-bold">
                  Personal Detail
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <b>ID:</b> {{employeeInfo.empId}}
                </td>
                <td colspan="4">
                  <b>Code:</b> {{employeeInfo.empCode}}
                </td>
              </tr>
              <tr>
                <td colspan="4"><b>Department:</b> {{deptName}}</td>
                <td colspan="4"><b>Designation:</b> {{designation}}</td>
              </tr>
              <tr>
                <td colspan="4">
                  <b>Name:</b> {{employeeInfo.title}} {{employeeInfo.firstName}} {{employeeInfo.middleName}} {{employeeInfo.lastName}}
                </td>
                <td colspan="2"><b>Gender:</b> {{employeeInfo.gender}}</td>
                <td colspan="2">
                  <b>Marrital Status:</b> {{employeeInfo.marritalStatus}}
                </td>
              </tr>
              <tr>
                <td colspan="8"><b>Address:</b><br/>
                  {{employeeInfo.address}}
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <b>Email:</b> {{employeeInfo.email}}
                </td>
                <td colspan="4">
                  <b>Contact No:</b> {{employeeInfo.contact}}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <b>Nationality:</b> {{employeeInfo.nationality}}
                </td>
                <td colspan="2">
                  <b>Category:</b> {{employeeInfo.category}}
                </td>
                <td colspan="4">
                  <b>Religion:</b> {{employeeInfo.religion}}
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <b>Blood Group:</b> {{employeeInfo.bloodGroup}}
                </td>
                <td colspan="2">
                  <b>Birth Date:</b> {{new Date(employeeInfo.dob).toLocaleDateString()}}</td>
                <td colspan="4">
                  <b>Joining Date:</b> {{new Date(employeeInfo.doj).toLocaleDateString()}}</td>
              </tr>
              <tr>
                <td colspan="8" class="has-background-grey has-text-white subtitle has-text-weight-bold">Office Detail</td>
              </tr>
              <tr>
                <td colspan="4">
                  PAN: {{employeeInfo.panNumber}}
                </td>
                <td colspan="4">
                  PF Number: {{employeeInfo.pfNumber}}
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  Aadhar Number: {{employeeInfo.aadharNumber}}
                </td>
                <td colspan="4">
                  UAN: {{employeeInfo.uanNumber}}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
</template>
<script>


import html2pdf from 'html2pdf.js'
  import config from '@/../static/test1.json'
    export default {
        name: 'EmployeeDetail',
        data() {
            return {
                deptName:'',
                designation:'',
                employeeInfo:null,
                image:null
            }
        },


        methods: {
          exportToPDF(){
            const element = document.getElementById('emp_profile');
            var option = {
              filename:'employee_profile.pdf',
              image:{ type: 'jpeg', quality: 1 },
              html2canvas:{ scale:2,useCORS:true },
              jsPDF:{ unit: 'in',format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(element).set(option).save();
          },
          getDesignationById(id){
            this.$store.dispatch('designationStore/getDesignationById',id)
              .then(response=>{
                this.designation=`${response.desgName}(${response.desgAlias})`
              })
              .catch(error=>{
                this.designation=''
              })
          },
          getDeptNameById(id){
            this.$store.dispatch('deptStore/getDeptNameByID',id)
              .then(response=>{
                this.deptName=`${response.deptName}(${response.deptAlias})`
              })
              .catch(error=>{
                this.deptName=''
              })
          }
        },
        mounted(){
          this.$store.dispatch('employeeStore/get_employee_by_id',this.$route.params.id)
            .then(rr=>{
                this.employeeInfo=rr.data
                this.image=config.db_configuration.baseURL+'/containers/employee_photo/download/'+this.employeeInfo.empPhoto
                this.getDesignationById(rr.data.designationId)
                this.getDeptNameById(rr.data.deptId)
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
