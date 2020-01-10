<template>
    <div class="" style="width:100%">

        <div class="is-radiusless box">
            <b-field label="Faculty Name">
                <b-select  @input="fNameChanged" v-model="facultyId" expanded>
                    <option :value="faculty.empId" v-for="faculty in facultyList">
                      {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                    </option>
                </b-select>
            </b-field>
        </div>

        <b-message @close="freeFacultyList=[]" type='is-info' title="Free FacultyList" :active.sync="freeFacultyList && freeFacultyList.length>0">
          <p :key="index" v-for="(ff,index) in freeFacultyList">
            {{ff.title}} {{ff.firstName}} {{ff.middleName}} {{ff.lastName}}
          </p>
        </b-message>
        <div class="is-radiusless box" v-if="!freeFacultyList || freeFacultyList.length==0">
          <p class="content has-text-info">Click Slot to Show Suggested Free Faculty List(According to TimeTable)</p>
        </div>
        <div class="is-radiusless box">
          <ReportPanel :isFaculty="facultyId" :isFacultyTtbl='true' :generateEvent='true' @openDetail="openDetail"/>
        </div>
        <b-loading is-full-page :active.sync="loading" ></b-loading>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import UserMxn from '@/mixin/user'
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    export default {
        name: "TTFacultyReport",
        props: ['ayId','facultyDept','timeTblId'],
        mixins: [UserMxn],
        data() {
            return {
                loading:false,
                facultyId: "",
                dept: "",
                freeFacultyList:[]
            };
        },
        components: {
            ReportPanel
        },
        computed: {
            facultyList(){
              return _.filter(this.$store.state.employeeStore.facultyList,{deptId:this.facultyDept})
            },
            busyFacultyList(){
              return this.$store.getters['ttStore/busyFacultyList']
            }
        },
        watch:{
          facultyList(){
              // if(this.facultyList && this.facultyList[0]){
              //       this.facultyId=this.facultyList[0].empId
              //   }
              //   else{
              //       this.facultyId="";
              //   }
                  this.fNameChanged()
                  this.loadBusyFacultyList()
          },
          loggedInUser(){
            this.facultyId=this.loggedInUser.empId
          },
          busyFacultyList(){
            if(!this.facultyList || !this.busyFacultyList)
              return
            this.freeFacultyList=JSON.parse(JSON.stringify(this.facultyList))
            this.busyFacultyList.map(tt=>{
              _.remove(this.freeFacultyList,ob=>{
                return ob.empId==tt
              })
            })
          }
        },
        mounted() {
        },
        methods: {
          fNameChanged(){


            this.loading=true
            this.freeFacultyList=[]
            this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: this.facultyId, tblId: this.timeTblId})
                    .then(rr => {
                        //
                        // this.timeTblDt.timeTableList = this.$store.state.ttStore.timeTblDt.timeTableList;
                        this.loading=false
                    })
                    .catch(error => {
                        console.log("****", error);
                        this.loading=false
                      });
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
            openDetail(load){
              this.loadBusyFacultyList(load)
            }
        }
};
</script>
<style>
</style>
