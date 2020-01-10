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
        </b-field>
        <b-field grouped>
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
        <div v-if="dt && dt.classId && dt.ayId && dt.fSubjectId">
          <AttendanceReport :ayId="dt.ayId" :classId="dt.classId" :ttSubjectId="dt.fSubjectId"/>
        </div>
    </div>
</template>

<script>
    import userMxn from '@/mixin/user'
    import config from "@/../static/test1.json";
    import { mapState} from 'vuex';
    import AttendanceReport from "@/components/attendance/sub_attd_report"
    export default {
        name: "SubjectAttndReport",
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
          deptChanged(){
            this.$store.dispatch('load_class_list_by_dept', this.dt.fDeptId)
            this.changeSubjectList()
          },
          changeSubjectList(){
            const ob={
              dept:this.dt.fDeptId,
              course:this.dt.fCourseId,
              sem:this.dt.ttSem
            }

            this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
          }
        }
};
</script>
<style>
</style>
