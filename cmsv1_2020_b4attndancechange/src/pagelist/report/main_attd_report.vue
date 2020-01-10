<template>
    <div class="container is-radiusless box" style="overflow:auto;">

      <h1 class="title">Attendance Report</h1>
      <b-tabs type="is-toggle">
        <b-tab-item label="Studentwise">
          <StudentAttndReport/>
        </b-tab-item>
        <b-tab-item label="Classwise">
          <SubjectAttndReport/>
        </b-tab-item>


        <b-tab-item label="Slotwise">
          <SlotAttndReport/>
        </b-tab-item>
        <b-tab-item label="Facultywise">
          <FacultyAttndReport/>
        </b-tab-item>
      </b-tabs>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import { mapState} from 'vuex';
    import SlotAttndReport from "@/components/attendance/slot_attd_page"
    import StudentAttndReport from "@/components/attendance/student_attd_page"
    import FacultyAttndReport from "@/components/attendance/faculty_attd_page"
    import SubjectAttndReport from "@/components/attendance/sub_attd_page"
    export default {
        name: "AttendanceDashboard",
        data() {
            return {
                timeTblId: "",
                facultyId: "",
                dept: "",
                ttRecordId:''
            };
        },
        components: {
            SlotAttndReport,
            StudentAttndReport,
            SubjectAttndReport,
            FacultyAttndReport
        },
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
