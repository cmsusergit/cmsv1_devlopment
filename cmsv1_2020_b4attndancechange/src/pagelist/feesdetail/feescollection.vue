<template>
    <div class="is-radiusless box" style="width:100%">

            <h1 class="title">STUDENT FEES COLLECTION</h1>
              <div class="card">
                <SearchBy :studentList="studentList" @searchOptionChanged='searchOptionChanged' @searchByText="searchByText" />
                <div style="overflow:auto;width:100%;">
                    <b-table class=""
                             :data="!searching?studentList:searchStudentList"
                             :paginated=true
                             :per-page=20
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
                                  <b-tooltip label="Click to Collect Fee" type='is-info' position='is-left'>
                                  <button @click="getFeesDetail(props.row)"  class="button is-dark is-radiusless is-small">
                                      Select
                                  </button>
                                  </b-tooltip>
                                </div>
                            </b-table-column>
                        </template>
                    </b-table>
                </div>
              </div>
              <b-modal scroll='keep' full-screen=true :active.sync='selectStudentDlg'>
                  <div class="card">
                    <StudentFeesCollection :inputOb="{ayId:dt.ayId,empId:loggedInUser.empId}" :studentDetail='selectedStudent'></StudentFeesCollection>
                  </div>
              </b-modal>
    </div>
</template>
<script>
import ListBy from '@/components/feesdetail/listby'
import SearchBy from '@/components/student/searchby'
import userMxn from '@/mixin/user'
import config from "@/../static/test1.json";
import { mapState} from 'vuex';
import StudentFeesCollection from "@/components/feesdetail/feescollection"
    export default {
        name: "StudentAttndReport",
        data() {
            return {
                dt:{
                  ayId:this.currAcademicyearId?this.currAcademicyearId:'',
                  fDeptId:this.loggedInUser?this.loggedInUserdeptId:''
                },
                selectedStudent:'',
                selectStudentDlg:false,
                listBy: {'dept': 'All', 'course': 'All',  'sem': 'All'},
                searchStudentList: [],
                searching: false,
                searchText:'',
                searchOption:'Enrollment',
                selectedStudentList:[]
            };
        },
        mixins: [userMxn],
        components: {
          StudentFeesCollection,
          ListBy,
          SearchBy
        },
        computed: {
            ...mapState([//....
                    'departmentList',
                    'classList',
                    'courseList']
                    ),
            studentList(){
              return this.$store.state.studentStore.studentList
            },
            loading(){return this.$store.state.studentStore.loading},
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
              this.$store.dispatch('load_class_list_by_dept', this.dt.fDeptId)
          }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_course_list');
            this.$store.dispatch('load_dept_list');
            this.dt.ayId=this.currAcademicyearId
            this.dt.fDeptId=this.loggedInUser.deptId
            this.$store.dispatch('load_class_list_by_dept', this.dt.fDeptId);

            this.$store.dispatch('studentStore/load_student_list', this.listBy)
        },
        methods: {
          getFeesDetail(studentOb){
            this.selectedStudent=studentOb
            this.selectStudentDlg=true
          },
          loadStudentList(){
            const ob={
              fDeptId:this.dt.fDeptId,
              fCourseId:this.dt.fCourseId,
            };
            this.$store.dispatch('studentStore/load_student_attend_list',ob);
          },
          deptChanged(dept) {
              this.listBy.dept = dept;
              this.$store.dispatch('studentStore/load_student_list', this.listBy)
              this.selectedStudentList=[]
            },
          currSemChanged(cseme) {
              this.listBy.sem = cseme;
              this.selectedStudentList=[]
              this.$store.dispatch('studentStore/load_student_list', this.listBy)
          },
          courseChanged(course) {
              this.listBy.course = course;
              this.selectedStudentList=[]
              this.$store.dispatch('studentStore/load_student_list', this.listBy)
          },
          searchByText(text) {
              this.searchText=text;
              this.searchBy();
          },
         searchOptionChanged(option){
             this.searchOption=option;
          },
          searchBy(){
              if (this.searchText == '') {
                  this.searching = false;
              } else {
                  this.searching = true;
                  this.searchStudentList = _.filter(this.studentList, (temp) => {
                      let tt = "";
                      if(this.searchOption=='Name')
                             tt+=temp.stuFirstname+" "+temp.stuMiddlename+" "+temp.stuLastname;
                      else if(this.searchOption=='Enrollment')
                          tt+=temp.stuEnroll
                       else if(this.searchOption=='CollegeId')
                          tt+=temp.stuCollegeId
                       else if(this.searchOption=='Email')
                          tt+=temp.stuEmail
                      return tt.toLowerCase().includes(this.searchText)
                  })
              }
          }
        }
}
</script>
<style>
</style>
