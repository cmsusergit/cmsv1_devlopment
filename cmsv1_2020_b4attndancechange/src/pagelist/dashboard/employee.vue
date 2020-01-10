<template>
    <div class="" style="width:100%;height:100%;">

        <h1 class="is-radiusless has-background-grey box has-text-white is-size-4">Welcome {{userName}}</h1>
        <div class="tile">
          <div class="tile is-child box is-radiusless">
            <h1 class="title is-size-5">Circulars</h1>
            <CircularPanel :totalPage="4"/>
          </div>
            <div style="margin:.1em;"></div>
            <div class="tile is-child box is-radiusless">
                <h1  class="title is-size-5">To Do</h1>

                <TodoPanel/>
            </div>
          </div>
          <div style="margin:.2em">
          </div>
          <div v-if="isAuthorizedRoleList(['FACULTY'])"  class="is-radiusless box">
            <b-switch class="is-pulled-right" type="is-info" v-model="isAttendance">Attendance Mode</b-switch>
            <ReportPanel @openDetail='openDetail' :isFacultyTtbl='true' :generateEvent="isAttendance"/>
          </div>
          <div v-if="isAuthorizedRoleList(['FACULTY'])" class="is-radiusless box">
            <b-tabs>
              <b-tab-item label="Assigned ProxyList">
                <ProxyAssignedList :assignedFacultyId.sync="facultyId"/>
              </b-tab-item>

                <b-tab-item v-if="isAuthorizedRoleList(['HOD'])" label="Approve ProxyList">
                  <ProxyApproveList :deptId.sync='deptId'/>
                </b-tab-item>
              <b-tab-item label="Owned ProxyList">
                <ProxyList :ownerId.sync="facultyId"/>
                </b-tab-item>
            </b-tabs>
          </div>
      </div>
</template>
<script>
import ProxyList from '@/components/proxy/proxyList'
import TodoPanel from '@/components/todo/todo'
import CircularPanel from '@/components/dashboard/circularpanel'
import userMxn from '@/mixin/user'
import ProxyAssignedList from '@/components/proxy/proxyAssignedList'
import ProxyApproveList from '@/components/proxy/proxyApproveList'
import ReportPanel from '@/components/report/report'

export default {
    name: 'EmployeeDashboard',
    components: {
      ProxyAssignedList,
      TodoPanel,
      ProxyList,
      ProxyApproveList,
      CircularPanel,
      ReportPanel
    },
    data() {
        return {
          academicYear:'',
          facultyId:'',
          deptId:'',
          isAttendance:false
        }
    },
    mixins: [userMxn],
    computed:{
      userName(){
        return this.loggedInUser.firstName +" "+this.loggedInUser.middleName+" "+this.loggedInUser.lastName
      }
    },
    watch: {
      currAcademicyearId(){
        this.academicYear=this.currAcademicyearId
        if(this.academicYear && this.deptId && this.facultyId)
        {
          this.loadTimeTable(this.academicYear,this.deptId)
        }
      },
      loggedInUser(){
        this.deptId=this.loggedInUser.deptId
        this.facultyId=this.loggedInUser.empId
        if(this.academicYear && this.deptId && this.facultyId)
        {
          this.loadTimeTable(this.academicYear,this.deptId)
        }
      }
    },
    methods: {
      loadTimeTable(ayId,deptId){
        const ob = {
            aYearId: ayId,
            dept: deptId
        };
        this.$store.dispatch('ttStore/getTimeTableId',ob).then(response => {
            if (response.data[0]) {
                const timeTblId = response.data[0].timetableId;
                this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: this.facultyId, tblId: timeTblId})
            }
        }).catch(error => {
            console.log('****', error);
            this.timeTblId="";
        });
      },
      openDetail(ttRecord){
        this.$router.push({name:'Attendance',params:{ttRecord:ttRecord}})
      }
    },
    mounted(){
      if(this.isAuthorizedRoleList(['FACULTY']) && this.academicYear && this.deptId && this.facultyId)
        this.loadTimeTable(this.academicYear,this.deptId)
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .boxv{
        background-color: white;
        color:#224444;
    }
</style>
