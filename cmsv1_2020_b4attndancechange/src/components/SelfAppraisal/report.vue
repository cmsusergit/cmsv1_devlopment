 <template>
    <div style="width:100%;" class="">

    <h1 v-if="apiFormType==0" class="is-size-4 has-text-centered">Annual Appraisal Report of Technical Faculty for A.Y.</h1>
    <h1 v-else-if="apiFormType==1" class="is-size-4 has-text-centered">Annual Appraisal Report of Non-Technical Faculty for A.Y.</h1>
    <h1 v-else-if="apiFormType==1" class="is-size-4 has-text-centered">Annual Appraisal Report of MCA Faculty for A.Y.</h1>
    <div>
      <p class="is-size-5 has-text-weight-bold has-text-centered">DETAILS OF POINTS SCORED BY FACULTY IN DIFFERENT ASPECTS OF APPRAISAL</p>
      <div style="margin-top:2em;font-size:80%;">
        <SelfAppraisalTFPartA :user='user'/>
      </div>


      <table class="table is-bordered is-fullwidth is-size-7">
        <thead>
          <th width="50">Sr.</th>
          <th class="has-text-centered">Part</th>
          <th class="has-text-centered" width="240">Min.Points Required to be Scored</th>
          <th width="140">Actual Score</th>
        </thead>

        <tr v-if="apiFormType==0" :key="indx" v-for="(part,indx) in partListTF">
          <td>{{indx+1}}.</td>
          <td>{{part.partName}}</td>
          <td class="has-text-centered">{{part.partMinScore}}</td>
          <td class="has-text-centered">{{part.actualScore}}</td>
        </tr>
        <tr v-if="apiFormType==1" :key="indx" v-for="(part,indx) in partListNTF">
          <td>{{indx+1}}.</td>
          <td>{{part.partName}}</td>
          <td class="has-text-centered">{{part.partMinScore}}</td>
          <td class="has-text-centered">{{part.actualScore}}</td>
        </tr>
        <tr v-if="apiFormType==2" :key="indx" v-for="(part,indx) in partListMCA">
          <td>{{indx+1}}.</td>
          <td>{{part.partName}}</td>
          <td class="has-text-centered">{{part.partMinScore}}</td>
          <td class="has-text-centered">{{part.actualScore}}</td>
        </tr>
        <tr>
          <td></td>
          <td class="has-text-weight-bold has-text-right" colspan="2">Total</td>
          <td class="has-text-weight-bold has-text-centered">{{totalScore}}</td>
        </tr>
      </table>
    </div>
    <div style="margin-top:1em;">
      <table class="table is-fullwidth is-bordered">
        <td width="50%">C:STUDENTS FEEDBACK (Minimum 70% required )</td>
        <td width="50%" class="is-paddingless is-radiusless">
          <b-input placeholder="Percentage" min="0" max="100" type="number"></b-input>
        </td>
      </table>
      <p class="is-size-5 has-text-weight-bold has-text-centered"></p>
    </div>
    <form @submit.prevent="submitReport" v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL','HOD'])">
      <table class="table is-fullwidth is-bordered is-size-7">
        <thead>
          <th></th>
          <th colspan="2">HOD's Observation</th>
        </thead>
        <thead>
          <th width="5%">Sr.</th>
          <th width="45%">Parameters</th>
          <th width="50%">Observation in Each Parameter</th>
        </thead>
        <tr :key="indx" v-for="(pp,indx) in paramList">
          <td>{{indx+1}}.</td>
          <td>{{pp.apiParamDesc}}</td>
          <td v-if="pp.apiParamType==1">
            <b-select :disabled="submissionCompleted || isAuthorizedRoleList(['PRINCIPAL'])" v-model="pp.observation" size="is-small" required expanded>
              <option :key="index" v-for="(ob,index) in observationList">{{ob}}</option>
            </b-select>
          </td>
          <td v-else-if="pp.apiParamType==2">
            <b-input v-model="pp.observation" :disabled="submissionCompleted || isAuthorizedRoleList(['PRINCIPAL'])" type="textarea" required></b-input>
          </td>
          <td v-else-if="pp.apiParamType==3">
            <b-input v-model="pp.observation" :disabled="submissionCompleted ||  isAuthorizedRoleList(['PRINCIPAL'])" required></b-input>
          </td>
          <td v-else-if="pp.apiParamType==4">
            <p class="tag is-small">{{submissionDt}}</p>
          </td>
        </tr>
      </table>
      <div v-if="isAuthorizedRoleList(['CMSADMIN','HOD'])" class="is-radiusless is-clearfix box">
        <button :disabled="submissionCompleted" type="submit" class="button is-info is-radiusless is-pulled-right" style="width:25%;">Submit</button>
      </div>
    </form>
    <form style="margin-top:2em;border:1px solid;" @submit.prevent="submitReportPrincipal" v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL'])">
      <table class="table is-fullwidth is-bordered is-size-7">
        <tr :key="indx" v-for="(pp,indx) in paramListPrincipal">
          <td>{{pp.apiParamDesc}}</td>
          <td v-if="pp.apiParamType==1">
            <b-select :disabled="submissionCompletedPrincipal || !isAuthorizedRoleList(['PRINCIPAL'])" v-model="pp.observation" size="is-small" required expanded>
              <option :key="index" v-for="(ob,index) in principalRateList">{{ob}}</option>
            </b-select>
          </td>
          <td v-else-if="pp.apiParamType==2">
            <b-input v-model="pp.observation" :disabled="submissionCompletedPrincipal || !isAuthorizedRoleList(['PRINCIPAL'])" type="textarea" required></b-input>
          </td>
          <td v-else-if="pp.apiParamType==3">
            <b-input v-model="pp.observation" :disabled="submissionCompletedPrincipal ||  !isAuthorizedRoleList(['PRINCIPAL'])" required></b-input>
          </td>
          <td v-else-if="pp.apiParamType==4">
            <p class="tag is-small">{{submissionDt}}</p>
          </td>
          <td v-else-if="pp.apiParamType==5">
            <b-switch v-model="pp.observation" type="is-info">{{pp.observation?'Y':'N'}}</b-switch>
          </td>
        </tr>
      </table>

      <div v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL'])" class="is-radiusless is-clearfix box">
        <button :disabled="submissionCompletedPrincipal" type="submit" class="button is-info is-radiusless is-pulled-right" style="margin-left:1em;width:20%;">Submit</button>
        <button type="button" :disabled="!submissionCompletedPrincipal" @click="generateReport" style="margin-left:1em;width:20%;" class="button is-info is-radiusless is-pulled-right">Generate Report</button>
      </div>
    </form>
  </div>
</template>
<script>
import SelfAppraisalTFPartA from '@/components/SelfAppraisal/part_a'
import userMxn from '@/mixin/user'
import {mapGetters} from 'vuex'
import image2base64 from 'image-to-base64'
import config from '@/../static/test1.json'
export default {
  name: 'SelfAppraisalReport',
  props: ['currAyId',
    'apiFormType','user'],
  mixins: [userMxn],
  components: {
    SelfAppraisalTFPartA
  },
  data() {
    return {
      partListTF:[
        {partName:"B:RESULT ANALYSIS",partMinScore:20,actualScore:0},
        {partName:"D-1:CURRICULAR ACTIVITIES",partMinScore:20,actualScore:0},
        {partName:"D-2:CO-CURRICULAR ACTIVITIES",partMinScore:20,actualScore:0},
        {partName:"D-3:EXTRA-CURRICULAR ACTIVITIES",partMinScore:20,actualScore:0},
        {partName:"D-4:DEVELOPMENTAL ACTIVITIES",partMinScore:80,actualScore:0}
      ],
      partListNTF:[
        {partName:"B:RESULT ANALYSIS",partMinScore:20,actualScore:0},
        {partName:"D-1: CURRICULAR & CO-CURRICULAR ACTIVITIES",partMinScore:30,actualScore:0},
        {partName:"D-2: EXTRA-CURRICULAR ACTIVITIES",partMinScore:30,actualScore:0},
        {partName:"D-3: DEVELOPMENTAL ACTIVITIES",partMinScore:60,actualScore:0}
      ],
      partListMCA:[
          {partName:"B:RESULT ANALYSIS",partMinScore:20,actualScore:0},
          {partName:"D-1:CURRICULAR ACTIVITIES",partMinScore:20,actualScore:0},
          {partName:"D-2:CO-CURRICULAR ACTIVITIES",partMinScore:40,actualScore:0},
          {partName:"D-3:EXTRA-CURRICULAR ACTIVITIES",partMinScore:40,actualScore:0},
          {partName:"D-4:ACTIVITIES OF PROFESSIONAL DEVELOPMENTAL",partMinScore:80,actualScore:0}
        ],
        empPhoto:'',
      selectedUser:{},
      paramList:[],
      paramListPrincipal:[],
      reportDefination:{},
      submissionCompleted:false,
      submissionCompletedPrincipal:false,
      submissionDt:new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear(),
      principalRateList:["Superior","Exceeds Expectations","Meets Expectations","Needs Improvement","Unacceptable"],
      observationList:["Excellent","Very Good","Good","Average","Needs Improvement"]
    }
  },
  computed: {
    ...mapGetters([
    ]), //....
    totalScore(){
      let partList=[]
      if(this.apiFormType==0)partList=this.partListTF
      else if (this.apiFormType==1) partList=this.partListNTF
      else if (this.apiFormType==2) partList=this.partListMCA
      let total=0
      partList.map(ob=>{
        total+=ob.actualScore
      })
      return total
    },
    teachingRecordList(){
      return this.$store.getters['selfAppraisalStore/getTeachingRecordList']
    }
  },
  watch:{
    user(){
      let partList=[]
      if(this.apiFormType==0)partList=this.partListTF
      else if (this.apiFormType==1) partList=this.partListNTF
      else if (this.apiFormType==2) partList=this.partListMCA
      for (let indx = 0; indx < partList.length; indx++) {
       this.getTotalScoreForEmployee(indx+1)
     }
     this.selectedUser.fullname=this.user.title +" "+this.user.firstName +" "+this.user.middleName +" "+this.user.lastName
     this.getDesignationById(this.user.designationId)
     this.getDeptNameById(this.user.deptId)
     this.selectedUser.dojoining=new Date(this.user.doj)
     //
      // this.getTotalScoreForEmployee()
      this.getReportByHODForEmployee()
      this.getReportByPrincipalForEmployee()
      const ob={fEmpId:this.user.empId,fAyId:this.ayId}
      this.$store.dispatch('selfAppraisalStore/load_teaching_record_list',ob)
      const imageUrl=config.db_configuration.baseURL+'/containers/employee_photo/download/'+this.user.empPhoto
      image2base64(imageUrl)
        .then(rr=>{
          this.empPhoto="data:image/jpeg;base64,"+rr
        })
        .catch(error=>{
          console.log('****',error);


        })
    },
    teachingRecordList(){
      let partList=[]
      if(this.apiFormType==0)partList=this.partListTF
      else if (this.apiFormType==1) partList=this.partListNTF
      else if(this.apiFormType==2)partList=this.partListMCA
      if(partList && partList.length>0){
        partList[0].actualScore=0
        this.teachingRecordList.map(ob=>{
            if(ob.instituteResult >= ob.gtuResult)
              partList[0].actualScore+=20
        })
        if (partList[0].actualScore>60) {
          partList[0].actualScore=60
        }
      }
    }
  },
  mounted()
  {
    this.getParamListForHOD()
    this.getParamListForPrincipal()
  },
  methods: {
      generateReport(){
        let pointTable=[]
        pointTable.push(['Sr','Part','Min.Points Required to be Scored','Actual Score'])
        let partList=[]
        if(this.apiFormType==0)partList=this.partListTF
        else if (this.apiFormType==1) partList=this.partListNTF
        else if(this.apiFormType==2)partList=this.partListMCA
        partList.map((ob,indx)=>{
          const temp1=[{text:(indx+1)},{text:ob.partName},{text:ob.partMinScore},{text:ob.actualScore}]
          pointTable.push(temp1)
        })
        pointTable.push(['','',{text:'Total'},{text:this.totalScore,colSpan:1}])
        let hodObservation=[]
        hodObservation.push([{text:"HoD's Observation",bold:true,colSpan:3,alignment:'center'},'',''])
        hodObservation.push([{text:'Sr.',bold:true},{text:'Parameter',bold:true},{text:'Observation in Each Parameter',bold:true}])
        this.paramList.map((ob,indx)=>{
          hodObservation.push([{text:(indx+1)},{text:ob.apiParamDesc},{text:ob.observation}])
        })
        let principalObservation=[]
        this.paramListPrincipal.map((ob,indx)=>{
          if(indx==this.paramListPrincipal.length-1){
              principalObservation.push([{text:ob.apiParamDesc,fillColor:'#eeeeff',bold:true},{text:ob.observation?'Yes':'No',fillColor:'#eeeeff',bold:true}])
          }
          else
          principalObservation.push([{text:ob.apiParamDesc},{text:ob.observation}])
        })
        this.reportDefination=[
          {style:'header',fontSize:14,bold:true,alignment:'center',text:'SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY,VASAD'},
          {margin:[0,2,0,10],style:'subheader',alignment:'center',text:'Annual Appraisal Report of Technical Faculty for A.Y.'},
          {
            table:{
                widths:['auto','auto','*',110],
                body:[
                    ['1','Name',this.selectedUser.fullname,
                      {rowSpan:4,alignment:'center',image:this.empPhoto,fit:[100,100]}
                    ],
                    ['2','Designation',this.selectedUser.designation,''],
                    ['3','Department',this.selectedUser.deptName,''],
                    ['4','Date of Joining',this.selectedUser.dojoining.toLocaleDateString(),'']
                ]}
            },
            {margin:[0,10,0,5],style:'header',fontSize:10,bold:true,alignment:'center',text:'DETAILS OF POINTS SCORED BY FACULTY IN DIFFERENT ASPECTS OF APPRAISAL'},
            {
              table:{
                widths:['auto','*',80,80],
                body:pointTable
              }
            },
            {margin:[0,5,0,5],text:''},
            {
              table:{
                  widths:['*','*'],
                  body:[[{text:'C:STUDENTS FEEDBACK (Minimum 70% Required)'},'']]
              }
            },
            {margin:[0,5,0,5],text:''},
            {
              table:{
                widths:[20,'*','*'],
                body:hodObservation
              }
            },

            {margin:[0,10,0,5],text:''},
            {
              table:{
                widths:['*','*'],
                body:principalObservation
              }
            },
            {margin:[0,20,0,20],alignment:'right',text:"Principal's Signature"},
            {


              table:{
                  widths:['*','*'],
                  body:[[{border:[false,false,false,false],text:"Increment To Be Released(Y/N):__________",alignment:'left',fontSize:11},
                  {border:[false,false,false,false],alignment:'right',text:"Signature",fontSize:11}
                ]]}
            }
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
      getParamListForHOD(){
        this.$store.dispatch("selfAppraisalStore/load_apiparam_forhod_list")
          .then(rr=>{
            this.paramList=_.sortBy(rr,['id'])
          })
          .catch(error=>{
            this.paramList=[]
            console.log("****",error);
          })
      },
      getParamListForPrincipal(){
        this.$store.dispatch("selfAppraisalStore/load_apiparam_forprincipal_list")
          .then(rr=>{
            this.paramListPrincipal=_.sortBy(rr,['id'])
          })
          .catch(error=>{
            this.paramListPrincipal=[]
            console.log("****",error);
          })
      },
      getReportByPrincipalForEmployee(){
        const temp={ayId:this.currAyId,empId:this.user.empId}
        this.$store.dispatch('selfAppraisalStore/getReportByPrincipalForEmployee',temp)
          .then(rr=>{
            if(rr.observationList && rr.observationList.length){
              this.submissionCompletedPrincipal=true
              let list=[]
              for(let indx=0;indx<rr.observationList.length;indx++){
              let ob=rr.observationList[indx].apiParamPrincipal
                ob.observation=rr.observationList[indx].apiObservation
                list.push(ob)
              }
              this.paramListPrincipal=_.sortBy(list,['id'])
            }
            else{
              this.submissionCompletedPrincipal=false
              this.getParamListForPrincipal()
            }
          })
          .catch(error=>{
            console.log('****',error);
          })
      },
      getReportByHODForEmployee(){
        const temp={ayId:this.currAyId,empId:this.user.empId}
        this.$store.dispatch('selfAppraisalStore/getReportByHODForEmployee',temp)
          .then(rr=>{
            if(rr.observationList && rr.observationList.length){
              this.submissionCompleted=true

              let list=[]
              for(let indx=0;indx<rr.observationList.length;indx++){
              let ob=rr.observationList[indx].apiParamHod
                ob.observation=rr.observationList[indx].apiObservation
                list.push(ob)
              }
              this.paramList=_.sortBy(list,['id'])
            }
            else{
              this.submissionCompleted=false
                this.getParamListForHOD()
            }
          })
          .catch(error=>{
            console.log('****',error);
          })
      },
      getTotalScoreForEmployee(indx){

        if(!this.user)return
        let partList=[]
        if(this.apiFormType==0)partList=this.partListTF
        else if (this.apiFormType==1) partList=this.partListNTF
        else if (this.apiFormType==2) partList=this.partListMCA
        this.$store.dispatch('selfAppraisalStore/getApprovedMetaDt',{empCode:this.user.empCode,sectionId:indx})
          .then(rr=>{
              if(indx)
                partList[indx].actualScore=rr
          })
          .catch(error=>{
            console.log('****',error);
          })
      },
      tabChanged(indx){
        this.getTotalScoreForEmployee(indx+1)
      },
      submitReport(){
        let list=[]
        for (let indx=0;indx<this.paramList.length;indx++) {
          if(this.paramList[indx].apiParamType==4)
            this.paramList[indx].observation=this.submissionDt
          const ob={
            id:0,
            apiObservation:this.paramList[indx].observation,
            fParamId:this.paramList[indx].id,
            fEmpId:this.user.empId,
            fAyId:this.currAyId
          }
          list.push(ob)
        }
        this.$store.dispatch("selfAppraisalStore/submitReportHOD",list)
          .then(r1=>{
            this.submissionCompleted=true
            this.$buefy.toast.open({
              duration: 5500,
              message: "Submitted",
              position: 'is-top',
              type: 'is-success'
          })
      })
      .catch(error=>{
        this.$buefy.toast.open({
          duration: 5500,
          message: "Error in Submit Report",
          position: 'is-top',
          type: 'is-danger'
        })
      })
    },
  submitReportPrincipal(){
    let list=[]
    for (let indx=0;indx<this.paramListPrincipal.length;indx++) {
      if(this.paramListPrincipal[indx].apiParamType==4)
        this.paramListPrincipal[indx].observation=this.submissionDt
      const ob={
        id:0,
        apiObservation:this.paramListPrincipal[indx].observation,
        fParamId:this.paramListPrincipal[indx].id,
        fEmpId:this.user.empId,
        fAyId:this.currAyId
      }
      list.push(ob)
    }
    this.$store.dispatch("selfAppraisalStore/submitReportPrincipal",list)
      .then(r1=>{
        this.submissionCompletedPrincipal=true
        this.$buefy.toast.open({
          duration: 5500,
          message: "Submitted",
          position: 'is-top',
          type: 'is-success'
      })
    })
    .catch(error=>{
    this.$buefy.toast.open({
      duration: 5500,
      message: "Error in Submit Report",
      position: 'is-top',
      type: 'is-danger'
    })
    })
  },
  getDesignationById(id){
    this.$store.dispatch('designationStore/getDesignationById',id)
      .then(response=>{
        this.selectedUser.designation=`${response.desgName}(${response.desgAlias})`
      })
      .catch(error=>{
        this.selectedUser.designation=''
      })
    },
  getDeptNameById(id){
    this.$store.dispatch('deptStore/getDeptNameByID',id)
      .then(response=>{
        this.selectedUser.deptName=`${response.deptName}(${response.deptAlias})`
      })
      .catch(error=>{
        this.selectedUser.deptName=''
      })
  }
}
}
</script>
<style>
</style>
