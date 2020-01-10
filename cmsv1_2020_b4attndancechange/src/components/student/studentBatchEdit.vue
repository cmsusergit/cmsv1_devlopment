<template>
  <div style="overflow:auto" class="modal-card is-radiusless box">

    <div class="modal-card-head">
      <p class="modal-card-title">Edit</p>
    </div>
    <div>
      <progress class="progress is-radiusless is-success" :value="completed" :max="selectedStudentList.length"></progress>
    </div>
    <div style="margin:.5em">
    </div>


    <b-tabs type="is-toggle is-boxed" expanded>
      <b-tab-item label="Edit">
        <section class="modal-card-body">
          <!-- <b-field label="Class">
            <b-select @input="classChanged" v-model="studentAcadProg.studentAcadProgressClassid" expanded>
              <option v-for="temp in classList" :value="temp.classId">{{temp.className}}</option>
            </b-select>
          </b-field>
          <b-field label="Batch">
            <b-select  v-model="studentAcadProg.studentAcadProgressBatchid" expanded>
              <option v-for="temp in batchList" :value="temp.batchId">{{temp.batchName}}</option>
            </b-select>
          </b-field> -->
          <b-field label="Sem">
            <b-select v-model="studentAcadProg.studentAcadProgressSem" expanded>
              <option v-for="indx in 10">{{indx}}</option>
            </b-select>
          </b-field>
          <b-field label="Status">
            <b-select v-model="studentAcadProg.studentAcadProgressStatus" expanded>
              <option v-for="temp in studentStatusList" :value="temp.Code">{{temp.status}}</option>
            </b-select>
          </b-field>
        </section>
      </b-tab-item>
      <b-tab-item>
      <template slot="header">
          <span style="text-decoration:underline">Your Selection:
            <b-tag rounded>{{selectedStudentList.length}}</b-tag>
          </span>
        </template>
        <b-table class="scrolledTable" :data='selectedStudentList'>
          <template slot-scope='props'>
            <b-table-column field='stuId' label="ID" width='40' sortable numeric>
              {{props.row.stuId}}
            </b-table-column>
            <b-table-column field="stuEnroll" label="Enrollment" sortable>
                {{ props.row.stuEnroll}}
            </b-table-column>
            <b-table-column field="stuCollegeId" label="College ID" sortable>
                {{ props.row.stuCollegeId }}
            </b-table-column>
            <b-table-column field='stuFirstname' label="Name" sortable>
              {{ props.row.stuTitle }} {{ props.row.stuFirstname }} {{ props.row.stuMiddlename }} {{ props.row.stuLastname }}
            </b-table-column>
          </template>
        </b-table>
      </b-tab-item>
  </b-tabs>
  <div class="level">
    <button v-if="completed<selectedStudentList.length"  @click="batchEdit" class="button is-radiusless level-item is-primary">Save</button>





    <button @click="$parent.close()" style="margin-left:.2em" class="button is-radiusless level-item is-primary">Close</button>
  </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import StudentAcadProg from '@/model/studentAcadProg'
import config from '@/../static/test1.json'
export default {
  name:"StudentBatchEdit",
  props: ['selectedStudentList'],
  data(){
    return {
      studentAcadProg:new StudentAcadProg(),
      completed:0,
      studentStatusList:config.studentStatusList
    }
  },
  computed: {
      ...mapState({//....
               batchList:state=>state.classStore.batchList,
               classList:state=>state.classList,
      })
    },
  methods: {
    batchEdit() {
      this.selectedStudentList.map(ob=>{
          // ob.fClassId=this.studentAcadProg.studentAcadProgressClassid
          // ob.fBatchId=this.studentAcadProg.studentAcadProgressBatchid
          ob.stuStatus=this.studentAcadProg.studentAcadProgressStatus
          ob.fcurrsem=this.studentAcadProg.studentAcadProgressSem
          this.$store.dispatch("studentStore/update_student_info",ob)
            .then(rr=>{
              let dt=new StudentAcadProg()
              dt.studentInfoStuId=ob.stuId
              this.$store.dispatch("studentStore/saveStudentAcadProg",dt)
                .then(r1=>{
                    this.completed=this.completed+1
                })
                .catch(e1=>{
                  console.log('****',e1);
                  this.$buefy.toast.open({
                    duration: 5500,
                    message: e1.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                  })
                })
            })
            .catch(error=>{
              console.log('****',error);
              this.$buefy.toast.open({
                duration: 5500,
                message: error.response.data.error.message,
                position: 'is-top',
                type: 'is-danger'
              })
            })
      })
    },
    //
    // classChanged(vv){
    //   this.$store.dispatch('classStore/load_batch_list_by_classid',vv)
    // }
  },
  mounted() {
    // if(this.selectedStudentList && this.selectedStudentList[0])
    //   this.$store.dispatch('load_class_list_by_dept', this.selectedStudentList[0].fDeptId);
  }
}
</script>
<style lang="css" scoped>
  .scrolledTable{    height:280px;
    overflow:auto;
  }
</style>
