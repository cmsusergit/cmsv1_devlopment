<template>
    <div class="dashboard is-radiusless box boxbg" style="width:100%;height:100%;">

        <div v-if="isAuthorizedRoleList(['EMPLOYEE'])">
          <EmployeeDashboard/>
        </div>
        <div v-if="isAuthorizedRoleList(['STUDENT'])">
          <StudentDashboard/>
        </div>
        <div v-if="isAuthorizedRoleList(['CMSADMIN'])">
          <CMSAdminDashboard/>
        </div>

      </div>
</template> 
<script>
    import userMxn from'@/mixin/user'
    import StudentDashboard from '@/pagelist/dashboard/student'
    import EmployeeDashboard from '@/pagelist/dashboard/employee'
    import config from '@/../static/test1.json'
    import CMSAdminDashboard from '@/pagelist/dashboard/admin'
    import axios from "axios"
    export default {
        name: 'Dashboard',
        components: {
          CMSAdminDashboard,
          EmployeeDashboard,
          StudentDashboard
        },
        data() {
            return {
                studentCount:null,
                employeeCount:null,
                mesg: 'Welcome to Your Vue.js App'
            }
        },
        mixins: [userMxn],
        mounted(){
          const studentCountUrl="/StudentInfos/count";
          this.$root.apiObject.get(studentCountUrl).then(response => {
              this.studentCount = response.data.count;
          }).catch(error => {
              console.log('****', error);
          });
          const employeeCountUrl="/EmpProfiles/count";
          this.$root.apiObject.get(employeeCountUrl).then(response => {
              this.employeeCount = response.data.count;
          }).catch(error => {
              console.log('****', error);
          });
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
