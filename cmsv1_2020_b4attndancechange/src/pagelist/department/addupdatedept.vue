<template>
    <div style="width:100%">

        <div class="dashboard is-radiusless box boxbg">
            <div class="level">

                <h1 class="level-left is-size-4 title">
                    <p v-if="!deptId">Add Department</p>
                    <p v-else>Update Department with Name: {{deptId}}</p>
                </h1>
            </div>


            <div class="is-radiusless box">
            <b-field grouped>
                <b-field label="Department Name" expanded >
                     <b-input v-model="deptInfo.deptName" required></b-input>
                </b-field>
                <b-field label="Department Alias" >
                      <b-input  v-model="deptInfo.deptAlias" required></b-input>
                </b-field>
                <b-field label="Department Code" >
                           <b-input v-model="deptInfo.deptCode" required></b-input>
                       </b-field>
            </b-field></div>
            <div class="is-radiusless box">
              <button v-if="deptId" @click="update()" style="width:15%" class="button is-info is-pulled-right">Update</button>
              <button v-else @click="save()" style="width:15%" class="button is-info is-pulled-right">Save</button>
              <div class="is-clearfix">
              </div>
            </div>
        </div>
        <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
        </b-loading>
    </div>
</template>
<script>
export default {
  name:"AddUpdateStudent",
  components:{
  },
  data(){
    return {
      loading:false,
      deptInfo:{
          fOrganizationId:1
      },
      deptId:null
    }
  },
  methods:{
      save(){
         this.$store.dispatch('deptStore/ADD_DEPT_INFO',this.deptInfo)
           .then(response=>{
                  this.$router.push({name:"Department"})
                 this.$buefy.toast.open({
                     duration: 5500,
                     message: "Department Added Successfully",
                     position: 'is-top',
                     type: 'is-success'
                 });
           }).catch(error=>{
             this.$buefy.toast.open({
                     duration: 5500,
                     message: error.response.data.error.message,
                     position: 'is-top',
                     type: 'is-danger'
                 });
           })
      },
      update(){
         this.$store.dispatch('deptStore/UPDATE_DEPT_INFO',this.deptInfo)
           .then(response=>{
                this.$router.push({name:"Department"})
                this.$buefy.toast.open({
                     duration: 5500,
                     message: "Department Updated Successfully",
                     position: 'is-top',
                     type: 'is-success'
                 });
           }).catch(error=>{
             this.$buefy.toast.open({
                     duration: 5500,
                     message: error.response.data.error.message,
                     position: 'is-top',
                     type: 'is-danger'
                 });
           })
      },
      populateDept(){
          this.$store.dispatch('deptStore/getDeptNameByID',this.deptId)
            .then(response=>{
              console.log(this.deptInfo);
              this.deptInfo=response
            })
            .catch(error=>{
              console.log('****',error);
            })
      }
  },
  mounted(){
    this.deptId=this.$route.params.id;
    if(this.deptId)
    this.populateDept()
    console.log('****',this.deptId)
  }
}
</script>
<style scoped>
    .boxbg{
        width:100%;
        background-color: lightgrey;

        color:#224444;
        height:100%;
    }
</style>
