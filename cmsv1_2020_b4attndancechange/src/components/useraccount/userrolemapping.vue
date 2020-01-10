<template>
    <section style="padding-top:.5em;border-top:1px solid gray;">

      <div v-if="roleForUser" class="is-radiusless box">
           <div class="subtitle">
              <b>Role Management for User</b> {{roleForUser.username}}
           </div>
           <div class="level">
             <div class="level-left">
               <span style="margin-right:1em;" class="has-text-weight-bold">Select Role</span>
             <b-select v-model="roleId">
               <option v-for="(role,index) in roleList" :key="index" :value="role.roleId">{{role.roleName}}</option>

             </b-select>
         </div>
           <button @click="assignRoleToUser" class="button is-info">Assign Role</button>
          </div>
           <table class="table is-bordered is-fullwidth">
             <tr>
               <th width="50">Sr.</th>
               <th class="has-text-centered">Role</th>
               <th width="140"></th>
             </tr>
             <tr v-for="(role,index) in roleListForUser" :key="index">
                <td>{{index+1}}</td>
                <td class="has-text-centered">{{role.roleName}}</td>
                <td><button @click="unassignRole(role.roleId)" class="button is-danger is-small">UnAssign Role</button></td>
             </tr>
           </table>
           <div class="is-clearfix">
             <button @click="$emit('closeRoleDlg')" class="button is-pulled-right is-info">Close</button>
           </div>
      </div>
    </section>
</template>
<script>

import _ from 'lodash'
  import {mapState} from 'vuex'
    export default {
        name: 'RoleMangement',
        props: [
            'roleForUser'
        ],
        data() {
            return {
              roleId:0,
              roleListForUser:null
            }
        },
        computed:mapState({
          roleList:state=>state.userAccountStore.roleList
        }),
        watch:{
          roleForUser(){
            this.getRoleListForUser()
          }
        },
        methods:{
          getRoleListForUser(){
            this.$store.dispatch('userAccountStore/load_role_list');
            this.$store.dispatch('userAccountStore/getRoleListForUserId',this.roleForUser.id)
              .then(rr=>{
                this.roleListForUser=rr
                this.roleListForUser.map(tt=>{
                    _.remove(this.roleList,(ob)=>{
                      return (ob.roleName==tt.roleName)
                  })
                })
              })
              .catch(error=>{
                this.roleListForUser=null
                console.log('****',error);
              })
          },
          assignRoleToUser(){
            const ob={  userId:this.roleForUser.id,roleId:this.roleId}
            this.$store.dispatch('userAccountStore/assign_role_user',ob)
              .then(rr=>{
                this.getRoleListForUser()
              })
              .catch(error=>{
                console.log('****',error);
              })
          },
          unassignRole(roleId){
            const ob={userId:this.roleForUser.id,roleId:roleId}
            this.$store.dispatch('userAccountStore/unassign_role_user',ob)
              .then(rr=>{
                this.getRoleListForUser()
              })
              .catch(error=>{
                console.log('****',error);
              })
          }
        },
        created(){
          this.getRoleListForUser()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .footrbox{
        background-color: floralwhite;
        padding:.4em;
        color:#224444;
        border-top:1px solid #224444;
    }
</style>
