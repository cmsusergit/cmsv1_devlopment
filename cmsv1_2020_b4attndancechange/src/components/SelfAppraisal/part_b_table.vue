 <template>
    <div style="margin-top:1em;width:100%;">

      <b-table v-if="teachingRecordList && teachingRecordList.length > 0" bordered :data="teachingRecordList" style="font-size:80%">
          <template slot-scope="props">
              <b-table-column label="Sr." width="40" numeric>
                  {{ props.index+1 }}
              </b-table-column>
              <b-table-column field="fDeptId" label="Branch">{{getDeptName(props.row.fDeptId)}}</b-table-column>
              <b-table-column field="fSem" label="Sem">{{props.row.fSem}}</b-table-column>
              <b-table-column field="fSubjectId" label="Subject Tought(Theory Only)">{{getSubjectName(props.row.fSubjectId)}}</b-table-column>
              <b-table-column field="fClassId" label="Class(Div.)">{{getClassName(props.row.fClassId)}}</b-table-column>

              <b-table-column field="studentCount" label="Number of Students">{{props.row.studentCount}}</b-table-column>
              <b-table-column field="avgAttendance" label="Avg. Attendance">
                {{props.row.avgAttendance}}
              </b-table-column>
              <b-table-column field="instituteResult" label="Institute Result">
                {{props.row.instituteResult}}
              </b-table-column>
              <b-table-column field="gtuResult" label="GTU Result">{{props.row.gtuResult}}</b-table-column>
              <b-table-column label="Points Calculated">{{props.row.instituteResult>=props.row.gtuResult?20:0}}</b-table-column>
              <b-table-column centered>
                      <button @click="removeRecord(props.row.id)"  class="button is-small is-danger">
                          <b-icon pack="fas" icon="trash" size="is-small"></b-icon>
                      </button>
              </b-table-column>
          </template>
        </b-table>
           <p class="tag has-text-weight-bold is-radiusless is-large" style="border:1px solid lightgrey;width:100%;">Total Points: {{totalPt}}
          {{totalPt==60?'Max Limit Reached':''}}
        </p>
      <!--
      <div v-if="isAuthorizedRoleList(['CMSADMIN','PRINCIPAL','HOD'])"  class="is-clearfix" style="margin-top:1em;">
        <button class="button is-radiusless is-pulled-right is-info" style="width:25%;">Approve</button>
      </div> -->
  </div>
</template>
<script>
import {mapState, mapGetter } from 'vuex'
import userMxn from '@/mixin/user'
export default {
  name: 'PartBTable',
  mixins: [userMxn],
  data() {
    return {
      subjectNameList:[],
      totalPt:0
    }
  },
  computed:{
  ...mapState([//....
    'departmentList', 'classList']),
    teachingRecordList(){
      return this.$store.getters['selfAppraisalStore/getTeachingRecordList']
    }
},
watch:{
    teachingRecordList(){
      this.totalPt=0
      this.teachingRecordList.map(ob=>{
          if(ob.instituteResult >= ob.gtuResult)
            this.totalPt+=20
      })
      if (this.totalPt>60) {
        this.totalPt=60
      }
    }
},
mounted()
  {
    this.$store.dispatch('subjectStore/getSubjectNameList').then(rr=>{
      this.subjectNameList=rr.data
    }).catch(error=>{
      console.log('****',error);
      this.subjectNameList=[]
    })
    this.$store.dispatch('load_dept_list')
    this.$store.dispatch('load_class_list_by_dept','All');
  },
  methods: {
    removeRecord(id){
      this.$store.dispatch('selfAppraisalStore/remove_teaching_record',id)
        .then(rr=>{
          this.$buefy.toast.open({
                duration: 2500,
                message: "Removed Successfully",
                position: 'is-top',
                type: 'is-success'
            });
        })
        .catch(error=>{
          this.$buefy.toast.open({
                  duration: 5500,
                  message: error.response.data.error.message,
                  position: 'is-top',
                  type: 'is-danger'
              });
        })
    },
    getClassName(id){
      const temp=_.find(this.classList,ob=>{
        return ob.classId==id
      })
      return temp?temp.className:''
    },
    getDeptName(id){
      const tt=_.find(this.departmentList,ob=>{
        return ob.deptId==id
      })
      return tt?tt.deptName:''
    },
    getSubjectName(id){
      const tt=_.find(this.subjectNameList,ob=>{return ob.subId==id})
      return tt?tt.subName:''
    }
  }
}
</script>
<style>
</style>
