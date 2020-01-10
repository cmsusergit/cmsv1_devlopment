 <template>
    <div style="width:100%;" class="is-radiusless box">

      <h1 class="subtitle has-text-weight-bold has-text-centered">
        <u>PART-A</u>
        <br>
        <b>GENERAL INFORMATION</b>
      </h1>

    <div class="has-text-weight-bold">
      <table class="table is-bordered is-fullwidth">
        <tr>

          <td width="40">1</td>
          <td width="250">Full Name</td>
          <td>{{selectedUser.fullname}}</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Designation</td>
          <td>{{selectedUser.designation}}</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Department</td>
          <td>{{selectedUser.deptName}}</td>
        </tr>
        <tr>
          <td>4</td>
          <td>Date of Joining</td>
          <td><p class="tag is-medium" v-if="selectedUser.dojoining">{{selectedUser.dojoining.getDate()}}/{{selectedUser.dojoining.getMonth()+1}}/{{selectedUser.dojoining.getFullYear()}}</p></td>
        </tr>
        <!-- <tr>
          <td>5</td>
          <td>Highest Qualification</td>
          <td>



            <b-select v-model="selectedUser.highestQualification" expanded>
              <option v-for="(temp,indx) in educationDetail" :key="indx">{{temp.degreeName}}</option>
            </b-select>
          </td>
        </tr>
        <tr>
          <td>6</td>
          <td>Experience at the College(YY-MM)</td>
          <td>
              <b-field grouped expanded>
                <b-input placeholder="YY" type="number"></b-input><b-input placeholder="MM" type="number"></b-input>
              </b-field>
          </td>
        </tr>
        <tr>
          <td>7</td>
          <td>LWP in AY</td>
          <td>
              <b-input type="number"/>
          </td>
        </tr> -->
      </table>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'SelfAppraisalPartA',
  data() {
    return {
      selectedUser:{
        fullname:'',
        designation:'',
        deptName:'',
        dojoining:'',
        highestQualification:''
      },
    }
  },
    props: ['user'],
  computed: {
    ...mapGetters([
    ]), //....
    educationDetail(){
      return this.$store.getters['employeeStore/employeeEducationList']
    }
  },
  watch:{
    user(){










      this.selectedUser.fullname=this.user.title +" "+this.user.firstName +" "+this.user.middleName +" "+this.user.lastName
      this.getDesignationById(this.user.designationId)
      this.getDeptNameById(this.user.deptId)
      this.selectedUser.dojoining=new Date(this.user.doj)
      this.$store.dispatch('employeeStore/load_employee_education_list',this.user.empId)
  }
  },
  mounted()
  {





    this.selectedUser.fullname=this.user.title +" "+this.user.firstName +" "+this.user.middleName +" "+this.user.lastName
    this.getDesignationById(this.user.designationId)
    this.getDeptNameById(this.user.deptId)
    this.selectedUser.dojoining=new Date(this.user.doj)
    this.$store.dispatch('employeeStore/load_employee_education_list',this.user.empId)
  },
  methods: {
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
