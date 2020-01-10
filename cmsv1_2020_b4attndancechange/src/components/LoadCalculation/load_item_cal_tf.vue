<template>
  <div class="is-radiusless is-clearfix box">
    <b-field grouped>
      <b-field label="Number Of Classes" expanded>
        <b-input v-model="nclasses" type="number" min="1" max="2"></b-input>
      </b-field>
      <b-field label="Number Of Batches(Total)" expanded>
        <b-input v-model="nbatches" type="number" min="1" max="20"></b-input>
      </b-field>
    </b-field>
    <b-field label="Number Of Classes">
      <b-checkbox @input="changeCBox" v-model="otherDept">Load By Other Department</b-checkbox>

    </b-field>
      <b-field v-if="otherDept" label="Department">
      <b-select v-model="otherDeptName" expanded>
        <option v-if="dept.deptId!=deptId" v-for="(dept, index) in departmentList" :key="index" :value="dept.deptId">{{dept.deptName}}</option>
      </b-select>
    </b-field>
    <button @click="$emit('addToTable',
                      {
                      nclasses:nclasses,
                      nbatches:nbatches,
                      otherDept:otherDept,
                      otherDeptName:otherDeptName
                      })" class="button is-radiusless is-info is-pulled-right is-clearfix" style="width:25%">Add to Calculation</button>
 </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'LoadItemCalcTF',
  data() {
      return {
        otherDept:false,
        loadCalcItemCount:1,
        nclasses:2,
        nbatches:4,
        otherDeptName:this.deptId
      }
  },
  computed:mapState([
    'departmentList',
  ]),
  methods:{
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
