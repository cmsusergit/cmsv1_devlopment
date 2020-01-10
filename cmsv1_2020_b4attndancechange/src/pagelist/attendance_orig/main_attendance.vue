<template>
    <div class="section is-radiusless box" style="width:100%">

        <h1 class="title is-size-4">Student Attendance</h1>
        <div v-show="isAuthorizedRoleList(['CMSADMIN','HOD'])" class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select @input="deptChanged" v-model="timeTblDt.academicYear" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>


                <b-field label="Department" expanded>
                    <b-select @input="deptChanged" v-model="timeTblDt.dept" expanded>
                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
            </b-field>
        </div>
        <div class="is-radiusless box" v-if="timeTblId">
            <b-field label="Faculty Name">
              <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','HOD'])" @input="fNameChanged" v-model="facultyId" expanded>
                  <option :value="faculty.empId" v-for="faculty in facultyList">
                    {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                  </option>
              </b-select>
            </b-field>
            <p class="content has-text-danger">Click on Relevant Slot to Start Attendance</p>
        </div>
        <div v-else>
          <div class="is-clearfix" style="margin-bottom:1em">
            <p>TimeTable Record !Found</p>
          </div>
        </div>
        <div v-if="timeTblId" class="is-radiusless box">
            <ReportPanel  :isFacultyTtbl='true'  :generateEvent='true' @openDetail='openDetail'/>
        </div>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import userMxn from '@/mixin/user'
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    export default {
        name: "AttendanceDashboard",
        data() {
            return {
                timeTblId: "",
                facultyId: "",
                dept: ""
            };
        },
        components: {
            ReportPanel
        },
        mixins: [userMxn],
        computed: {
            ...mapState([//....
                    'departmentList']
                    ),
            aYearList() {
                return this.$store.state.acadyearStore.acadyearList
            },
            timeTblDt() {
                return this.$store.state.ttStore.timeTblDt;
            },
            facultyList(){
              return this.$store.state.employeeStore.facultyList
            }
        },
        watch: {
            departmentList() {
                if (!this.timeTblDt.dept)
                    this.timeTblDt.dept = this.departmentList[0].deptName;
                this.deptChanged()
            },
            currAcademicyearId(){
              this.timeTblDt.academicYear=this.currAcademicyearId
              this.fNameChanged()
            },
            loggedInUser(){
              this.timeTblDt.dept=this.loggedInUser.deptId
              this.facultyId=this.loggedInUser.empId
              this.fNameChanged()
            }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_dept_list');
            if(this.timeTblDt.dept)
            {
              this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.timeTblDt.dept)
              this.fNameChanged()
            }
      },
        methods: {
            deptChanged() {
                const ob = {
                    aYearId: this.timeTblDt.academicYear,
                    dept: this.timeTblDt.dept
                };
                this.$store.dispatch('ttStore/getTimeTableId', ob).then(response => {
                    if (response.data[0]) {
                        this.timeTblId = response.data[0].timetableId;
                        this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: this.timeTblDt.pFacultyId, tblId: this.timeTblId})
                                .then(rr => {
                                    this.timeTblDt.timeTableList = this.$store.state.ttStore.timeTblDt.timeTableList;
                                }).catch(error => {
                                  console.log("****", error);
                                });
                    } else
                        this.timeTblId = "";
                }).catch(error => {
                    console.log('****', error);
                    this.timeTblId="";
                });

                this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.timeTblDt.dept)
            },
            openDetail(ttRecord){
              this.$router.push({name:'Attendance',params:{ttRecord:ttRecord}})
            },
            fNameChanged() {
                this.timeTblDt.pFacultyId = this.facultyId;
                if (this.timeTblDt.pFacultyId) {
                    for (let indx = 0; indx < this.timeTblDt.timeTableList.length; indx++) {
                        this.timeTblDt.timeTableList[indx].fFacultyId = this.timeTblDt.pFacultyId;
                    }
                    this.deptChanged();
                }},
}};
</script>
<style>
</style>
