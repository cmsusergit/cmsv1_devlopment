<template>
      <section>

        <b-field grouped>
          <b-field label="Course Name" expanded>

              <b-autocomplete v-model="pastAcademicInfo.stuCourseName" :data='courseList'></b-autocomplete>
          </b-field>
          <b-field label="Board/University" expanded>
            <b-autocomplete v-model="pastAcademicInfo.stuBoardUni" :data='boardList'></b-autocomplete>
          </b-field>


          <b-field label="Year of Passing" >
            <b-select v-model="pastAcademicInfo.stuPassingYear" required>
                <option v-for="year in yearList">{{year}}</option>
            </b-select>
          </b-field>
          <b-field :label='pastAcademicInfo.stuGradeSystem'>
            <b-select v-model="pastAcademicInfo.stuGradeSystem">
              <option>%</option>
              <option>CGPA</option>
              <option>CPI</option>
              <option>Other</option>
            </b-select>
          </b-field>
          <b-field label="Result/Grade">
            <b-input v-model="pastAcademicInfo.stuGrade" required></b-input>
          </b-field>

      </b-field>
      </section>
</template>
<script>
    export default {
        name: 'PastAcademicInfo',
        props:[
          'pastAcademicInfo'
        ],
        data() {
            return {
              boardList:['GSEB','GHSEB','CBSE'],
              courseList:['SSC','HSC','DIPLOMA','BE','BCA','B.Voc','D.Voc']
            }
        },
        computed:{
          yearList(){
            const year=new Date().getFullYear();
            return Array.from({length:year-1980},(value,index)=>1980+index+1)
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
