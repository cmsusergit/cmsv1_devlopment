<template lang="html"> 
  <div class="is-radiusless box">

<b-field grouped>
    <b-field label="Class Name" expanded>
      <b-input v-model="studentClassInfos.className" required></b-input>
    </b-field>
    <b-field label="Department" expanded>

        <b-select v-model="studentClassInfos.fDeptId" expanded>
          <option v-for="dp in departmentList" :value="dp.deptId">
            {{dp.deptName}}
          </option>
        </b-select>
    </b-field>
    </b-field>
    <div class="level level-right">
      <button @click="addClass" class="button is-radiusless  is-primary level-item">Add Class</button>
      <button v-if="studentClassInfos.className!=='' " @click="updateClass" class="button is-radiusless is-primary level-item">Update Class</button>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
    </b-loading>
  </div>
</template>
<script>

import {mapState} from 'vuex'
export default {
  name: 'AddClass',
  props: ['studentClassInfos'],
  data() {
      return {
        loading:false,
      }
  },
  computed:mapState([

    'departmentList'
  ]),
  methods:{
      addClass(){
        if(this.studentClassInfos.className!==''){
          this.$buefy.dialog.confirm({
                    message: 'This Will Add New Class,Really want to Continue?',
                    onConfirm: () => {
                      this.addClass1();
                    }
                })
        }
        else{
          this.addClass1();
        }
},

addClass1(){
        this.loading=true;
        this.studentClassInfos.classId=0;
        this.$store.dispatch('classStore/add_class',this.studentClassInfos)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Class Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Error in Adding Class\n"+error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
                this.loading=false;
          });
      },
      updateClass(){
        this.loading=true;
        this.$store.dispatch('classStore/update_class',this.studentClassInfos)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Class Updated Successfully",
                    position: 'is-top',type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Error in Updating Class\n"+error.response.data.error.message,
                    position: 'is-top',type: 'is-danger'
                });
                this.loading=false;
          });
      }
  },
  created(){
    this.$store.dispatch('load_dept_list')
  }
}
</script>
<style lang="css" scoped>
</style>
