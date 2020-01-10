<template>
    <div style="width:100%;" class="is-radiusless box">

    <div style="font-size:87%" class="has-text-weight-bold">
      <table class="table is-bordered is-fullwidth">
        <thead>
          <th width="40">Sr.</th>
          <th>Parameter</th>
          <th width="50">Max. Points</th>
          <th width="50">Per. Point</th>
          <th width="280">Supporting Documents to be attached</th>
        </thead>

        <tr v-for="(param,index) in paramList" :key="index">
          <td>{{sfSectionId}}.{{index+1}}</td>
          <td>{{param.apiMetaParam}}</td>
          <td>{{param.apiMetaMaxpt}}</td>
          <td>{{param.apiMetaPerpt}}</td>
          <td class="is-paddingless">
            <ul>
            <li v-for="indx in Math.floor(param.apiMetaMaxpt/param.apiMetaPerpt)" :key="indx" class="is-radiusless is-marginless box has-text-centered">
              <input class="input is-small is-radiusless" style="margin-bottom:.5em;"/> <br>

              <b-upload @input="documentUploaded(index)" v-model="file">
                  <a class="button is-radiusless is-primary is-small">
                      <b-icon icon="upload"></b-icon>
                      <span>Upload File</span>
                  </a>
              </b-upload>
              <span v-if="fileName" class="is-size-7">{{new Date().toLocaleDateString()}}</span>
              <br>
              <div class="tags">
                <span v-if="fileName" class="tag is-radiusless is-success" style="margin-top:0.2em">
                    {{fileName}}
                    <button class="delete is-small"
                        type="button"
                        @click="removeFile">
                    </button>
                </span>
            </div>
              <b-checkbox size="is-small" style="margin-left:.4em;" :disabled="!isAuthorizedRoleList(['CMSADMIN','HOD'])"/>
                <b-tag class="is-radiusless" :type="false?'is-success':'is-danger' ">
                  Is Approved?
              </b-tag>
            </li>
          </ul>
        </td>
      </tr>
      </table>
    </div>
  </div>
</template>
<script>
import userMxn from '@/mixin/user'
import {mapState} from 'vuex'
import apiObject from '@/dataserve/student_serve.js'
export default {
  name: 'SelfAppraisalPartDTable',
  props: ['sfAyid','sfSectionId'],
  mixins: [userMxn],
  data() {
    return {
      paramList:[],
        file:null,
        fileName:'',
        apiProofPath:''
    }
  },
  computed: {
  },
  watch:{
    loggedInUser(){
      const url1="/apicontainers/"+this.loggedInUser.empCode
      apiObject.get(url1)
        .then(rr=>{
          this.apiProofPath=url1
        })
        .catch(error=>{
          apiObject.post('/apicontainers',{name:this.loggedInUser.empCode})
            .then(rr=>{
              this.apiProofPath=url1
            })
          .catch(error=>{
              console.log('****',error);
            })
        })
    },
    file(){
      // if(this.file && this.file[0])
      //   this.fileName=this.file[0].name
    }
  },
  mounted()
  {
    this.$store.dispatch('selfAppraisalStore/load_param_list',{ayId:this.sfAyid,sectionId:this.sfSectionId})
      .then(rr=>{
          this.paramList=rr;
      })
      .catch(error=>{
          console.log('****',error);
      })
  },
  methods: {
    removeFile(){
    const url1="/apicontainers/"+this.loggedInUser.empCode+"/files/"+this.fileName
    apiObject.delete(url1)
      .then(rr=>{
        this.fileName=""
      })
      .catch(error=>{
        this.$buefy.toast.open({
              duration: 5500,
              message: error.response.data.error.message,
              position: 'is-top',
              type: 'is-danger'
        })
    })
  },

  documentUploaded(index){
      if(this.file && this.file[0])
        this.fileName="D"+this.sfSectionId+"_"+(index+1)+"."+this.file[0].name.substring(this.file[0].name.lastIndexOf(".")+1,this.file[0].name.length)
      else
        this.fileName=''
      const url1="/apicontainers/"+this.loggedInUser.empCode+"/upload?filename="+this.fileName
      let fd=new FormData()
      fd.append('file',this.file[0])
      apiObject.post(url1,fd)
      .then(rr=>{
      })
      .catch(error=>{
        this.$buefy.toast.open({
            duration: 5500,
            message: error.response.data.error.message,
            position: 'is-top',
            type: 'is-danger'
      })
      })
    }
  }
}
</script>









<style>
</style>
