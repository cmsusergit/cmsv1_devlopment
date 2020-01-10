 <template>
    <div style="width:100%;" class="">

    <h1 class="is-size-4 has-text-centered">Annual Appraisal Report of Technical Faculty for A.Y.</h1>
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
        <tr :key="indx" v-for="(part,indx) in partList">
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
    <div v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL'])" style="margin-top:.5em;">
      <table class="table is-fullwidth is-bordered is-size-7">
        <td class="is-size-5">Principal's Rating</td>
        <td>
          <b-select expanded>
            <option :key="index" v-for="(ob,index) in principalRateList">{{ob}}</option>
          </b-select>
        </td>
        <tr>
          <td>Special Remarks by Principal</td>
          <td><b-input type="textarea"></b-input></td>
        </tr>
        <tr>
          <td>Name of Principal</td>
          <td>
            <b-input></b-input>
          </td>
        </tr>
        <tr>
          <td>Date</td>
          <td>
            <p class="tag is-small">{{submissionDt}}</p></td>
        </tr>
      </table>
    </div>
    <div v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL'])" style="margin-top:.5em;">
      <table class="table is-fullwidth is-bordered">
        <tr>
        <td width="50%">Increment to be Released(Y/N)</td>
        <td width="50%">
          <b-switch v-model="releaseFlag" type="is-info">{{releaseFlag?'Y':'N'}}</b-switch>
        </td>
        </tr>
        <tr>
        <td width="50%">Signature</td>


        <td width="50%" class="is-paddingless is-radiusless">
        </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import SelfAppraisalTFPartA from '@/components/SelfAppraisal/part_a'
import userMxn from '@/mixin/user'
import {mapGetters} from 'vuex'
export default {
  name: 'SelfAppraisalReport',
  props: ['currAyId','user'],
  mixins: [userMxn],
  components: {
    SelfAppraisalTFPartA
  },
  data() {
    return {
      releaseFlag:true,
      partList:[
        {partName:"B:RESULT ANALYSIS",partMinScore:20,actualScore:0},
        {partName:"D-1:CURRICULAR ACTIVITIES",partMinScore:20,actualScore:0},
        {partName:"D-2:CO-CURRICULAR ACTIVITIES",partMinScore:20,actualScore:0},
        {partName:"D-3:EXTRA-CURRICULAR ACTIVITIES",partMinScore:20,actualScore:0},
        {partName:"D-4:DEVELOPMENTAL ACTIVITIES",partMinScore:80,actualScore:0}
      ],
      paramList:[],
      submissionCompleted:false,
      submissionDt:new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear(),
      totalScore:0,
      principalRateList:["Superior","Exceeds Expectations","Meets Expectations","Needs Improvement","Unacceptable"],
      observationList:["Excellent","Very Good","Good","Average","Needs Improvement"]
    }
  },
  computed: {
    ...mapGetters([
    ]) //....
  },
  watch:{
    user(){
      for (let indx = 0; indx < this.partList.length; indx++) {
       this.getTotalScoreForEmployee(indx+1)
     }
      this.getTotalScoreForEmployee()
      this.getReportByHODForEmployee()
     }
  },
  mounted()
  {
    this.getParamListForHOD()
  },
  methods: {
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
        this.$store.dispatch('selfAppraisalStore/getApprovedMetaDt',{empCode:this.user.empCode,sectionId:indx})
          .then(rr=>{
              if(indx)
                this.partList[indx].actualScore=rr
              else
                this.totalScore=rr
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
      }
  }
}
</script>
<style>
</style>
