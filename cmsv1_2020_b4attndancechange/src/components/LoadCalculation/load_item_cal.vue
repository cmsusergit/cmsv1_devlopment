<template>
  <div class="is-radiusless is-clearfix box">
    <table class="table is-bordered is-fullwidth">
      <thead>
        <th>Theory</th>
        <th>Practical</th>
        <th>Tutorial</th>
      </thead>
      <tr>
        <td>{{subjectInfo.subjectTheory}}</td>
          <td>{{subjectInfo.subjectPractical}}</td>
          <td>{{subjectInfo.subjectTutorial}}</td>

      </tr>
    </table>
    <b-field label="Number Of Departments Sharing Subject" expanded>
      <input v-model="loadCalcItemCount" class="input is-small is-radiusless is-info">
    </b-field>

    <div :key="indx" v-for="(record,indx) in loadCalcList" class="is-radiusless box">
      <b-field grouped>
        <b-field label="Number Of Classes" expanded>
          <b-input v-model="record.nclasses" type="number" min="0" max="4"></b-input>
        </b-field>
        <b-field label="Number Of Batches(Total)" expanded>
          <b-input v-model="record.nbatches" type="number" min="0" max="40"></b-input>
        </b-field>
      </b-field>
      <b-field label="">
        <b-checkbox @input="changeCBox" v-model="record.otherDept">Load By Other Department</b-checkbox>
      </b-field>
        <b-field v-if="record.otherDept" label="Department">
        <b-select v-model="record.otherDeptName" expanded>
          <option v-if="dept.deptId!=deptId" v-for="(dept, index) in departmentList" :key="index" :value="dept.deptId">{{dept.deptName}}</option>
        </b-select>
      </b-field>
    </div>
    <div class="is-clearfix">
      <button @click="$emit('addToTable',loadCalcList)" class="button is-radiusless is-info is-pulled-right is-clearfix" style="margin-top:0em;width:25%;">Add to Calculation</button>
    </div>
 </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'LoadItemCalc',
  props: ['subjectInfo','deptId'],
  data() {
      return {
        loadCalcItemCount:1,
        loadCalcList:[{
          subject:this.subjectInfo,
          otherDept:false,
          nclasses:2,
          nbatches:4,
          otherDeptName:this.deptId
        }]
      }
  },
  computed:mapState([
    'departmentList',
  ]),
  watch:{
    loadCalcItemCount(){
      this.loadCalcList=Array.from({length:this.loadCalcItemCount},ob=>{
        return{



          subject:this.subjectInfo,
          otherDept:false,
          nclasses:2,
          nbatches:4,
          otherDeptName:this.deptId
      }})
    }
  },
  methods:{
    addToTable(){
      this.$emit('addToTable',this.loadCalcList)
    },
    changeCBox(){
        if(this.otherDept)
          this.otherDeptName=this.deptId
    }
  },
  created(){
    this.$store.dispatch('load_dept_list')
  }
}
</script>
<style lang="css" scoped>
</style>
