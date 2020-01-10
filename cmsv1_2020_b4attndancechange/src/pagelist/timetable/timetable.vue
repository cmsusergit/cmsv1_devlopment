<template>
    <div class="section is-radiusless box" style="width:100%">

          <div v-show="isAuthorizedRoleList(['CMSADMIN','HOD'])" class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select @input="deptChanged" v-model="timeTblDt.academicYear" expanded>
                        <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
                <b-field label="Department" expanded>
                    <b-select  @input="deptChanged" v-model="timeTblDt.dept" expanded>

                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
                   </b-select>
                </b-field>
            </b-field>
        </div>

        <div class="" v-if="timeTblId">
            <b-field label="Faculty Name">
                <b-select @input="fNameChanged" v-model="facultyId" expanded>
                    <option :value="faculty.empId" v-for="faculty in facultyList">
                      {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                    </option>
                </b-select>
            </b-field>
            <TimeTable v-if="facultyId" :tblDt="JSON.stringify(timeTblDt)" :timeTblId="timeTblId" />

            <div v-show="isAuthorizedRoleList(['CMSADMIN','HOD'])" class="is-clearfix">
                <button @click="confirmDeleteTTbl" class="button is-radiusless is-danger is-pulled-right">Delete TimeTable</button>
            </div>
        </div>
        <div v-else>
          <div class="is-clearfix" style="margin-bottom:1em">
            <button @click="addTimeTable" class="button is-primary is-pulled-right">+Add TimeTable</button>
          </div>
        </div>
        <div v-if="timeTblId" class="is-radiusless box">
          <ReportPanel :isFacultyTtbl='true' :generateEvent='false'/>
        </div>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import userMxn from '@/mixin/user.js'
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    import TimeTable from "@/components/timetable/ttpanel";
    export default {
        name: "dashboard",
        data() {
            return {
                timeTblId: "",
                facultyId: "",
                dept: ""
            };
        },
        mixins: [userMxn],
        components: {
            TimeTable,
            ReportPanel
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
          currAcademicyearId(){
            this.timeTblDt.academicYear=this.currAcademicyearId
          },
          loggedInUser(){
            this.timeTblDt.dept=this.loggedInUser.deptId
          }
        },
        mounted() {
            this.$store.dispatch('load_dept_list');
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            if(this.timeTblDt.dept){
              this.deptChanged()
            }
            this.fNameChanged()
        },
        methods: {
            addTimeTable() {
                this.$store.dispatch('ttStore/saveTimeTable', this.timeTblDt).then(response => {
                    if (response.data){
                        this.timeTblId = response.data.timetableId;
                        this.$buefy.toast.open({
                                duration: 5500,
                                message: "TimeTable Added Successfully",
                                position: 'is-top',
                                type: 'is-success'
                        });
                      }
                    else
                        this.timeTblId = ""
                }).catch(error => {
                  this.$buefy.toast.open({
                          duration: 5500,
                          message: error.response.data.error.message,
                          position: 'is-top',
                          type: 'is-danger'
                  });
                });
            },
            deptChanged() {
                const ob = {
                    aYearId: this.timeTblDt.academicYear,
                    dept: this.timeTblDt.dept
                };
                this.$store.dispatch('ttStore/getTimeTableId', ob).then(response => {
                    if (response.data[0]) {
                        this.timeTblId = response.data[0].timetableId;
                        if(this.timeTblDt.pFacultyId)
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
            fNameChanged() {
                this.timeTblDt.pFacultyId = this.facultyId;
                console.log(this.timeTblDt.pFacultyId)
                if (this.timeTblDt.pFacultyId) {
                    for (let indx = 0; indx < this.timeTblDt.timeTableList.length; indx++) {
                        this.timeTblDt.timeTableList[indx].fFacultyId = this.timeTblDt.pFacultyId;
                    }
                    this.deptChanged();
                }},

        confirmDeleteTTbl(){
          this.$buefy.dialog.confirm({
            message:"This removes all Timetable Records also,<br/>Do you Really Want to Remove?",
            onConfirm:()=>{
              this.deleteTimeTable()
            }
          })
        },
        deleteTimeTable(){
          this.$store.dispatch('ttStore/deleteTimeTable',this.timeTblId)
            .then(rr=>{
              this.timeTblId=""
              this.$buefy.toast.open({
                      duration: 5500,
                      message: "TimeTable Removed Successfully",
                      position: 'is-top',
                      type: 'is-success'
              });
            })
            .catch(error=>{
              this.$buefy.toast.open({
                      duration: 5500,
                      message: error.response.data.error.message,
                      position: 'is-top',
                      type: 'is-danger'
                  });
            })
        }
}};
</script>
<style>
</style>
