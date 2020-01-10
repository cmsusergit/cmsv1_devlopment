<template>
      <section style="padding-top:.5em;border-top:1px solid gray;">

              <b-field grouped>
                <b-field label="Enrollment Number" expanded>
                  <b-input v-model='studentInfo.stuEnroll' required></b-input>
                </b-field>
                <b-field label="College ID" expanded>
                  <b-input v-model='studentInfo.stuCollegeId' required></b-input>
                </b-field>
              </b-field>
              <b-field grouped>

                <b-field label="Title">
                    <b-select v-model="studentInfo.stuTitle">
                        <option>Mr.</option>
                        <option>Mrs.</option>
                        <option>Ms.</option>
                    </b-select>
                </b-field>
                <b-field label="First Name" expanded>
                  <b-input @input.native="toUppercase" v-model="studentInfo.stuFirstname " required>
                  </b-input>
                </b-field>
                <b-field label="Middle Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.stuMiddlename" required></b-input>
                </b-field>
                <b-field label="Last Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.stuLastname" required></b-input>
                </b-field>
            </b-field>

            <b-field grouped>
              <b-field label="Email" expanded>
                 <b-input type="email" v-model="studentInfo.stuEmail" required></b-input>
              </b-field>
              <b-field label="Contact Number" expanded>
                 <b-input v-model="studentInfo.stuMobile" required></b-input>
              </b-field>
            </b-field>
            <b-field grouped>
                <b-field label="Gender">
                    <b-select v-model="studentInfo.stuGender" expanded>
                      <option>Male</option><option>Female</option>
                    </b-select>
                </b-field>
                <b-field label="Birth Date">
                  <b-datepicker v-model="studentInfo.stuDob"  icon="calendar-today" :date-formatter="formatDt" style="overflow:visible"></b-datepicker>
                </b-field>
                <div style="margin:0 auto;">
                <b-field class="file" expanded>
                  <b-upload @input="photoChanged" v-model="file" style="margin-left:1em;" accept="image/*">
                      <a class="is-medium is-radiusless is-info button">
                          <b-icon icon="upload"></b-icon>
                          <span>Upload Photo</span>
                      </a>
                  </b-upload>

                  <img :src="getImageURL" width="100px" alt="Image !Found" style="margin-left:.5em;border:1px solid;">
                </b-field>
              </div>
                </b-field>
            <b-field grouped>
                <b-field label="Blood Group" expanded>
                  <b-select v-model="studentInfo.stuBloodgroup" expanded>
                    <option v-for="bg in bgList">{{bg}}</option>
                  </b-select>
                </b-field>
                <b-field label="Religion" expanded>
                  <b-select v-model="studentInfo.stuReligion" expanded>
                    <option v-for="religion in religionList">{{religion}}</option>
                  </b-select>
                </b-field>
                <b-field label="Nationality" expanded>
                  <b-select v-model="studentInfo.stuNationality" expanded>
                    <option v-for="nationality in nationalityList">{{nationality}}</option>
                  </b-select>
                </b-field>
                <b-field label="Category" expanded>
                  <b-select v-model="studentInfo.stuCategory" expanded>
                    <option v-for="category in categoryList">{{category}}</option>
                  </b-select>
                </b-field>
              </b-field>

              <p class="is-5 has-text-weight-bold">Mother's Detail</p>
              <b-field grouped style="border-top:1px solid gray;padding-top:1em;">
                <b-field label="First Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.studentMotherFname" required></b-input>
                </b-field>
                <b-field label="Middle Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.studentMotherMname" required></b-input>
                </b-field>
                <b-field label="Last Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.studentMotherLname" required></b-input>
                </b-field>
              </b-field>
              <p class="is-5 has-text-weight-bold">Father's Detail</p>
              <b-field grouped style="border-top:1px solid gray;padding-top:1em;">
                <b-field label="First Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.studentFatherFname" required></b-input>
                </b-field>
                <b-field label="Middle Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.studentFatherMname" required></b-input>
                </b-field>
                <b-field label="Last Name" expanded>
                    <b-input @input.native="toUppercase" v-model="studentInfo.studentFatherLname" required></b-input>
                </b-field>
              </b-field>
              <b-field grouped>
                <b-field label="Contact Number" expanded>
                  <b-input @input.native="toUppercase" v-model="studentInfo.studentFatherContact" required></b-input>
                </b-field>
                <b-field label="Occupation" expanded>
                  <b-input studentInfo.studentFatherOccupation required></b-input>
                </b-field>
                <b-field label="Annual Income" expanded>
                  <b-input v-model="studentInfo.studentFatherAnnualIncome" type="number" required></b-input>
                </b-field>
              </b-field>
      </section>
</template>
<script>
import axios from 'axios'
import config from '@/../static/test1.json'
const apiObject=axios.create({
    baseURL:config.db_configuration.baseURL
})
export default {
        name: 'StudentPersonalInfo',
        props:[
          'studentInfo'
        ],
        data() {
            return {
              file:null,
              gender:'',
              bgList:[
                  'A+','B+','A-','B-','O+','O-','AB+','AB-','-'
              ],
              religionList:['Hindu','Muslim','Christian','Jain','Other'],
              nationalityList:['Indian','Foreign'],
              categoryList:['Open','SEBC','SC','ST','OTHER']
          }
        },
        computed:{
          getImageURL(){
                return config.db_configuration.baseURL+'/containers/student_photo/download/'+this.studentInfo.stuPhoto
            }
        },
        watch:{
        },
        created() {
        },
        methods:{
          formatDt(d){
            return d.toLocaleDateString();
          },
          photoChanged(ee){
            this.uploadPhoto(ee)
          },
          uploadPhoto(ee){
            const url1="/containers/student_photo/upload"
            let fd=new FormData()
            const image=this.studentInfo.stuEnroll+'_'+this.file[0].name
            fd.append('image',this.file[0],image)
            apiObject.post(url1,fd)
              .then(response=>{
                  this.studentInfo.stuPhoto=image
                })
                .catch(error=>{
                  console.log('----',error)
                  this.studentInfo.stuPhoto=''
              })
            .catch(error=>{
              console.log('****',error);
            });
          },
          toUppercase(ee){
            if(/[^A-Za-z]$/i.test(ee.target.value))
              ee.target.value=''
            ee.target.value=ee.target.value.toUpperCase()
          }
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
