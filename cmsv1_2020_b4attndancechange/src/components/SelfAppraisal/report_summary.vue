 <template>
    <div style="width:100%;" class="">

    <h1 v-if="apiFormType==0" class="is-size-4 has-text-centered">Annual Appraisal Summary of Technical Faculty</h1>
    <h1 v-else-if="apiFormType==1" class="is-size-4 has-text-centered">Annual Appraisal Summary of Non-Technical Faculty</h1>
    <h1 v-else-if="apiFormType==2" class="is-size-4 has-text-centered">Annual Appraisal Summary of MCA Faculty</h1>
    <br>
    <div>





    <table class="table is-bordered is-fullwidth">
      <thead>
        <th width="40">Sr.</th>
        <th>Faculty Name</th>
        <th width="80">DOJ</th>
        <th width="80">Result Point</th>
        <th width="80">Student Feedback</th>
        <th width="80">Total Score Part-D</th>
        <th>HOD Remarks</th>
        <th>Principal Remarks</th>
        <th width="20">Principal Recommandation(Y/N)</th>
      </thead>
      <tr :key="indx" v-for="(summary,indx) in summaryList">
          <td>{{indx+1}}</td>
          <td>{{summary.facultyName}}</td>
          <td>{{new Date(summary.doj).toLocaleDateString()}}</td>
          <td>{{summary.result}}</td>
          <td></td>
          <td>{{summary.total}}</td>
          <td>{{summary.hodObservation}}</td>
          <td>{{summary.principalObservation}}</td>
          <td v-if="summary.recommanded">{{summary.recommanded?'Y':'N'}}</td>
          <td v-else>-</td>
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
  name: 'SelfAppraisalReportSummary',
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
          if(temp && temp.apiObservationHods && temp.apiObservationHods.length>0)
            record.hodObservation=temp.apiObservationHods[0].apiObservation
            if(temp && temp.apiObservationPrincipals && temp.apiObservationPrincipals.length>0){
              record.principalObservation=temp.apiObservationPrincipals[0].apiObservation
              record.recommanded=temp.apiObservationPrincipals[1].apiObservation
            }
          this.summaryList.splice(this.summaryList.length,0,record)

        }
      })
    this.summaryList=_.sortBy(this.summaryList,['doj'])
    },
    generateReport(){
        let summaryTable=[]
        summaryTable.push([{text:'Sr.',alignment:'center'},
        {text:'Faculty Name',alignment:'center'},
        {text:'DOJ',alignment:'center'},
        {text:"Result Points",alignment:'center'},
        {text:'Student Feedback',alignment:'center'},
        {text:'Total Score Part-D',alignment:'center'},
        {text:'HOD Remarks',alignment:'center'},
        {text:'Principal Remarks',alignment:'center'},
        {text:'Principal Recommandation(Y/N)',alignment:'center'}])
        this.summaryList.map((summary,indx)=>{
          summaryTable.push([{text:(indx+1),alignment:'center'},
                            {text:summary.facultyName,alignment:'left'},

                            {text:new Date(summary.doj).toLocaleDateString(),alignment:'center'},
                            {text:summary.result,alignment:'center'},'',
                            {text:summary.total,alignment:'center'},
                            {text:summary.hodObservation,alignment:'center'},{text:summary.principalObservation,alignment:'center'},{text:summary.recommanded?(summary.recommanded?'Y':'N'):'-',alignment:'center'}])

        })
        this.reportDefination=[
          {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY, VASAD'},
          {style:'subheader',alignment:'center',text:this.deptName.deptName},
          {margin:[0,2,0,10],style:'subheader',alignment:'center',text:'Annual Appraisal Report Summary For AY 2018-19'},
         {
            table:{
                headerRows:1,

                widths:['auto','auto',80,'*','*','*','auto','auto',87],
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
<style>
</style>
