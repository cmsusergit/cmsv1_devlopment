<template>
    <div class="section is-radiusless box" style="width:100%">

      <h1 class="title is-size-4">Proxy Assignment</h1>
        <div v-show="isAuthorizedRoleList(['CMSADMIN','HOD'])" class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select @input="deptChanged" v-model="timeTblDt.academicYear" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
                <b-field label="Department" expanded>
                    <b-select @input="deptChanged" v-model="timeTblDt.dept" expanded>

                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
            </b-field>
        </div>
        <div class="is-radiusless box" v-if="timeTblId">
            <b-field label="Faculty Name">
              <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','TT_COORD','HOD'])" @input="fNameChanged" v-model="facultyId" expanded>
                  <option :value="faculty.empId" v-for="faculty in facultyList">
                    {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                  </option>
              </b-select>
            </b-field>
        </div>
        <div v-else>
          <div class="is-clearfix" style="margin-bottom:1em">
            <p>TimeTable Record !Found</p>
          </div>
        </div>
        <div v-if="timeTblId" class="is-radiusless box">
            <ReportPanel :isFacultyTtbl='true' :generateEvent='true' @openDetail='openDetail'/>
        </div>
        <b-modal :can-cancel=false :active.sync="openDlg">
          <ProxyDlg :isUpdate='isUpdate' :ayId="timeTblDt.academicYear" :proxyDetail="proxyDetail"/>
      </b-modal>
      <ProxyList @editProxy="editProxy" @deleteProxy='deleteProxy' :ownerId="facultyId"/>
    </div>
  </template>
<script>
    import config from "@/../static/test1.json";
    import userMxn from '@/mixin/user'
    import { mapState} from 'vuex';
    import ProxyList from '@/components/proxy/proxyList'
    import ProxyDlg from '@/components/proxy/proxyDlg'
    import ReportPanel from "@/components/report/report";
    export default {
        name: "ProxyInfo",
        data() {
            return {
                timeTblId: "",
                isUpdate:false,
                facultyId: "",
                dept: "",
                openDlg:false,
                proxyDetail:{
                    proxyId: 0
                }
            };
        },
        components: {
            ProxyList,
            ReportPanel,
            ProxyDlg
        },
        mixins: [userMxn],
        computed: {
            ...mapState([//....
                    'departmentList']
                    ),
            aYearList() {
              return this.$store.state.acadyearStore.acadyearList
            },
            timeTblDt() {
                return this.$store.state.ttStore.timeTblDt;
            },
            facultyList(){
              return this.$store.state.employeeStore.facultyList
            }
        },
        watch: {
            departmentList() {
                if (!this.timeTblDt.dept)
                    this.timeTblDt.dept = this.departmentList[0].deptName;
            },
            currAcademicyearId(){
              this.timeTblDt.academicYear=this.currAcademicyearId
              this.fNameChanged()
            },
            loggedInUser(){
              this.timeTblDt.dept=this.loggedInUser.deptId
              this.facultyId=this.loggedInUser.empId
              this.fNameChanged()
            }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_dept_list');
            if(this.timeTblDt.dept){
              this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.timeTblDt.dept)
            }
            this.fNameChanged()
      },
        methods: {


            editProxy(id){
              this.$store.dispatch('proxyStore/load_proxy_by_id',id)
                .then(rr=>{
                  this.proxyDetail=rr
                  this.proxyDetail.proxyDate=new Date(rr.proxyDate)
                  this.isUpdate=true
                  this.openDlg=true
                })
                .catch(error=>{
                  console.log('****',error);
                })
            },
            deleteProxy(id) {
                this.$buefy.dialog.confirm({
                    title: 'Delete ProxyDetail',
                    message: 'Are you sure you want to <b>delete</b>?<br/>This action cannot be undone.',
                    confirmText: 'Delete',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm:()=>{
                        this.deleteProxyConfirmed(id)
                    }
              })
              },
            deleteProxyConfirmed(id){
              this.$store.dispatch('proxyStore/delete_proxy_detail',id)
                .then(rr=>{
                  this.$buefy.toast.open({
                    duration: 5500,
                    message: 'ProxyDetail Removed',
                    position: 'is-top',
                    type: 'is-success'
                  })
                  this.$store.dispatch('proxyStore/load_proxy_list',this.facultyId)
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
            deptChanged() {
                const ob = {
                    aYearId: this.timeTblDt.academicYear,
                    dept: this.timeTblDt.dept
                };
                this.$store.dispatch('ttStore/getTimeTableId', ob).then(response => {
                    if (response.data[0]) {
                        this.timeTblId = response.data[0].timetableId;
                        this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: this.timeTblDt.pFacultyId, tblId: this.timeTblId})
                                .then(rr => {
                                    this.timeTblDt.timeTableList = this.$store.state.ttStore.timeTblDt.timeTableList;
                                }).catch(error => {
                                  console.log("****", error);
                                });
                    } else
                        this.timeTblId = "";
                }).catch(error => {
                    console.log('****', error);
                    this.timeTblId="";
                });
                this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.timeTblDt.dept)
            },
            openDetail(ttRecord){
                  this.proxyDetail.fTtid=ttRecord.ttId
                  this.proxyDetail.proxyDate=new Date()
                  this.proxyDetail.isApproved=0
                  this.proxyDetail.fOwnerid=ttRecord.fFacultyId
                  this.proxyDetail.fOwnerDeptid=ttRecord.fDeptId
                  this.isUpdate=false
                  this.openDlg=true
            },
            fNameChanged() {
                this.timeTblDt.pFacultyId = this.facultyId;
                if (this.timeTblDt.pFacultyId) {
                    for (let indx = 0; indx < this.timeTblDt.timeTableList.length; indx++) {
                        this.timeTblDt.timeTableList[indx].fFacultyId = this.timeTblDt.pFacultyId;
                    }
                    this.deptChanged();
                }},
}};
</script>
<style>
</style>
