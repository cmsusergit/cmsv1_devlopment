<template>
  <div class="section is-radiusless box" style="width:100%">

    <h1 class="title is-size-4">Prepare Lessonplan</h1>
    <p hidden>{{loggedInUser}}</p>
    <div class="is-radiusless box">
        <b-field grouped>
            <b-field label="Academic Year" expanded>
                <b-select v-model="lpRecord.ayId" expanded>
                    <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                </b-select>
            </b-field>

            <b-field label="Faculty Department" expanded>
                <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN'])" @input="facultyDeptChanged" v-model="facultyDeptId" expanded>
                    <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
                </b-select>
            </b-field>
        </b-field>
        <b-field grouped>
          <b-field label="Faculty Name" expanded>
              <b-select @input="optionChanged" :disabled="!isAuthorizedRoleList(['CMSADMIN'])" v-model="lpRecord.facultyId" expanded>
                  <option :value="faculty.empId" v-for="faculty in facultyList">
                    {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                  </option>
              </b-select>
          </b-field>
        <b-field label="Course" >
          <b-select @input="optionChanged" v-model="lpRecord.courseId" expanded>
            <option v-for="course in courseList" :value="course.courseId">{{course.courseName}}({{course.courseAlias}})</option>
        </b-select>
        </b-field>
        <b-field label="Department" expanded>
            <b-select @input="optionChanged" v-model="lpRecord.deptId" expanded>
                <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
            </b-select>
        </b-field>
        <b-field label="Class" >
            <b-select @input="optionChanged" v-model="lpRecord.classId" expanded>
                <option :key="indx" v-for="(cl, indx) in classList" :value="cl.classId">
                    {{cl.className}}
                </option>
            </b-select>
        </b-field>
      <b-field label="Semester">
      <b-Select @input="optionChanged" v-model="lpRecord.semId" expanded>
          <option v-for="cl in 10">{{cl}}</option>
      </b-select>
      </b-field>
      </b-field>
      <b-field label="Select Subject" >
        <b-select @input='optionChanged' v-model="lpRecord.subId" expanded>
          <option v-for="subject in subjectList" :value="subject.subId">{{subject.subName}}</option>
      </b-select>
    </b-field>
      <b-field label='Reference Books'>
          <b-input @blur="onRefBlur" maxlength="500" v-model="lpRecord.refBook" type='textarea'/>
      </b-field>
      <!--
      <b-field label='Course Objectives'>
          <b-input  type='textarea'/>
      </b-field> -->
    </div>
    <div v-if="!lessonPlan" class="is-radiusless box is-clearfix">
      <button :disabled="!lpRecord||!lpRecord.refBook||!lpRecord.facultyId||!lpRecord.classId||!lpRecord.subId" @click="addLessonPlan" class="is-pulled-right is-radiusless button is-info">Add LessonPlan</button>
    </div>
    <div v-else>
      <div class="is-radiusless is-clearfix box">
        <b-field class="is-pulled-right">
          <b-select class="is-radiusless" v-model="pageOrientation">
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </b-select>
        </b-field>
        <button @click="generateReport" class="button is-info is-radiusless is-pulled-right">LessonPlan Report</button>

        <b-checkbox v-model="isIncludeContent" type="is-info" class="is-pulled-right" style="margin-right:2em;padding:.5em;">Include Content Covered</b-checkbox>
      </div>
      <b-tabs v-model="selectedTabIndx" type="is-toggle" expanded>
        <b-tab-item label="GTU UNIT">
        <LPUnit :inputLpUnit='selectedUnit' @addUnit='addUnit' @editUnit='editUnit'></LPUnit>
        <table v-if="lpUnitList.length>0" class="table  is-paddingless is-bordered is-fullwidth">
          <thead>
            <th>Sr.</th>
            <th>GTU Unit Number</th>
            <th>GTU Unit Name</th>
            <th>GTU Unit Hrs.</th>
            <th></th>
          </thead>
          <tr :key="indx" v-for="(unit,indx) in lpUnitList">
            <td width="20">{{indx+1}}</td>
            <td width="50">{{unit.gtuUnitno}}</td>
            <td>{{unit.gtuUnitname}}</td>
            <td width="70">{{unit.gtuUnithrs}}</td>
            <td class="has-text-centered" width="20%">
              <button @click="selectedUnit=unit" class="button is-primary is-radiusless is-small" style="width:25%">Edit</button>
              <button @click="removeUnit(indx)" class="button is-danger is-radiusless is-small" style="width:25%">Delete</button>
              <button @click="nextToTopic(unit)" class="button is-info is-radiusless is-small">TopicList</button>
            </td>
          </tr>
        </table>
        </b-tab-item>
        <b-tab-item label="GTU TOPIC" disabled>
          <LPTopic @gotoUnitList="selectedTabIndx=0" :lpUnit='selectedUnit'/>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import LPUnit from '@/components/lessonplan/lpunit'
import LPTopic from '@/components/lessonplan/lptopic'

import userMxn from '@/mixin/user'
import {mapState} from 'vuex'
import config from "@/../static/test1.json";
export default {
  name:"LessonPlan",
  components: {
    LPUnit,
    LPTopic
  },
  mixins: [userMxn],
  props: ['selectedLP'],
  data(){
    return {
      isIncludeContent:false,
      selectedUnit:'',
      facultyDeptId:'',
      selectedTabIndx:0,
      deptId:'',
      lpRecord:{lpId:0,facultyId:0,deptId:0,courseId:1,subId:0},
      lessonPlan:'',
      lpUnitList:[],
      pageOrientation:'landscape'
    }
  },
  computed: {
      ...mapState([//....
        'courseList',
        'classList',
        'departmentList']),
        subjectList() {
            return this.$store.state.subjectStore.subjectList;
        },
        aYearList() {
            return this.$store.state.acadyearStore.acadyearList
        },
        facultyList(){
          return this.$store.state.employeeStore.facultyList
        }
  },
  watch: {
    currAcademicyearId(){
      this.lpRecord.ayId=this.currAcademicyearId
    },
    loggedInUser(){
      this.facultyDeptId=this.loggedInUser.deptId
      this.lpRecord.deptId=this.loggedInUser.deptId
      this.lpRecord.facultyId=this.loggedInUser.empId
    }
  },
  mounted() {
      this.$store.dispatch('load_dept_list');
      this.$store.dispatch('acadyearStore/load_academicyear_list')
      this.$store.dispatch('load_course_list')
      if(this.facultyDeptId){
          this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.facultyDeptId)
      }
      if(this.selectedLP){
        this.lpRecord=JSON.parse(JSON.stringify(this.selectedLP))
      }
      if(this.lpRecord.deptId){
          this.$store.dispatch('load_class_list_by_dept', this.lpRecord.deptId);
          const ob={
            dept:this.lpRecord.deptId,
            course:this.lpRecord.courseId,
            sem:this.lpRecord.semId
          }
          this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
      }
  },
  methods: {
    generateReportWithContentCovered(){
      const detail={
        ayId:this.lessonPlan.ayId,
        subjectId:this.lessonPlan.subId,
        classId:this.lessonPlan.classId,
        facultyId:this.lessonPlan.facultyId
      }
      this.$store.dispatch('lessonPlanStore/getScheduleListForReport',detail)
        .then(response=>{
          let scheduleList=[]
          response.map(record=>{
            if(record.timetableRecordInfo){
              scheduleList.push({date:record.csDateConducted,presentCount:record.attndanceInfos.length,content:record.csContentCovered})
            }
          })
          this.generateReportWithContentCovered1(scheduleList)
        })
        .catch(error=>{
        })
      },
      generateReportWithContentCovered1(scheduleList){
        const ayear=this.$store.getters['acadyearStore/getAcademicyearById'](this.lpRecord.ayId).ayBatchYear
        const faculty=this.$store.getters['employeeStore/facultyNameById'](this.lpRecord.facultyId)
        let facultyName='-'
        if(faculty)
          facultyName=faculty.title+" "+faculty.firstName+" "+faculty.middleName+" "+faculty.lastName
        const subjectName=this.$store.getters['subjectStore/getSubjectById'](this.lpRecord.subId).subName
        let className=this.classList.find(ob=>ob.classId==this.lpRecord.classId).className
        let reportHeading={margin:[10,20,10,2],style:'subheader',
          columns:[{alignment:'left',text:"Academic Year: "+ayear},{alignment:'right',text:"Faculty Name: "+facultyName}]}
        let reportHeading1={margin:[10,2,10,20],style:'subheader',
          columns:[{alignment:'left',text:"Subject: "+subjectName},{alignment:'center',text:"Sem: "+this.lpRecord.semId},{alignment:'right',text:"ClassName: "+className}]}
        let reportTable=[]
          reportTable.push([{fillColor:'#dde',alignment:'center',text:'Sr.'},{alignment:'center',fillColor:'#dde',text:'Unit Number\nName of Unit\nHrs. Alloted by GTU'},
          {fillColor:'#dde',alignment:'center',text:'Lecture Number'},
          {fillColor:'#dde',alignment:'center',text:'Topics'},
          {fillColor:'#dde',alignment:'center',text:'Teaching Method'},
          {fillColor:'#dde',alignment:'center',text:'Teaching Aid'},
          {fillColor:'#dde',alignment:'center',text:'Online Posts\n(Y/N)'},
          {fillColor:'#dde',alignment:'center',text:'Actual Date'},
          {fillColor:'#dde',alignment:'center',text:'Number Of Students Present'},
          {fillColor:'#dde',alignment:'center',text:'Content Covered'}
        ])
          let count=0
          let scheduleListIndx=0
          this.lpUnitList.map((ob,indx)=>{
            if(ob.topicList)
              ob.topicList.map((topic,ii)=>{
                  count=count+1
                  const schedule=scheduleList[scheduleListIndx]
                  scheduleListIndx=scheduleListIndx+1
                  if(ii==0)
                    reportTable.push([{rowSpan:ob.topicList.length,alignment:'center',text:indx+1},
                    {rowSpan:ob.topicList.length,alignment:'center',text:ob.gtuUnitno+'\n'+ob.gtuUnitname+'\n'+ob.gtuUnithrs},
                    {alignment:'center',text:count},
                    {alignment:'justify',text:topic.topic},
                    {alignment:'center',text:topic.tMethod},
                    {alignment:'center',text:topic.tAid},
                    {alignment:'center',text:topic.onlinePost?'Y':'N'},
                    {alignment:'center',text:schedule?new Date(schedule.date).toDateString():''},
                    {alignment:'center',text:schedule?schedule.presentCount:''},
                    {alignment:'center',text:schedule?schedule.content:''}
                  ])
                  else
                    reportTable.push(['','',
                    {alignment:'center',text:count},
                    {alignment:'justify',text:topic.topic},
                    {alignment:'center',text:topic.tMethod},
                    {alignment:'center',text:topic.tAid},
                    {alignment:'center',text:topic.onlinePost?'Y':'N'},
                    {alignment:'center',text:schedule?new Date(schedule.date).toDateString():''},
                    {alignment:'center',text:schedule?schedule.presentCount:''},
                    {alignment:'center',text:schedule?schedule.content:''}
                  ])
              })
          })
        let reportDefination=[
          {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'},
            reportHeading,
            reportHeading1,
            {
            table:{
                headerRows:1,
                widths:[40,80,40,'*',80,80,40,'auto',50,'*'],
                body:reportTable
              }
            },
            {margin:[10,10,20,20],text:'References:\n'+ this.lpRecord.refBook},{margin:[20,40,20,40],alignment:'right',text:'Signature'}
          ]

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
    generateReport(){
      if(this.isIncludeContent){
          this.generateReportWithContentCovered()
          return;
      }
      const ayear=this.$store.getters['acadyearStore/getAcademicyearById'](this.lpRecord.ayId).ayBatchYear
      const faculty=this.$store.getters['employeeStore/facultyNameById'](this.lpRecord.facultyId)
      let facultyName='-'
      if(faculty)
        facultyName=faculty.title+" "+faculty.firstName+" "+faculty.middleName+" "+faculty.lastName
      const subjectName=this.$store.getters['subjectStore/getSubjectById'](this.lpRecord.subId).subName
      let className=this.classList.find(ob=>ob.classId==this.lpRecord.classId).className
      let reportHeading={margin:[10,20,10,2],style:'subheader',
        columns:[{alignment:'left',text:"Academic Year: "+ayear},{alignment:'right',text:"Faculty Name: "+facultyName}]}
      let reportHeading1={margin:[10,2,10,20],style:'subheader',
        columns:[{alignment:'left',text:"Subject: "+subjectName},{alignment:'center',text:"Sem: "+this.lpRecord.semId},{alignment:'right',text:"ClassName: "+className}]}
      let reportTable=[]
        reportTable.push([{fillColor:'#dde',alignment:'center',text:'Sr.'},{alignment:'center',fillColor:'#dde',text:'Unit Number\nName of Unit\nHrs. Alloted by GTU'},
        {fillColor:'#dde',alignment:'center',text:'Lecture Number'},
        {fillColor:'#dde',alignment:'center',text:'Topics'},
        {fillColor:'#dde',alignment:'center',text:'Teaching Method'},
        {fillColor:'#dde',alignment:'center',text:'Teaching Aid'},{fillColor:'#dde',alignment:'center',text:'Online Posts\n(Y/N)'}])
        let count=0
        this.lpUnitList.map((ob,indx)=>{
          if(ob.topicList)
            ob.topicList.map((topic,ii)=>{
                count=count+1
                if(ii==0)
                  reportTable.push([{rowSpan:ob.topicList.length,alignment:'center',text:indx+1},
                  {rowSpan:ob.topicList.length,alignment:'center',text:ob.gtuUnitno+'\n'+ob.gtuUnitname+'\n'+ob.gtuUnithrs},
                  {alignment:'center',text:count},
                  {alignment:'justify',text:topic.topic},
                  {alignment:'center',text:topic.tMethod},
                  {alignment:'center',text:topic.tAid},
                  {alignment:'center',text:topic.onlinePost?'Y':'N'}])
                else
                  reportTable.push(['','',
                  {alignment:'center',text:count},
                  {alignment:'justify',text:topic.topic},
                  {alignment:'center',text:topic.tMethod},
                  {alignment:'center',text:topic.tAid},
                  {alignment:'center',text:topic.onlinePost?'Y':'N'}])
            })
        })
      let reportDefination=[
        {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'},
          reportHeading,
          reportHeading1,
          {
          table:{
              headerRows:1,
              widths:[40,80,40,'*',80,80,40],
              body:reportTable
            }
          },
          {margin:[10,10,20,20],text:'References:\n'+ this.lpRecord.refBook},{margin:[20,40,20,40],alignment:'right',text:'Signature'}
        ]

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
    nextToTopic(unit){
      this.selectedTabIndx=1
      this.selectedUnit=unit
    },
    loadLessonPlan(){
      if(!this.lpRecord.facultyId||!this.lpRecord.courseId || !this.lpRecord.subId ||!this.lpRecord.semId || !this.lpRecord.classId){
			return;
		}
      const ob={
        facultyId: this.lpRecord.facultyId,
        deptId: this.lpRecord.deptId,
        courseId: this.lpRecord.courseId,
        subId: this.lpRecord.subId,
        ayId: this.lpRecord.ayId,
        semId: this.lpRecord.semId,
        classId: this.lpRecord.classId
      }
      this.$store.dispatch('lessonPlanStore/load_lessonplan',ob)
      .then(rr=>{
        this.lessonPlan=rr
        this.lpRecord.refBook=this.lessonPlan.refBook
        if(this.lessonPlan){
            this.loadLpunitList(this.lessonPlan.lpId)
        }
      })
      .catch(error=>{
        this.lessonPlan=null
        this.$buefy.toast.open({
                    duration: 5500,
                    message: error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
        })
      })
    },
    loadLpunitList(id){
      this.$store.dispatch('lessonPlanStore/load_lessonplan_unit',id)
      .then(rr=>{
        this.lpUnitList=rr
        for (let indx = 0; indx < this.lpUnitList.length;indx++) {
          this.loadLptopicList(this.lpUnitList[indx])
        }
      })
      .catch(error=>{
        this.lpUnitList=null
        console.log('****',error);
      })
    },
    loadLptopicList(unit){
      this.$store.dispatch('lessonPlanStore/load_lessonplan_topic',unit.unitId)
      .then(rr=>{
        this.$set(unit,'topicList',rr)
      })
      .catch(error=>{
        console.log('****',error);
        return null;
      })
    },
    facultyDeptChanged(){
      this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.facultyDeptId)
    },
    deptChanged(){
      this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.lpRecord.deptId)
      this.$store.dispatch('load_class_list_by_dept', this.lpRecord.deptId)
    },
    optionChanged(){
      this.$store.dispatch('load_class_list_by_dept', this.lpRecord.deptId)
      const ob={
        dept:this.lpRecord.deptId,
        course:this.lpRecord.courseId,
        sem:this.lpRecord.semId
      }
      this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
      this.loadLessonPlan()
    },
    addLessonPlan() {
      this.lpRecord.lpId=0
      this.$store.dispatch('lessonPlanStore/add_lessonplan',this.lpRecord)
        .then(rr=>{
          this.$buefy.toast.open({
              duration: 5500,
              message: "LessonPlan Added",
              position: 'is-top',
              type: 'is-success'
          })
          this.loadLessonPlan()
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
    addUnit(unit){
        unit.lpId=this.lessonPlan.lpId
        this.$store.dispatch('lessonPlanStore/add_lessonplan_unit',unit)
          .then(response=>{
            this.$buefy.toast.open({
                        duration: 5500,

                        message: "Unit Added",
                        position: 'is-top',
                        type: 'is-success'
                      })
              this.lpUnitList.push(response)
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
    editUnit(unit){
        this.$store.dispatch('lessonPlanStore/edit_lessonplan_unit',unit)
          .then(response=>{
            this.$buefy.toast.open({
                        duration: 5500,
                        message: "Unit Updated",
                        position: 'is-top',
                        type: 'is-success'
                      })
              let index=-1
              this.lpUnitList.map((ob,indx)=>{
                if(ob.unitId==unit.unitId)
                  index=indx
                })
              this.$set(this.lpUnitList,index,response)
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
    removeUnit(indx){
      this.$store.dispatch('lessonPlanStore/remove_lessonplan_unit',this.lpUnitList[indx].unitId)
        .then(rr=>{
          this.lpUnitList.splice(indx,1)
          this.$buefy.toast.open({
                    duration: 5500,
                    message: "Unit Removed",
                    position: 'is-top',
                    type: 'is-success'
          })
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
    onRefBlur(){
        if(!this.lessonPlan || !this.lpRecord)
          return

        if(this.lessonPlan.refBook!=this.lpRecord.refBook)this.$buefy.dialog.confirm({
              title: 'Content Changed',
              message: 'Content Of References Have been Changed,Do you Want to Apply Changes?',
              confirmText: 'Update',
              type: 'is-info',
              hasIcon: true,
              onConfirm: () => {
                const temp={
                  lpId:this.lessonPlan.lpId,
                  refBook:this.lpRecord.refBook
                }


                this.$store.dispatch('lessonPlanStore/updateReference',temp)
                  .then(rr=>{
                    this.$buefy.toast.open({
                      duration:5500,
                      message:"Updated Reference",
                      position:"is-top",
                      type:"is-success"
                    })
                  })
                }
          })

    }
  }
}
</script>

<style lang="css" scoped>
</style>
