<template>
    <div class="section is-radiusless box">

        Student Attendance
        <div class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select :disabled="!isAuthorized" @input="deptChanged" v-model="timeTblDt.academicYear" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
                <b-field label="Department" expanded>

                    <b-select :disabled="!isAuthorized" @input="deptChanged" v-model="timeTblDt.dept" expanded>
                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
            </b-field>
            <b-field grouped>
              <b-field label="Sem">
               <b-select @input="changeSubjectList" v-model="dt.ttSem" >
                    <option :key="indx" v-for="indx in 10">{{ indx }}</option>
                </b-select>
              </b-field>
              <b-field label="Course" expanded>
                <b-select @input="changeSubjectList" v-model="dt.fCourseId" expanded>
                    <option v-for="course in courseList" :value="course.courseId">{{course.courseAlias}}</option>
                </b-select>
              </b-field>
              <b-field  label="Subject Name" expanded>
                      <b-select v-model="dt.fSubjectId" expanded>
                        <option v-for="(subject, index) in subjectList" :key="index" :value="subject.subId">
                          {{subject.subName}}
                        </option>
                      </b-select>
              </b-field>
              <b-field  label="Class Name" expanded>
                      <b-select v-model="dt.classId" expanded>
                        <option v-for="(cl, index) in classList" :key="index" :value="cl.classId">
                          {{cl.className}}
                        </option>
                      </b-select>
              </b-field>
            </b-field>
          </div>
      <AttendanceReport v-if="ttRecordId" :ttScheduleId="ttRecordId"/>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import userMxn from '@/mixin/user'
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    import AttendanceReport from "@/components/attendance/slot_attd_report"
    export default {
        name: "SlotAttndReport",
        data() {
            return {
                dt:{},
                dept: "",
                ttRecordId:''
            };
        },
        components: {
            ReportPanel,AttendanceReport
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
            },
            isAuthorized(){
              return this.isAuthorizedRoleList(['CMSADMIN','HOD'])
            }
        },
        watch: {
            departmentList() {
                if (!this.timeTblDt.dept)
                    this.timeTblDt.dept = this.departmentList[0].deptName;
            },
            currAcademicyearId(){
              this.timeTblDt.academicYear=this.currAcademicyearId
            },
              loggedInUser(){
                this.timeTblDt.dept=this.loggedInUser.deptId
                this.facultyId=this.loggedInUser.empId
              }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_dept_list');
            this.facultyId=config.facultyList[0].facultyId;
            if(this.timeTblDt.dept)
              this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.timeTblDt.dept)
            this.fNameChanged()
        },
        methods: {
            deptChanged() {
                const ob = {
                    aYearId:this.timeTblDt.academicYear,
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
              this.ttRecordId=ttRecord.ttId
                console.log(`----${this.ttRecordId}----`);
              //
              //this.$router.push({name:'Attendance',params:{ttRecord:ttRecord}})
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
