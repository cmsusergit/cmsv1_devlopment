<template>
    <div style="width:100%;overflow:auto;">

    <b-loading :active.sync="loading"></b-loading>
    <div class="has-text-weight-bold">
      <table class="table is-bordered is-fullwidth">
        <thead>
          <th width="40">Sr.</th>
          <th>Parameter</th>
          <th width="50">Max. Points</th>
          <th width="280">Supporting Documents to be attached</th>
        </thead>

        <tr v-for="(param,index) in paramList" :key="index">
          <td>{{sfSectionId}}.{{index+1}}</td>
          <td>{{param.apiMetaParam}}</td>
          <td>{{param.apiMetaMaxpt}}</td>
<!--
          	<td>{{param.apiMetaPerpt}}</td> -->
          <td class="is-paddingless">
            <ul>

            <li v-for="indx in Math.floor(param.apiMetaMaxpt/param.apiMetaPerpt)" :key="indx" class="is-radiusless is-marginless box has-text-centered">

                <SelfAppraisalPartDTableRecord :proofIndex="sfSectionId+'_'+(index+1)" :apiRecord="getAPIRecord(param,indx)"/>
            </li>
          </ul>
        </td>
      </tr>
      </table>
    </div>
  </div>
</template>
<script>
import _ from "lodash"
import {mapState} from 'vuex'
import apiObject from '@/dataserve/student_serve.js'
import SelfAppraisalPartDTableRecord from '@/components/SelfAppraisal/part_d_tablerecord'
export default {
  name: 'SelfAppraisalPartDTable',
  props: ['sfAyid','user','sfSectionId','apiFormType'],
  components: {
    SelfAppraisalPartDTableRecord
  },
  data() {
    return {
        apiEmployeeList:[],
        loading:false,
        paramList:[],
        apiProofPath:''
    }
  },
  computed: {
  },
  watch:{
    user(){
      this.loadDt()
    },
  },
  mounted()
  {
    this.$store.dispatch('selfAppraisalStore/load_param_list',{ayId:this.sfAyid,apiMetaType:this.apiFormType,sectionId:this.sfSectionId})
      .then(rr=>{
          this.paramList=rr;
          this.loadDt()
      })
      .catch(error=>{
          console.log('****',error);
      })
  },
  methods: {
    loadDt(){
      this.$store.dispatch('selfAppraisalStore/load_param_list',{ayId:this.sfAyid,apiMetaType:this.apiFormType,sectionId:this.sfSectionId})
        .then(rr=>{
            this.paramList=rr;
        })
        .catch(error=>{
            console.log('****',error);
        })
      const url1="/apicontainers/"+this.user.empCode
      apiObject.get(url1)
        .then(rr=>{
          this.apiProofPath=url1
        })
        .catch(error=>{
          apiObject.post('/apicontainers',{name:this.user.empCode})
            .then(rr=>{
              this.apiProofPath=url1
            })
          .catch(error=>{
              console.log('****',error);
            })
        })
        this.loadAPIEmployeeList()
    },
    getAPIRecord(p1,index){
      const ob={
        apiAyearId:1,
        id:0,
        index:index,
        apiEmpMetaId:p1.id,
        apiEmpCode:this.user.empCode,
        apiUploadDate:new Date(),
        apiDocPath:'',
        apiEmpApproved:0,
    }
    const temp=_.filter(this.apiEmployeeList,record=>{
      return record.apiEmpMetaId==p1.id
    })

    if(temp && temp.length>index-1){
      temp[index-1].apiMetaPerpt=p1.apiMetaPerpt
      return temp[index-1]
    }
    else
    {
      ob.apiMetaPerpt=p1.apiMetaPerpt
      return ob;
    }
  },
  loadAPIEmployeeList(){
    this.loading=true;
    const ob={
      apiAyearId:1,
      apiEmpCode:this.user.empCode
    }
    this.$store.dispatch("selfAppraisalStore/load_apiemployeelist",ob)
      .then(rr=>{
        this.apiEmployeeList=rr
        this.loading=false
      })
      .catch(error=>{
        this.loading=false
        console.log('****',error);
      })
  }
}
}
</script>
<style>
</style>
