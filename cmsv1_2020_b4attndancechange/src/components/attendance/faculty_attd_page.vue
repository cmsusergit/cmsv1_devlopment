<template>
    <div class="section is-radiusless box" style="width:100%">

        <div class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','HOD','STUDENT_COORD','TT_COORD'])" v-model="dt.ayId" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
                <b-field label="Department" expanded>
                <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','HOD','STUDENT_COORD','TT_COORD'])"  @input="deptChanged" v-model="dt.fDeptId" expanded>

                      <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
              </b-field>
                <b-field grouped>
                  <b-field label="Faculty">
                     <b-select @input="facultyChanged" :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','HOD','STUDENT_COORD','TT_COORD'])" v-model="dt.facultyId">
                         <option :value="faculty.empId" v-for="faculty in facultyList">
                           {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                         </option>
                     </b-select>
                      </b-select>
                  </b-field>
                  <!-- <b-field label="Sem">
                     <b-select @input="changeSubjectList" v-model="dt.ttSem" >
                          <option :key="indx" v-for="indx in 10">{{ indx }}</option>
                      </b-select>
                  </b-field>
                  <b-field label="Course" expanded>
                      <b-select @input="changeSubjectList" v-model="dt.fCourseId" expanded>
                          <option v-for="course in courseList" :value="course.courseId">{{course.courseAlias}}</option>
                      </b-select>
                  </b-field> -->



                  <b-field v-if="subjectList1" label="Subject Name" expanded>
                          <b-select v-model="dt.fSubjectId" expanded>
                            <option v-for="(subject, index) in subjectList1" :key="index" :value="subject.subId">
                              {{subject.subName}}
                            </option>
                          </b-select>
                  </b-field>
                  <b-field v-if="classList1" label="Class Name" expanded>
                    <b-select @input="classChanged"  v-model="dt.classId" expanded>
                      <option v-for="(cl, index) in classList1" :key="index" :value="cl.classId">
                        {{cl.className}}
                      </option>
                    </b-select>
                </b-field>
        </b-field>
        <b-field grouped>
          <div class="is-radiusless box has-text-centered" style="width:100%;">
            <b-radio @input="radioChanged" v-model="dt.loadType" name="LoadType" style="width:20%;" native-value="Theory">Theory</b-radio>
            <b-radio @input="radioChanged" v-model="dt.loadType" name="LoadType" style="width:20%;" native-value="Practical">Practical</b-radio>
            <b-radio @input="radioChanged" v-model="dt.loadType" name="LoadType" style="width:20%;" native-value="Tutorial">Tutorial</b-radio>
            <b-radio @input="radioChanged" v-model="dt.loadType" name="LoadType" style="width:20%;" native-value="Other">Other</b-radio>
          </div>
        </b-field>
        <b-field v-if="dt.loadType!='Theory' " grouped>
          <b-field label="Batch Name" expanded>
            <b-select v-model="dt.fBatchId" expanded>
                <option :key="indx" v-for="(batch, indx) in batchList" :value="batch.batchId">
                    {{ batch.batchName }}
                </option>
            </b-select>
          </b-field>
        </b-field>
      </div>
        <div v-if="dt && dt.facultyId && dt.classId && dt.ayId && dt.fSubjectId">
          <AttendanceReport :facultyId="dt.facultyId" :ayId="dt.ayId" :classId="dt.classId" :ttSubjectId="dt.fSubjectId" :batchId="dt.fBatchId" :loadType="dt.loadType"/>
        </div>
    </div>
</template>
<script>
    import userMxn from '@/mixin/user'
    import config from "@/../static/test1.json";
    import { mapState} from 'vuex';
    import AttendanceReport from "@/components/attendance/faculty_attd_report"
    export default {
        name: "SubjectAttndReport",
        data() {
            return {
              classList1:[],
              subjectList1:[],
                dt:{
                  facultyId:'',
                  ayId:this.currAcademicyearId?this.currAcademicyearId:'',
                  fDeptId:this.loggedInUser?this.loggedInUserdeptId:'',
                  loadType:'Theory',
                  fBatchId:-1
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
            facultyList(){
              return this.$store.state.employeeStore.facultyList
            },

            subjectList() {
                return this.$store.state.subjectStore.subjectList;
            },
            batchList(){
              return this.$store.state.classStore.batchList
            },
            isAuthorized(){
              return this.isAuthorizedRoleList(['CMSADMIN','HOD'])
            },
            subjectListByFaculty(){
              return this.$store.getters['ttStore/subjectListByFaculty']
            }
        },
        watch: {
          subjectListByFaculty(){
            if(!this.subjectListByFaculty || this.subjectListByFaculty.length==0)return
            this.subjectList1=[]
            this.subjectListByFaculty.map(ob=>{
              _.uniqBy(ob.timetableRecordInfos,'fSubjectId').map(tt=>{
                this.subjectList1.push(_.find(this.subjectList,record=>record.subId==tt.fSubjectId))
              })
              this.classList1=[]
              _.uniqBy(ob.timetableRecordInfos,'fClassId').map(tt=>{
                this.classList1.push(_.find(this.classList,record=>record.classId==tt.fClassId))
              })
            })
          },
          currAcademicyearId(){
            this.dt.ayId=this.currAcademicyearId
          },
          loggedInUser(){
              this.dt.fDeptId=this.loggedInUser.deptId
              this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.loggedInUser.deptId)
              this.$store.dispatch('ttStore/loadSubjectListByFaculty',{ayId:this.dt.ayId,facultyId:this.loggedInUser.empId})
              this.dt.facultyId=this.loggedInUser.empId
          }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_course_list');
            this.$store.dispatch('load_dept_list');
            this.$store.dispatch("subjectStore/LOAD_SUBJECT_LIST")
            this.dt.ayId=this.currAcademicyearId
            this.dt.fDeptId=this.loggedInUser.deptId
            this.$store.dispatch('load_class_list_by_dept','All')
        },
        methods: {
          facultyChanged(){
            this.$store.dispatch('ttStore/loadSubjectListByFaculty',{ayId:this.dt.ayId,facultyId:this.dt.facultyId})
          },
          radioChanged(value){
            if(value=='Theory')
              this.dt.fBatchId=-1
            else
              this.dt.fBatchId=''
          },
          deptChanged(){
            this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.dt.fDeptId)
          },
          classChanged(vv){
            this.$store.dispatch('classStore/load_batch_list_by_classid',vv)
          }
        }
};
</script>
<style>
</style>
