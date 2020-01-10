<template>
    <div class="is-radiusless box">

        <div class="level">
            <h1 class="level-left is-size-4 title">Student Management</h1>
        </div>
        <b-loading is-full-page :active.sync="uploading" ></b-loading>
        <div v-if="isAuthorizedRoleList(['CMSADMIN','STUDENT_COORD','HOD'])" class="level is-radiusless box">
          <div class="level-left">
          <b-upload @input="importExcel" v-model="excelFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
              <a class="button is-info">
                  <b-icon icon="file-import"></b-icon>

                  <span>Import</span>
              </a>
          </b-upload>
          <button @click='exportToFile' style="margin-left:.5em" class="button is-info">Export</button>
          </div>
          <div class="level-right">
          <router-link to="/addupdatestudent" class="button level-right is-info">Add Student</router-link>
          <b-switch v-model="isBatchEdit" style="margin-left:.5em;" class="button">Edit Student List</b-switch>
        </div>
        </div>
        <ListBy @classChanged="classChanged"  @batchChanged="batchChanged" @currSemChanged="currSemChanged" @courseChanged="courseChanged" @deptChanged="deptChanged"></ListBy>
        <SearchBy :studentList="studentList" @searchOptionChanged='searchOptionChanged' @searchByText="searchByText" />

        <div style="overflow:auto;width:100%;">
            <b-table class=""
                     :data="!searching?studentList:searchStudentList"
                     :paginated=true
                     :per-page=100
                     :loading='loading'
                     default-sort-direction="asc"
                     default-sort="stuId"
                     detailed
                     :checked-rows.sync='selectedStudentList'
                     :checkable="isBatchEdit"
                     >
                <template slot-scope="props">
                  <b-table-column label="Sr." width="40" numeric>
                        {{ props.index+1 }}
                    </b-table-column>
                    <b-table-column field="stuEnroll" label="Enrollment" sortable>
                        {{ props.row.stuEnroll}}
                    </b-table-column>
                    <b-table-column field="stuCollegeId" label="College ID" sortable>
                        {{ props.row.stuCollegeId }}
                    </b-table-column>
                    <b-table-column field="stuFirstname" label="Name" sortable>
                        {{ props.row.stuTitle }} {{ props.row.stuFirstname }} {{ props.row.stuMiddlename }} {{ props.row.stuLastname }}
                    </b-table-column>
                    <b-table-column field="stuDob" label="Birth Date" centered sortable>
                        <span class="tag is-secondary">
                            {{new Date(props.row.stuDob).toLocaleDateString() }}
                        </span>
                    </b-table-column>
                    <b-table-column label="Gender">
<!--
                        <b-icon pack="fas"
                                :icon="props.row.stuGender === 'Male' ? 'mars' : 'venus'">
                        </b-icon> -->
                        {{ props.row.stuGender }}
                    </b-table-column>
                    <b-table-column field="stuEmail" label="Email" sortable>
                        {{ props.row.stuEmail }}
                    </b-table-column>
                    <b-table-column  centered>
                        <div>
                            <button @click="detailStudent(props.row.stuId)"  class="button is-info is-small ">
                                <b-icon pack="fas" icon="eye"></b-icon>
                            </button>
                            <button v-if="isAuthorizedRoleList(['CMSADMIN','STUDENT_COORD','HOD'])" @click="updateStudent(props.row.stuId)"  class="button is-dark is-small ">
                                <b-icon pack="fas" icon="edit"></b-icon>
                            </button>
                            <button v-if="isAuthorizedRoleList(['CMSADMIN','STUDENT_COORD','HOD'])" @click="confirmCustomDelete(props.row.stuId,props.row.stuPhoto)"  class="button is-small is-danger">
                                <b-icon pack="fas" icon="trash"></b-icon>
                            </button>
                            </button>
                        </div>
                    </b-table-column>
                </template>
                <template slot="detail" slot-scope="props">
                    <div class="card">
                        <StudentDetail :studentInfo="props.row"></StudentDetail>
                    </div>
                </template>
            </b-table>
        </div>
        <div v-if="isBatchEdit" style="margin-top:1em;">
          <button :disabled='selectedStudentList.length==0' @click='openBatchEditDlg' class="button is-info">Edit Student List</button>
        </div>
        <b-modal scroll="keep" :active.sync="openBatchEdit" :width="800" has-modal-card>
          <StudentBatchEdit :selectedStudentList='selectedStudentList'/>
        </b-modal>
    </div>
</template>
<script>
    import ListBy from '@/components/student/listby'
    import SearchBy from '@/components/student/searchby'
    import StudentDetail from '@/components/student/studentdetail'
    import {mapState} from 'vuex'
    import XLSX from 'xlsx'
    import config from '@/../static/test1.json'
    import axios from "axios"
    import StudentBatchEdit from '@/components/student/studentBatchEdit'
    export default{
        name: 'StudentManagement',
        components: {
          ListBy,
          SearchBy,
          StudentDetail,
          StudentBatchEdit
        },
        data() {
            return {
                uploading: false,
                openBatchEdit:false,
                excelFile: null,

                listBy: {'dept': 'All', 'course': 'All', 'class': 'All', 'sem': 'All'},
                searchStudentList: [],
                searching: false,
                searchText:'',
                searchOption:'Enrollment',
                selectedStudentList:[],
                isBatchEdit:false
            };
        },
        computed: {
            ...mapState({
                    studentList: state => state.studentStore.studentList,
                    loading: state => state.studentStore.loading
            })
        },
        methods: {
            deptChanged(dept) {
                this.listBy.dept = dept;
                this.$store.dispatch('studentStore/load_student_list', this.listBy)
                this.selectedStudentList=[]
            },
            currSemChanged(cseme) {
                this.listBy.sem = cseme;
                this.selectedStudentList=[]
                this.$store.dispatch('studentStore/load_student_list', this.listBy)
            },
            classChanged(cl) {
              if(cl!='All'){
                  this.listBy.class=cl
                  this.$store.dispatch('classStore/load_batch_list_by_classid',cl)
                  const ob={allocationDetail:{
                    classId:this.listBy.class,
                  }}
                  this.selectedStudentList=[]
                  this.$store.dispatch('studentStore/load_student_list_by_class_batch', ob)
                }
                else{
                  this.selectedStudentList=[]
                  this.$store.dispatch('studentStore/load_student_list', this.listBy)
                }
            },
            batchChanged(value) {
                let ob={
                  allocationDetail:{
                    classId:this.listBy.class
                  }
                }
                if(value!='All')
                  ob.allocationDetail.batchId=value
                this.$store.dispatch('studentStore/load_student_list_by_class_batch', ob)
            },
            courseChanged(course) {
                this.listBy.course = course;
                this.selectedStudentList=[]
                this.$store.dispatch('studentStore/load_student_list', this.listBy)
            },

            removeStudent(id,path) {
              this.$store.dispatch('studentStore/remove_student_info',id)
                .then(rr=>{
                  this.$store.dispatch('studentStore/remove_student_photo',path)
                  this.$buefy.toast.open({
                        duration: 5500,
                        message: "Student with Id " + id + " Removed",
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
            updateStudent(id) {
                this.$router.push({name: 'AddUpdateStudent', params: {id: id}})
            },
            confirmCustomDelete(id,path) {
                this.$buefy.dialog.confirm({
                    title: 'Deleting account',
                    message: 'Are you sure you want to <b>delete</b> ? This action cannot be undone.',
                    confirmText: 'Delete',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.removeStudent(id,path)
                      }
                })
            },
            detailStudent(id) {
                this.$router.push({name: 'StudentDetail', params: {id: id}})
            },
            importExcel() {

                console.log('****', this.excelFile.name);
                this.uploadExcelFile()
            },
            uploadExcelFile() {
                this.uploading = true;
                const url1 = config.db_configuration.baseURL + "/containers/test1/upload"
                let fd = new FormData()
                fd.append('type','studentlist')
                fd.append('excel', this.excelFile)
                axios.post(url1, fd).then(response => {
                    console.log('****', response);
                    this.$store.dispatch('studentStore/load_student_list', this.listBy)
                    this.uploading = false;
                })
                .catch(error => {
                    this.uploading = false;
                    console.log('****', error);
                });
            },
            searchByText(text) {
                this.searchText=text;

                this.searchBy();
            },
           searchOptionChanged(option){
               this.searchOption=option;
            },
            searchBy(){
                if (this.searchText == '') {
                    this.searching = false;
                } else {
                    this.searching = true;
                    this.searchStudentList = _.filter(this.studentList, (temp) => {
                        let tt = "";
                        if(this.searchOption=='Name')
                               tt+=temp.stuFirstname+" "+temp.stuMiddlename+" "+temp.stuLastname;
                        else if(this.searchOption=='Enrollment')
                            tt+=temp.stuEnroll
                         else if(this.searchOption=='CollegeId')
                            tt+=temp.stuCollegeId
                         else if(this.searchOption=='Email')
                            tt+=temp.stuEmail
                        return tt.toLowerCase().includes(this.searchText)
                    })
                }
            },
              getValidDate(temp){
                date=new Date(temp)
                const dateUTC = new Date(Date.UTC(date.getFullYear(),
                          date.getMonth(),
                          date.getDate()
                 ))
                 return dateUTC.toLocaleDateString()
              },
           openBatchEditDlg(){
             this.openBatchEdit=true
           },

           isAuthorizedRoleList(roleNameList){
             return this.$store.getters['loginStore/isAuthorizedRoleList'](roleNameList)
           },
           exportToFile(){
             console.log('****EXPORT FILE****');
             let list1=new Array()
             const fieldList=["stuId","stuEnroll","stuCollegeId","stuTitle","stuFirstname","stuMiddlename","stuLastname","stuEmail"]
             if(!this.searching)
                 this.studentList.map((ob,indx)=>{
                   list1.push(_.pick(ob,fieldList))
                 })
            else
                this.searchStudentList.map((ob,indx)=>{
                  list1.push(_.pick(ob,fieldList))
                })
             const wsheet=XLSX.utils.json_to_sheet(list1)
             const wb=XLSX.utils.book_new()
             XLSX.utils.book_append_sheet(wb,wsheet,"student_list")
             XLSX.writeFile(wb,"studentlist.xlsx")
             console.log('****EXPORT FILE****');
            }
         },
         mounted() {
            this.$store.dispatch('studentStore/load_student_list', this.listBy)
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
