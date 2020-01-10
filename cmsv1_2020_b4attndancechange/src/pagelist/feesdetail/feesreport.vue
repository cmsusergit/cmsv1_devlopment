<template>
    <div class="is-radiusless box" style="width:100%">

            <h1 class="title">DETAILS OF STUDENT FEES</h1>
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select v-model="dt.ayId" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
              </b-field>


              <div class="card">
                <ListBy @hasPaidChanged="hasPaidChanged" @currSemChanged="currSemChanged" @courseChanged="courseChanged" @deptChanged="deptChanged"></ListBy>
                <div v-if="studentList && studentList.length>0" style="overflow:auto;width:100%;">
                    <b-table class=""
                             :data="studentList"
                             :paginated=true
                             :per-page=100
                             :loading='loading'
                             default-sort-direction="asc"
                             default-sort="stuId"
                             >
                        <template slot-scope="props">
                            <b-table-column label="Sr." width="40" numeric>
                                {{ props.index+1 }}
                            </b-table-column>
                            <b-table-column field="stuEnroll" label="Enrollment" sortable>
                                {{ props.row.stuEnroll}}
                            </b-table-column>
                            <b-table-column field="stuCollegeId" label="College ID" sortable>
                                {{ props.row.stuCollegeId }}
                            </b-table-column>
                            <b-table-column field="stuFirstname" label="Name" sortable>
                                {{ props.row.stuTitle }} {{ props.row.stuFirstname }} {{ props.row.stuMiddlename }} {{ props.row.stuLastname }}
                            </b-table-column>
                            <b-table-column  centered>
                                <div>
                                  <b-tooltip label="Click to Get Report Of Fee" type='is-info' position='is-left'>
                                  <button @click="getFeesDetail(props.row)"  class="button is-dark is-radiusless is-small">
                                      Select
                                  </button>
                                  </b-tooltip>
                                </div>
                            </b-table-column>
                        </template>
                    </b-table>
                </div>
                <div v-else class="is-radiusless box">
                    <p class="title has-text-danger">Record !Found</p>
                </div>
              </div>
              <b-modal scroll='keep' :height="500" :active.sync='selectStudentDlg'>
                  <div class="card is-radiusless box">
                    <StudentFeesDetail :studentDetail='selectedStudent'></StudentFeesDetail>
                  </div>
              </b-modal>
    </div>
</template>
<script>
import ListBy from '@/components/feesdetail/listby'
import userMxn from '@/mixin/user'
import config from "@/../static/test1.json";
import { mapState} from 'vuex';
import StudentFeesDetail from "@/components/feesdetail/feesdetail"
    export default {
             name: "StudentAttndReport",
        data() {
            return {
                dt:{
                  ayId:this.currAcademicyearId?this.currAcademicyearId:'',
                  fDeptId:this.loggedInUser?this.loggedInUserdeptId:''
                },
                studentList1:'',
                selectedStudent:'',
                selectStudentDlg:false,
                listBy: {'dept': 'All', 'course': 'All',  'sem': 'All',hasPaid:0},
                selectedStudentList:[],
                hasPaid:1
            };
        },
        mixins: [userMxn],
        components: {
          StudentFeesDetail,
          ListBy
        },
        computed: {
            ...mapState([//....
                    'departmentList',
                    'classList',
                    'courseList']
                    ),
            studentList(){
              return this.$store.getters['feesDetailStore/studentFeesDetailList'](this.hasPaid)
              //
              // const tt=this.$store.getters['feesDetailStore/studentFeesDetailList']
              // this.studentList1=_.remove(JSON.parse(JSON.stringify(tt)),ob=>ob.feesInfos.length==0)
              // return tt
            },
            loading(){
              return this.$store.state.studentStore.loading
            },
            aYearList() {
              return this.$store.state.acadyearStore.acadyearList
            },
            isAuthorized(){
              return this.isAuthorizedRoleList(['CMSADMIN','HOD'])
            }
        },
        watch: {
          currAcademicyearId(){

            this.dt.ayId=this.currAcademicyearId
          },
          loggedInUser(){
              this.dt.fDeptId=this.loggedInUser.deptId
          }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_course_list');
            this.$store.dispatch('load_dept_list');
            this.dt.ayId=this.currAcademicyearId
            this.dt.fDeptId=this.loggedInUser.deptId
            this.$store.dispatch('feesDetailStore/load_studentfeesdetail_list')
        },
        methods: {
          hasPaidChanged(vv){
              this.hasPaid=vv
          },
          getFeesDetail(studentOb){
            this.selectedStudent=studentOb
            this.selectStudentDlg=true
          },
          loadStudentList(){
            // const ob={
            //   fDeptId:this.dt.fDeptId,
            //   fCourseId:this.dt.fCourseId,
            // };
            // this.$store.dispatch('studentStore/load_student_attend_list',ob);
          },
          deptChanged(dept) {
              //
              // this.listBy.dept = dept;
              // this.$store.dispatch('studentStore/load_student_list', this.listBy)
              // this.selectedStudentList=[]
            },
          currSemChanged(cseme) {
              //
              // this.listBy.sem = cseme;
              // this.selectedStudentList=[]
              // this.$store.dispatch('studentStore/load_student_list', this.listBy)
          },
          courseChanged(course) {
              this.listBy.course = course;
              this.selectedStudentList=[]
              this.$store.dispatch('studentStore/load_student_list', this.listBy)
          }
        }
}
</script>
<style>
</style>
