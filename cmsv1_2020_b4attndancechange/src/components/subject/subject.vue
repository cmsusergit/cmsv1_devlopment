<template>
    <section style="padding-top:.5em;border-top:1px solid gray;">
        <b-field grouped>
            <b-field label="Department" expanded>
                <b-select v-model="subjectInfo.subjectDept"  expanded>
                  <option v-for="dp in departmentList" :value='dp.deptId'>{{dp.deptName}}</option>
                </b-select>
            </b-field>
            <b-field label="Course" expanded>
              <b-select v-model="subjectInfo.subjectCourse"  expanded>
            <option v-for="course in courseList" :value='course.courseId'>{{course.courseAlias}}</option>
            </b-select>
          </b-field>
          <b-field label="Sem" expanded>
          <b-Select v-model="subjectInfo.subjectSem"  expanded>
              <option v-for="cl in 10">{{cl}}</option>
          </b-select>
          </b-field>
        </b-field>
          <b-field grouped>
        <b-field label="Subject Name" expanded >
                   <b-input v-model="subjectInfo.subName" required></b-input>
               </b-field>
        <b-field label="Subject Alias" >
                          <b-input  v-model="subjectInfo.subAlias" required></b-input>
                      </b-field>
                      <b-field label="Subject Code" >
                                 <b-input v-model="subjectInfo.subCode" required></b-input>
                             </b-field>

                             <b-field label="Subject Type" expanded >
                                        <b-select v-model="subjectInfo.subType" required expanded>
                                          <option>Regular</option>
                                          <option>Elective</option>
                                        </b-select>
                                    </b-field>
             </b-field >
    </section>
</template>
<script>
  import {mapState} from 'vuex'
    export default {
        name: 'SubjectInfo',
        props: [
            'subjectInfo'
        ],
        data() {
            return {
            }
        },
        computed:mapState([
          'departmentList',
          'courseList'
        ]),
        methods:{
        },
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
