<template>
    <div style="padding:.5em;">

        <aside class="menu">
          <router-link :to="{ path: '/'}">
            <p @click='currentMenu=(currentMenu==1?0:1)' class="menu-label">
              Dashboard
              </p>
          </router-link>
          <transition name="slide">
            <ul v-if="currentMenu==1"  class="menu-list list">


              <!--
                <li v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL','DIRECTOR'])">
                  <a>Oraganization</a>
                </li> -->
                    <li v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL','DIRECTOR','EMPLOYEE','STUDENT'])">
                      <router-link class="textcolor" :to="{ name: 'Circular'}">All Circulars</router-link>
                    </li>
                    <!--
                    <li><a >MessageBox</a></li> -->
                    <li v-if="isAuthorized('CMSADMIN')">
                      <router-link class="textcolor" to='/useraccount'>
                        User Account Management
                      </router-link>
                    </li>
            </ul>
          </transition>
            <p @click='currentMenu=(currentMenu==2?0:2)' v-if="isAuthorized('CMSADMIN')" class="menu-label">
                Academic
            </p>
            <transition name="slide">
              <template v-if="currentMenu==2">
              <ul v-if="isAuthorized('CMSADMIN')" class="menu-list list">
                <li>
                  <router-link class="textcolor" to='/academicyear' >
                      Acadamic Year
                  </router-link>
                  <router-link class="textcolor" to='/designation' >
                      Designation
                  </router-link></li>
                  <li>  <router-link class="textcolor" to='/department' >
                        Department
                    </router-link></li>
                  <li><router-link class="textcolor" to='/course' >
                        Course
                    </router-link></li>
                  <li>
                    <router-link class="textcolor" to='/subject' >
                      Subject
                  </router-link><!-- StudentManagement Page-->
                  </li>
                  <li>
                    <router-link class="textcolor" :to="{ name: 'ClassName'}">
                      Class List
                    </router-link></li>
                  <li>
                    <router-link class="textcolor" :to="{ name: 'BatchName'}">Batch List</router-link>
                  </li>
                    <li><router-link class="textcolor" to="/location">Location Configuration</router-link></li>
              </ul></template>
            </transition>






            <template v-if="isAuthorizedRoleList(['CMSADMIN','HOD','STUDENT_COORD','DIRECTOR','PRINCIPAL','FACULTY','ADMIN'])">
            <p @click='currentMenu=(currentMenu==3?0:3)' class="menu-label" >
                Student
            </p>
            <transition name="slide">
            <ul v-if="currentMenu==3" class="menu-list list">
                <li>
                  <router-link class="textcolor" to='/studentmanagement' ><!-- StudentManagement Page-->
                        Student Management
                    </router-link>
                </li>
                  <li v-if="isAuthorizedRoleList(['CMSADMIN','STUDENT_COORD','HOD'])">
                     <router-link class="textcolor" to='/studentallocation' ><!-- StudentManagement Page-->
                         Student Allocation
                     </router-link>
                   </li>

                   <li v-if="!isAuthorizedRoleList(['ADMIN'])">
                  <router-link class="textcolor" :to="{ name: 'AttendanceDashboard' }">Student Attendance</router-link>
                </li>
                    <li v-if="!isAuthorizedRoleList(['ADMIN'])" >
                    <router-link class="textcolor" :to="{ name: 'MainAttdReport'}">Attendance Report</router-link>
                  </li>
                </li>
            </ul>
          </transition>
          </template>
          <template v-if="isAuthorizedRoleList(['CMSADMIN','HOD','DIRECTOR','PRINCIPAL','EMPLOYEE'])">
            <p @click='currentMenu=(currentMenu==4?0:4)' class="menu-label">
                Employee
            </p>
            <transition name="slide">
              <ul v-if="currentMenu==4" class="menu-list list">
                  <li><router-link class="textcolor" to='/employeemanagement' >Employee Profile</router-link></li>
              </ul>
          </transition>
          </template>
          <p @click='currentMenu=(currentMenu==5?0:5)' v-if="!isAuthorizedRoleList(['STUDENT','ADMIN'])" class="menu-label">
              Load Adjustment
          </p>




          <transition name="slide">
            <template v-if="currentMenu==5">
              <ul v-if="isAuthorizedRoleList(['CMSADMIN','TT_COORD','HOD','DIRECTOR','PRINCIPAL','FACULTY'])" class="menu-list list">
                  <li>
                    <router-link class="textcolor" :to="{ name: 'ProxyDetail'}">
                        Proxy Assignment
                    </router-link>
                  </li>
                  <li>
                    <router-link class="textcolor" :to="{ name: 'ProxyReport'}">
                        Proxy Report
                    </router-link>
                  </li>
                  <li v-if="isAuthorizedRoleList(['CMSADMIN','HOD'])">
                    <router-link class="textcolor" :to="{ name: 'ProxyApprove' }">Approve Proxy</router-link>
                  </li>
                </ul>
              </template>
            </transition>
            <p @click='currentMenu=(currentMenu==6?0:6)' v-if="!isAuthorizedRoleList(['ADMIN','STUDENT'])" class="menu-label">
              Time Table
          </p>
          <transition name="slide">
          <template v-if="currentMenu==6">


            <ul  class="menu-list list">
                <template v-if="isAuthorizedRoleList(['CMSADMIN','TT_COORD','HOD','DIRECTOR','PRINCIPAL'])">
                  <li><router-link class="textcolor" to="/loadcal">Load Calculation</router-link></li>
                  <li><router-link class="textcolor" to="/loadcalreport">Load Calculation Report</router-link></li>
                </template>
                <li v-if="isAuthorizedRoleList(['CMSADMIN','TT_COORD','HOD','DIRECTOR','PRINCIPAL'])">
                  <router-link class="textcolor" to='/timetable' >
                    TimeTable Management(Faculty wise)
                  </router-link>
                  </li>
                <!-- </ul>
                <ul v-if="isAuthorizedRoleList(['CMSADMIN','TT_COORD','HOD','DIRECTOR','PRINCIPAL','FACULTY'])" class="menu-list"> -->
                      <li v-if="isAuthorizedRoleList(['CMSADMIN','TT_COORD','HOD','DIRECTOR','PRINCIPAL','FACULTY'])">
                        <router-link class="textcolor" :to="{ name: 'TimeTableReport'}">TimeTables</router-link>
                      </li>
                    </ul>
              </template>
            </transition>
              <template v-if="isAuthorizedRoleList(['CMSADMIN','TT_COORD','HOD','DIRECTOR','PRINCIPAL','FACULTY'])">
                <router-link class="textcolor" to="/lessonplan">
                  <p @click='currentMenu=1' class="menu-label">
                      Lessonplan
                    </p>
                </router-link>
              </template>
          <template v-if="isAuthorizedRoleList(['CMSADMIN','EMPLOYEE'])">
            <p @click='currentMenu=(currentMenu==7?0:7)' class="menu-label" v-if="!isAuthorizedRoleList(['ADMIN'])">
              APPRAISAL
            </p>
            <transition name="slide">
            <ul v-if="currentMenu==7" class="menu-list list">
                <li><a class="textcolor" :href="appraisalTF">Parameters and Policy (TF)</a></li>
                <li><a class="textcolor" :href="appraisalNTF">Parameters and Policy (NTF)</a></li>
                <!-- <li><router-link v-if="isAuthorizedRoleList(['CMSADMIN','EMPLOYEE','HOD'])" class="textcolor" to="/selfappraisaltf">Appraisal Entry Form</router-link></li>
                <li><router-link v-if="isAuthorizedRoleList(['DIRECTOR','PRINCIPAL'])" class="textcolor" to="/selfappraisaltf">Approve Appraisal Form</router-link></li> -->
                <li><router-link class="textcolor" to="/selfappraisalreport">Appraisal Report</router-link></li>
                <li><router-link class="textcolor" v-if="isAuthorizedRoleList(['CMSADMIN','TRUSTEE','DIRECTOR','PRINCIPAL'])" to="/selfappraisalsummary">Appraisal Summary</router-link></li>
            </ul>
          </transition>
          </template>
          <template v-if="isAuthorizedRoleList(['CMSADMIN','STUDENT_COORD','HOD','DIRECTOR','PRINCIPAL'])">
            <p @click='currentMenu=(currentMenu==8?0:8)' class="menu-label">
                Student Messaging
            </p>
            <transition name="slide">
             <ul v-if="currentMenu==8" class="menu-list list">
                <li><router-link class="textcolor" to="/composemessage">Compose Message</router-link></li>
                <li>
                  <a class="textcolor">Messaging Report</a>
                </li>
            </ul>
          </transition>
          </template>
          <template v-if="isAuthorizedRoleList(['CMSADMIN','ADMIN'])">
            <p @click='currentMenu=(currentMenu==9?0:9)' class="menu-label">
              FEES MANAGEMENT
            </p>
            <transition name="slide">
            <ul v-if="currentMenu==9" class="menu-list list">
              <li><router-link class="textcolor" to="/feescollection">Collect Fees</router-link></li>
              <li><router-link class="textcolor" to="/feesdetail">Fees Report</router-link></li>
            </ul>
          </transition>
          </template>
        </aside>
    </div>
</template>
<script>

import config from '@/../static/test1.json'
import {mapState} from 'vuex'
export default {
  name:"SideBar",
  data(){
    return {
      loggedInUser:'',
      currentMenu:0
    }
  },
  computed:{
    appraisalTF(){
      return config.db_configuration.baseURL+'/apicontainers/policy/download/AppraisalTF.pdf'
    },
    appraisalNTF(){
      return config.db_configuration.baseURL+'/apicontainers/policy/download/AppraisalNTF.pdf'
    }
  },
  components: {
  },
  methods: {
    openUserProfile(){
      if(this.loggedInUser.empId)
        this.$router.push({name: 'EmployeeDetail', params: {id: this.loggedInUser.empId}})
      else if(this.loggedInUser.stuId)
        this.$router.push({name: 'StudentDetail', params: {id: this.loggedInUser.stuId}})
    },
    getUser(){
      const id=this.$store.getters['loginStore/getLoggedInUserId']
      this.$store.dispatch('userAccountStore/getUserAccountById',id)
      .then(rr=>{
        const user=rr
        if(user.userType==0)
          return;
        else if (user.userType==2) {
          this.$store.dispatch('studentStore/get_student_by_code',user.username)
          .then(rr=>{
            this.loggedInUser=rr
          })
          .catch(error=>{
            console.log('****',error);
          })
        }
        else {
          this.$store.dispatch('employeeStore/get_employee_by_code',user.username)
            .then(rr=>{
              this.loggedInUser=rr
              console.log('++++',this.loggedInUser);
            })
            .catch(error=>{
              console.log('****',error);
            })
        }
      })
      .catch(error=>{
        console.log('****',error);
      })
    },
    isAuthorizedRoleList(roleNameList){
      return this.$store.getters['loginStore/isAuthorizedRoleList'](roleNameList)
    },
    isAuthorized(roleName){
      return this.$store.getters['loginStore/isAuthorizedRole'](roleName)
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>
<style scoped>
.list{
  transform-origin: top;
  font-size: 100%;
}
.textcolor:hover{
  color:rgb(0,0,20);
}
p{
  font-size: 100%;
  cursor:pointer;
}
p:hover{
  font-size: 101%;
  opacity:0.8;
}
.textcolor{
  background-color:#224a5e;
  color:white;
}
.slide-enter-active, .slide-leave-active{
  transition: all .2s;
}
.slide-enter, .slide-leave-to{
  transform: scaleY(0);
}
    /* p{
        font-weight: bold;
        color:#224444;
    }
    .sidebarbox{
        background-color: floralwhite;
        padding:.4em;
        color:#224444;
        border-right:1px solid #224444;
    } */
</style>
