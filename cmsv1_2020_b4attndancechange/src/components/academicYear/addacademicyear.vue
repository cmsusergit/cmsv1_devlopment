<template> 
  <div class="is-radiusless box">

<b-field grouped>
    <b-field label="Acadamic Year Id" expanded>
      <b-input v-model="academicYearInfo.ayId" disabled></b-input>
    </b-field>
    <b-field label="Batch Year" expanded>
        <b-input v-model="academicYearInfo.ayBatchYear" expanded></b-input>
    </b-field>
    </b-field>
    <b-field grouped>
      <b-field label='Start Date' expanded>
        <b-datepicker v-model="academicYearInfo.ayStartDate"/>
      </b-field>
      <b-field label='End Date' expanded>
        <b-datepicker v-model="academicYearInfo.ayEndDate"/>
      </b-field>
    </b-field>
    <b-field label="Comments" expanded>
      <b-input v-model="academicYearInfo.ayComment" type="textarea" required></b-input>
    </b-field>
    <div class="level level-right">
      <button @click="addAcademicYear" class="button is-radiusless  is-primary level-item">Add Academicyear</button>
      <button v-if="academicYearInfo.ayId!==0" @click="updateAcademicYear" class="button is-radiusless is-primary level-item">Update Academicyear</button>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
    </b-loading>
  </div>
</template>
<script>

import {mapState} from 'vuex'
export default {
  name: 'addAcademicYear',
  props: ['academicYearInfo'],
  data() {
      return {
        loading:false,
      }
  },
  methods:{
      addAcademicYear(){
        if(this.academicYearInfo.ayId!==0){
          this.$buefy.dialog.confirm({
                    message: 'This Will Add New Academic Year,Really want to Continue?',
                    onConfirm: () => {
                      this.academicYearInfo.ayId=0
                      this.addAcademicYear1();
                    }
                })
        }
        else{
          this.addAcademicYear1();
        }
},
addAcademicYear1(){
        this.loading=true;
        this.$store.dispatch('acadyearStore/add_academic_year',this.academicYearInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Academic Year Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.academicYearInfo={}
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Error\n"+error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
                this.loading=false;
          });
       },
      updateAcademicYear(){
        this.loading=true;
        this.$store.dispatch('acadyearStore/update_academic_year',this.academicYearInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Acadamic Year Updated Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.academicYearInfo={}
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Error\n"+error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
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
