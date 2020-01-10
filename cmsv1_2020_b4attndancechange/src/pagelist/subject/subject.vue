<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Subject Management</h1>
        </div>
        <router-link to="/addupdatesubject" class="button  is-pulled-right is-primary">Add Subject</router-link>
        <div class="is-clearfix" style="margin-bottom: .5em;padding-bottom:.4em;"></div>





        <div class="is-radiusless box">
          <b-field label="Department" expanded>
              <b-select @input="deptChanged" v-model="deptId" expanded>
                <option value="-1">All</option>
                <option v-for="dp in departmentList" :value="dp.deptId">{{dp.deptName}}</option>
              </b-select>
          </b-field>
        </div>
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="deptId==-1?subjectList:subjectListByDept"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column label="Sr." width="20">
                      {{props.index + 1}}
                    </b-table-column>
                    <!--
                    <b-table-column field="subId" label="ID" width="40" numeric sortable>
                        {{ props.row.subId }}
                    </b-table-column> -->
                    <b-table-column field="subName" label="Subject Name" sortable>
                        {{ props.row.subName}}
                    </b-table-column>
                    <b-table-column field="subAlias" label="Alias" sortable>
                        {{ props.row.subAlias }}
                    </b-table-column>
                    <b-table-column field="subCode" label="Subject Code" sortable>
                        {{ props.row.subCode}}
                    </b-table-column>
                    <!-- <b-table-column field="subjectEffectiveFrom" label="EffectiveFrom" centered sortable>
                        <span class="tag is-secondary">
                            {{ new Date(props.row.subjectEffectiveFrom).toLocaleDateString() }}
                        </span>
                    </b-table-column> -->
                    <b-table-column field="subjectType" label="Subject Type" sortable>
                        {{ props.row.subType }}
                    </b-table-column>
                    <b-table-column field="subjectCourse" label="Department" sortable>
                        {{deptNameById(props.row.subjectDept)}}
                      </b-table-column>
                    <b-table-column field="subjectCourse" label="Course" sortable>
                        {{ courseNameById(props.row.subjectCourse)}}
                    </b-table-column>
                    <b-table-column field="subjectSem" label="Sem" sortable>
                        {{ props.row.subjectSem}}
                    </b-table-column>
                    <b-table-column label="Operation" centered>
                        <div>
                            <button @click="updateSubject(props.row.subId)" style="width:40%;" class="button is-small is-info">Edit</button>
                            <button @click="removeSubject(props.row.subId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import {mapState,mapGetters} from 'vuex'
            export default{
                name: 'StudentManagement',
                data() {
                    return {
                        loading:false,
                        deptId:-1,
                        subjectListByDept:'',
                        listBy:false
                    }
                },
                computed:{
                  ...mapState({
                    courseList:state=>state.courseList,
                    deptList:state=>state.departmentList,
                    subjectList:state=>state.subjectStore.subjectList,
                    departmentList:state=>state.departmentList
                  })
                },
                methods: {
                    removeSubject(id){
                      this.$buefy.dialog.confirm({
                              message: 'Do you Really want to Delete Department?',
                              onConfirm: () => {
                                    this.$store.dispatch('subjectStore/DELETE_SUBJECT_INFO',id)
                                    .then(response=>{
                                      this.$buefy.toast.open({
                                              duration: 5500,
                                              message: "Subject with Id " + id + " Deleted",
                                              position: 'is-top',
                                              type: 'is-success'
                                          });
                                          this.$store.dispatch('subjectStore/LOAD_SUBJECT_LIST')
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
                    deptNameById(id){
                      let deptName=''
                      this.deptList.map(ob=>{
                            if(ob.deptId==id)
                              deptName=ob.deptName
                      })
                      return deptName
                    },
                    courseNameById(id){
                      let courseName=''
                      this.courseList.map(ob=>{
                            if(ob.courseId==id)
                              courseName=ob.courseName
                      })
                      return courseName
                    },
                    updateSubject(id){
                      this.$router.push({name:'AddUpdateSubject',params:{id:id}})
                      this.$store.dispatch('subjectStore/UPDATE_SUBJECT_INFO');
                    },
                    deptChanged(dept){
                        this.subjectListByDept=_.filter(this.subjectList,ob=>{return ob.subjectDept==this.deptId})
                    }
                },
                mounted() {
                    this.$store.dispatch('subjectStore/LOAD_SUBJECT_LIST');
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
