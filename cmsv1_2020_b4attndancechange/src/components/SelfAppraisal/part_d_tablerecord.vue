<template>
    <div style="width:100%;">

      <div v-if="apiRecordDB.apiEmpApproved==1" class="tag is-radiusless is-primary is-large" style="width:100%;border:1px solid grey;">
        Approved Points: {{apiRecordDB.apiMetaPerpt}}
      </div>
      <div v-else>
        <div v-if="apiRecordDB.apiEmpApproved==2" class="tag is-radiusless is-warning is-large" style="margin-bottom:.2em;width:100%;">
          Disapproved
        </div>
        <b-input v-model="apiRecordDB.apiDescription" size="is-small" class="is-radiusless" style="margin-bottom:.5em;" placeholder="Description"/>


          <b-upload v-if="!apiRecordDB.apiDocPath" @input="documentUploaded" v-model="file" :disabled="!apiRecordDB.apiDescription">
              <a class="button is-radiusless is-primary is-small" :disabled="!apiRecordDB.apiDescription">
                  <b-icon icon="upload"></b-icon>
                  <span>Upload</span>
              </a>
          </b-upload>
        <p class="tag is-danger" v-else>Remove File To Re-Upload</p>
        </div>
        <div>
        <div v-if="apiRecordDB.apiDocPath" class="tag is-radiusless is-info is-size-7" style="margin-top:.5em;width:100%;">Uploaded On: {{new Date(apiRecordDB.apiUploadDate).toLocaleDateString()}}</div>
          <div class="tag" style="margin-bottom:.5em;width:100%;" v-if="apiRecordDB.apiDocPath">
            <a :href="downloadDocument(apiRecordDB.apiDocPath)" class="tag is-radiusless is-secondary" style="margin-top:0.2em;width:100%;">
                {{apiRecordDB.apiDocPath}}
            </a>
            <b-tooltip v-if="apiRecordDB.apiEmpApproved!=1" label="Delete File">
              <button class="delete  is-small"
                  type="button"
                  @click="confirmRemoveFile">
              </button>
            </b-tooltip>
        </div>





        <div v-if="apiRecordDB.apiDocPath && isAuthorizedRoleList(['CMSADMIN','PRINCIPAL','DIRECTOR','HOD'])">
          <button v-if="apiRecordDB.apiEmpApproved!=1" @click="setApproveStatus(1)" class="button is-radiusless is-small is-success">Approved</button>
          <button v-else @click="setApproveStatus(0)" class="button is-radiusless is-small is-secondary">Reset Approval</button>
          <button v-if="apiRecordDB.apiEmpApproved!=2" @click="setApproveStatus(2)" class="button is-radiusless is-small is-danger">DisApprove</button>
          <button v-else @click="setApproveStatus(0)" class="button is-radiusless is-small is-secondary">Reset DisApproved</button>
          <!-- <b-checkbox @input="isApprovedPoint" size="is-small" v-model="approvedStatusBoolean" style="margin-left:.4em;"/>
          <b-tag class="is-radiusless" :type="this.approvedStatusBoolean?'is-success':'is-danger' ">
              Is Approved?
          </b-tag> -->
        </div>
      </div>
  </div>
</template>
<script>
import userMxn from '@/mixin/user'
import {mapState} from 'vuex'
import apiObject from '@/dataserve/student_serve.js'
import config from '@/../static/test1.json'
export default {
  name: 'SelfAppraisalPartDTableRecord',
  props: ['apiRecord','proofIndex',],
  mixins: [userMxn],
  data() {
    return {
      paramList:[],
      apiRecordDB:{},
        file:null,
        apiProofPath:''
    }
  },
  computed: {
  },
  watch:{
    apiRecord(){
      this.apiRecordDB=JSON.parse(JSON.stringify(this.apiRecord))
      const url1="/apicontainers/"+this.apiRecordDB.apiEmpCode
      apiObject.get(url1)
        .then(rr=>{
          this.apiProofPath=url1
        })
        .catch(error=>{
          apiObject.post('/apicontainers',{name:this.apiRecordDB.apiEmpCode})
            .then(rr=>{
              this.apiProofPath=url1
            })
          .catch(error=>{
              console.log('****',error);
            })
        })
    }
  },
  mounted()
  {
  },
  methods: {
    setApproveStatus(value){
      const ob={
        id:this.apiRecordDB.id,
        apiEmpApproved:value
      }
      this.apiRecordDB.apiEmpApproved=value
      this.$store.dispatch('selfAppraisalStore/approve_apiemployee',ob)
      console.log('----',value);
    },
    downloadDocument(docPath){
      const url1= config.db_configuration.baseURL+'/apicontainers/'+this.apiRecordDB.apiEmpCode+"/download/"+docPath
      console.log('----',url1);
      return url1
    },

    confirmRemoveFile(){
      this.$buefy.dialog.confirm({
          title: 'Delete File',
          message: 'Are you sure you want to <b>delete</b> ? This action cannot be undone.',
          confirmText: 'Delete',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
              this.removeFile()

            }
      })
    },
    removeFile(){
    const url1="/apicontainers/"+this.apiRecordDB.apiEmpCode+"/files/"+this.apiRecordDB.apiDocPath
    apiObject.delete(url1)
      .then(rr=>{
        this.removeAPIEmployee()
        this.apiRecordDB.apiDocPath=""
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
      const description=this.apiRecordDB.apiDescription
      this.apiRecordDB=JSON.parse(JSON.stringify(this.apiRecord))
      this.apiRecordDB.apiDescription=description
      if(this.file && this.file[0])
        this.apiRecordDB.apiDocPath="D"+this.proofIndex+"_"+this.file[0].name
      else
        this.apiRecordDB.apiDocPath=''
      const url1="/apicontainers/"+this.apiRecordDB.apiEmpCode+"/upload?filename="+this.apiRecordDB.apiDocPath
      let fd=new FormData()
      fd.append('file',this.file[0])
      apiObject.post(url1,fd)
      .then(rr=>{
          this.apiRecordDB.apiUploadDate=new Date()
          this.saveAPIEmployee()
      })
      .catch(error=>{
        if(error)
        this.$buefy.toast.open({
            duration: 5500,
            message: error.response.data.error.message,
            position: 'is-top',
            type: 'is-danger'
      })
      })
    },
    removeAPIEmployee(){
      this.$store.dispatch('selfAppraisalStore/remove_apiemployee',this.apiRecordDB.id)
        .then(rr=>{
          this.apiRecordDB={id:0}
          this.$buefy.toast.open({
              duration: 5500,
              message: 'Succesfully Removed',
              position: 'is-top',
              type: 'is-success'
          })
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
    saveAPIEmployee(){
      this.$store.dispatch('selfAppraisalStore/save_apiemployee',this.apiRecordDB)
        .then(rr=>{
          this.apiRecordDB=rr;
          this.$buefy.toast.open({
              duration: 5500,
              message: 'Succesfully Uploaded',
              position: 'is-top',
              type: 'is-success'
          })
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
