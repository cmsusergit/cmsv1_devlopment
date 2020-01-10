<template lang="html">
  <div class="is-radiusless box">

<b-field grouped>
    <b-field label="Select Department" expanded>

        <b-select @input="deptChanged" v-model="studentBatchInfo.fDeptId" expanded>
          <option v-for="dp in departmentList" :value="dp.deptId">
            {{dp.deptName}}
          </option>
        </b-select>
    </b-field>
    <b-field label="Select Class" expanded>
        <b-select v-model="studentBatchInfo.fClassId" expanded>
          <option v-for="dp in classList" :value="dp.classId">
            {{dp.className}}
          </option>
        </b-select>
    </b-field>
  </b-field>
  <b-field label="Batch Name" expanded>
    <b-input :disabled='!studentBatchInfo.fDeptId || !studentBatchInfo.fClassId' v-model="studentBatchInfo.batchName" required></b-input>
  </b-field>
    <div class="level level-right">
      <button @click="addBatch" class="button is-radiusless  is-primary level-item">Add Batch</button>

      <button v-if="studentBatchInfo.batchName && studentBatchInfo.batchName!=='' " @click="updateBatch" class="button is-radiusless is-primary level-item">Update Batch</button>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
    </b-loading>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'AddBatch',
  props: ['studentBatchInfo'],
  data() {
      return {
        loading:false,
      }
  },
  computed:mapState([
    'classList',
    'departmentList'
  ]),
  methods:{
      addBatch(){
        if(this.studentBatchInfo.batchName!==''){
          this.$buefy.dialog.confirm({
                    message: 'This Will Add New Batch,Really want to Continue?',
                    onConfirm: () => {
                      this.addBatch1();
                    }
                })
        }
        else{
          this.addBatch1();
        }
},
addBatch1(){
        this.loading=true;
        this.studentBatchInfo.batchId=0;
        this.$store.dispatch('classStore/add_batch',this.studentBatchInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Batch Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Error in Adding Batch\n"+error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
                this.loading=false;
          });
      },
      updateBatch(){
        this.loading=true;
        this.$store.dispatch('classStore/update_batch',this.studentBatchInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Batch Updated Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Error in Updating Batch\n"+error.response.data.error.message,
                    position: 'is-top',type: 'is-danger'
                });
                this.loading=false;
          });
      },

  deptChanged(){
      if(this.studentBatchInfo.fDeptId)
        this.$store.dispatch('load_class_list_by_dept',this.studentBatchInfo.fDeptId)
  }
},
created(){
    this.$store.dispatch('load_dept_list')
    if(this.studentBatchInfo.fDeptId)
      this.$store.dispatch('load_class_list_by_dept',this.studentBatchInfo.fDeptId)
  }
}
</script>
<style lang="css" scoped>
</style>
