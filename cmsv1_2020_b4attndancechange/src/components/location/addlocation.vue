<template lang="html">
  <div class="is-radiusless box">

<b-field grouped>
    <b-field label="Location Name" expanded>
      <b-input v-model="locationInfo.locName" required></b-input>
    </b-field>
    <b-field label="Department" expanded>
        <b-select v-model="locationInfo.fDeptId" expanded>
          <option v-for="dp in departmentList" :value="dp.deptId">{{dp.deptName}}</option>
        </b-select>
    </b-field>


    </b-field>
    <b-field label="Description" expanded>
      <b-input v-model="locationInfo.locDescription" type="textarea" required></b-input>
    </b-field>
    <div class="level level-right">
      <button @click="addLocation" class="button is-radiusless  is-primary level-item">Add Location</button>
      <button v-if="locationInfo.locId!==0" @click="updateLocation" class="button is-radiusless is-primary level-item">Update Location</button>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
    </b-loading>
  </div>
</template>
<script>

import {mapState} from 'vuex'
export default {
  name: 'AddLocation',
  props: ['locationInfo'],
  data() {
      return {
        loading:false,
      }
  },
  computed:mapState([
    'departmentList',
  ]),
  methods:{
      addLocation(){
        if(this.locationInfo.locId!==0){
          this.$buefy.dialog.confirm({
                    message: 'This Will Add New Location,Really want to Continue?',
                    onConfirm: () => {
                      this.locationInfo.locId=0
                      this.addLocation1();
                    }
                })
        }
        else{
          this.addLocation1();
        }
},
addLocation1(){
        this.loading=true;
        this.$store.dispatch('locStore/add_location',this.locationInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Location Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "Error in Adding Location\n"+error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
                this.loading=false;
          });
      },
      updateLocation(){
        this.loading=true;
        this.$store.dispatch('locStore/update_location',this.locationInfo)
          .then(rr=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Location Updated Successfully",
                    position: 'is-top',type: 'is-success'
                });
                this.loading=false;
          })
          .catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,message: "Error in Adding Location\n"+error.response.data.error.message,
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
