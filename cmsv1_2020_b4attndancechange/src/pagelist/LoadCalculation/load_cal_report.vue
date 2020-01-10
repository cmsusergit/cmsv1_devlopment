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
          <div class="is-radiusless is-clearfix box">
            <button @click='generateReport' class="button is-radiusless is-primary is-pulled-right" style="width:25%;">Summary Report</button>
          </div>
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
                    <tr :key="rr.loadCalcDeptId" v-for="(rr,index) in record.loadcalcDepts">
                      <td>{{index+1}}</td>
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
                    <tr v-if="loadCalcOb.deptId!=rr.assignDeptId" :key="rr.loadCalcDeptId" v-for="(rr,index) in record.loadcalcDepts">
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
                    <tr v-if="record.loadcalcDepts" :key="index" v-for="(rr,index) in record.loadcalcDepts">
                      <td>{{index+1}}</td>
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
        return _.sortBy(this.$store.getters['loadCalcStore/getLoadCalculation'],['courseId','semId'])
      },









      loadCalculationInOther(){
        return  _.sortBy(_.filter(this.$store.getters['loadCalcStore/getLoadCalculationInOther'],ob=>{return ob.loadcalcDepts && ob.loadcalcDepts.length>0}),['deptId','courseId','semId'])
      },
      getCourseById(){
        return id=>this.courseList.find(tt=>tt.courseId==id)
      },
      getDeptById(){
        return id=>this.$store.getters['getDeptNameById'](id)
      },
      getSubjectById(){
        return id=>this.$store.getters['subjectStore/getSubjectById'](id)
      },
      loadCalculationByOther(){
        if(!this.loadCalculation)return
        let temp=[]
        JSON.parse(JSON.stringify(this.loadCalculation)).map(record=>{
          const tt=_.filter(record.loadcalcDepts,ob=>{return this.loadCalcOb.deptId!=ob.assignDeptId})
          if(tt && tt.length>0){
            record.loadcalcDepts=tt
            temp.push(record)
          }
        })
        console.log(JSON.stringify(temp));
        return temp
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
      getByOtherIndx(indx,index){
        let temp=indx==0?0:indx-1
        return
      },
      optionChanged(){
        this.load_calculation()
      },
      load_calculation(){
        if(!this.loadCalcOb.ayId || !this.loadCalcOb.deptId)return;
        this.$store.dispatch('loadCalcStore/load_dept_calculation',this.loadCalcOb)
        this.$store.dispatch('loadCalcStore/load_dept_calculation_in_other',this.loadCalcOb)
      },
      generateReport(){
        let reportHeading={margin:[10,20,10,2],style:'subheader',

          columns:[{alignment:'left',text:"Academic Year: "+this.aYearList.find(ob=>ob.ayId==this.loadCalcOb.ayId).ayBatchYear},{alignment:'right',text:"Department: "+this.getDeptById(this.loadCalcOb.deptId).deptName}]}
          let tempTitle1={
            margin:[10,20,10,2],style:'subheader',
            columns:[{alignment:'center',text:"Weekly Teaching Load Calculation of Department "+this.getDeptById(this.loadCalcOb.deptId).deptName}]
          }
        let reportTable=[]


          reportTable.push([{fillColor:'#dde',alignment:'center',text:'Sr.'},
          {alignment:'center',fillColor:'#dde',text:'Sem'},
          {fillColor:'#dde',alignment:'center',text:'Course'},
          {fillColor:'#dde',alignment:'center',text:'Subject Code'},
          {fillColor:'#dde',alignment:'center',text:'Subject Name'},
          {fillColor:'#dde',alignment:'center',text:'Total Hrs.'},
          {fillColor:'#dde',alignment:'center',text:'Department'}])
          this.loadCalculation.map((ob,indx)=>{
            ob.loadcalcDepts.map((record,ii)=>{
                const sub1=this.getSubjectById(record.subId)
                reportTable.push([{alignment:'center',text:ii+1},
                  {alignment:'center',text:ob.semId},
                  {alignment:'center',text:this.getCourseById(ob.courseId).courseAlias},
                  {alignment:'center',text:(sub1&&sub1.subCode)?sub1.subCode:'-'},
                  {alignment:'justify',text:(sub1&&sub1.subName)?sub1.subName:'-'},
                  {alignment:'center',text:record.subthHrs*record.totClass+record.subprHrs*record.totBatches+record.subtutHrs*record.totBatches},
                  {alignment:'center',text:this.getDeptById(record.assignDeptId).deptAlias}
                ])
              })
              reportTable.push([{fillColor:'lightgrey',text:`Total ${this.getCourseById(ob.courseId).courseAlias} Sem:${ob.semId}`,alignment:'right',colSpan:5},{},{},{},{},{text:ob.semTotal,fillColor:'lightgrey',alignment:'center',colSpan:2}])
            })
            if(!this.loadCalculation || this.loadCalculation.length==0){
              reportTable.push([{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'}])
            }
            reportTable.push([{fillColor:'grey',text:`Total(Hrs.)`,alignment:'right',colSpan:5},{},{},{},{},{text:this.totalLoadOfDept,fillColor:'grey',alignment:'center',colSpan:2}])
            let tempTitle2={
              margin:[10,20,10,2],style:'subheader',
              columns:[{alignment:'center',text:"Load Taken By Other Department In "+this.getDeptById(this.loadCalcOb.deptId).deptName}]
            }
            let loadByOtherTable=[]
            loadByOtherTable.push([{fillColor:'#dde',alignment:'center',text:'Sr.'},
            {alignment:'center',fillColor:'#dde',text:'Sem'},
            {fillColor:'#dde',alignment:'center',text:'Course'},
            {fillColor:'#dde',alignment:'center',text:'Subject Code'},
            {fillColor:'#dde',alignment:'center',text:'Subject Name'},
            {fillColor:'#dde',alignment:'center',text:'Total Hrs.'},
            {fillColor:'#dde',alignment:'center',text:'Department'}])
            this.loadCalculationByOther.map((ob,indx)=>{
              ob.loadcalcDepts.map((record,ii)=>{
                  const sub1=this.getSubjectById(record.subId)
                  loadByOtherTable.push([
                    {alignment:'center',text:ii+1},
                    {alignment:'center',text:ob.semId},
                    {alignment:'center',text:this.getCourseById(ob.courseId).courseAlias},
                    {alignment:'center',text:(sub1&&sub1.subCode)?sub1.subCode:'-'},
                    {alignment:'justify',text:(sub1&&sub1.subName)?sub1.subName:'-'},
                    {alignment:'center',text:record.subthHrs*record.totClass+record.subprHrs*record.totBatches+record.subtutHrs*record.totBatches},
                    {alignment:'center',text:this.getDeptById(record.assignDeptId).deptAlias}
                  ])
                })
              })
              if(!this.loadCalculationByOther || this.loadCalculationByOther.length==0){
                loadByOtherTable.push([{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'}])
              }
              loadByOtherTable.push([{fillColor:'grey',text:`Total(Hrs.)`,alignment:'right',colSpan:5},{},{},{},{},{text:this.totalLoadByOther,fillColor:'grey',alignment:'center',colSpan:2}])
              let tempTitleInOther={
                margin:[10,20,10,2],style:'subheader',
                columns:[{alignment:'center',text:"Load Taken By Department "+this.getDeptById(this.loadCalcOb.deptId).deptName+" In Other Department"}]
              }
              let loadInOtherTable=[]
              loadInOtherTable.push([{fillColor:'#dde',alignment:'center',text:'Sr.'},
              {fillColor:'#dde',alignment:'center',text:'Department'},
              {fillColor:'#dde',alignment:'center',text:'Course'},
              {alignment:'center',fillColor:'#dde',text:'Sem'},
              {fillColor:'#dde',alignment:'center',text:'Subject Code'},
              {fillColor:'#dde',alignment:'center',text:'Subject Name'},
              {fillColor:'#dde',alignment:'center',text:'Total Hrs.'}
              ])
              this.loadCalculationInOther.map((ob,indx)=>{
                ob.loadcalcDepts.map((record,ii)=>{
                    const sub1=this.getSubjectById(record.subId)
                    loadInOtherTable.push([
                      {alignment:'center',text:ii+1},
                      {alignment:'center',text:this.getDeptById(ob.deptId).deptAlias},
                      {alignment:'center',text:this.getCourseById(ob.courseId).courseAlias},
                      {alignment:'center',text:ob.semId},
                      {alignment:'center',text:(sub1&&sub1.subCode)?sub1.subCode:'-'},
                      {alignment:'justify',text:(sub1&&sub1.subName)?sub1.subName:'-'},
                      {alignment:'center',text:record.subthHrs*record.totClass+record.subprHrs*record.totBatches+record.subtutHrs*record.totBatches},
                    ])
                  })
                })
                if(!this.loadCalculationInOther || this.loadCalculationInOther.length==0){
                  loadInOtherTable.push([{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'},{text:'-'}])
                }
                loadInOtherTable.push([{fillColor:'grey',text:`Total(Hrs.)`,alignment:'right',colSpan:5},{},{},{},{},{text:this.totalLoadInOther,fillColor:'grey',alignment:'center',colSpan:2}])
                let tempTitle={
                  margin:[10,20,10,2],style:'subheader',
                  columns:['']
                }
                let totalLoadTable=[
                        [{alignment:'right',fillColor:'#eedddd',text:"Teaching Load Of Department(A)"},{alignment:'center',fillColor:'#eedddd',text:this.totalLoadOfDept}],
                        [{alignment:'right',fillColor:'#eedddd',text:'Load taken By Other Department(B)'},{alignment:'center',fillColor:'#eedddd',text:this.totalLoadByOther}],
                        [{alignment:'right',fillColor:'#eedddd',text:'Load taken By Department In Other Departments(C)'},{alignment:'center',fillColor:'#eedddd',text:this.totalLoadInOther}],
                        [{alignment:'right',fillColor:'#eedddd',text:'Total Load Taken By Department(Hrs.)'},{alignment:'center',fillColor:'#eedddd',text:(this.totalLoadOfDept-this.totalLoadByOther+this.totalLoadInOther)}]
                      ]
              let reportDefination=[
                {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'},
                  reportHeading
                ]
                if(reportTable && reportTable.length>0){
                  reportDefination.push(tempTitle1)
                  reportDefination.push(
                      {
                        table:{
                          headerRows:1,
                          widths:[20,25,40,70,'*',50,'auto'],
                          body:reportTable
                        }
                      })
                }
                if(loadByOtherTable && loadByOtherTable.length>0){
                  reportDefination.push(tempTitle2)
                  reportDefination.push(
                    {
                    table:{
                        headerRows:1,
                        widths:[20,25,40,70,'*',50,'auto'],
                        body:loadByOtherTable

                      }
                  })
                }
                if(loadInOtherTable && loadInOtherTable.length>0){
                    reportDefination.push(tempTitleInOther)
                    reportDefination.push(
                      {
                      table:{
                          headerRows:1,
                          widths:[20,70,'auto',20,50,'*',50],
                          body:loadInOtherTable
                        }
                      })
                    }
                    reportDefination.push(tempTitle)
                    reportDefination.push(
                      {
                      table:{
                          widths:['*','*'],
                          body:totalLoadTable
                        }
                      })
          var pdfMake = require('pdfmake/build/pdfmake.js')
          if (pdfMake.vfs == undefined){
            var pdfFonts = require('pdfmake/build/vfs_fonts.js')
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
          }
          pdfMake.createPdf({pageOrientation:this.pageOrientation,
            content:reportDefination,
            defaultStyle:{fontSize:11}
          }).open()
      },
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
