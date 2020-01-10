<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">User Account Management</h1>
        </div>
        <router-link to="/addupdateuser" class="button  is-pulled-right is-primary">Add User</router-link>
        <div class="is-clearfix" style="margin-bottom: .5em;padding-bottom:.4em;"></div>

        <RoleManagement @closeRoleDlg="roleForUser=null" v-if="roleForUser" :roleForUser="roleForUser"></RoleManagement>
        <SearchBy @searchOptionChanged='searchOptionChanged' @searchByText="searchByText"/>


        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="!searching?userList:searchUserList"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column label="Sr." width="20">
                      {{props.index + 1}}
                    </b-table-column>
                    <b-table-column field="id" label="ID" width="40" numeric sortable>
                        {{ props.row.id }}
                    </b-table-column>
                    <b-table-column field="username" label="User Name" sortable>
                        {{ props.row.username}}
                    </b-table-column>
                    <b-table-column field="email" label="Email" sortable>
                        {{ props.row.email}}
                    </b-table-column>
                    <b-table-column label="Operation" centered expanded>
                        <div>
                            <button @click="updateUser(props.row.id)"  class="button is-small is-info">Edit</button>
                            <button @click="manageRole(props.row)"  class="button is-small is-info">Role Management</button>
                            <button @click="removeUser(props.row.id)"  class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import RoleManagement from '@/components/useraccount/userrolemapping'
import {mapState,mapGetters} from 'vuex'
import SearchBy from '@/components/useraccount/searchby'

export default{
                name: 'UserManagement',
                components: {
                    RoleManagement,
                    SearchBy
                },
                data() {
                    return {
                        searching: false,
                        searchOption:'User Name',
                        searchText:'',
                        searchUserList:[],
                        roleForUser:null,
                        loading:false
                    };
                },
                computed:{
                  ...mapState({
                    userList:state=>state.userAccountStore.userList
                  })
                },
                methods: {
                    manageRole(user){
                      this.roleForUser=user
                    },
                    removeUser(id){
                      this.$buefy.dialog.confirm({
                              message: 'Do you Really want to Delete Department?',
                              onConfirm: () => {
                                    this.$store.dispatch('userAccountStore/delete_user_account',id)
                                    .then(response=>{
                                      this.$buefy.toast.open({
                                              duration: 5500,
                                              message: "User with Id " + id + " Deleted",
                                              position: 'is-top',
                                              type: 'is-success'
                                          });
                                          this.$store.dispatch('userAccountStore/load_user_list')
                                    })
                                    .catch(error=>{
                                      this.$buefy.toast.open({
                                             duration: 5500,
                                             message: error,
                                             position: 'is-top',
                                             type: 'is-danger'
                                         });
                                       });
                                   }
                                 })
                    },
                    updateUser(id){
                      this.$router.push({name:'AddUserAccount',params:{id:id}})
                      this.$store.dispatch('userAccountStore/update_user_account');
                    },
                    searchOptionChanged(option){
                        this.searchOption=option;
                     },
                     searchByText(text){
                       this.searchText=text
                       this.searchBy()
                     },
                     searchBy(){
                         if (this.searchText == '') {
                             this.searching = false;
                         } else {
                             this.searching = true;


                             this.searchUserList = _.filter(this.userList, (temp) => {
                                 let tt = "";
                                 if(this.searchOption=='User Name')
                                        tt+=temp.username;
                                 else if(this.searchOption=='Email')
                                     tt+=temp.email
                                 return tt.toLowerCase().includes(this.searchText)
                             })
                         }
                   }
                },
                mounted() {
                    this.$store.dispatch('userAccountStore/load_user_list');
                    this.$store.dispatch('load_dept_list')
                    this.$store.dispatch('load_course_list')
                }
            }
</script>
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .tablebox{
        width:80vw;
        border:2px solid lightgrey;
        /*        border:1px solid white;
                overflow-y: auto;
                overflow-x: auto;
                height:  120vh;*/
    }
</style>
