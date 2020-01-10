 <template>
    <div style="width:100%;" class="tile">

      <div v-if="!isListLoaded" class="box is-radiusless is-child tile">
        <vue-frappe id='dept_chart' title='Staff Count' type="pie" :labels="chartLabel" :dataSets="chartDt">
        </vue-frappe>
      </div>
    </div>
</template>
<script>



import _ from 'lodash'
import {mapState} from 'vuex'
export default {
  name: 'DeptCountChart',
  data() {
    return {
      isListLoaded:true,
      chartDt:'',
      chartLabel:'',
    }
  },
  computed: {
    ...mapState(//....
      ['departmentList']
    ),
    deptStudentCount(){
      return id=>{
        const count=this.$store.getters['studentStore/getStudentCount'](id)
        return count.true?count.true:0
      }
    }
  },
  watch:{
    departmentList(){
      this.getChartLabel()
    },
    isListLoaded(){
      if(!this.isListLoaded)this.getChartDt()
    }
  },
  mounted()
  {
      this.$store.dispatch('load_dept_list')
      this.$store.dispatch('employeeStore/load_employee_list').then(rr=>{
        this.isListLoaded=false
      }).catch(error=>{this.isListLoaded=false})
  },
  methods: {
    getChartLabel(){
      this.chartLabel=[]
      this.departmentList.map(dept=>{
        this.chartLabel.push(dept.deptAlias)
      })
    },
    getChartDt(){
      let staffCount=[]
      this.departmentList.map(dept=>{
        staffCount.push(this.deptStaffCount(dept.deptId))
      })
      this.chartDt=[{name:'Staff',values:staffCount}]
    }
  }
}
</script>
<style scoped>
</style>
