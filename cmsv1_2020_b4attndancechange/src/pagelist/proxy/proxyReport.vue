<template>
    <div class="section is-radiusless box" style="width:100%">

          <h1 class="title is-size-4">Proxy Report</h1>
        <div class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','HOD'])" @input="deptChanged" v-model="proxyReportDt.academicYear" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>


                <b-field label="Department" expanded>
                    <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','TRUSTEE','DIRECTOR','PRINCIPAL'])" @input="deptChanged" v-model="proxyReportDt.deptId" expanded>
                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
            </b-field>
            <b-field label="Faculty Name">
              <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','HOD'])" v-model="currFaculty" expanded>
                  <option :value="faculty" :key="indx" v-for="(faculty,indx) in facultyList">
                    {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                  </option>
              </b-select>
            </b-field>
        </div>
        <div v-if="proxyReportDt.faculty">
          <ProxyAssignedReport :ayId="proxyReportDt.academicYear" :faculty="currFaculty"/>
      </div>
    </div>
  </template>







<script>
    import facultyMxn from '@/mixin/faculty'
    import userMxn from '@/mixin/user'
    import { mapState} from 'vuex'
    import ProxyAssignedReport from '@/components/proxy/proxyassignedreport'
    export default {
        name: "ProxyReport",
        components: {
          ProxyAssignedReport
        },
        data() {
            return {
              currFaculty:{},
              proxyReportDt:{},
              deptName:''
            }
          },
        mixins: [userMxn,facultyMxn],
        computed: {
            ...mapState([//....
                    'departmentList']
                    ),
            aYearList() {
              return this.$store.state.acadyearStore.acadyearList
            },
            facultyList(){
              return this.$store.state.employeeStore.facultyList
            }
        },
        watch: {
            departmentList() {
                // if (!this.proxyReportDt.deptId)
                //     this.proxyReportDt.deptId = this.departmentList[0].deptId;
            },
            currAcademicyearId(){
              this.proxyReportDt.academicYear=this.currAcademicyearId
            },
            loggedInUser(){
              this.proxyReportDt.deptId=this.loggedInUser.deptId
              this.currFaculty=this.loggedInUser
              this.proxyReportDt.faculty=this.loggedInUser
              this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.proxyReportDt.deptId)
            }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_dept_list');
            //
            // if(this.proxyReportDt.deptId){
            //   this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.proxyReportDt.deptId)
            // }
      },
        methods: {
            deptChanged() {
              if(this.proxyReportDt.deptId)
                this.$store.dispatch('deptStore/getDeptNameByID',this.proxyReportDt.deptId)
                  .then(rr=>{
                    this.deptName=rr.deptAlias
                  })
                  .catch(error=>{
                    this.deptName=""
                  })
                this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.proxyReportDt.deptId)
            }
}};
</script>
<style scoped>
th{
  font-size:80%;
  text-align: center;
}
</style>
