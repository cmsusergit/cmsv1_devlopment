<template>
    <div class="is-radiusless box boxbg">

        <div>
            <h1 class="is-size-4 title has-text-centered">
              SCHEME OF AWARD OF POINTS TO FACULTIES FOR ACADEMIC PERFORMANCE
              <br>
                <br>
                <p v-if="apiFormType==0">Applicable to Faculties Teaching Engineering Subjects(TF)</p>
                <p v-else-if="apiFormType==1">Applicable to Faculties Teaching Non-Enggineering Subjects(NTF)</p>
                <p v-else>Applicable to Faculties of Master of Computer Application(MCA)</p>
                <br>

                <b>Academic Year:2018-19</b>
                <br><br>
                <p>Appraisal Approval Form</p>
            </h1>
        </div>
        <div v-if="isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','HOD'])" class="is-radiusless box" style="margin-top:2em;">
          <b-field grouped>
          <b-field label="Department" expanded>
              <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL'])" @input="optionChanged" expanded>
                  <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
              </b-select>
          </b-field>
          <b-field label="Select Faculty" expanded>
            <b-select @input="fNameChanged" placeholder="Select Faculty" expanded>
                <option :value="faculty" v-for="faculty in facultyList">
                  {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                </option>
            </b-select>
            </b-field>
        </b-field>
        </div>
        <!-- <div class="is-radiusless is-clearfix box">
          <SelfAppraisalReport :user="user"/>
        </div> -->
        <div v-if="user && user.deptId" class="box is-marginless is-radiusless is-clearfix">
          <router-link class="button is-radiusless is-info is-pulled-right" style="width:25%" :to="{ name: 'SelfAppraisalReport', params: {facultyDetail:facultyDetail}}">
            Go to Report
          </router-link>
        </div>
        <div class="is-radiusless box is-marginless">
          <SelfAppraisalTFPartA :user='user'/>
          <SelfAppraisalTFPartB :ayId='currentAyId' :user='user'/>
          <SelfAppraisalTFPartC/>
          <SelfAppraisalTFPartD :user='user' :apiFormType='apiFormType'/>
        </div>
        <div v-if="user && user.deptId" class="box is-radiusless is-clearfix">
          <router-link class="button is-radiusless is-info is-pulled-right" style="width:25%" :to="{ name: 'SelfAppraisalReport', params: {facultyDetail:facultyDetail}}">

            Go to Report
          </router-link>
        </div>
    </div>
</template>
<script>
import userMxn from '@/mixin/user'
import SelfAppraisalTFPartA from '@/components/SelfAppraisal/part_a'
import SelfAppraisalTFPartB from '@/components/SelfAppraisal/part_b'
import SelfAppraisalTFPartC from '@/components/SelfAppraisal/part_c'
import SelfAppraisalTFPartD from '@/components/SelfAppraisal/part_d'
import SelfAppraisalReport from'@/components/SelfAppraisal/report'
import {mapState,mapGetters} from 'vuex'
            export default{
                name: 'SelfAppraisalTF',
                mixins: [userMxn],
                components: {
                  SelfAppraisalTFPartA,
                  SelfAppraisalTFPartB,
                  SelfAppraisalTFPartC,
                  SelfAppraisalTFPartD,
                  SelfAppraisalReport
                },
                data() {
                    return {
                      user:'',
                      facultyDetail:{},
                      apiFormType:''
                    };
                },
                computed:{
                  ...mapState([
                    'departmentList'
                  ]),
                  currentAyId(){
                    this.facultyDetail.ayId=2
                    return 2;
                  },
                  facultyList(){
                    return this.$store.state.employeeStore.facultyList
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
                      this.facultyDetail.faculty=this.user
                      this.facultyDetail.deptId=this.user.deptId
                    },  optionChanged(dept){
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
