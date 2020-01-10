<template>
  <div style="width:100%;">

    <div class="card">
      <div class="card-content is-size-7 has-text-weight-bold has-text-left">
        <p>Name: {{studentDetail.stuTitle}} {{studentDetail.stuFirstname}} {{studentDetail.stuMiddlename}} {{studentDetail.stuLastname}}</p>
        <p>Enrollment: {{studentDetail.stuEnroll}} ({{deptName}})</p>
        <p>CollegeID: {{studentDetail.stuCollegeId}}</p>
        <p>Email: {{studentDetail.stuEmail}}</p><p>Contact:{{studentDetail.stuMobile}}</p>
      </div>
    </div>


    <table class="table is-fullwidth is-bordered" style="margin-top:.4em;">
        <thead><th colspan="9" class="has-text-centered">Details Of Student Fees Payment</th></thead>
        <thead>
        <th>Sr.</th>
        <th>Sem.</th>
        <th>Amount Paid(Rs.)</th>
        <th>Receipt Number</th>
        <th>Receipt Date</th>
        <th>Fees Category</th>
        <th>Status</th>
        <th>Comments</th>
        <th v-if="isEditable"></th>
      </thead>
      <tr :key="indx" v-for="(record,indx) in feesDetail">
        <td>{{indx+1}}</td>
        <td>{{record.feesSem}}</td>
        <td>{{record.feesAmountPaid}}</td>
        <td>{{record.feesReceiptNumber}}</td>
        <td>{{new Date(record.feesReceiptDate).toDateString()}}</td>
        <td>{{getCategory(record.feesCategory)}}</td>
        <td>{{record.feesPaymentStatus==1?'Full':'Half'}}</td>
        <td>{{record.feesComment}}</td>




        <td v-if="isEditable">
          <button @click="$emit('editRecord',record)" class="button is-radiusless is-small is-primary">Edit</button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  name:'StudentFeesDetail',
  props: ['studentDetail','isEditable'],
  data () {
    return {
      deptName:''
    }
  },
  computed: {
    getCategory(){
        return id=>{
           const tt=this.categoryList.find(ob=>ob.id==id)
           return tt?tt.categoryAlias:'-'
         }
    },
    categoryList(){
      return this.$store.getters["feesDetailStore/categoryList"]
    },
    feesDetail(){
      return this.$store.getters["feesDetailStore/studentFeesDetail"]
    }
  },
  mounted () {
    if(!this.categoryList || this.categoryList.length==0){
      this.$store.dispatch("feesDetailStore/load_category_list")
    }
    this.getDeptNameById(this.studentDetail.fDeptId)
    this.getStudentFeesDetail()
  },
  watch: {
  },
  methods: {
    getDeptNameById(id){
      this.$store.dispatch('deptStore/getDeptNameByID',id)
        .then(response=>{
          this.deptName=`${response.deptName}`
        })
        .catch(error=>{
          this.deptName=''
        })
    },
    getStudentFeesDetail(){
      this.$store.dispatch("feesDetailStore/load_student_feesdetail",this.studentDetail.stuId)
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
