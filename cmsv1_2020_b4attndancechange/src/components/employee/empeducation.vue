<template>
      <section>

    <b-field grouped>
      <b-field label="Degree" expanded>
        <b-input v-model="empEducationInfo.degreeName"></b-input>
      </b-field>
      <b-field label="Passing Year" expanded>
        <b-input v-model="empEducationInfo.degreeYear"></b-input>
    </b-field>

      <b-field label="University" expanded>
        <b-input v-model="empEducationInfo.degreeUniversity"></b-input>
      </b-field>
      </b-field>
      <b-field label="Remarks" expanded>
        <b-input type="textarea" v-model="empEducationInfo.comments"></b-input>
      </b-field>
      <div style="margin-bottom:1em;">
      </div>
</section>
</template>
<script>
import config from '@/../static/test1.json'

import {mapState} from 'vuex'
export default {
        name: 'EmployeeEducation',
        props:[
          'empEducationInfo'
        ],
        data() {
            return {
          }
        },
        methods:{
        },
        mounted() {
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
