<template>
      <section style="padding-top:.5em;height:100%;" class="is-radiusless box">

    <b-field grouped>
      <b-field label="Employee PAN" expanded>

        <b-input @input.native="toUppercase" v-model="empDocInfo.panNumber"></b-input>
      </b-field>
      <b-field label='Employee PF Number' expanded>
        <b-input @input.native="toUppercase" v-model="empDocInfo.pfNumber"></b-input>
      </b-field>
    </b-field>
    <b-field grouped>
      <b-field label="Employee Aadharcard Number" expanded>
        <b-input @input.native="toUppercase" v-model="empDocInfo.aadharNumber"></b-input>
      </b-field>
      <b-field label='Employee UAN' expanded>
        <b-input @input.native="toUppercase" v-model="empDocInfo.uanNumber"></b-input>
      </b-field>
    </b-field>
</section>
</template>
<script>
import config from '@/../static/test1.json'

import {mapState} from 'vuex'
export default {
        name: 'EmployeeDocument',
        props:[
          'empDocInfo'
        ],
        data() {
            return {
          }
        },
        methods:{
          toUppercase(ee){
            ee.target.value=ee.target.value.toUpperCase()
          }
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
