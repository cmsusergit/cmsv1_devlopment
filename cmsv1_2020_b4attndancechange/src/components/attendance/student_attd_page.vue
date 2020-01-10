<template>
    <div class="is-radiusless box" style="width:100%">

            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select v-model="dt.ayId" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
              </b-field>
              <div class="is-clearfix"><button @click='selectStudentDlg=true' class="button is-radiusless is-info is-pulled-right">Select Student</button></div>


              <b-modal scroll='keep' :height="500" :active.sync='selectStudentDlg'>
              <div class="card">
                <ListBy @classChanged="classChanged"  @batchChanged="batchChanged" @currSemChanged="currSemChanged" @courseChanged="courseChanged" @deptChanged="deptChanged"></ListBy>
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
                                  <b-tooltip label="Click to Get Report Of Attendance" type='is-info' position='is-left'>
                                  <button @click="getAttendanceDetail(props.row)"  class="button is-dark is-radiusless is-small">
                                      Select
                                  </button>
                                  </b-tooltip>
                                </div>
                            </b-table-column>
                        </template>
                    </b-table>
                </div>
              </div>
            </b-modal>
            <div style="margin-top:.4em;" v-if="dt.ayId && selectedStudent">
              <div class="is-radiusless is-paddingless box" v-for="subject in subjectList">
                <div class="has-background-grey has-text-white" style="padding:.4em;">{{subject.subName}}</div>
                <AttendanceReport :ayId="dt.ayId" :selectedStudent="selectedStudent" :ttSubjectId="subject.subId" ttLoadType="Theory"/>
                <AttendanceReport :ayId="dt.ayId" :selectedStudent="selectedStudent" :ttSubjectId="subject.subId" ttLoadType="Practical"/>
                <AttendanceReport :ayId="dt.ayId" :selectedStudent="selectedStudent" :ttSubjectId="subject.subId" ttLoadType="Tutorial"/>
                <AttendanceReport :ayId="dt.ayId" :selectedStudent="selectedStudent" :ttSubjectId="subject.subId" ttLoadType="Other"/>
              </div>
            </div>
    </div>
</template>
<script>
import ListBy from '@/components/student/listby'
import SearchBy from '@/components/student/searchby'
import userMxn from '@/mixin/user'
import config from "@/../static/test1.json";
import { mapState} from 'vuex';
import AttendanceReport from "@/components/attendance/student_attd_report"
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
                listBy: {'dept': 'All', 'course': 'All', 'class': 'All', 'sem': 'All'},
                searchStudentList: [],
                searching: false,
                searchText:'',
                searchOption:'Name',
                selectedStudentList:[]
            };
        },mixins: [userMxn],
        components: {
          ListBy,
          SearchBy,
          AttendanceReport
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
              subjectList() {
                  return this.$store.state.subjectStore.subjectList;
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
          getAttendanceDetail(studentOb){
            this.selectedStudent=studentOb
            if(this.selectedStudent)
                this.loadSubjectList()
            this.selectStudentDlg=false
          },
          loadStudentList(){
            const ob={
              fDeptId:this.dt.fDeptId,
              fCourseId:this.dt.fCourseId,
              fClassId:this.dt.fClassId,
              fcurrsem:this.dt.ttSem
            };
            if (this.dt.ttLoadType!='Theory') {
                ob["fBatchId"]=this.dt.fBatchId
            }
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
          classChanged(cl) {
            if(cl!='All'){
                this.listBy.class=cl
                this.$store.dispatch('classStore/load_batch_list_by_classid',cl)
                const ob={allocationDetail:{
                  classId:this.listBy.class,
                }}
                this.selectedStudentList=[]
                this.$store.dispatch('studentStore/load_student_list_by_class_batch', ob)
              }
              else{
                this.selectedStudentList=[]
                this.$store.dispatch('studentStore/load_student_list', this.listBy)
              }
          },
          batchChanged(value) {
              let ob={
                allocationDetail:{
                  classId:this.listBy.class
                }
              }
              if(value!='All')
                ob.allocationDetail.batchId=value
              this.$store.dispatch('studentStore/load_student_list_by_class_batch', ob)
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
          },
          loadSubjectList(){
            const ob={
              dept:this.selectedStudent.fDeptId,
              course:this.selectedStudent.fCourseId,
              sem:this.selectedStudent.fcurrsem
            }
            this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
          }
        }
};
</script>
<style>
</style>
