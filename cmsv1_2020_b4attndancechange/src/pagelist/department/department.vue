<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Department Management</h1>
        </div>
      <router-link to="/addupdatedept" class="button  is-pulled-right is-primary">Add Department</router-link>
        <div class="is-clearfix" style="margin-bottom: .5em;padding-bottom:.4em;"></div>
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="departmentList"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">

                    <b-table-column label="Sr." centered>
                        {{ props.index+1 }}
                    </b-table-column>
                    <b-table-column field="deptId" label="ID"  centered sortable>
                        {{ props.row.deptId }}
                    </b-table-column>
                    <b-table-column field="deptname" label="Department Name"  sortable>
                        {{ props.row.deptName }}
                    </b-table-column>
                    <b-table-column field="deptalias" label="Alias" centered sortable>
                        {{ props.row.deptAlias}}
                    </b-table-column>
                    <b-table-column field="depatcode" label="Department Code" centered sortable>
                        {{ props.row.deptCode }}
                    </b-table-column>

                    <b-table-column label="Operation" centered>
                        <div>
                            <button @click="updateDept(props.row.deptId)" style="width:40%;" class="button is-small is-info">Edit</button>
                            <button @click="removeConfirmDept(props.row.deptId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
            export default{
                name: 'StudentManagement',
                data() {
                    return {
                      loading:false
                    };
                },
                computed:{
                  ...mapState({
                    departmentList:state=>state.departmentList
                  })
                },
                methods: {
                    removeConfirmDept(id){
                      this.$buefy.dialog.confirm({
                              message: 'Do you Really want to Delete Department?',
                              onConfirm: () => {
                                this.removeDept(id)
                              }
                            })
                          },
                    removeDept(id){
                      this.$store.dispatch('deptStore/REMOVE_DEPT_INFO',id)
                        .then(response=>{
                             this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Department Deleted Successfully,Please Refresh to see Changes",
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
                    updateDept(id){
                      this.$router.push({name:'AddUpdateDept',params:{id:id}})
                    }
                },
                mounted() {
                    this.$store.dispatch('load_dept_list');
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
