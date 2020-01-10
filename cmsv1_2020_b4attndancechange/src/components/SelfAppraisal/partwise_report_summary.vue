 <template>
    <div style="width:100%;" class="">

    <h1 v-if="apiFormType==0" class="is-size-4 has-text-centered">Report of Part wise Scores of Technical Faculty</h1>
    <h1 v-else-if="apiFormType==1" class="is-size-4 has-text-centered">Report of Part wise Scores of Non-Technical Faculty</h1>
    <h1 v-else-if="apiFormType==2" class="is-size-4 has-text-centered">Report of Part wise Scores of MCA Faculty</h1>
    <br>
    <div>





    <table class="table is-bordered is-fullwidth">
      <thead>
        <th rowspan="2" class="has-text-centered" width="40">Sr.</th>
        <th rowspan="2">Faculty Name</th>
        <th rowspan="2" width="80">DOJ</th>
        <th rowspan="2" width="110">Result Point (Part-B)</th>
        <th rowspan="2" width="80">Student Feedback (Part-C)</th>
        <th colspan="5">Score of Part-D</th>
        <tr>
          <th width="70">D-1</th>
          <th width="70">D-2</th>
          <th width="70">D-3</th>
          <th width="70">D-4</th>
          <th width="110">Total Score Part-D</th>
        </tr>
      </thead>
      <tr :key="indx" v-for="(summary,indx) in summaryList">
          <td>{{indx+1}}</td>
          <td class="has-text-left" width="280">{{summary.facultyName}}</td>
          <td>{{new Date(summary.doj).toLocaleDateString()}}</td>
          <td>{{summary.result}}</td>
          <td></td>
          <td :key="ii" v-for="(partd,ii) in summary.partD">{{partd.score}}</td>
          <td>{{summary.total}}</td>
        </tr>
    </table>
    </div>
    <div class="box is-radiusless is-clearfix">
      <button @click='generateReport' class="button is-radiusless is-info is-pulled-right" style="width:25%;">Report</button>
    </div>
  </div>
</template>
<script>
import userMxn from '@/mixin/user'
import {mapGetters} from 'vuex'
import config from '@/../static/test1.json'
export default {
  name: 'SelfAppraisalPartwiseReportSummary',
  props: ['currAyId',
    'apiFormType',
    'facultyList',
  'deptName'],
  mixins: [userMxn],
  data() {
    return {
      summaryList:[],
      reportDefination:{}
    }
  },
  computed: {
    deptSummaryList(){return this.$store.getters['selfAppraisalStore/deptSummaryList']},
    deptResultSummaryList(){return this.$store.getters['selfAppraisalStore/deptResultSummaryList']},
    designation(){
      return id=>{
        return this.$store.getters['designationStore/designationById'](id)
      }
    }
  },
  watch:{
    deptSummaryList(){
      this.loadSummaryList()
    },
    facultyList(){
      this.loadSummaryList()
    },
    deptResultSummaryList(){
      this.loadSummaryList()
    }
  },
  mounted() {
    this.$store.dispatch('designationStore/load_desg_list')
  },
  methods: {
    loadSummaryList(){
      if(!this.deptSummaryList)return
      if(!this.deptResultSummaryList || !this.facultyList)return
      this.summaryList=[]
      this.deptSummaryList.map(summary=>{
        let record={total:0}
        if(summary && summary.length>0){
          const faculty=_.find(this.facultyList,ob=>ob.empCode==summary[0].apiEmpCode)
          record.facultyName=faculty.title+" "+faculty.firstName+" "+faculty.middleName+" "+faculty.lastName+"("+this.designation(faculty.designationId).desgName+")"
          record.doj=faculty.doj
          summary.map(ob=>{
            record.total+=ob.apiMeta.apiMetaPerpt
          })
          const temp=_.find(this.deptResultSummaryList,ob=>ob.empCode==summary[0].apiEmpCode)
          if(temp && temp.apiTeachings){
            let count1=_.countBy(temp.apiTeachings,ob=>ob.instituteResult>=ob.gtuResult).true
            count1 =count1?count1:0
            record.result=(count1*20<60)?count1*20:60
          }
          record.partD=Array.from({length:4},(vv,ii)=>vv={score:0})
          record.partD.map((p1,i1)=>{
              const temp=_.forEach(summary,ob=>{
                if(ob.apiMeta.apiMetaSection==i1+1)
                  p1.score+=ob.apiMeta.apiMetaPerpt
              })
          })

          this.summaryList.splice(this.summaryList.length,0,record)
        }
      })
      this.summaryList=_.sortBy(this.summaryList,['doj'])
    },
    generateReport(){
        let summaryTable=[]
        summaryTable.push([{text:'Sr.',rowSpan:2,alignment:'center',bold:true},
        {text:'Faculty Name',rowSpan:2,alignment:'center',bold:true},
        {text:'DOJ',rowSpan:2,alignment:'center',bold:true},
        {text:"Result Points (Part-B)",rowSpan:2,alignment:'center',bold:true},
        {text:'Student Feedback (Part-C)',rowSpan:2,alignment:'center',bold:true},
        {text:'Total Score Part-D',rowSpan:1,colSpan:5,alignment:'center',bold:true},'','','',''
      ])
      summaryTable.push(['','','','','',
        {text:'D-1',bold:true,alignment:'center'},{text:'D-2',bold:true,alignment:'center'},{text:'D-3',bold:true,alignment:'center'},{text:'D-4',bold:true,alignment:'center'},{text:'Total',bold:true,alignment:'center'}])
        this.summaryList.map((summary,indx)=>{
            let tempRecord=[{text:(indx+1),alignment:'center'},
                            {text:summary.facultyName,alignment:'left'},
                            {text:new Date(summary.doj).toLocaleDateString(),alignment:'center'},
                            {text:summary.result,alignment:'center'},''
                            ]
             summary.partD.map(pp=>{tempRecord.push({text:pp.score,alignment:'center'})})
             tempRecord.push({text:summary.total,alignment:'center'})
            summaryTable.push(tempRecord)


        })
        this.reportDefination=[
          {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY, VASAD'},
          {style:'subheader',alignment:'center',text:this.deptName.deptName},
          {margin:[0,2,0,10],style:'subheader',alignment:'center',text:'REPORT OF PART WISE SCORES OF FACULTIES FOR AY 2018-19'},
         {
            table:{
                headerRows:2,
                widths:['auto',250,80,'*','*',50,50,50,50,50],
                body:summaryTable
              }
          }
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

}
}
</script>
<style scoped>
th,td{
  font-size: 100%;
  text-align: center;
}
</style>
