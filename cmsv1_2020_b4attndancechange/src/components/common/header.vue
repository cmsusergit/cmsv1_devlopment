<template>
  <div class="level">

    <router-link to="/">
      <img class="level-left image" style="width:14em" src="../../assets/logo.png">
    </router-link>
    <h1 class="level-item is-size-4 has-text-white">Campus Management System</h1>
    <p style="color:white">{{userName}}</p>
<!--
    <a v-if="isLoggedIn" @click="logout" id="logoutBtn" class="level-right has-text-white is-size-5">Logout</a>
 -->


     <b-dropdown v-if="isLoggedIn" aria-role='list' position="is-bottom-left">
      <button style="background-color:#224a5d" class="button is-link is-radiusless is-large" slot='trigger'>
        <span>
          <figure v-if="image" class="image is-1by1 is-32x32">
            <img v-if="image" class="is-rounded" :src="image" alt="Image !Found">
          </figure>
          <b-icon v-if="!image" icon="user-circle" size="is-large"></b-icon>
        </span>
        <b-icon pack="fas" icon="angle-down"></b-icon>
      </button>
      <b-dropdown-item aria-role="listitem">
        <a @click='openChangePwd' class="has-text-dark content">Change Password</a>
      </b-dropdown-item>
      <b-dropdown-item @click="logout" aria-role="listitem">Logout</b-dropdown-item>
    </b-dropdown>
    <b-modal :active.sync="isChangePwdDlg" scroll="keep" has-modal-card>
        <ChangePassword/>
    </b-modal>
  </div>
</template>
<script>
import config from '@/../static/test1.json'
import ChangePassword from '@/components/useraccount/changepwd'
import UserMxn from '@/mixin/user'
    export default {
        name: 'Header',
        components: {
          ChangePassword
        },
        mixins: [UserMxn],
        data() {
            return {
                userName:'',
                image:'',
                isChangePwdDlg:false
            }
        },
        computed:{
          isLoggedIn(){
            return this.$store.getters['loginStore/isLoggedIn']
          }
        },
        watch:{
          loggedInUser(){
            if(this.loggedInUser.empCode){
              this.userName=this.loggedInUser.empCode
              this.image=config.db_configuration.baseURL+'/containers/employee_photo/download/'+this.loggedInUser.empPhoto
            }
            else if(this.loggedInUser.stuEnroll){
              this.userName=this.loggedInUser.stuEnroll
              this.image=''
          }
            else {
              this.image=''
            }
          }
        },
        methods: {
          openChangePwd(){
            this.isChangePwdDlg=true
          },
          logout() {
              this.userName=''
              this.image=''
              this.$store.dispatch('loginStore/logout')
            }
        }
    }
</script>
<style scoped>
    .headerbox{
        background-color: floralwhite;
        font-weight: 400;
        color:#224444;
        border-bottom: 1px solid #224444;
    }
    #logoutBtn:hover{
      color:blue;
      text-decoration: underline;
    }
</style>
