<template>
  <div class="is-radiusless box">

    <b-field grouped>
      <b-field label="Department" expanded>
        <b-select @input='deptChanged' v-model="dept" expanded>
          <option>All</option>
          <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
        </b-select>
      </b-field>



      <b-field label="Course" expanded>
        <b-select @input='courseChanged' v-model="course" expanded>
          <option>All</option>
          <option v-for="cc in courseList" :value="cc.courseId">{{cc.courseAlias}}</option>
        </b-select>
      </b-field>
      <b-field label="Sem" expanded>
          <b-select @input="currSemChanged" v-model="currSem" expanded>
            <option>All</option>
            <option v-for="indx in 10">{{indx}}</option>
          </b-select>
      </b-field>
    </b-field>
    <b-field grouped>
      <b-field>
        <b-radio-button @input="hasPaidChanged" v-model="hasPaid" native-value=1  type="is-success">Paid</b-radio-button>
        <b-radio-button @input="hasPaidChanged" v-model="hasPaid" native-value=2  type="is-danger">!Paid</b-radio-button>
      </b-field>
    </b-field>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name:"listby",
  props: ['disableAllOption'],
  data(){
    return {
      hasPaid:0,
      currSem:"All",
      dept:"All",
      className:"All",
      course:"All",
      batchName:"All"
    }
  },
  computed:{
    ...mapState([    //....
    'departmentList',
    'courseList',
  ]),
  },
  created(){
    this.$store.dispatch('load_dept_list')
    this.$store.dispatch('load_course_list')
  },
  methods:{
    hasPaidChanged(vv){this.$emit('hasPaidChanged',vv)},
    currSemChanged(value){
      this.$emit('currSemChanged',value)
    },
    deptChanged(value){
      this.$emit('deptChanged',value)
      this.className=''
      this.$store.dispatch('load_class_list_by_dept', this.dept);
    },
    courseChanged(value){
      this.$emit('courseChanged',value)
    }
  }
}
</script>
<style>
</style>
