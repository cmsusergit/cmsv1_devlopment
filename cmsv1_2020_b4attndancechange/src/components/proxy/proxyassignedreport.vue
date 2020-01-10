<template>
    <div>

      <div class="is-clearfix" style="margin-bottom:1em;">
        <button @click='generateReport' class="button is-radiusless is-pulled-right is-info" style="width:25%;">Generate Report</button>
      </div>
      <div class="box is-radiusless">
      <h1 class="subtitle has-text-centered">Reports Of Classes Assigned By {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
        ({{getDesignationById(faculty.designationId)}})({{deptName}}) to Other Faculties
      </h1>
      <table v-if="proxyReportAssignedByList.length!=0" class="table is-fullwidth is-bordered">
        <thead>

            <th class="has-text-centered">Sr.</th>
            <th class="has-text-centered">Date</th>
            <th class="has-text-centered">Slot(Duration)</th>
            <th class="has-text-centered">Subject</th>
            <th class="has-text-centered">Load Type</th>
            <th class="has-text-centered">Dept.</th>
            <th class="has-text-centered">Sem.</th>
            <th class="has-text-centered">Class/Batch</th>
            <th class="has-text-centered">Engaged by Faculty</th>
        </thead>
        <tr :key="indx" v-for="(record,indx) in proxyReportAssignedByList">
          <td>{{indx+1}}</td>
          <td class="has-text-centered"><b-tag type="is-radiusless">{{new Date(record.date).toDateString()}}</b-tag></td>
          <td class="has-text-centered">{{record.slot}}({{record.duration}})</td>
          <td class="has-text-centered">{{record.subject}}</td>
          <td class="has-text-centered">{{record.loadType}}</td>
          <td class="has-text-centered">{{record.dept}}</td>
          <td class="has-text-centered">{{record.semId}}</td>
          <td class="has-text-centered">{{record.class}}<br/>{{record.batch}}</td>
          <td class="has-text-centered">{{record.faculty}}</td>
        </tr>
      </table>
      <div v-else class="box is-size-5 is-radiusless has-text-danger">
        Record not Found
      </div>
        <div class="box is-radiusless">
          <p class="is-size-5">Total Teaching Hours Assigned to Other Faculties: {{totalAssignedByLoad}}</p>
        </div>
      </div>
      <div class="box is-radiusless">
      <h1 class="subtitle has-text-centered">Reports Of Classes Assigned To {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
        ({{getDesignationById(faculty.designationId)}})({{deptName}}) In Place of Other Faculties
      </h1>
      <table v-if="proxyReportAssignedToList.length!=0" class="table is-fullwidth is-bordered">
        <thead>
            <th class="has-text-centered">Sr.</th>
            <th class="has-text-centered">Date</th>
            <th class="has-text-centered">Slot(Duration)</th>
            <th class="has-text-centered">Subject</th>
            <th class="has-text-centered">Load Type</th>
            <th class="has-text-centered">Dept.</th>
            <th class="has-text-centered">Sem.</th>
            <th class="has-text-centered">Class/Batch</th>
            <th class="has-text-centered">Faculty To Whom It Belonged</th>
        </thead>
        <tr :key="indx" v-for="(record,indx) in proxyReportAssignedToList">
          <td>{{indx+1}}</td>
          <td class="has-text-centered"><b-tag type="is-radiusless">{{new Date(record.date).toDateString()}}</b-tag></td>
          <td class="has-text-centered">{{record.slot}}({{record.duration}})</td>
          <td class="has-text-centered">{{record.subject}}</td>
          <td class="has-text-centered">{{record.loadType}}</td>
          <td class="has-text-centered">{{record.dept}}</td>
          <td class="has-text-centered">{{record.semId}}</td>
          <td class="has-text-centered">{{record.class}}<br/>{{record.batch}}</td>
          <td class="has-text-centered">{{record.faculty}}</td>
        </tr>
      </table>
      <div v-else class="box is-size-5 is-radiusless has-text-danger">
        Record not Found
      </div>
      <div class="box is-radiusless">
        <p class="is-size-5">Total Teaching Hours Engaged For Other Faculties: {{totalAssignedToLoad}}</p>
      </div>
      </div>
    </div>
  </template>
<script>
import { mapState} from 'vuex'
import facultyMxn from '@/mixin/faculty'
    export default {
        name: "ProxyAssignedReport",
        props: ['ayId','faculty'],
        mixins: [facultyMxn],
        data() {
            return {
              totalAssignedToLoad:0,
              totalAssignedByLoad:0
            }
        },
        computed: {
          ...mapState([//....
            'classList',
            'batchList',
            'departmentList']),


            deptName(){
              if(this.departmentList && this.faculty)
                return this.departmentList.find(tt=>tt.deptId==this.faculty.deptId).deptAlias
            },
          proxyReportAssignedByList(){
            const proxyReportDt=this.$store.getters['proxyStore/proxyReportAssignedByList']
            if(!proxyReportDt){
              return ''
            }
            let tempList=[]
            this.totalAssignedByLoad=0
            proxyReportDt.assignedByProxyList.map(ob=>{
              const temp={
                faculty:this.getFacultyNameById(ob.fFacultyid),
                date:ob.proxyDate,
                subject:this.$store.getters['subjectStore/getSubjectById'](ob.timetableRecordInfo.fSubjectId).subName,
                class:this.classList.find(tt=>tt.classId==ob.timetableRecordInfo.fClassId).className,
                batch:ob.timetableRecordInfo.fBatchId!=0?this.batchList.find(tt=>tt.batchId==ob.timetableRecordInfo.fBatchId).batchName:'',

                loadType:ob.timetableRecordInfo.ttLoadType,
                semId:ob.timetableRecordInfo.ttSem,
                dept:this.departmentList.find(tt=>{return tt.deptId==ob.timetableRecordInfo.fDeptId}).deptName,
                duration:ob.timetableRecordInfo.ttDuration,
                slot:ob.timetableRecordInfo.ttStartTime.substring(0,ob.timetableRecordInfo.ttStartTime.lastIndexOf(':'))+' to '+ob.timetableRecordInfo.ttEndTime.substring(0,ob.timetableRecordInfo.ttEndTime.lastIndexOf(':'))
              }
              this.totalAssignedByLoad+=temp.duration
              tempList.push(temp)
            })
            return tempList
          },
          proxyReportAssignedToList(){
            const proxyReportDt=this.$store.getters['proxyStore/proxyReportAssignedToList']
           if(!proxyReportDt){
              return ''
            }
            this.totalAssignedToLoad=0
            let tempList=[]
            proxyReportDt.assignedToProxyList.map(ob=>{
              const temp={
                faculty:this.getFacultyNameById(ob.fOwnerid),
                date:ob.proxyDate,
                subject:this.$store.getters['subjectStore/getSubjectById'](ob.timetableRecordInfo.fSubjectId).subName,
                class:this.classList.find(tt=>tt.classId==ob.timetableRecordInfo.fClassId).className,
                batch:ob.timetableRecordInfo.fBatchId!=0?this.batchList.find(tt=>tt.batchId==ob.timetableRecordInfo.fBatchId).batchName:'',
                loadType:ob.timetableRecordInfo.ttLoadType,
                semId:ob.timetableRecordInfo.ttSem,
                dept:this.departmentList.find(tt=>{return tt.deptId==ob.timetableRecordInfo.fDeptId}).deptName,
                slot:ob.timetableRecordInfo.ttStartTime.substring(0,ob.timetableRecordInfo.ttStartTime.lastIndexOf(':'))+' to '+ob.timetableRecordInfo.ttEndTime.substring(0,ob.timetableRecordInfo.ttEndTime.lastIndexOf(':')),
                duration:ob.timetableRecordInfo.ttDuration
              }
              this.totalAssignedToLoad+=temp.duration
              tempList.push(temp)
            })
            return tempList
          }
        },
        watch:{
            ayId(){
                if(!this.faculty)
                  return
                const ob={ayId:this.ayId,facultyId:this.faculty.empId}
                this.$store.dispatch('proxyStore/load_proxyreport_assignedby_list',{detail:ob})
                this.$store.dispatch('proxyStore/load_proxyreport_assignedto_list',{detail:ob})
            },
          faculty(){





              console.log('faculty');
              if(!this.ayId)
                return
              const ob={ayId:this.ayId,facultyId:this.faculty.empId}
              this.$store.dispatch('proxyStore/load_proxyreport_assignedby_list',{detail:ob})
              this.$store.dispatch('proxyStore/load_proxyreport_assignedto_list',{detail:ob})
          }
        },
        mounted() {
          const ob={ayId:this.ayId,facultyId:this.faculty.empId}
          this.$store.dispatch('subjectStore/load_subject_by_dept',-1)
          this.$store.dispatch('load_dept_list')
          this.$store.dispatch('load_class_list')
          this.$store.dispatch('load_batch_list')
          this.$store.dispatch('proxyStore/load_proxyreport_assignedby_list',{detail:ob})
          this.$store.dispatch('proxyStore/load_proxyreport_assignedto_list',{detail:ob})
        },
        methods: {
          generateReport(){
            let tableAssignedBy=[]
            tableAssignedBy.push([{fillColor:'#dde',alignment:'center',text:'Sr.'},
            {fillColor:'#dde',alignment:'center',text:'Date'},
            {fillColor:'#dde',alignment:'center',text:'Slot(Duration)'},
            {fillColor:'#dde',alignment:'center',text:'Subject'},
            {fillColor:'#dde',alignment:'center',text:'Load Type'},
            {fillColor:'#dde',alignment:'center',text:'Dept.'},
            {fillColor:'#dde',alignment:'center',text:'Sem.'},
            {fillColor:'#dde',alignment:'center',text:'Class/Batch'},
            {fillColor:'#dde',alignment:'center',text:'Faculty Name'}])
            this.proxyReportAssignedByList.map((ob,indx)=>{
              let record=[]
              record.push({alignment:'center',text:indx+1})
              record.push({alignment:'center',text:new Date(ob.date).toDateString()})
              record.push({alignment:'center',text:ob.slot+'('+ob.duration+')'})
              record.push({alignment:'center',text:ob.subject})
              record.push({alignment:'center',text:ob.loadType})
              record.push({alignment:'center',text:ob.dept})
              record.push({alignment:'center',text:ob.semId})
              record.push({alignment:'center',text:ob.class+' '+ob.batch})
              record.push({alignment:'center',text:ob.faculty})
              tableAssignedBy.push(record)
            })

            let tableAssignedTo=[]
            tableAssignedTo.push([{fillColor:'#dde',alignment:'center',text:'Sr.'},
            {fillColor:'#dde',alignment:'center',text:'Date'},
            {fillColor:'#dde',alignment:'center',text:'Slot(Duration)'},
            {fillColor:'#dde',alignment:'center',text:'Subject'},
            {fillColor:'#dde',alignment:'center',text:'Load Type'},
            {fillColor:'#dde',alignment:'center',text:'Dept.'},
            {fillColor:'#dde',alignment:'center',text:'Sem.'},


            {fillColor:'#dde',alignment:'center',text:'Class/Batch'},
            {fillColor:'#dde',alignment:'center',text:'Faculty Name'}])
            this.proxyReportAssignedToList.map((ob,indx)=>{
              let record=[]
              record.push({alignment:'center',text:indx+1})
              record.push({alignment:'center',text:new Date(ob.date).toDateString()})
              record.push({alignment:'center',text:ob.slot+'('+ob.duration+')'})
              record.push({alignment:'center',text:ob.subject})
              record.push({alignment:'center',text:ob.loadType})
              record.push({alignment:'center',text:ob.dept})
              record.push({alignment:'center',text:ob.semId})
              record.push({alignment:'center',text:ob.class+' '+ob.batch})
              record.push({alignment:'center',text:ob.faculty})
              tableAssignedTo.push(record)
            })
            let tempText1='Reports Of Classes Assigned By '+this.faculty.title+' '+this.faculty.firstName+' '+this.faculty.middleName+' '+this.faculty.lastName+'('+this.getDesignationById(this.faculty.designationId)+')('+this.deptName+') to Other Faculties'
            let tempText2='Reports Of Classes Assigned To '+this.faculty.title+' '+this.faculty.firstName+' '+this.faculty.middleName+' '+this.faculty.lastName+'('+this.getDesignationById(this.faculty.designationId)+')('+this.deptName+') to Other Faculties'
            let reportDefination=[]
            reportDefination.push({style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'})
            reportDefination.push({margin:[0,20,0,10],fontSize:14,style:'subheader',alignment:'center',text:tempText1})
            if(tableAssignedBy.length>1){
              reportDefination.push({
                      width:'auto',
                      table:{
                          body:tableAssignedBy
                  }
                })
              }
              else{
                reportDefination.push({margin:[0,10,0,10],fontSize:17,alignment:'center',text:'Record not Found'})
              }
              reportDefination.push({margin:[0,10,0,10],fontSize:14,alignment:'right',text:'Total Teaching Hours Assigned to Other Faculties: '+ this.totalAssignedByLoad})
              reportDefination.push({margin:[0,20,0,10],fontSize:14,style:'subheader',alignment:'center',text:tempText2})
              if(tableAssignedTo.length>1){
                reportDefination.push({
                        width:'auto',
                        table:{
                            body:tableAssignedTo
                    }
                  })
              }
              else{
                  reportDefination.push({margin:[0,10,0,10],fontSize:17,alignment:'center',text:'Record not Found'})
              }
              reportDefination.push({margin:[0,10,0,10],fontSize:14,alignment:'right',text:'Total Teaching Hours Engaged For Other Faculties: '+ this.totalAssignedToLoad})
              var pdfMake = require('pdfmake/build/pdfmake.js')
              if (pdfMake.vfs == undefined){
                var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                pdfMake.vfs = pdfFonts.pdfMake.vfs;
              }
              pdfMake.createPdf({
                pageOrientation:'landscape',

                content:reportDefination,
                defaultStyle:{fontSize:11}
              }).open()
          }
        }
};
</script>
<style>
th,td{
  text-align:center;
  font-size:80%;
}
</style>
