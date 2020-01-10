 <template>
    <div id="report" style="overflow:auto;width:100%;">

        <div class="subtitle" v-if="isFaculty||isClassName||isLocationName">
          <button @click="generateReport" style="margin-bottom:1em;" class="button is-info is-pulled-right is-radiusless is-small">PDF Report</button>
        </div>
         <div ref="content" id="to_print">
            <table id="table1" class="table is-bordered is-fullwidth">
                <thead>
                <th :style="isClassTtbl?'border:1px solid grey':'' "></th>



                <th class="has-text-weight-bold is-size-7 has-text-centered" v-for="slot in timeTblSlotList" :style="isClassTtbl?'border:1px solid grey':'' ">
                    {{slot.startTime}} to {{slot.endTime}}
                </th>
                </thead>
                <template v-if="isFaculty || isFacultyTtbl">
                        <tr  v-for="(temp,indx) in getTtblMatrix">
                            <td class="has-text-weight-bold is-size-7">{{timeTblDayList[indx]}}</td>
                            <td v-for="(tt,indx1) in temp" v-bind:colspan="tt.ttDuration" class="is-size-7 is-paddingless has-text-weight-bold">
                              <div v-if="generateEvent">
                                <div @click="openDetail(tt)" v-if="tt.ttId">
                                  <TtRecordInfo :facultyTT='true' :recordInfo="tt"/>
                                </div>
                                </div>
                                <div v-else>
                                <div v-if="tt.ttId">
                                  <TtRecordInfo :facultyTT='true' :recordInfo="tt"/>
                                </div>
                              </div>
                            </td>
                        </tr>
                </template>

                <template v-if="isClassTtbl">
                        <tr v-for="(temp,indx) in getClassTtblMatrix">
                            <td class="has-text-weight-bold is-size-7" style="border:1px solid grey;">{{timeTblDayList[indx]}}</td>
                            <td v-for="(tt,indx1) in temp" v-bind:colspan="tt.ttDuration" class="is-size-7 is-paddingless has-text-weight-bold" style="background-color:white;border:1px solid grey;">
                              <div v-if="generateEvent">
                                    <template v-if="tt.loadList && tt.loadList.length>0">
                                        <table style="width:100%" >
                                        <td  v-for="(rr,rindx) in tt.loadList" :style="rindx!=tt.loadList.length-1?'border-right:1px solid lightgrey':'' " style="padding:2px;">
                                             <div @click="openDetail(rr)" v-if="rr.ttId" :style="rindx%2==0?'color:blue':'color:green' ">
                                                <TtRecordInfo :classTT='true' :recordInfo="rr"/>
                                            </div>
                                        </td>
                                        </table>
                                    </template>
                                    <template v-else>
                                        <div v-if="tt.ttId">
                                            <TtRecordInfo :classTT='true' :recordInfo="tt"/>
                                        </div>
                                    </template>
                                </div>
                                <div v-else>
                                    <template v-if="tt.loadList && tt.loadList.length>0">
                                        <table style="width:100%" >
                                        <td  v-for="(rr,rindx) in getLoadList(tt.loadList)" :style="rindx!=tt.loadList.length-1?'border-right:1px solid lightgrey':'' " style="background:beige;padding:2px;">
                                            <div v-if="rr.ttId" :style="rindx%2==0?'color:blue':'color:green' ">
                                                <TtRecordInfo :classTT='true' :recordInfo="rr"/>
                                            </div>
                                        </td>
                                        </table>
                                    </template>
                                    <template v-else>
                                        <div v-if="tt.ttId">
                                            <TtRecordInfo :classTT='true' :recordInfo="tt"/>
                                        </div>
                                    </template>
                              </div>
                            </td>
                        </tr>
                </template>
                <template v-if="isLocationTtbl">
                        <tr  v-for="(temp,indx) in getLocationTtblMatrix">
                            <td class="has-text-weight-bold is-size-7">{{timeTblDayList[indx]}}</td>
                            <td v-for="(tt,indx1) in temp" v-bind:colspan="tt.ttDuration" class="is-size-7 is-paddingless has-text-weight-bold">
                              <div v-if="generateEvent">
                                <div @click="openDetail(tt)" v-if="tt.ttId">
                                  <TtRecordInfo :locationTT='true' :recordInfo="tt"/>
                                </div>
                                </div>
                                <div v-else>
                                <div v-if="tt.ttId">
                                  <TtRecordInfo :locationTT='true' :recordInfo="tt"/>
                                </div>
                              </div>
                            </td>
                        </tr>
                </template>
            </table>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import TtRecordInfo from '@/components/report/ttRecordInfo'
import {mapGetters} from 'vuex'
import { TTRecordModel} from '@/store/modules/timetable.js'
export default {
  name: 'Report',
  components: {
    TtRecordInfo
  },
  props: ['generateEvent','isFaculty','isFacultyTtbl','isClassName','isLocationName',
      'isLocationTtbl','isClassTtbl'],


  data() {
    return {}
  },
  computed: {
    ...mapGetters("ttStore", [
      "getTtblMatrix","getLocationTtblMatrix",
      "getClassTtblMatrix"
    ]), //....
    timeTblDayList() {
      return this.$store.state.ttStore.timeTblDayList;
    },
    timeTblSlotList() {
      return this.$store.state.ttStore.timeTblSlotList;
    },
    //
    // timeTblDt() {
    //     return this.$store.state.ttStore.timeTblDt;
    // }
  },
  mounted()
  {
      this.$store.dispatch('subjectStore/LOAD_SUBJECT_LIST')
      this.$store.dispatch('classStore/load_class_list')
      this.$store.dispatch('classStore/load_batch_list')
      this.$store.dispatch('locStore/load_loc_list')
      this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
  },
  methods: {
      getLoadList(loadList){
          const ob=_.sortBy(loadList,temp=>{
              return temp.fBatchId
          })
          return ob
      },
    openDetail(ttRecord) {
      this.$emit('openDetail',ttRecord)
    },
    generateReport(){
        if(this.isFaculty){
          this.generateFacultyReport()
        }
        else if(this.isClassName){
          this.generateClassReport()
        }
        else if(this.isLocationName){
          this.generateLocationReport()
        }
    },

    generateClassReport(){
      let tableWidth=['*']
      let table=[]
      let hrow=['']
      this.timeTblSlotList.map(slot=>{
          tableWidth.push('auto')
          hrow.push(slot.startTime+' to '+slot.endTime)
      })
      table.push(hrow)
      let className=this.$store.getters['classStore/classNameById'](this.isClassName)
      this.getClassTtblMatrix.map((temp,indx)=>{
        let tablerow=[]
        tablerow.push(this.timeTblDayList[indx])
        temp.map((record,rindx)=>{
            if(record.ttId){
              if(!record.loadList){
                  let facultyName=this.$store.getters['employeeStore/facultyNameById'](record.fFacultyId)
                  let locName=this.$store.getters['locStore/getLocationById'](record.fLocationId).locName
                  let subjectName=this.$store.getters['subjectStore/getSubjectById'](record.fSubjectId).subAlias
                  let batchName=''
                  if(record.fBatchId!=0){
                        batchName=this.$store.getters['classStore/batchNameById'](record.fBatchId).batchName
                  }
                  let tempText=""
                  if(facultyName)
                    tempText+=facultyName.firstName.substring(0,1)+facultyName.middleName.substring(0,1)+facultyName.lastName.substring(0,1)+"\n"+subjectName
                  tempText+='\n'+className.className
                  if(batchName) tempText+='\n'+batchName
                  tempText+='('+locName+')\n'+record.ttLoadType
                  tablerow.push({text:tempText,colSpan:record.ttDuration})
                  for (var ii = 1; ii < record.ttDuration;ii++) {
                      tablerow.push({text:''})
                  }
              }
              else{
                  let loadlist=[]
                  record.loadList=_.sortBy(record.loadList,['fBatchId'])
                  record.loadList.map(ttrecord=>{
                    let facultyName=this.$store.getters['employeeStore/facultyNameById'](ttrecord.fFacultyId)
                    let locName=this.$store.getters['locStore/getLocationById'](ttrecord.fLocationId).locName
                    let subjectName=this.$store.getters['subjectStore/getSubjectById'](ttrecord.fSubjectId).subAlias
                    let batchName=''
                    if(ttrecord.fBatchId!=0){
                          batchName=this.$store.getters['classStore/batchNameById'](ttrecord.fBatchId).batchName
                    }
                    let tempText=""
                    if(facultyName)
                      tempText+=facultyName.firstName.substring(0,1)+facultyName.middleName.substring(0,1)+facultyName.lastName.substring(0,1)+"\n"+subjectName
                    if(batchName) tempText+='\n'+batchName+'\n'
                    tempText+='('+locName+')\n'+ttrecord.ttLoadType
                    loadlist.push({text:tempText})
                  })
                  let widthList=[]
                  loadlist.map(ob=>{widthList.push('*')})

                  tablerow.push({colSpan:record.ttDuration,table:{widths:widthList,body:[loadlist]},layout:{
                    fillColor:function(ii,nd){return '#dde'},
                    hLineWidth:function(i,nd){return 0},
                    vLineWidth:function(i,nd){return (i==0||i==nd.table.widths.length)?0:1}
                  }})
                  for (var i = 1; i < record.ttDuration; i++)
                    tablerow.push({text:''})
              }
            }
            else {
              tablerow.push({text:''})
            }
        })
        console.log('----',tablerow.length);
        table.push(tablerow)
      })
      const deptName=this.$store.getters['getDeptNameById'](className.fDeptId)
      this.reportDefination=[
        {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'},
          {margin:[0,2,0,2],fontSize:14,style:'subheader',alignment:'center',text:'Time Table'},
          {
            margin:[0,10,0,10],
            columns:[
            {alignment:'left',text:deptName.deptName},
            {alignment:'right',text:className.className}
          ]},
        {
          style:{fontSize:8,alignment:'center'},
          columns:[
            {width:'*',text:''},
            {
              width:'auto',
              table:{
                  widths:tableWidth,
                  body:table
              }
            },
            {width:'*',text:''}
          ]
        },
        {margin:[0,20,0,5],fontSize:11,alignment:'right',text:'Signature'}
      ]
      var pdfMake = require('pdfmake/build/pdfmake.js')
        if (pdfMake.vfs == undefined){
          var pdfFonts = require('pdfmake/build/vfs_fonts.js')
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }
        pdfMake.createPdf({
          pageOrientation:'landscape',
          content:this.reportDefination,
          defaultStyle:{fontSize:11}
        }).open()
    },
    generateLocationReport(){
      let tableWidth=['*']
      let table=[]
      let hrow=['']
      this.timeTblSlotList.map(slot=>{
          tableWidth.push('*')
          hrow.push(slot.startTime+' to '+slot.endTime)
      })
      table.push(hrow)
      this.getLocationTtblMatrix.map((temp,indx)=>{
        let tablerow=[]
        tablerow.push(this.timeTblDayList[indx])
        temp.map((record,rindx)=>{
            if(record.ttId){
              let facultyName=this.$store.getters['employeeStore/facultyNameById'](record.fFacultyId)
              let subjectName=this.$store.getters['subjectStore/getSubjectById'](record.fSubjectId).subAlias
              let className=this.$store.getters['classStore/classNameById'](record.fClassId).className
              let batchName=''
              if(record.fBatchId!=0){
                    batchName=this.$store.getters['classStore/batchNameById'](record.fBatchId).batchName
              }
              let tempText=""
              if(facultyName)
                tempText+=facultyName.firstName.substring(0,1)+facultyName.middleName.substring(0,1)+facultyName.lastName.substring(0,1)
              else
                tempText+="-"
              tempText+='\n'+subjectName+','+className
              if(batchName) tempText+='\n'+batchName
              tempText+='\n'+record.ttLoadType
              tablerow.push({fontSize:8,text:tempText,colSpan:record.ttDuration,alignment:'center'})
              for (var i = 1; i < record.ttDuration; i++)
                tablerow.push({text:''})
            }
            else {
              tablerow.push('')
            }
        })
        table.push(tablerow)
      })
      let locName=this.$store.getters['locStore/getLocationById'](this.isLocationName)
        const deptName=this.$store.getters['getDeptNameById'](locName.fDeptId)
      this.reportDefination=[
        {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'},
          {margin:[0,2,0,2],fontSize:14,style:'subheader',alignment:'center',text:'Time Table'},
          {
            margin:[0,10,0,10],
            columns:[
              {alignment:'left',text:deptName.deptName},
            {alignment:'right',text:locName.locName}
          ]},
        {
          widths:tableWidth,
          table:{
              body:table
          },
        },
        {margin:[0,20,0,5],fontSize:11,alignment:'right',text:'Signature'}
      ]
      var pdfMake = require('pdfmake/build/pdfmake.js')
        if (pdfMake.vfs == undefined){
          var pdfFonts = require('pdfmake/build/vfs_fonts.js')
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }
        pdfMake.createPdf({
          content:this.reportDefination,
          defaultStyle:{fontSize:11}
        }).open()
    },
    generateFacultyReport(){
      let tableWidth=['*']
      let table=[]
      let hrow=['']
      this.timeTblSlotList.map(slot=>{
          tableWidth.push('*')
          hrow.push(slot.startTime+' to '+slot.endTime)
      })
      table.push(hrow)
      let facultyName=this.$store.getters['employeeStore/facultyNameById'](this.isFaculty)
      this.getTtblMatrix.map((temp,indx)=>{
        let tablerow=[]
        tablerow.push(this.timeTblDayList[indx])
        temp.map((record,rindx)=>{
            if(record.ttId){
              let locName=this.$store.getters['locStore/getLocationById'](record.fLocationId).locName
              let subjectName=this.$store.getters['subjectStore/getSubjectById'](record.fSubjectId).subAlias
              let className=this.$store.getters['classStore/classNameById'](record.fClassId).className
              let batchName=''
              if(record.fBatchId!=0){
                    batchName=this.$store.getters['classStore/batchNameById'](record.fBatchId).batchName
              }
              let tempText=subjectName+'\n'+className
              if(batchName) tempText+='\n'+batchName
              tempText+='('+locName+')\n'+record.ttLoadType
              tablerow.push({fontSize:8,text:tempText,colSpan:record.ttDuration,alignment:'center'})
              for (var i = 1; i < record.ttDuration; i++)
                tablerow.push({text:''})
            }
            else {
              tablerow.push('')
            }
        })
        table.push(tablerow)
      })
      const deptName=this.$store.getters['getDeptNameById'](facultyName.deptId).deptName
      this.reportDefination=[
        {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'},
          {margin:[0,2,0,2],fontSize:14,style:'subheader',alignment:'center',text:'Time Table'},
          {
            margin:[0,10,0,10],
            columns:[
            {alignment:'left',text:deptName},
            {alignment:'right',text:facultyName.title+" "+facultyName.firstName+" "+facultyName.middleName+" "+facultyName.lastName}
          ]},
        {
          widths:tableWidth,
          table:{
              body:table
          },
        },
        {margin:[0,20,0,5],fontSize:11,alignment:'right',text:'Signature'}
      ]
      var pdfMake = require('pdfmake/build/pdfmake.js')
        if (pdfMake.vfs == undefined){
          var pdfFonts = require('pdfmake/build/vfs_fonts.js')
          pdfMake.vfs = pdfFonts.pdfMake.vfs;
        }
        pdfMake.createPdf({
          content:this.reportDefination,
          defaultStyle:{fontSize:11}
        }).open()
    }
  }
}
</script>
<style scoped>
</style>
