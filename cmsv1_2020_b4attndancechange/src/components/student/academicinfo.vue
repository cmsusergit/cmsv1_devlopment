<template>
    <section style="padding-top:.5em;height:80vh;border-top:1px solid gray;">

        <b-field grouped>
            <b-field label="Department" expanded>
                <b-select v-model="academicInfo.fDeptId" expanded>
                  <option v-for="dp in departmentList" :value="dp.deptId">
                    {{dp.deptName}}({{dp.deptAlias}})
                  </option>
                </b-select>
            </b-field>


            <b-field label="Course" expanded>
              <b-select v-model="academicInfo.fCourseId" expanded>
                <option v-for="course in courseList" :value="course.courseId">
                  {{course.courseName}}({{course.courseAlias}})
                </option>
            </b-select>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field label="Current Sem" expanded>
          <b-Select v-model="academicInfo.fcurrsem" expanded>
              <option v-for="cl in 10">{{cl}}</option>
          </b-select>
          </b-field>
            <b-field label="Date of Admission" expanded>
                <b-datepicker v-model="academicInfo.stuAdmissiondate" expanded icon="calendar-today" style="overflow:visible;"></b-datepicker>
            </b-field>
        </b-field>
    </section>
</template>
<script>
  import {mapState} from 'vuex'
    export default {
        name: 'StudentAcademicInfo',
        props: [
            'academicInfo'
        ],
        data() {
            return {
            }
        },
        computed:mapState([
          'courseList',
          'departmentList'
        ]),
        created(){
          this.$store.dispatch('load_dept_list')
          this.$store.dispatch('load_course_list')
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .footrbox{
        background-color: floralwhite;
        padding:.4em;
        color:#224444;
        border-top:1px solid #224444;
    }
</style>
