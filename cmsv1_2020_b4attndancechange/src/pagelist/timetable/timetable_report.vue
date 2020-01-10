<template>
    <div class="section is-radiusless box" style="width:100%">

        <div class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','HOD','TT_COORD'])" @input="deptChanged" v-model="timeTblDt.academicYear" expanded>
                        <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
                <b-field  label="Department" expanded>
                    <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','HOD','TT_COORD'])" @input="deptChanged" v-model="timeTblDt.dept" expanded>

                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
                   </b-select>
                </b-field>
            </b-field>
        </div>
          <b-tabs @change='tabChanged' type="is-toggle" v-if="timeTblId" expanded>
            <b-tab-item label="Faculty Timetable">
              <TTFacultyReport :ayId="timeTblDt.academicYear" :facultyDept="timeTblDt.dept" :timeTblId="timeTblId"/>
            </b-tab-item>
            <b-tab-item label="Class Timetable">
              <TTClassReport  :ayId="timeTblDt.academicYear"/>
            </b-tab-item>
            <b-tab-item label="Location Timetable">
              <TTLocationReport :ayId="timeTblDt.academicYear" :timeTblId="timeTblId"/>
            </b-tab-item>
            </b-tabs>
        <div v-else>
          <div class="is-clearfix title" style="margin-bottom:1em">
              TimeTable not exist
          </div>
        </div>
        <!--
        <div v-if="timeTblId" class="is-radiusless box">
          <ReportPanel :generateEvent='false'/>
        </div> -->
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import userMxn from '@/mixin/user'
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    import TTFacultyReport from "@/components/report/ttreport/tt_faculty";
    import TTLocationReport from "@/components/report/ttreport/tt_location";
    import TTClassReport from "@/components/report/ttreport/tt_class";
    export default {
        name: "dashboard",
        data() {
            return {
                timeTblId: "",
                dept: ""
            };
        },
        mixins: [userMxn],
        components: {
            TTClassReport,TTLocationReport,
            TTFacultyReport
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
            }
        },
        watch: {
            // departmentList() {
            //     if (!this.timeTblDt.dept){
            //         this.timeTblDt.dept = this.departmentList[0].deptName;
            //       }
            // },
            currAcademicyearId(){
              this.timeTblDt.academicYear=this.currAcademicyearId
            },
            loggedInUser(){
              this.timeTblDt.dept=this.loggedInUser.deptId
              this.deptChanged()
            }
        },
        mounted() {
            this.$store.dispatch('load_dept_list');
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            if(this.timeTblDt.dept){
              this.deptChanged()
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
                    } else
                        this.timeTblId = "";
                }).catch(error => {
                    console.log('****', error);
                    this.timeTblId="";
                });
              this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
              this.$store.dispatch('load_class_list_by_dept',this.timeTblDt.dept);
              this.$store.dispatch("locStore/load_loc_list_dept",this.timeTblDt.dept)
            },

            tabChanged(indx){
              if(indx==0){
                this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
              }
              else if(indx==1){
                this.$store.dispatch('load_class_list_by_dept',this.timeTblDt.dept);
              }
              else if(indx==2){
                this.$store.dispatch("locStore/load_loc_list_dept",this.timeTblDt.dept)
              }
            }
        }
      };
</script>
<style>
</style>
