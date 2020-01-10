<template>
    <div class="is-radiusless box boxbg">

      <div class="is-radiusless box" style="margin-top:2em;">
          <b-field grouped>
            <b-field label="Academic Year" expanded>
                <b-select v-model="currAyearId" expanded>
                    <option v-for="ay in aYearList" :value="ay.id">{{ay.apiAyear}}</option>
                </b-select>
            </b-field>



            <b-field label="Department" expanded>
                <b-select v-model="deptId" :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL'])" @input="optionChanged" expanded>
                    <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
                </b-select>
            </b-field>
          </b-field>
        </div>
        <div class="is-radiusless is-clearfix box">
          <b-tabs type="is-toggle">
            <b-tab-item label="Final Summary Report">
              <SelfAppraisalSummary :apiFormType='apiFormType' :currAyId='currAyearId' :facultyList='facultyList' :deptName='deptName'/>
            </b-tab-item>
            <b-tab-item label="Partwise Summary Report">
              <SelfAppraisalPartwiseSummary :apiFormType='apiFormType' :currAyId='currAyearId' :facultyList='facultyList' :deptName='deptName'/>
            </b-tab-item>
          </b-tabs>
        </div>
    </div>
</template>
<script>
import userMxn from '@/mixin/user'
import SelfAppraisalSummary from'@/components/SelfAppraisal/report_summary'
import SelfAppraisalPartwiseSummary from'@/components/SelfAppraisal/partwise_report_summary'
import {mapState,mapGetters} from 'vuex'
            export default{
                name: 'SelfAppraisalSummaryPage',
                mixins: [userMxn],
                components: {
                  SelfAppraisalSummary,
                  SelfAppraisalPartwiseSummary
                },
                data() {
                    return {
                      currAyearId:2,
                      apiFormType:'',
                      deptId:''
                    };
                },
                computed:{
                  ...mapState([
                    'departmentList'
                  ]),
                  facultyList(){
                    return this.$store.state.employeeStore.facultyList
                  },
                  aYearList() {
                      return [{id:1,apiAyear:"2017-18",apiAyearCurrent:0},{id:2,apiAyear:"2018-19",apiAyearCurrent:1}]
                  },

                  deptName(){
                    return _.find(this.departmentList,ob=>{return ob.deptId==this.deptId})
                  }
                },
                watch:{
                  loggedInUser(){
                    this.deptId=this.loggedInUser.deptId
                    this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.deptId)
                    this.$store.dispatch('selfAppraisalStore/loadDeptSummaryList',this.deptId)
                    this.$store.dispatch('selfAppraisalStore/loadDeptResultSummaryList',this.deptId)
                  }
                },
                methods: {
                    optionChanged(dept){
                      if(this.deptId==7)
                        this.apiFormType=1
                      else if(this.deptId==10)
                        this.apiFormType=2
                      else
                        this.apiFormType=0
                      this.$store.dispatch('employeeStore/load_facultylist_by_dept',dept)
                      this.$store.dispatch('selfAppraisalStore/loadDeptSummaryList',dept)
                      this.$store.dispatch('selfAppraisalStore/loadDeptResultSummaryList',this.deptId)
                    }
                },
                mounted() {
                  this.$store.dispatch('load_dept_list')
                  if(!this.deptId)return
                  this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.deptId)
                  this.$store.dispatch('selfAppraisalStore/loadDeptSummaryList',this.deptId)
                  this.$store.dispatch('selfAppraisalStore/loadDeptResultSummaryList',this.deptId)
                }
              }
</script>
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .tablebox{
        width:80vw;
        border:2px solid lightgrey;
        /*        border:1px solid white;
                overflow-y: auto;
                overflow-x: auto;
                height:  120vh;*/
    }
</style>
