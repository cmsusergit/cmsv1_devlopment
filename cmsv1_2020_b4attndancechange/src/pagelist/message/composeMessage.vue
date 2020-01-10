<template lang="html">
  <div class="dashboard is-radiusless box boxbg" style="width:100%;">
      <div class="level">
          <h1 class="level-left is-size-4 title">Compose Message</h1>
      </div>

      <b-field grouped>
        <b-input v-model="excelFileName" disabled expanded/>
        <b-upload @input="importExcel" v-model="excelFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <a class="button is-primary">
              <b-icon icon="file-import"></b-icon>
              <span>Import Student List</span>

          </a>
      </b-upload>
    </b-field>
    <b-field>
      <b-input v-model="selectedTemplate" type="textarea"/>
    </b-field>
    <button :disabled='!selectedTemplate' @click="sendMessage" class="button is-primary">Send Messgage</button>
    <div class="is-radiusless box" style="margin-top:1em">
      <h1 class="subtitle">
        Templates
      </h1>
    </div>

    <div v-for="(template, index) in templatelist" :key="index" class="is-radiusless box" style="margin-top:1em"
      @click="selecteTemplate(template)">
    <p class="content" >{{template}}</p>
  </div>
    </div>
</template>

<script>
import config from '@/../static/test1.json'
import axios from "axios"
export default {
  name: 'ComposeMessage',
  data(){
    return {
      excelFile:null,
      fd:null,
      excelFileName:'',
      selectedTemplate:'',
      templatelist:['Your Ward is absent Today',
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit']
    }
  },
  methods: {
    importExcel(){
      console.log('****',this.excelFile);
      if (this.excelFile && this.excelFile[0]) {
        this.excelFileName=this.excelFile[0].name
      }
      this.uploadExcelFile()
    },
    selecteTemplate(template){
      this.selectedTemplate=template
    },
    uploadExcelFile(){
      this.loading=true;
      this.fd=new FormData()
      this.fd.set('accountType','intl')
      this.fd.set('msg_type','Text')
      this.fd.append('file',this.excelFile[0])
      this.loading=false
},
sendMessage(){
    this.loading=true
    const url1='https://api.gupshup.io/sm/api/ent/sms/file/upload/.xls'
    this.fd.set('msg',this.selectedTemplate)
      axios({
        method:'post',
        url:url1,
        data:this.fd,
          headers:{
            'Content-Type':'multipart/form-data',
            'apikey': '9a93d2b2cb5841acc11b24595a06fd91'
        }
      })
      .then(rr=>{
        console.log('****',JSON.stringify(rr.data));
        this.$buefy.toast.open({
          duration:5500,
          message:(rr.data.response.status=="error")?rr.data.response.details:rr.data.response.id,
          position:'is-top',
          type:(rr.data.response.status=="error")?'is-danger':'is-success'
        })
      })
      .catch(error=>{
        console.log('****',error);
        this.$buefy.toast.open({
            duration:5500,
            message:error,
            position:'is-top',
            type:'is-danger'
        })
      });
    }
  }
}
</script>


<style lang="css">
.boxbg{
    background-color: rgb(241,241,242);
    color:white;
}
</style>
