<template>
    <div class="is-radiusless box boxbg">

      <div class="is-radiusless box" style="margin-top:2em;">
          <b-field grouped>
            <b-field label="Academic Year" expanded>
                <b-select v-model="currAyearId" expanded>
                    <option v-for="ay in aYearList" :value="ay.id">{{ay.apiAyear}}</option>
                </b-select>
            </b-field>



            <b-field label="Department" expanded>
                <b-select v-model="deptId" :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL'])" @input="optionChanged" expanded>
                    <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
                </b-select>
            </b-field>
          </b-field>
          <b-select v-model="user" :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','HOD','PRINCIPAL'])" @input="fNameChanged" placeholder="Select Faculty" expanded>
              <option :value="faculty" v-for="faculty in facultyList">
                {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
              </option>
          </b-select>
        </div>
        <div class="is-radiusless is-clearfix box">
          <SelfAppraisalReport :apiFormType='apiFormType' :currAyId='currAyearId' :user="user"/>
        </div>
        <!-- <div class="is-radiusless box">
          <SelfAppraisalTFPartA :user='user'/>
          <SelfAppraisalTFPartB/>
          <SelfAppraisalTFPartC/>
          <SelfAppraisalTFPartD :user='user'/>
        </div> -->
    </div>
</template>
<script>
import userMxn from '@/mixin/user'
import SelfAppraisalReport from'@/components/SelfAppraisal/report'
import {mapState,mapGetters} from 'vuex'
            export default{
                name: 'SelfAppraisalTF',
                mixins: [userMxn],
                components: {
                  SelfAppraisalReport
                },
                props: ['facultyDetail'],
                data() {
                    return {
                      deptId:1,
                      currAyearId:2,
                      apiFormType:'',
                      user:''
                    };
                },
                computed:{
                  ...mapState([
                    'departmentList'
                  ]),
                  facultyList(){
                    return this.$store.state.employeeStore.facultyList
                  },
                  aYearList() {
                      return [{id:1,apiAyear:"2017-18",apiAyearCurrent:0},{id:2,apiAyear:"2018-19",apiAyearCurrent:1}]
                  }
                },
                watch:{
                  loggedInUser(){
                    this.user=this.loggedInUser
                    if(this.user.deptId==7)
                      this.apiFormType=1
                    else if(this.user.deptId==10)
                      this.apiFormType=2
                    else
                      this.apiFormType=0
                    this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.loggedInUser.deptId)
                }},
                methods: {
                    fNameChanged(value){
                      this.user=value
                    },
                    optionChanged(dept){
                      if(dept==7)
                        this.apiFormType=1
                      else if(dept==10)
                        this.apiFormType=2
                      else
                        this.apiFormType=0
                      this.$store.dispatch('employeeStore/load_facultylist_by_dept',dept)
                    }
                },
                mounted() {
                  this.$store.dispatch('load_dept_list')
                  if(this.facultyDetail){
                    this.currAyId=this.facultyDetail.ayId
                    this.deptId=this.facultyDetail.deptId
                    this.user=this.facultyDetail.faculty
                  }
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
