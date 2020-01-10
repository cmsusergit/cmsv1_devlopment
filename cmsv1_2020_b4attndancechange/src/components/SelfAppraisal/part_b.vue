 <template>
    <div style="width:100%;" class="is-radiusless box">

      <h1 class="subtitle has-text-weight-bold has-text-centered">
        <u>PART-B</u>
        <br>
        <b>TEACHING PERFORMANCE</b>
      </h1>
        <form @submit.prevent="addRecord">
        <table style="font-size:80%" class="table is-bordered is-fullwidth">



            <thead>
              <th>Branch</th>
              <th>Sem.</th>
              <th>Subject Taught(Theory Only)</th>
              <th>Class(Div.)</th>
              <th>Number Of Students</th>
              <th>Avg. Attendance</th>
              <th>Institute Result</th>
              <th>GTU Result</th>
              <th></th>
            </thead>
            <tr>
              <td width="110">
                <b-select size="is-small" v-model="record.fDeptId"  @input="changeDept" required expanded>
                  <option v-for="dp in departmentList" :value="dp.deptId">
                    {{dp.deptAlias}}
                  </option>
              </b-select>
              </td>
              <td width="75">
                <b-Select size="is-small" v-model="record.fSem" @input="changeSubjectList(record)" required expanded>
                  <option v-for="cl in 10">{{cl}}</option>
                </b-select>
              </td>
              <td>
                <b-select v-model="record.fSubjectId" size="is-small" required expanded>
                  <option v-for="(subject, index) in subjectList" :key="index" :value="subject.subId">
                    {{subject.subName}}
                  </option>
                </b-select>
              </td>
              <td width="110">
                <b-select v-model="record.fClassId" size="is-small" required expanded>
                    <option :key="indx" v-for="(cl, indx) in classList" :value="cl.classId">
                        {{cl.className}}
                    </option>
                </b-select>
              </td>
              <td width="140">
                <b-input v-model="record.studentCount" size="is-small" type="number" required/>
              </td>
              <td width="140">
                 <b-input v-model="record.avgAttendance" size="is-small" type="number" min="0" max="100" required/>
              </td>
              <td>
                <b-input v-model="record.instituteResult" size="is-small" type="number" min="0" max="100" required/>
              </td>
              <td>
                <b-input v-model="record.gtuResult" size="is-small" type="number" required/>
              </td>
              <td>
                <button type="submit" class="button is-small is-info">+</button>
              </td>
            </tr>
          </table>
          </form>
          <PartBTable></PartBTable>
  </div>
</template>
<script>
import {mapState, mapGetter } from 'vuex'
import PartBTable from '@/components/SelfAppraisal/part_b_table'
export default {
  name: 'SelfAppraisalPartB',
  props: ['ayId','user'],
  components: {
    PartBTable
  },
  data() {
    return {
      record:{id:0},
      deptId:'',
      currSeme:''
    }
  },
  computed:{
  ...mapState([//....
    'departmentList', 'classList']),
    subjectList() {
        return this.$store.state.subjectStore.subjectList;
    },
    teachingRecordList(){
      return this.$store.getters['selfAppraisalStore/getTeachingRecordList']
    }
},
  watch:{
    user(){
        const ob={fEmpId:this.user.empId,fAyId:this.ayId}
        this.$store.dispatch('selfAppraisalStore/load_teaching_record_list',ob)
    }
  },
  mounted()
  {
    this.$store.dispatch('load_dept_list')
    if(this.user){
    const ob={fEmpId:this.user.empId,fAyId:this.ayId}
    this.$store.dispatch('selfAppraisalStore/load_teaching_record_list',ob)
  }
  },

  methods: {
    addRecord(){
      this.record.id=0
      this.record.fEmpId=this.user.empId
      this.record.fAyId=this.ayId
      this.$store.dispatch('selfAppraisalStore/save_apiteaching_perfomance',this.record)
        .then(rr=>{
            this.record={}
            this.$buefy.toast.open({
                  duration: 2500,
                  message: "Added Successfully",
                  position: 'is-top',
                  type: 'is-success'
              });
        }).catch(error=>{
          console.log('****',error);
          this.$buefy.toast.open({
                  duration: 5500,
                  message: error.response.data.error.message,
                  position: 'is-top',
                  type: 'is-danger'
              });
        })
    },
    changeDept(deptId){
      this.$store.dispatch('load_class_list_by_dept', deptId);
    },
    changeSubjectList(record){
      const ob={
        dept:record.fDeptId,
        sem:record.fSem
      }
      this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
    }
  }
}
</script>
<style>
</style>
