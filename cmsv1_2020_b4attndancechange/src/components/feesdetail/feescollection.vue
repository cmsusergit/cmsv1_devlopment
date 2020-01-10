<template>
  <div class="box" style="width:100%;">

    <div>
      <StudentFeesDetail @editRecord="editRecord" :studentDetail='studentDetail' isEditable=true></StudentFeesDetail>
    </div>
    <form @submit.prevent="feesCollected" class="card is-radiusless" style="margin-top:1em;">
      <b-field grouped style="padding:1em;">
        <b-field label="Academic Year" expanded>
          <b-select v-model="feesCollectionDetail.fAyId" required disabled expanded>
            <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
          </b-select>

        </b-field>
        <b-field label="Select Year" expanded>
          <b-select :disabled="isEditable" @input='countTagChanged' v-model="currentFeesCount"  required expanded>
            <option :key="indx" v-for="(vv,indx) in feesCount" :value="vv">{{vv.feesCountTag}}</option>
          </b-select>
        </b-field>
        <b-field label="Receipt Number" expanded>
          <b-input v-model="feesCollectionDetail.feesReceiptNumber" required disabled expanded>
          </b-input>
        </b-field>
        <b-field label="Sem" expanded>
          <b-select :disabled="isEditable" v-model="feesCollectionDetail.feesSem"  required expanded>
            <option v-for="indx in 10">{{indx}}</option>
          </b-select>
        </b-field>
        <b-field label="Receipt Date" expanded>
          <b-datepicker v-model="feesCollectionDetail.feesReceiptDate" placeholder="Select Receipt Date">
          </b-datepicker>
        </b-field>
      </b-field>
        <div class="is-parent tile">
          <div class="is-child tile has-text-centered" style="box-shadow:1px 1px 5px 0px lightgrey">
            <b-radio @input='categoryChanged' v-model="feesCollectionDetail.feesCategory" style="padding:.4em" class="tile is-child" name="category" v-for="category in categoryList" type="is-info" :native-value="category.id" required>{{category.categoryAlias}}</b-radio>
          </div>
          <div class="is-child tile has-text-centered" style="box-shadow:1px 1px 5px 0px lightgrey">
            <b-radio @input="statusChanged" v-model="feesCollectionDetail.feesPaymentStatus" class="is-child tile" name="status" v-for="status in paymentStatus" type="is-info"  style="padding:.4em" :native-value="status.id" required>{{status.status}}</b-radio>
          </div>
        </div>
      <div class="card-content">
          <b-field grouped>
            <b-field label="Amount Paid" expanded>
                <b-input v-model="feesCollectionDetail.feesAmountPaid" step="0.5" type="number" required></b-input>
            </b-field>
          <b-field label="Comment" expanded>
            <b-input rows="1" size="is-small" v-model="feesCollectionDetail.feesComment" type="textarea" maxlength="250"></b-input>
          </b-field>
        </b-field>
          </div>
          <div class="card-footer" style="border-top:1px solid lightgrey;">
            <div class="is-clearfix" style="width:100%;">
              <button @click="$parent.close()" type="button" class="is-radiusless button is-danger is-pulled-right" style="margin:.5em;width:10%;">Cancel</button>
              <b-tooltip label="Only Authorized Person can Edit" type="is-info" class="is-pulled-right"  style="margin:.5em;width:10%;">
                <button @click="editFeesDetail" :disabled="!isEditable || !isAuthorizedRoleList(['CMSADMIN','ADMINOFFICER'])" type="button" class="is-radiusless button is-info"  style="width:100%;">Edit</button>
              </b-tooltip>
              <button :disabled="isEditable" type="submit" class="is-radiusless button is-primary is-pulled-right" style="margin:.5em;width:10%;">Collect</button>
            </div>
          </div>
    </form>
  </div>
</template>
<script>
import StudentFeesDetail from '@/components/feesdetail/feesdetail'
import userMxn from '@/mixin/user'
export default {
  name:'StudentFeesCollection',
  components: {
    StudentFeesDetail
  },
  props: ['inputOb','studentDetail'],
  mixins: [userMxn],
  data () {
    return {
      currentFeesCount:null,
      deptName:'',
      isEditable:false,
      paymentStatus:[{id:1,status:'Full'},{id:0,status:'Half'}],
        feesCollectionDetail:{
          feesSem:-1,
          feesPaymentStatus:1,
          feesReceiptDate:new Date(),
          feesId:0,
          feesReceiptNumber:'-',
          feesComment:'',
          feesAmountPaid:75300,
          feesCollectorId:this.inputOb.empId,
          feesCategory:2,
          fStuId:this.studentDetail.stuId,
          fAyId:this.inputOb.ayId,
        }
    }
  },
  computed: {
    aYearList(){
      return this.$store.state.acadyearStore.acadyearList
    },
    feesCount(){
      return this.$store.getters['feesDetailStore/feesCount']
    },
    categoryList(){
      return this.$store.getters['feesDetailStore/categoryList']
    },
    feesDetail(){
      return this.$store.getters["feesDetailStore/studentFeesDetail"]
    }
  },
  mounted () {
    this.$store.dispatch('acadyearStore/load_academicyear_list')
    this.$store.dispatch('feesDetailStore/load_category_list')
    this.getDeptNameById(this.studentDetail.fDeptId)

    this.getStudentFeesDetail()
  },
  watch: {
    currAcademicyearId(){
      this.$store.dispatch('feesDetailStore/load_fees_count',this.currAcademicyearId)
      this.feesCollectionDetail.ayId=this.currAcademicyearId
    }
  },
  methods: {
    editRecord(record){
      this.isEditable=true
      this.feesCollectionDetail=record
    },
    countTagChanged(vv){
      this.feesCollectionDetail.feesReceiptNumber=vv.feesCount
    },
    getDeptNameById(id){
      this.$store.dispatch('deptStore/getDeptNameByID',id)
        .then(response=>{
          this.deptName=`${response.deptName}`
        })
        .catch(error=>{
          this.deptName=''
        })
    },
    feesCollected(){
      this.currentFeesCount.feesCount+=1
      const temp={
        count:this.currentFeesCount,
        dt:this.feesCollectionDetail
      }
      this.$store.dispatch('feesDetailStore/add_fees_collection_detail',temp)
        .then(rr=>{
          this.$buefy.dialog.alert({title:"Fees Collected",message:`<p style='text-align:center'>Fees Collected Succesfully with <br/> <b>Receipt Number:${rr.feesReceiptNumber}</b></p>`})
          this.$parent.close()
        })
        .catch(error=>{
          this.$buefy.dialog.alert({title:"Error",message:"Error:"+error})
          this.$parent.close()
        })
    },
    editFeesDetail(){
      this.$store.dispatch('feesDetailStore/edit_fees_collection_detail',this.feesCollectionDetail)
        .then(rr=>{
          this.$buefy.dialog.alert({title:"Fees Updated",message:`<p style='text-align:center'>Fees Updated Succesfully with <br/> <b>Receipt Number:${rr.feesReceiptNumber}</b></p>`})
          this.$parent.close()
        })
        .catch(error=>{
          this.$buefy.dialog.alert({title:"Error",message:"Error:"+error})
          this.$parent.close()
        })
    },
    getStudentFeesDetail(){
      this.$store.dispatch("feesDetailStore/load_student_feesdetail",this.studentDetail.stuId)
    },
    statusChanged(value){
      if(value==1)
        this.feesCollectionDetail.feesAmountPaid=75300
      else
        this.feesCollectionDetail.feesAmountPaid=''
    },
    categoryChanged(value){
      if(this.feesCollectionDetail.feesCategory==1){
        this.feesCollectionDetail.feesAmountPaid=1300
      }
      else if(this.feesCollectionDetail.feesCategory==4)
        this.feesCollectionDetail.feesAmountPaid=''
      else
        this.feesCollectionDetail.feesAmountPaid=75300
    }
  }
}
</script>
<style lang="css" scoped>
  /* #buttons {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  /* Page content */
  /* .content {
    padding: 16px;
  } */
</style>
