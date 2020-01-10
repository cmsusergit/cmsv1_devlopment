<template>
    <div style="width:100%;">

        <div class="dashboard is-radiusless box boxbg">
            <div class="level">

                <h1 class="level-left is-size-4 title">
                    <p v-if="!empId">Add Employee</p>
                    <p v-else>Update Employee</p>
                </h1>
            </div>


            <div class="is-radiusless box">
                <b-tabs  position="is-centered" type="is-toggle" expanded>
                    <b-tab-item  label="Personal Info">
                      <EmpPersonalProfile :empProfileInfo='employeeProfile'>
                      </EmpPersonalProfile>
                      <EmpDocumentDetail :empDocInfo='employeeProfile'>
                      </EmpDocumentDetail>
                    </b-tab-item>
                    <b-tab-item  label="Education Info">
                      <div v-for="(temp, index) in employeeEducation" :key="index" class="is-radiusless box">

                        <p class="subtitle">Education Information {{index+1}}
                        <button @click='removeEducationDetail(index)' class="button is-outlined is-pulled-right is-small is-danger">
                          <b-icon pack='fas' icon='times'></b-icon>
                        </button></p>
                        <EmpEducationDetail :empEducationInfo='temp'></EmpEducationDetail>
                      </div>
                      <button @click='addEducationDetail' style="margin-top:.5em;width:10em;" class="button is-pulled-right is-primary">Add</button>
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
import EmpPersonalProfile from '@/components/employee/emppersonalprofile'
import EmpDocumentDetail from '@/components/employee/empdocument'
import EmpEducationDetail from '@/components/employee/empeducation'
import config from "@/../static/test1.json"
import EmployeeEducation from '@/model/empeducation.js'
import EmployeeProfile from '@/model/employeeProfile.js'
export default {
  name:"AddUpdateEmployee",
  components:{
    EmpPersonalProfile,
    EmpDocumentDetail,
    EmpEducationDetail
  },
  data(){
    return {
      loading:false,
      employeeProfile:new EmployeeProfile(),
      employeeEducation:new Array(),
      empId:null,
    }
  },
  methods:{
  save (){
    if(this.empId)
      this.updateEmployee(this.empId)
    else
      this.addEmployee()
  },
  addEmployee(){
    this.employeeProfile.doj=new Date(this.employeeProfile.doj.getTime() + Math.abs(this.employeeProfile.doj.getTimezoneOffset()*60000))
    this.employeeProfile.dob=new Date(this.employeeProfile.dob.getTime() + Math.abs(this.employeeProfile.dob.getTimezoneOffset()*60000))
    this.$store.dispatch('employeeStore/add_employee_personal',this.employeeProfile)
    .then(response=>{

        if(this.employeeEducation && this.employeeEducation.length>0){
          this.employeeEducation.empId=response.data.empId
          return this.$store.dispatch('employeeStore/add_employee_education_info',this.employeeEducation)
        }
        else {
          return Promise.resolve(response)
        }
    })
    .then(response=>{
      this.$buefy.toast.open({
                    duration: 5500,
                    message: "Employee Created",
                    position: 'is-top',
                    type: 'is-success'
      })
      this.$router.push({name:'EmployeePersonalProfile'})
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
  removeEducationDetail(id){
    this.employeeEducation.splice(id,1)
  },
  addEducationDetail(){
    this.employeeEducation.push(new EmployeeEducation())
  },
  updateEmployee(id){

    this.employeeProfile.doj=new Date(this.employeeProfile.doj.getTime() + Math.abs(this.employeeProfile.doj.getTimezoneOffset()*60000))
    this.employeeProfile.dob=new Date(this.employeeProfile.dob.getTime() + Math.abs(this.employeeProfile.dob.getTimezoneOffset()*60000))
    this.$store.dispatch('employeeStore/update_employee_personal',this.employeeProfile)
    .then(rr=>{

        const ob={
          empId:id,
          educationList:this.employeeEducation
        }
        return this.$store.dispatch("employeeStore/update_empeducation_for_employee",ob)
      })
      .then(rr=>{
        this.$buefy.toast.open({
                    duration: 5500,
                    message: "Employee Updated",
                    position: 'is-top',
                    type: 'is-success'
        })
        this.$router.push({name:'EmployeePersonalProfile'})
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
  populateDt(){
    this.$store.dispatch("employeeStore/get_employee_by_id",this.empId)
      .then(response=>{
        if(response.data)
          this.employeeProfile=response.data
          this.employeeProfile.doj=new Date(response.data.doj);
          this.employeeProfile.dob=new Date(response.data.dob);
          return this.$store.dispatch('employeeStore/get_empeducation_by_id',this.empId)
      })
      .then(rr=>{
        if(rr.data && rr.data.length>0)
        {
          this.employeeEducation=rr.data
         }
        else{
          this.employeeEducation=new Array();
          //
          //this.employeeEducation.push(new EmployeeEducation())
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
},
  mounted(){
    this.empId=this.$route.params.id;
    if(!this.empId){
      this.employeeProfile=new EmployeeProfile()
      if(!this.employeeEducation)
          this.employeeEducation=new Array()
      //
      //this.employeeEducation.push(new EmployeeEducation())
      }
    else{
      this.populateDt()
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
