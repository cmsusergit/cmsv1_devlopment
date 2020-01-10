<template>
    <div class="is-radiusless box" style="width:100%;overflow:auto;">

      <div class="level">
          <h1 class="level-left is-size-4 title">Employee Profile</h1>
        </div>
        <b-loading is-full-page :active.sync="uploading" ></b-loading>
        <div v-if="isAuthorizedRoleList(['CMSADMIN','HOD'])" class="is-radiusless box">
          <b-upload @input="importExcel" v-model="excelFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
              <a class="button is-info">
                  <b-icon icon="file-import"></b-icon>
                  <span>Import</span>

              </a>
          </b-upload>
        <button @click="exportToFile" class="button is-info">Export</button>
        <router-link to="/addupdateemployee" class="button  is-pulled-right is-info">Add Employee</router-link>
        <div class="is-clearfix"></div>
      </div>
        <div class="">
          <SearchBy @searchOptionChanged='searchOptionChanged' @searchByText="searchByText"/>
        </div>
        <!--<ListBy @classChanged="classChanged" @currSemChanged="currSemChanged" @courseChanged="courseChanged" @deptChanged="deptChanged"></ListBy> -->
        <div style="margin-top:1em;overflow:auto;" class="is-radiusless box">
            <b-table
                     :data="!searching?employeeList:searchEmployeeList"
                     :narrowed="true"
                     :paginated=true
                     :per-page=20
                     :loading='loading'
                     default-sort-direction="asc"
                     default-sort="stuId">
                <template slot-scope="props">
                    <b-table-column label="Sr." width="40">
                        {{ props.index + 1 }}
                    </b-table-column>


                    <b-table-column field="empCode" label="Code" width="50" sortable >
                        {{ props.row.empCode }}
                    </b-table-column>
                    <b-table-column field="firstName" label="Name" sortable>
                        {{ props.row.title }} {{ props.row.firstName }} {{ props.row.middleName }} {{ props.row.lastName }}
                    </b-table-column>
                    <b-table-column field="designationId" label="Designation" sortable>
                        {{ getDesignationById(props.row.designationId) }}
                    </b-table-column>
                    <b-table-column label="Department">
                      {{getDeptNameByID(props.row.deptId)}}
                    </b-table-column>
                    <b-table-column field="doj" label="Joining Date" sortable>
                      {{new Date(props.row.doj).toLocaleDateString()}}
                    </b-table-column>
                    <b-table-column field="dob" label="Birth Date" sortable>
                      {{new Date(props.row.dob).toLocaleDateString()}}
                    </b-table-column>
                    <b-table-column label="Gender">
<!--
                        <b-icon pack="fas"
                                :icon="props.row.gender === 'Male' ? 'mars' : 'venus'">
                        </b-icon> -->
                        {{ props.row.gender }}
                    </b-table-column>
                    <b-table-column field="email" label="Email" sortable>
                        {{ props.row.email }}
                    </b-table-column>
                    <b-table-column  centered>
                        <div>
                          <button @click="detailEmployee(props.row.empId)"  class="button is-info is-small ">
                              <b-icon pack="fas" icon="eye"></b-icon>
                          </button>
                            <button v-if="isAuthorizedRoleList(['CMSADMIN','HOD'])" @click="updateEmployee(props.row.empId)"  class="button is-dark is-small ">
                                <b-icon pack="fas" icon="edit"></b-icon>
                            </button>
                            <button v-if="isAuthorizedRoleList(['CMSADMIN','HOD'])" @click="confirmCustomDelete(props.row.empId)"  class="button is-small is-danger">
                                <b-icon pack="fas" icon="trash"></b-icon>
                            </button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
          </div>
    </div>
</template>
<script>
import XLSX from 'xlsx'
import FacultyMxn from '@/mixin/faculty'
import config from '@/../static/test1.json'
import axios from "axios"
import {mapState} from 'vuex'
import SearchBy from '@/components/employee/searchby'
export default{
        name: 'EmployeeManagement',
        components: {
          SearchBy
        },mixins: [FacultyMxn],
        data() {
            return {
              excelFile:[],
              loading:false,
              uploading:false,
              searching: false,
              searchOption:'Name',
              searchText:'',
              searchEmployeeList:[]
            };
        },
        computed: {
            ...mapState({
                    employeeList: state => state.employeeStore.employeeList
            })
        },
        methods:{
          isAuthorizedRoleList(roleNameList){
            return this.$store.getters['loginStore/isAuthorizedRoleList'](roleNameList)
          },
          updateEmployee(id){
            console.log(`****${id}****`);
            this.$router.push({name:'AddUpdateEmpPersonalProfile',params: {id: id}})
          },
          getDeptNameByID(id){
            const ob=this.$store.getters.getDeptNameById(id)
            return (ob && ob.deptName)
          },
          removeEmployee(id) {
            this.$store.dispatch('employeeStore/remove_employee_personal',id)
              .then(rr=>{
                this.$buefy.toast.open({
                      duration: 5500,
                      message: "Employee with Id " + id + " Removed",
                      position: 'is-top',
                      type: 'is-success'
                })
              })
              .catch(error=>{
                this.$buefy.toast.open({
                  duration: 5500,
                  message: error.response.data.error.message,
                  position: 'is-top',
                  type: 'is-danger'
                })
              })
          },
          confirmCustomDelete(id){
            this.$buefy.dialog.confirm({
                title: 'Deleting account',
                message: 'Are you sure you want to <b>delete</b> your Employee With ID ' + id + '? This action cannot be undone.',
                confirmText: 'Delete Employee',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    this.removeEmployee(id)
                  }
            })
          },
          importExcel() {
              this.uploadExcelFile()
          },
          detailEmployee(id){
            this.$router.push({name: 'EmployeeDetail', params: {id: id}})
          },
          uploadExcelFile() {
              this.uploading = true;
              const url1 = config.db_configuration.baseURL + "/containers/test1/upload"
              let fd = new FormData()
              console.log('****',this.excelFile);
              fd.append('type','employeelist')
              fd.append('excel', this.excelFile[0])
              axios.post(url1, fd).then(response => {
                  console.log('****', response);
                  this.$store.dispatch('employeeStore/load_employee_list')
                  this.uploading = false;
              })
              .catch(error => {
                  this.uploading = false;
                  console.log('****', error);
              });
          },

          exportToFile(){
              console.log("EXPORT FILE");
              let list1=new Array()
              const fieldList=["empId","empCode","title","firstName","middleName","lastName","address","gender","panNumber","uanNumber","aadharNumber","pfNumber"]
              if(!this.searching){
                this.employeeList.map(ob=>{
                    let temp=_.pick(ob,fieldList)
                    temp.DateOfJoining=new Date(ob.doj).toLocaleDateString()
                    temp.Designation=this.getDesignationById(ob.designationId)
                    list1.push(temp)
                })
              }
              else {
                this.searchEmployeeList.map(ob=>{
                    let temp=_.pick(ob,fieldList)
                    temp.DateOfJoining=new Date(ob.doj).toLocaleDateString()
                    temp.Designation=this.getDesignationById(ob.designationId)
                    list1.push(temp)
                })
              }

              const wsheet=XLSX.utils.json_to_sheet(list1)
              const wb=XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb,wsheet,"employee_list")
              XLSX.writeFile(wb,"employeelist.xlsx")
              console.log("EXPORTFILE DONE");
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
                   this.searchEmployeeList = _.filter(this.employeeList, (temp) => {
                       let tt = "";
                       if(this.searchOption=='Name')
                              tt+=temp.firstName+" "+temp.middleName+" "+temp.lastName;
                       else if(this.searchOption=='Employee Code')
                           tt+=temp.empCode
                       return tt.toLowerCase().includes(this.searchText)
                   })
               }
         }
       },
        mounted() {
          this.$store.dispatch('load_dept_list')
          this.$store.dispatch('employeeStore/load_employee_list')
        }
    }
</script>

<style scoped>
    .boxbg{
        background-color: rgb(241,241,242);
        color:white;
    }
    .tablebox{
        /*        border:1px solid white;
                overflow-y: auto;
                overflow-x: auto;
                height:  120vh;*/
    }
</style>
