<template lang="html">
  <div class="is-radiusless box">

<b-field grouped>
    <b-field label="Designation Name" expanded>
      <b-input v-model="designationInfo.desgName" required></b-input>
    </b-field>
    <b-field label="Designation Alias" expanded>
          <b-input v-model="designationInfo.desgAlias" required></b-input>
    </b-field>
    </b-field>
    <div class="level level-right">

      <button @click="addDesignation" class="button is-radiusless  is-primary level-item">Add Designation</button>
      <button v-if="designationInfo.desgName!=='' " @click="updateDesignation" class="button is-radiusless is-primary level-item">Update Designation</button>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
    </b-loading>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'AddDesignation',
  props: ['designationInfo'],
  data() {
      return {
        loading:false,
      }
  },
  methods:{
      addDesignation(){
        if(this.designationInfo.desgName!==''){
          this.$buefy.dialog.confirm({
                    message: 'This Will Add New Designation,Really want to Continue?',
                    onConfirm: () => {
                      this.addDesignation1();
                    }
                })
        }
        else{
          this.addDesignation1();
        }
},
addDesignation1(){
        this.loading=true;
        this.designationInfo.desgId=0;
        this.$store.dispatch('designationStore/add_designation',this.designationInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Designation Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Error in Adding Designation\n"+error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
                this.loading=false;
          });
      },
      updateDesignation(){
        this.loading=true;

        this.$store.dispatch('designationStore/update_designation',this.designationInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Designation Updated Successfully",
                    position: 'is-top',type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Error in Updating Designation\n"+error.response.data.error.message,
                    position: 'is-top',type: 'is-danger'
                });
                this.loading=false;
          });
      }
  },
  created(){
  }
}
</script>
<style lang="css" scoped>
</style>
