<template>
      <section class="is-radiusless box" style="padding-top:.5em;margin-bottom:1em;height:100%;">

      <b-field grouped>
        <b-field label="ID" expanded>
          <b-input v-model="empProfileInfo.empId" disabled expanded></b-input>
        </b-field>
        <b-field label='Code' expanded>
          <b-input v-model="empProfileInfo.empCode" expanded></b-input>
        </b-field>
        </b-field>
        <b-field grouped>

          <b-field label="Department" expanded>
              <b-select v-model="empProfileInfo.deptId" expanded>
                <option v-for="dp in departmentList" :value="dp.deptId">
                  {{dp.deptName}}
                </option>
            </b-select>
          </b-field>
          <b-field label='Designation' expanded>
            <b-select v-model="empProfileInfo.designationId" expanded>
              <option  v-for="(designation, index) in designationList" :value="designation.desgId" :key="index">{{designation.desgName}}</option>
            </b-select>
          </b-field>
          <b-field label="IsTeaching">
            <b-switch @input="isTeachingChanged" class="is-large" type="is-info" v-model="isTeaching"></b-switch>
        </b-field>
      </b-field>
      <b-field grouped>
        <b-field label='Joining Date' expanded>
          <b-datepicker v-model="empProfileInfo.doj"/>
        </b-field>
        <b-field label='Birth Date' expanded>
          <b-datepicker v-model="empProfileInfo.dob"/>
        </b-field>
      </b-field>
      <b-field grouped>
        <b-field label="Title">
            <b-select v-model="empProfileInfo.title">
                <option>Mr.</option>
                <option>Mrs.</option>
                <option>Ms.</option>
                <option>Dr.</option>
            </b-select>
        </b-field>
        <b-field label="First Name" expanded>
          <b-input @input.native="toUppercase" v-model="empProfileInfo.firstName" required>
          </b-input>
        </b-field>
        <b-field label="Middle Name" expanded>
            <b-input @input.native="toUppercase" v-model="empProfileInfo.middleName" required></b-input>
        </b-field>
        <b-field label="Last Name" expanded>
            <b-input @input.native="toUppercase" v-model="empProfileInfo.lastName" required></b-input>
        </b-field>
    </b-field>
    <b-field grouped>
      <b-field label="Email" expanded>
         <b-input type="email" v-model="empProfileInfo.email" required></b-input>
      </b-field>
      <b-field label="Contact Number" expanded>
        <b-input v-model="empProfileInfo.contact"></b-input>
        </b-field>
  </b-field>
        <b-field label=' Address'>
          <b-input v-model="empProfileInfo.address" type='textarea'></b-input>
        </b-field>
        <b-field class="file">
              <b-upload @input="photoChanged" v-model="file" accept="image/*">
                  <a class="button is-info">
                      <b-icon icon="upload"></b-icon>
                      <span>Upload Photo</span>
                  </a>
              </b-upload>

              <img :src="getImageURL" width="100px" style="margin-left:0.5em;border:1px solid;">
<!--
              <figure v-if="image" class="image is-128x128" style="margin-left:1em;">
                <img :src="getImageURL" height="128px" width="128px" alt="photo">
              </figure> -->
        </b-field>
        <b-field grouped>
            <b-field label="Blood Group" expanded>
              <b-select v-model="empProfileInfo.bloodGroup" expanded>
                <option v-for="bg in bgList">{{bg}}</option>
              </b-select>
            </b-field>
            <b-field label="Religion" expanded>
              <b-select v-model="empProfileInfo.religion" expanded>
                <option v-for="religion in religionList">{{religion}}</option>
              </b-select>
            </b-field>
            <b-field label="Nationality" expanded>
              <b-select v-model="empProfileInfo.nationality" expanded>
                <option v-for="nationality in nationalityList">{{nationality}}</option>
              </b-select>
            </b-field>
            <b-field label="Category" expanded>
              <b-select v-model="empProfileInfo.category" expanded>
                <option v-for="category in categoryList">{{category}}</option>
              </b-select>
            </b-field>
          </b-field><b-field grouped>

            <b-field label="Gender" expanded>
                <b-select v-model="empProfileInfo.gender" expanded>
                  <option>Male</option><option>Female</option>
                </b-select>
            </b-field>
          <b-field label="Marrital Status" expanded>
            <b-select v-model="empProfileInfo.marritalStatus" expanded>
              <option v-for="marritalStatus in marritalStatusList">{{marritalStatus}}</option>
            </b-select>
          </b-field>
</b-field>
<!--
<b-field label="Father First Name" expanded>
    <b-input @input.native="toUppercase" v-model="empProfileInfo.fatherName" required></b-input>
</b-field> -->
</section>
</template>
<script>
import apiObject from '@/dataserve/student_serve.js'
import config from '@/../static/test1.json'
import {mapState} from 'vuex'
export default {
        name: 'EmployeePersonalInfo',
        props:[
          'empProfileInfo'
        ],
        data() {
            return {
              isTeaching:true,
              file:null,
              designation:{},
              bgList:[
                  '-','A+','B+','A-','B-','O+','O-','AB+','AB-'
              ],
              image:'',
              religionList:['Hindu','Muslim','Christian','Jain'],
              nationalityList:['Indian','Foreign'],
              categoryList:['Open','SEBC','SC','ST','OTHER'],
              marritalStatusList:['Married','UnMarried']
          }
        },
        computed:{
        ...mapState({//....
          departmentList:state=>state.departmentList,
          designationList:state=>state.designationStore.designationList
        }),
        getImageURL(){
            return config.db_configuration.baseURL+'/containers/employee_photo/download/'+this.image
        }
    },
        methods:{
          photoChanged(ee){
            this.uploadPhoto(ee)
          },
          uploadPhoto(ee){
            const url1="/containers/employee_photo/upload"
            let fd=new FormData()
            const image=this.empProfileInfo.empCode+'_'+this.file[0].name
            fd.append('image',this.file[0],image)
            apiObject.post(url1,fd)
              .then(response=>{
                  this.image=image
                  this.empProfileInfo.empPhoto=this.image
                })
                .catch(error=>{
                  console.log('----',error);
                  this.image=''
              })
            .catch(error=>{
              console.log('****',error);
            });
          },
          isTeachingChanged(v1){
            this.empProfileInfo.isTeaching=v1?1:0
          },
          toUppercase(ee){
            ee.target.value=ee.target.value.toUpperCase()
          }
        },
        watch:{
          empProfileInfo(v1){
                this.image=this.empProfileInfo.empPhoto
                this.isTeaching=this.empProfileInfo.isTeaching?true:false
            }
        },
        created() {
          this.image=this.empProfileInfo.empPhoto
        },
        mounted() {
          this.$store.dispatch('designationStore/load_desg_list')
          this.$store.dispatch('load_dept_list')
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
