<template>
        <div class="dashboard is-radiusless box boxbg">

            <div class="level">
                <h1 class="level-left is-size-4 title">
                    <p v-if="!userId">Add User</p>
                    <p v-else>Update User with ID: {{userId}}</p>
                </h1>
            </div>
            <div class="is-radiusless box" style="width:80vw;">
                <UserAccount :userInfo="userInfo"></UserAccount>
            <div class="is-radiusless box">

              <button v-if="userId" @click="update()" style="width:15%" class="button is-info is-pulled-right">Update</button>
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

import UserAccount from '@/components/useraccount/useraccount'
export default {
  name:"AddUserAccount",
  components:{
    UserAccount
  },
  data(){
    return {
      loading:false,
      userInfo:{},
      userId:null
    }
  },
  methods:{
      save(){
        this.$store.dispatch('userAccountStore/add_user_account',this.userInfo)
        .then(response=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "User Added Successfully",
                    position: 'is-top',
                    type: 'is-success'
                });
              this.$router.push({name:"UserAccount"})
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
        this.$store.dispatch('userAccountStore/update_user_account',this.userInfo)
          .then(response=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: "User Account Updated Successfully",
                    position: 'is-top',
                    type: 'is-success'
               });
               this.$router.push({name:"UserAccount"})
          }).catch(error=>{
            this.$buefy.toast.open({
                    duration: 5500,
                    message: error.response.data.error.message,
                    position: 'is-top',
                    type: 'is-danger'
                });
          })
      },
      populateUserAccountById(){
        this.$store.dispatch('userAccountStore/getUserAccountById',this.userId)
          .then(rr=>{
            this.userInfo=rr
          })
          .catch(error=>{
            console.log('****',error);
          })
      }
  },
  mounted(){
    this.userId=this.$route.params.id;
    if(this.userId){
      this.populateUserAccountById()
    }
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
