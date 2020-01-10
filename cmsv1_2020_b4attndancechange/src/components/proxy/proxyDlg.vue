<template>
    <form @submit.prevent="assignLoad" class="is-radiusless box" style="width:100%">

             <div class="is-radiusless box">
               <LoadDetail @loadDetailDone='getLoadDetail' :recordId='proxyDetail.fTtid'/>
            </div>
            <h1 class="subtitle">Available Faculties</h1>
            <div style="overflow:auto;height:80px" class="is-radiusless box">
              <p :key="index" v-for="(ff,index) in freeFacultyList">
                {{ff.title}} {{ff.firstName}} {{ff.middleName}} {{ff.lastName}}-
                <template v-if="ff.contact">{{ff.contact}}</template>
              </p>

            </div>
            <div class="is-radiusless box">
            <b-field grouped>
                <b-field label="Department" expanded>
                    <b-select @input="deptChanged" v-model="proxyDetail.fOwnerDeptid" expanded required>
                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
                   </b-select>
                </b-field>
                <b-field label="Faculty Name" expanded>
                <b-select v-model="proxyDetail.fFacultyid" expanded required>
                    <option v-if="faculty.empId!=proxyDetail.fOwnerid" :value="faculty.empId" v-for="faculty in facultyList">
                      {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                    </option>
                </b-select>
              </b-field>
            </b-field>
            <b-field label="Select Date">
            <b-datepicker :unselectable-days-of-week="daysToDisable" v-model="proxyDetail.proxyDate"  icon="calendar-today" :date-formatter="formatDt" style="overflow:visible">
            </b-datepicker>
          </b-field>
          <div class="is-pulled-right">
            <button type="submit" class="button is-info">Save</button>
            <button type="button" @click="$parent.close()" class="button is-info">Cancel</button>
          </div>
          <div class="is-clearfix">
          </div>
          </div>
    </form>
</template>
<script>
    import LoadDetail from '@/components/proxy/loadDetail'
    import config from "@/../static/test1.json";
    import { mapState} from 'vuex';
    import _ from 'lodash'
    export default {
        name: "ProxyDlg",
        props: ['isUpdate','ayId','proxyDetail'],
        data() {
            return {
                daysToDisable:[],
                freeFacultyList:[],
                dept: ""
            };
        },
        components: {
          LoadDetail
        },
        computed: {
            ...mapState([//....
                    'departmentList']
                    ),
            dayList(){
              return config.dt_list.rowh
            },
            facultyList(){
              return this.$store.getters['employeeStore/getFacultyListForProxy']
            },
            busyFacultyList(){
              return this.$store.getters['ttStore/busyFacultyList']
            }
        },
        watch:{
          busyFacultyList(){
            this.freeFacultyList=JSON.parse(JSON.stringify(this.facultyList))
            this.busyFacultyList.map(tt=>{
              _.remove(this.freeFacultyList,ob=>{
                return ob.empId==tt
              })
            })
          }
        },


        mounted() {
          if(this.proxyDetail.fDeptId==-1){
              this.$store.dispatch('proxyStore/get_faculty_dept',this.proxyDetail.fFacultyid)
                .then(rr=>{
                  this.dept=rr
                })
                .catch(error=>{
                  console.log('****',error);
                })
            }
            this.proxyDetail.proxyDate=new Date(this.proxyDetail.proxyDate)
            this.$store.dispatch('load_dept_list');
            this.$store.dispatch('employeeStore/load_proxyfacultylist_by_dept',this.proxyDetail.fOwnerDeptid)
        },
        methods: {
            deptChanged(dept) {
                this.$store.dispatch('employeeStore/load_proxyfacultylist_by_dept',dept)
            },
            loadBusyFacultyList(load){
                const ob={
                  ayId:this.ayId,
                  ttDay:load.ttDay,
                  ttStartTime:load.ttStartTime,
                  ttEndTime:load.ttEndTime
                }


                this.$store.dispatch('ttStore/loadBusyFacultyList',ob)
            },
          getLoadDetail(load){
              const indx=_.findIndex(this.dayList,ob=>{

                return ob==load.ttDay
              })
              this.daysToDisable=[0,1,2,3,4,5,6]
              _.remove(this.daysToDisable,ob=>{return ob==indx+1})
              this.loadBusyFacultyList(load)
            },
            assignLoad(){
              if(this.isUpdate){
                this.updateProxyDetail()
              }
              else{
                this.saveProxyDetail()
              }
            },
            updateProxyDetail(){
                const tempD=new Date( this.proxyDetail.proxyDate.getTime() + Math.abs(this.proxyDetail.proxyDate.getTimezoneOffset()*60000) )
                const dt={
                    proxyId: this.proxyDetail.proxyId,
                    fTtid:this.proxyDetail.fTtid,
                    fFacultyid:this.proxyDetail.fFacultyid,
                    proxyDate: tempD,
                    isApproved: 0,
                    isCOmpleted:0,
                    fOwnerid:this.proxyDetail.fOwnerid,
                    fOwnerDeptid:this.proxyDetail.fOwnerDeptid
                }
                this.$store.dispatch('proxyStore/update_proxy_detail',dt)
                  .then(rr=>{
                    this.$buefy.toast.open({
                      duration: 5500,
                      message: 'ProxyDetail Updated',
                      position: 'is-top',
                      type: 'is-success'
                    })
                    this.$store.dispatch('proxyStore/load_proxy_list',this.proxyDetail.fOwnerid)
                    this.$parent.close()
                  })
                  .catch(error=>{
                    this.$buefy.toast.open({
                      duration: 5500,
                      message: error.response.data.error.message,
                      position: 'is-top',
                      type: 'is-danger'
                    })
                    this.$parent.close()
                  })
                },
            saveProxyDetail(){
                const tempD=new Date(this.proxyDetail.proxyDate.getTime() + Math.abs(this.proxyDetail.proxyDate.getTimezoneOffset()*60000))
                const dt={
                    proxyId: 0,
                    fTtid:this.proxyDetail.fTtid,
                    fFacultyid:this.proxyDetail.fFacultyid,
                    proxyDate: tempD,
                    isApproved: 0,
                    isCompleted:0,
                    fOwnerDeptid:this.proxyDetail.fOwnerDeptid,
                    fOwnerid:this.proxyDetail.fOwnerid
                }
                this.$store.dispatch('proxyStore/save_proxy_detail',dt)
                  .then(rr=>{
                    this.$buefy.toast.open({
                      duration: 5500,
                      message: 'Load Adjusted',
                      position: 'is-top',
                      type: 'is-success'
                    })
                    this.$parent.close()
                  })
                  .catch(error=>{
                    this.$buefy.toast.open({
                      duration: 5500,
                      message: error.response.data.error.message,
                      position: 'is-top',
                      type: 'is-danger'
                    })
                    this.$parent.close()
                  })
            },
            formatDt(d){
              return d.toLocaleDateString();
            }
}};
</script>
<style>
</style>
