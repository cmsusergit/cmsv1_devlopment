 <template>
    <div style="width:100%;">
      <div v-if="!loading" class="box is-child is-radiusless tile" style="width:50%;">
        <vue-frappe id='student_chart' title='Student Count' type="pie":labels="chartLabel" :dataSets="chartStudentDt">
        </vue-frappe>
      </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {mapState} from 'vuex'

export default {
  name: 'DeptStudentCountChart',
  data() {
    return {
      chartLabel:'',
      chartStudentDt:''
    }
  },
  computed: {
    ...mapState(//....
      ['departmentList']
    ),
    ...mapState(//....
      'studentStore',['loading']
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
    loading(){
      if(!this.loading)this.getChartStudentDt()
    }
  },
  mounted()
  {
      this.$store.dispatch('load_dept_list')
      this.$store.dispatch('studentStore/load_student_list')
  },
  methods: {
    getChartLabel(){
      this.chartLabel=[]
      this.departmentList.map(dept=>{
        this.chartLabel.push(dept.deptAlias)
      })
    },
    getChartStudentDt(){
      let studentCount=[]
      this.departmentList.map(dept=>{
        studentCount.push(this.deptStudentCount(dept.deptId))
      })
      this.chartStudentDt=[{name:'Student',values:studentCount}]
    }
  }
}
</script>
<style scoped>
</style>
