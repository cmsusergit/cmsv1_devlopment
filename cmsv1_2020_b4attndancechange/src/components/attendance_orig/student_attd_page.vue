<template>
    <div class="section is-radiusless box" style="width:100%">

        <div class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select :disabled="!isAuthorized" v-model="dt.ayId" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>


                <b-field label="Department" expanded>
                <b-select :disabled="!isAuthorized" @input="deptChanged" v-model="dt.fDeptId" expanded>
                      <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
                  </b-field>
                  <b-field grouped>
          <b-field label="Sem">
             <b-select @input="deptChanged" v-model="dt.ttSem" >
                  <option :key="indx" v-for="indx in 10">{{ indx }}</option>
              </b-select>
          </b-field>
          <b-field label="Course" expanded>
              <b-select @input="deptChanged" v-model="dt.fCourseId" expanded>
                  <option v-for="course in courseList" :value="course.courseId">{{course.courseAlias}}</option>
              </b-select>
          </b-field>
          <b-field  label="Class Name" expanded>
                  <b-select @input="loadStudentList" v-model="dt.classId" expanded>
                    <option v-for="(cl, index) in classList" :key="index" :value="cl.classId">
                      {{cl.className}}
                    </option>
                  </b-select>
          </b-field>
          <b-field  label="Select Student" expanded>
                  <b-select v-model="dt.stuEnroll" expanded>
                    <option v-for="(student, index) in studentList" :key="index" :value="student.stuEnroll">
                      {{student.stuEnroll}}({{student.stuTitle}} {{student.stuFirstname}} {{student.stuMiddlename}} {{student.stuLastname}})
                    </option>
                  </b-select>
          </b-field>
        </b-field>
        </div>
        <div v-if="dt && dt.classId && dt.ayId && dt.stuEnroll">
          <template v-for="subject in subjectList">
            <div  style="margin-bottom:1em">

            <p class=" tag is-radiusless is-info is-large">{{subject.subName}}</p>
            <AttendanceReport :ayId="dt.ayId" :stuEnroll="dt.stuEnroll" :ttSubjectId="subject.subId"/>
          </div>
          </template>
        </div>
    </div>
</template>
<script>
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
                }
            };
        },mixins: [userMxn],
        components: {
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
            aYearList() {
              return this.$store.state.acadyearStore.acadyearList
            },
            subjectList() {
                return this.$store.state.subjectStore.subjectList;
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
        },
        methods: {
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
          loadSubjectList(){
            const ob={
              dept:this.dt.fDeptId,
              course:this.dt.fCourseId,
              sem:this.dt.ttSem
            }
            this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
          },
          deptChanged(){
            this.$store.dispatch('load_class_list_by_dept', this.dt.fDeptId)
            this.loadSubjectList()
            this.loadStudentList()
          }
        }
};
</script>
<style>
</style>
