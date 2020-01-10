<template>
    <div class="is-radiusless box" style="height:100%">

        <div class="level">
            <h1 class="level-left is-size-4 title">Student Allocation</h1>
        </div>
        <b-loading is-full-page :active.sync="loading" ></b-loading>
        <b-loading is-full-page :active.sync="ploading" ></b-loading>
        <ListBy :disableAllOption="true" @classChanged="classChanged" @batchChanged="batchChanged"  @currSemChanged="currSemChanged" @courseChanged="courseChanged" @deptChanged="deptChanged"></ListBy>
        <div class="tile is-parent">
          <div class="tile is-child is-radiusless is-paddingless box">
          <p class="has-background-grey has-text-white is-size-5">Allocate From</p>

          <select v-model="selectedStudentList" class="select is-multiple is-fullwidth" multiple size="50">
              <option v-for="(student,index) in studentList" :key="index" :value="student">
                {{student.stuEnroll}} - {{student.stuTitle}} {{student.stuFirstname}} {{student.stuMiddlename}} {{student.stuLastname}}
              </option>
          </select>
        </div>
        <div class="tile is-child is-1 has-text-centered is-radiusless box">
          <button @click="allocateToList" class="button is-radiusless is-info" style="height:47%;">></button>
          <button @click="deallocateFromList" class="button is-radiusless is-info" style="margin-top:1em;height:47%;"><</button>
        </div>
        <div class="tile is-child is-radiusless is-paddingless box">
          <p class="has-background-grey has-text-white is-size-5">Allocate To</p>
          <select v-model="selectedAllocatedList" class="select is-multiple is-fullwidth" multiple size="50">
              <option v-for="(student,index) in allocatedStudentList" :key="index" :value="student">
                 {{student.stuEnroll}} - {{student.stuTitle}} {{student.stuFirstname}} {{student.stuMiddlename}} {{student.stuLastname}}
              </option>
          </select>
        </div>
      </div>

      <!-- <div class="box is-radiusless is-clearfix">
        <b-field grouped>
                <b-field label="Class Name" expanded>
                  <b-select @input="classIdChanged" v-model="classId" expanded>
                    <option v-for="temp in classList" :value="temp.classId">{{temp.className}}</option>
                  </b-select>
                </b-field>
                <b-field label="Batch Name" expanded>
                  <b-select v-model="batchId" expanded>
                    <option v-for="temp in batchList" :value="temp.batchId">{{temp.batchName}}</option>
                  </b-select>
                </b-field>
              </b-field>
                <button @click="saveAllocatedStudentList" class="button is-radiusless is-info is-pulled-right" style="width:25%;">Allocate</button>
    </div> -->
    </div>
</template>
<script>
    import ListBy from '@/components/student/listby'
    import _ from 'lodash'
    import {mapState} from 'vuex'
    import config from '@/../static/test1.json'
    import axios from "axios"
    export default{
        name: 'StudentManagement',
        components: {
          ListBy
        },
        data() {
            return {
                ploading: false,
                listBy: {dept: 'All', course: 'All', class: '', sem: 'All',batch:''},
                searchText:'',
                searchOption:'Name',
                selectedStudentList:[],
                selectedAllocatedList:[]
            };
        },
        computed: {
            ...mapState({
                    classList: state=>state.classList,
                    batchList: state=>state.classStore.batchList,
                    loading: state => state.studentStore.loading
            }),
            allocatedStudentList:{
              get(){
                  const list1=this.$store.getters['studentStore/getAllocatedStudentList'].studentList
                  let mergedList=[]
                  if(!list1)
                    return
                  list1.map(ob=>{
                    if(ob && ob.studentInfo)
                    mergedList.push(ob.studentInfo)
                  })
                  mergedList=_.uniqBy(mergedList,'stuEnroll')
                  return _.sortBy(mergedList,['stuEnroll'])
              },
              set(value){
              }
            },
            studentList:{
              get(){
                  return _.sortBy(this.$store.getters['studentStore/getStudentList'],['stuEnroll'])
              },
              set(value){
              }
            }
        },
        watch:{
        },
        methods: {
           saveAllocatedStudentList(){
             if(!this.verifyBeforeAllocationList())
                return
            let list=[]
             this.selectedStudentList.map(ob=>{
               list.push({
                 id:0,
                 studentId:ob.stuId,
                 classId:this.listBy.class,
                 batchId:this.listBy.batch
               })
             })
            this.$store.dispatch('studentStore/saveAllocatedStudentList',list)
              .then(rr=>{
                const ob={allocationDetail:{
                  classId:this.listBy.class,
                  batchId:this.listBy.batch
                }}
                this.$store.dispatch('studentStore/load_allocated_student_list', ob)
                this.$buefy.toast.open({
                  duration: 2500,
                  message:'Student Allocated' ,
                  position: 'is-top',
                  type: 'is-success'
                })
              })
              .catch(error=>{
                this.$buefy.toast.open({
                  duration: 5500,
                  message: "Either Duplicate Entry OR "+error.response.data.error.message,
                  position: 'is-top',
                  type: 'is-danger'
                })
              })
           },

           deallocateStudent(){
                if(!this.verifyBeforeDeallocationList())
                  return
                let list=[]
                this.selectedAllocatedList.map(ob=>{
                  list.push({
                    studentId:ob.stuId,
                    classId:this.listBy.class,
                    batchId:this.listBy.batch
                  })
                })
              this.$store.dispatch('studentStore/deallocateStudent',{list:list})
                .then(rr=>{
                  const ob={allocationDetail:{
                    classId:this.listBy.class,
                    batchId:this.listBy.batch
                  }}
                  this.$store.dispatch('studentStore/load_allocated_student_list', ob)
                  this.$buefy.toast.open({
                    duration: 2500,
                    message:'Student Deallocated',
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
            verifyBeforeAllocationList(){
              if(this.selectedStudentList.length==0){
                this.$buefy.toast.open({
                  duration: 5500,
                  message: "Select Students Before Allocation",
                  position: 'is-top',
                  type: 'is-danger'
                })
                return false
              }
              if(!this.listBy.class || !this.listBy.batch){
                this.$buefy.toast.open({
                  duration: 5500,
                  message: "ClassName or BatchName Require Selection",
                  position: 'is-top',
                  type: 'is-danger'
                })
                return false
              }
              return true
            },
            verifyBeforeDeallocationList(){
                if(this.selectedAllocatedList.length==0){
                  this.$buefy.toast.open({
                    duration: 5500,
                    message: "Select Students Before DeAllocation",
                    position: 'is-top',
                    type: 'is-danger'
                  })
                  }
                  if(!this.listBy.class || !this.listBy.batch){
                    this.$buefy.toast.open({
                      duration: 5500,
                      message: "ClassName or BatchName Require Selection",
                      position: 'is-top',
                      type: 'is-danger'
                    })
                  return false
                }
                return true
              },
            deptChanged(dept) {
                this.listBy.dept = dept;
                this.$store.dispatch('load_class_list_by_dept', this.listBy.dept);
                this.$store.dispatch('studentStore/load_student_list', this.listBy)
                this.selectedStudentList=[]
            },
            currSemChanged(cseme) {
                this.listBy.sem = cseme;
                this.selectedStudentList=[]
                this.$store.dispatch('studentStore/load_student_list', this.listBy)
            },
            classChanged(cl) {
                this.listBy.class=cl
                this.$store.dispatch('classStore/load_batch_list_by_classid',cl)
                const ob={allocationDetail:{
                  classId:this.listBy.class,
                }}
                this.$store.dispatch('studentStore/load_allocated_student_list', ob)
            },
            batchChanged(value) {
                this.listBy.batch=value
                const ob={allocationDetail:{
                  classId:this.listBy.class,
                  batchId:this.listBy.batch
                }}
                this.$store.dispatch('studentStore/load_allocated_student_list', ob)
            },
            courseChanged(course) {
                this.listBy.course = course;
                this.selectedStudentList=[]
                this.$store.dispatch('studentStore/load_student_list', this.listBy)
            },
            searchByText(text) {
                this.searchText=text;
                this.searchBy();
            },
           searchOptionChanged(option){
               this.searchOption=option;
            },
            getValidDate(temp){
              date=new Date(temp)
              const dateUTC = new Date(Date.UTC(date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
               ))
               return dateUTC.toLocaleDateString()
            },
           isAuthorizedRoleList(roleNameList){
             return this.$store.getters['loginStore/isAuthorizedRoleList'](roleNameList)

           },
           allocateToList(){
             this.ploading=true
             this.saveAllocatedStudentList()
              this.ploading=false
           },
           deallocateFromList(){
             this.ploading=true
             // _.remove(this.allocatedStudentList,ob=>{
             //   let flag=false
             //   this.selectedAllocatedList.map(temp=>{
             //     if(temp.stuId==ob.stuId)
             //        flag=true
             //   })
             //   return flag
             // })
             // this.selectedAllocatedList.map(el=>{
             //    this.studentList.push(el)
             //  })
              this.deallocateStudent()
              this.ploading=false
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
