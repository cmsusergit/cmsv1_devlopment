<template>
    <div class="is-radiusless box" style="width:100%;">

        <b-message type="is-danger" class="title is-4" v-if="recordExistsMessage">
          {{recordExistsMessage}}
        </b-message>
        <div v-else>
        <table id="todt" class="table is-bordered is-fullwidth" style="font-size:1em">
          <tr>
            <td colspan="4">
              <b>Subject Name:</b> {{subName}}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <b>Department:</b> {{deptName}}

            </td>
            <td colspan="2">
              <b>Course:</b> {{courseName}}
            </td>
          </tr>
          <tr>
            <td><b>Sem:</b> {{ttRecord.ttSem}}</td>
            <td><b>Class Name:</b> {{className}}</td>
            <td><b>Load Type:</b> {{ttRecord.ttLoadType}}</td>
            <td><b>Batch Name:</b> {{batchName}}</td>
          </tr>
          <tr>
            <td colspan="2"><b>Day:</b> {{ttRecord.ttDay}}</td>
            <td><b>StartTime:</b> {{ttRecord.ttStartTime}}</td>
            <td>
              <b>EndTime:</b> {{ttRecord.ttEndTime}}</td>
          </tr>
          <tr>
             <td colspan="4"><b>Select Date:</b>

              <b-datepicker @input="dateChanged" icon-pack="fa" icon="calendar-alt"

                :disabled="proxyInfo && proxyInfo.isProxy==1" v-model="scheduleDate"
                :unselectable-days-of-week="daysToDisable"
                :maxDate="dtLimit"
                :date-formatter="formatDt"
                required
               /></td>
          </tr>
          <tr v-if="proxyInfo">
            <td colspan="2">OwnedBy: {{getFacultyNameById(ttRecord.fFacultyId)}}</td>
            <td colspan="2">AssignedTo: {{getFacultyNameById(proxyInfo.proxyFacultyId)}}</td>
          </tr>
        </table>
        <!-- <b-field>
          <b-checkbox v-model="isProxy">Is Proxy?</b-checkbox>
      </b-field>
            <b-field v-if="isProxy" label="Faculty Name">
                <b-select expanded>
                    <option :value="faculty.facultyId" v-for="faculty in facultyList">{{faculty.fName}}</option>
                </b-select>
            </b-field> -->
        <div v-if="studentList.length!==0"  style="border:1px solid grey">
        <b-tabs v-model="activeTab" type="is-toggle" expanded>
          <b-tab-item label="Student List">
            <b-table class="is-radiusless box"
                 :data="studentList" bordered
                 :loading='loading'
                 :checked-rows.sync=presentList
                  default-sort="stuEnroll" checkable
                 >
            <template slot-scope="props">
                <b-table-column label="Sr.No." width="50">{{props.index+1}}
                </b-table-column>
                <b-table-column width="250" field="stuEnroll" label="Enrollment" sortable>
                    {{ props.row.stuEnroll}}
                </b-table-column>
                <b-table-column field="stuFirstname" label="Name">
                    {{ props.row.stuTitle }} {{ props.row.stuFirstname }} {{ props.row.stuMiddlename }} {{ props.row.stuLastname }}
                </b-table-column>
            </template>
        </b-table>
        <p v-if="!scheduleDate" style="width:100%" class="tag is-radiusless is-large is-danger">
            <span @click="scrollToTop" class="has-text-white" style="cursor:pointer">Please Select Date To Continue</span>
          </p>
         <button v-else @click="activeTab=1" class="button is-primary" style="width:100%">Next</button>
      </b-tab-item>
      <b-tab-item :disabled="!scheduleDate" label="Present List">
        <div class="is-size-5 has-text-white has-background-info has-text-weight-bold is-radiusless box">Total Present Students Count: {{presentList.length}}</div>
        <table class="table is-bordered is-fullwidth">
          <thead>
            <th>Student Enrollment</th>
            <th>Student Name</th>
          </thead>
        <tr v-for="(tt, index) in presentList" :key="index">
          <td>{{tt.stuEnroll}}</td>
          <td>
            {{tt.stuTitle}} {{tt.stuFirstname}} {{tt.stuMiddlename}} {{tt.stuLastname}}
          </td>
        </tr>
      </table>
      <b-field label="Content Covered">
        <b-input v-model="contentCovered" maxlength="250" class="is-radiusless" type="textarea"/>
      </b-field>
      <button :disabled="!this.contentCovered" @click="submitAttendance" class="button is-primary" style="width:100%">Submit</button>
      </b-tab-item>
    </b-tabs>
      </div>
      <div v-else class="is-radiusless box">
          Student list is Empty
      </div>
      </div>
    </div>

</template>
<script>
import _ from 'lodash'
import {mapState} from 'vuex'
import config from "@/../static/test1.json";
export default {

  name:"Attendance",
  props: ['ttRecord','proxyInfo'],
  components: {
  },
  data(){
  return {
      recordExistsMessage:'',
      daysToDisable:[],
      activeTab:0,
      isProxy:false,
      scheduleDate:null,
      presentList:[],
      subName:'',
      courseName:'',
      batchName:'',
      className:'',
      deptName:'',
      contentCovered:''
  }},
  computed: {
      ...mapState({
              studentList: state => state.studentStore.studentList,
              loading: state => state.studentStore.loading
      }),
      dtLimit(){
        return new Date()
      },
        facultyList(){
          return this.$store.state.employeeStore.facultyList
        }
    },
    watch:{
      proxyInfo(){
        if(this.proxyInfo)
          this.scheduleDate=this.proxyInfo.proxyDate
      }
    },
  methods: {
      dateChanged(dt){
        const ob={
          ftimetableid:this.ttRecord.ttId,
          csDateConducted:this.scheduleDate
        }
        this.$store.dispatch('attendanceStore/classScheduleExist',ob)
          .then(rr=>{
            console.log(`!!!!${rr.recordExist}!!!!`);
            if(rr.recordExist){
                this.recordExistsMessage="Record Already Exist"
            }
          })
          .catch(error=>{
            this.$buefy.toast.open({
              duration: 5500,
              message: error.response.data.error.message,
              position: 'is-top',
              type: 'is-danger'
            })
          })
        },
    submitAttendance(){
      let stList=new Array(this.studentList.length)
      _.forEach(this.studentList,(student,indx)=>{
        stList[indx]={
          attId:0,
          fstudenrollId:student.stuEnroll,
          fclassscheduleid:0,
          attPresent:false
        }
      });
      _.forEach(stList,(student)=>{
        if(_.find(this.presentList,{stuEnroll:student.fstudenrollId})){
          student.attPresent=true
        }
      });
      const tempD=new Date( this.scheduleDate.getTime() + Math.abs(this.scheduleDate.getTimezoneOffset()*60000) )
      let dt={
        classSchedule:{
          csId:0,
          csDateConducted:tempD,
          ftimetableid:this.ttRecord.ttId,
          fproxyfacultyid:-1,
          csIsProxy:0,
          csContentCovered:this.contentCovered
        },
        studentList:stList
      }

      if(this.proxyInfo && this.proxyInfo.isProxy){
        dt.classSchedule.csIsProxy=1
        dt.classSchedule.fproxyfacultyid=this.proxyInfo.proxyFacultyId
      }
      this.$store.dispatch('attendanceStore/save_attendance',dt).
          then(rr=>{
            this.$buefy.toast.open({
                  duration: 5500,
                  message: "Attendance Submitted",
                  position: 'is-top',
                  type: 'is-success'
            })
            if(this.proxyInfo)
              this.$store.dispatch('proxyStore/completeProxy',this.proxyInfo.proxyId)
            this.$router.push({name:'AttendanceDashboard'})
          })
          .catch(error=>{
            this.$buefy.toast.open({
              duration: 5500,
              message: error.response.data.error.message,
              position: 'is-top',
              type: 'is-danger'
            })
        })
    },
    getDeptNameById(id){
      this.$store.dispatch('deptStore/getDeptNameByID',id)
        .then(response=>{
          this.deptName=`${response.deptName}(${response.deptAlias})`
        })
        .catch(error=>{
          this.deptName=''
        })
    },
    getBatchNameById(id){
      if(id==0){
        this.batchName='-'
        return
      }
      this.$store.dispatch('classStore/getBatchNameById',id)
        .then(response=>{
          this.batchName=response.batchName
        })
        .catch(error=>{
          this.batchName=''
        })
    },
    getCourseNameById(id){
      this.$store.dispatch('courseStore/getCourseNameByID',id)
        .then(response=>{
          this.courseName=`${response.courseName}(${response.courseAlias})`
        })
        .catch(error=>{
          this.courseName=''
        })
    },
    getClassNameById(id){
      this.$store.dispatch('classStore/getClassNameById',id)
        .then(response=>{
          this.className=response.className
        })
        .catch(error=>{
          this.className=''
        })
    },
    startAttendance(){
        let ob={
          allocationDetail:{
            classId:this.ttRecord.fClassId
          }
        }
        if(this.ttRecord.ttLoadType!='Theory'){
          ob.allocationDetail.batchId=this.ttRecord.fBatchId
        }
        this.$store.dispatch('studentStore/load_student_list_by_class_batch', ob)
      // const ob={
      //   fDeptId:this.ttRecord.fDeptId,
      //   fCourseId:this.ttRecord.fCourseId,
      //   fClassId:this.ttRecord.fClassId,
      //   fcurrsem:this.ttRecord.ttSem
      // };
      // if (this.ttRecord.ttLoadType!='Theory') {
      //     ob["fBatchId"]=this.ttRecord.fBatchId
      // }
      // this.$store.dispatch('studentStore/load_student_attend_list',ob);
    },
    formatDt(dd){
      return dd.toLocaleDateString()
    },

    getFacultyNameById(id){
      const faculty=_.find(this.facultyList,{empId:id})
      if(!faculty)return;
      const temp='('+faculty.firstName.charAt(0)+faculty.middleName.charAt(0)+faculty.lastName.charAt(0)+')'
      return faculty.firstName+" "+faculty.middleName+" "+faculty.lastName+" "+temp
    },
    scrollToTop(){

      window.scrollTo({top:0,left:0,behavior:'smooth'})
    }
  },
  mounted() {
        this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
        this.$store.dispatch('subjectStore/getSubNameById',this.ttRecord.fSubjectId).
          then(rr=>{
            this.subName=rr
          })
          .catch(error=>{
            console.log('****',error);
          });
          if(this.proxyInfo)
            this.scheduleDate=new Date(this.proxyInfo.proxyDate)
          const indx=_.findIndex(config.dt_list.rowh,ob=>{
            return ob==this.ttRecord.ttDay
          })
          this.daysToDisable=[0,1,2,3,4,5,6]
          _.remove(this.daysToDisable,ob=>{return ob==indx+1})
          this.getDeptNameById(this.ttRecord.fDeptId)
          this.getCourseNameById(this.ttRecord.fCourseId)
          this.getClassNameById(this.ttRecord.fClassId)
          this.getBatchNameById(this.ttRecord.fBatchId)
          this.startAttendance();
  }
}

</script>
<style lang="css" scoped>
</style>
