<template>
    <div style="height:100%;" class="dashboard boxbg">

        <div class="box is-radiusless" style="width:100%;">
          <h1 class="level-left is-size-4 title">LoadCalculation Report</h1>
          <b-field grouped>
            <b-field label="Academic Year" expanded>
                <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','HOD'])" v-model="loadCalcOb.ayId" expanded>
                    <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                </b-select>
            </b-field>


              <b-field label="Department" expanded>
                  <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','HOD'])" v-model='loadCalcOb.deptId' @input="optionChanged" expanded>
                    <option v-for="dp in departmentList" :value="dp.deptId">{{dp.deptName}}</option>
                  </b-select>
              </b-field>
            </b-field>
          <div>
          <div class="is-radiusless box" style="margin-top:.5em;">
                <p class="is-size-5 has-text-weight-bold" style="margin-bottom:.5em;">Weekly Teaching Load Calculation Of Department</p>

                <table class="table is-fullwidth is-bordered">
                  <thead style="background-color:ivory;color:rgb(0,0,25);">
                    <tr>
                      <th rowspan="2">Sr.</th>
                      <th rowspan="2">Sem</th>
                      <th rowspan="2">Course</th>
                      <th rowspan="2">Subject Code</th>
                      <th rowspan="2">Subject Name</th>
                      <th colspan="3">Teaching Scheme</th>
                      <th rowspan="2" width="50">Number Of Classes</th>
                      <th rowspan="2" width="50">Number Of Batches</th>
                      <th  colspan="4">Total Hrs.</th>
                      <th rowspan="2" width="110">Dept.</th>
                    </tr>
                    <tr>
                      <th width="50">Th.(Hrs.)</th>
                      <th width="50">Pr.(Hrs.)</th>
                      <th width="50">Tut.(Hrs.)</th>
                      <th width="50">Th.(Hrs.)</th>
                      <th width="50">Pr.(Hrs.)</th>
                      <th width="50">Tut.(Hrs.)</th>
                      <th width="50">Total(Hrs.)</th>
                    </tr>
                  </thead>
                  <template v-for="(record,indx) in loadCalculation">
                    <tr :key="getIndx(indx,index)" v-for="(rr,index) in record.loadcalcDepts">
                      <td>{{getIndx(indx,index)}}</td>
                      <td>{{record.semId}}</td>
                      <td>{{getCourseById(record.courseId).courseAlias}}</td>
                      <td>{{getSubjectById(rr.subId).subCode}}</td>
                      <td style="text-align:left;">{{getSubjectById(rr.subId).subName}}</td>
                      <td>{{rr.subthHrs}}</td>
                      <td>{{rr.subprHrs}}</td>
                      <td>{{rr.subtutHrs}}</td>
                      <td>{{rr.totClass}}</td><td>{{rr.totBatches}}</td>
                      <td>{{rr.subthHrs*rr.totClass}}</td>
                      <td>{{rr.subprHrs*rr.totBatches}}</td>
                      <td>{{rr.subtutHrs*rr.totBatches}}</td>
                      <td>{{rr.subthHrs*rr.totClass+rr.subprHrs*rr.totBatches+rr.subtutHrs*rr.totBatches}}</td>
                      <td>{{getDeptById(rr.assignDeptId).deptAlias}}</td>
                    </tr>
                      <tr style="background-color:ivory;color:rgb(0,0,50)">
                        <td style="font-weight:bold;text-align:right;" colspan="10">Total Load For {{getCourseById(record.courseId).courseAlias}}({{record.semId}})</td>
                        <td class="has-text-weight-bold" colspan="5">{{record.semTotal}}</td>
                      </tr>
                  </template>
                    <tr style="background-color:mistyrose;color:rgb(0,0,50)">
                      <td colspan="10" style="text-align:right;font-weight:bold;">Total Load Of Dept. taken By Dept.</td>
                      <td colspan="5" style="font-weight:bold;">{{totalLoadOfDept}}</td>
                    </tr>
                </table>
            </div>


            <p :key="indx" v-for="(rr,indx) in loadCalculationByOther" :style="{color:rr%2==0?'grey':'blue'}">{{rr}}</p>
            <div class="is-radiusless box" style="margin-top:.5em;">
                <p class="is-size-5 has-text-weight-bold" style="margin-bottom:.5em;">Load taken By Other Department</p>
                <table class="table is-fullwidth is-bordered">
                  <thead style="background-color:ivory;color:rgb(0,0,25);">
                    <tr>
                      <th rowspan="2">Sr.</th>
                      <th rowspan="2">Sem</th>
                      <th rowspan="2">Course</th>
                      <th rowspan="2">Subject Code</th>
                      <th rowspan="2">Subject Name</th>
                      <th colspan="3">Teaching Scheme</th>
                      <th rowspan="2" width="50">Number Of Classes</th>
                      <th rowspan="2" width="50">Number Of Batches</th>
                      <th  colspan="4">Total Hrs.</th>
                      <th rowspan="2" width="50">Assigned To Dept.</th>
                    </tr>
                    <tr>
                      <th width="50">Th.(Hrs.)</th>
                      <th width="50">Pr.(Hrs.)</th>
                      <th width="50">Tut.(Hrs.)</th>
                      <th width="50">Th.(Hrs.)</th>
                      <th width="50">Pr.(Hrs.)</th>
                      <th width="50">Tut.(Hrs.)</th>
                      <th width="50">Total(Hrs.)</th>
                    </tr>
                  </thead>
                  <template v-for="(record,indx) in loadCalculationByOther">
                    <tr v-if="record.loadcalcDepts" :key="getByOtherIndx(indx,index)" v-for="(rr,index) in record.loadcalcDepts">
                      <td>{{getByOtherIndx(indx,index)}}</td>
                      <td>{{record.semId}}</td>
                      <td>{{getCourseById(record.courseId).courseAlias}}</td>
                      <td>{{getSubjectById(rr.subId).subCode}}</td>
                      <td style="text-align:left;">{{getSubjectById(rr.subId).subName}}</td>
                      <td>{{rr.subthHrs}}</td>
                      <td>{{rr.subprHrs}}</td>
                      <td>{{rr.subtutHrs}}</td>
                      <td>{{rr.totClass}}</td><td>{{rr.totBatches}}</td>

                      <td>{{rr.subthHrs*rr.totClass}}</td>
                      <td>{{rr.subprHrs*rr.totBatches}}</td>
                      <td>{{rr.subtutHrs*rr.totBatches}}</td>
                      <td>{{rr.subthHrs*rr.totClass+rr.subprHrs*rr.totBatches+rr.subtutHrs*rr.totBatches}}</td>
                      <td>{{getDeptById(rr.assignDeptId).deptAlias}}</td>
                    </tr>
                  </template>
                    <tr style="background-color:mistyrose;font-size:100%;">
                      <td colspan="10" style="text-align:right;font-weight:bold;">Total Load Of Dept. taken By Other Dept.</td>
                      <td colspan="5" style="font-weight:bold;">{{totalLoadByOther}}</td>
                    </tr>
                </table>
            </div>
            <div class="is-radiusless box" style="margin-top:.5em;">
                <p class="is-size-5 has-text-weight-bold" style="margin-bottom:.5em;">Load taken By Department In Other Departments</p>
                <table class="table is-fullwidth is-bordered">
                  <thead style="background-color:ivory;color:rgb(0,0,20);">
                    <tr>
                      <th rowspan="2">Sr.</th>
                      <th rowspan="2">Sem</th>
                      <th rowspan="2">Course</th>
                      <th rowspan="2">Subject Code</th>
                      <th rowspan="2">Subject Name</th>
                      <th colspan="3">Teaching Scheme</th>
                      <th rowspan="2" width="50">Number Of Classes</th>
                      <th rowspan="2" width="50">Number Of Batches</th>
                      <th  colspan="4">Total Hrs.</th>
                      <th rowspan="2" width="50">Dept.</th>
                    </tr>
                    <tr>
                      <th width="50">Th.(Hrs.)</th>
                      <th width="50">Pr.(Hrs.)</th>
                      <th width="50">Tut.(Hrs.)</th>
                      <th width="50">Th.(Hrs.)</th>
                      <th width="50">Pr.(Hrs.)</th>
                      <th width="50">Tut.(Hrs.)</th>
                      <th width="50">Total(Hrs.)</th>
                    </tr>
                  </thead>
                  <template v-for="(record,indx) in loadCalculationInOther">
                    <tr v-if="record.loadcalcDepts" :key="getInOtherIndx(indx,index)" v-for="(rr,index) in record.loadcalcDepts">
                      <td>{{getInOtherIndx(indx,index)}}</td>
                      <td>{{record.semId}}</td>
                      <td>{{getCourseById(record.courseId).courseAlias}}</td>
                      <td>{{getSubjectById(rr.subId).subCode}}</td>
                      <td style="text-align:left;">{{getSubjectById(rr.subId).subName}}</td>
                      <td>{{rr.subthHrs}}</td>
                      <td>{{rr.subprHrs}}</td>
                      <td>{{rr.subtutHrs}}</td>
                      <td>{{rr.totClass}}</td>
                      <td>{{rr.totBatches}}</td>
                      <td>{{rr.subthHrs*rr.totClass}}</td>
                      <td>{{rr.subprHrs*rr.totBatches}}</td>
                      <td>{{rr.subtutHrs*rr.totBatches}}</td>
                      <td>{{rr.subthHrs*rr.totClass+rr.subprHrs*rr.totBatches+rr.subtutHrs*rr.totBatches}}</td>
                      <td>{{getDeptById(record.deptId).deptAlias}}</td>
                    </tr>
                  </template>
                    <tr style="background-color:mistyrose;font-size:100%;">
                      <td colspan="10" style="text-align:right;font-weight:bold;">Total Load Of Dept. taken By Other Dept.</td>
                      <td colspan="5" style="font-weight:bold;">{{totalLoadInOther}}</td>
                    </tr>
                </table>
            </div>
              <div class="is-radiusless box" style="margin-top:.5em;">
                <p class="is-size-5 has-text-weight-bold" style="margin-bottom:.5em;">Total Load taken By Department</p>
                <table class="table is-bordered is-fullwidth totalRow">
                  <tr>
                    <td>Teaching Load Calculation Of Department(A)</td>
                    <td>{{totalLoadOfDept}}</td></tr>
                  <tr>
                    <td>Load taken By Other Department(B)</td>
                    <td>{{totalLoadByOther}}</td>
                  </tr>
                  <tr>
                    <td>Load taken By Department In Other Departments(C)</td><td>{{totalLoadInOther}}</td>
                  </tr>
                  <tr style="background-color:mistyrose;color:rgb(0,0,20);">
                    <td>Total Load(A-B+C)</td><td>{{totalLoadOfDept-totalLoadByOther+totalLoadInOther}}</td>
                  </tr>
                </table>
              </div>
        </div>
    </div>
    </div>
</template>
<script>
import _ from 'lodash'
import userMxn from '@/mixin/user'
import {mapState} from 'vuex'
export default{
    name: 'LoadCalculationReport',
    data() {
        return {


          totalLoadOfDept:0,
          totalLoadInOther:0,
          totalLoadByOther:0,
          loadCalcOb:{ayId:'',deptId:''}
        }
    },
    mixins: [userMxn],
    computed:{
      ...mapState([//....
              'departmentList', 'courseList'
      ]),
      aYearList() {
          return this.$store.state.acadyearStore.acadyearList
      },
      subjectList() {
          return this.$store.state.subjectStore.subjectList;
      },

      loadCalculation(){
        let temp=this.$store.getters['loadCalcStore/getLoadCalculation']
        return temp
      },
      loadCalculationInOther(){
        return this.$store.getters['loadCalcStore/getLoadCalculationInOther']
      },
      loadCalculationByDept(){
        if(this.loadCalculation){
          let temp=JSON.parse(JSON.stringify(this.loadCalculation))
          _.map(temp,ob=>{
            ob.loadcalcDepts=ob.loadcalcDepts.filter(tt=>tt.assignDeptId!=this.loadCalcOb.deptId)
          })
          return temp
        }
      },

      loadCalculationByOther(){
        if(this.loadCalculation){
              let temp=JSON.parse(JSON.stringify(this.loadCalculation))
              _.map(temp,ob=>{
                  const t1=ob.loadcalcDepts.filter(tt=>
                    {return tt.assignDeptId!=this.loadCalcOb.deptId})
                    if(t1 && t1.length>0)
                      temp.push(ob)
              })
              return temp
        }else null
      },
      getCourseById(){
        return id=>this.courseList.find(tt=>tt.courseId==id)
      },
      getDeptById(){
        return id=>this.$store.getters['getDeptNameById'](id)
      },
      getSubjectById(){
        return id=>this.$store.getters['subjectStore/getSubjectById'](id)
      }
    },
    watch:{
      loadCalculation(){
        this.totalLoadOfDept=0
        this.totalLoadByOther=0
        this.loadCalculation.map(ob=>{
          ob.semTotal=0
          ob.loadcalcDepts.map(record=>{
            if(record.assignDeptId!=this.loadCalcOb.deptId){
              this.totalLoadByOther+=record.subthHrs*record.totClass+record.subprHrs*record.totBatches+record.subtutHrs*record.totBatches
            }
            const temp=record.subthHrs*record.totClass+record.subprHrs*record.totBatches+record.subtutHrs*record.totBatches
            ob.semTotal+=temp
            this.totalLoadOfDept+=temp
          })
        })
      },
      loadCalculationInOther(){
        this.totalLoadInOther=0
        this.loadCalculationInOther.map(ob=>{
          ob.loadcalcDepts.map(record=>{
              this.totalLoadInOther+=record.subthHrs*record.totClass+record.subprHrs*record.totBatches+record.subtutHrs*record.totBatches
          })
        })
      },
      currAcademicyearId(){
        this.loadCalcOb.ayId=this.currAcademicyearId
        this.load_calculation()
      },
      loggedInUser(){
        this.loadCalcOb.deptId=this.loggedInUser.deptId
        this.load_calculation()
      }
    },
    methods: {
      getInOtherIndx(indx,index){
        let temp=indx==0?0:indx-1
        return indx*(this.loadCalculationInOther[temp].loadcalcDepts.length)+index+1
      },
      getByOtherIndx(indx,index){
        let temp=indx==0?0:indx-1
        return indx*(this.loadCalculationByOther[temp].loadcalcDepts.length)+index+1
      },
      getIndx(indx,index){
        let temp=indx==0?0:indx-1

        return indx*(this.loadCalculation[temp].loadcalcDepts.length)+index+1
      },
      optionChanged(){
        this.load_calculation()
      },
      load_calculation(){
        if(!this.loadCalcOb.ayId || !this.loadCalcOb.deptId)return;
        this.$store.dispatch('loadCalcStore/load_dept_calculation',this.loadCalcOb)
        this.$store.dispatch('loadCalcStore/load_dept_calculation_in_other',this.loadCalcOb)
      }
    },
    created(){
      this.$store.dispatch('acadyearStore/load_academicyear_list')
      this.$store.dispatch('load_dept_list')
      this.$store.dispatch('load_course_list')
      this.$store.dispatch('subjectStore/LOAD_SUBJECT_LIST')
    }
}
</script>
<style scoped>
    .boxbg{
        background-color: white;
        color:white;
    }
      .totalRow{
        background-color: ivory;
        font-weight:bold;
      },
      th,td{
        font-size: 100%;
        text-align: center;
      }
      .totalRow td:nth-child(1){
        text-align: left;
        border-width: 2px;
      },
      .totalRow td{
          text-align:center ;
          border-width: 2px;
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
