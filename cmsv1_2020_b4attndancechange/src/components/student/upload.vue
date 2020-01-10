<template>
      <section>

        <h1 class="title">Upload Document</h1>
        <div class="section">
          <b-field :key="indx" v-for="(file,indx) in fileList" grouped>
            <div class="is-radiusless box" style="width:100%;margin-right:1em">

          <b-field expanded>
            <b-select  expanded>
              <option v-for="pd in pastDocs">{{pd}}</option>
            </b-select>
            </b-field>
            <b-field label="Description" expanded><b-input type="textarea" expanded></b-input></b-field>
            </div>
            <vue-dropzone  @vdropzone-complete="fileUploaded" ref="vueDropzone" id="dropzone" :options="dropzoneOptions" expanded>
            </vue-dropzone>

        </b-field>
        </div>
      </section>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import config from '@/../static/test1.json'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
        name: 'UploadFile',
        components:{vueDropzone: vue2Dropzone},
        props:[],
        data() {
            return {
              fileList:[''],
              dropzoneOptions: {
                  url: config.db_configuration.baseURL+'/containers/upload_document/upload',
                  thumbnailWidth: null,
                  maxFilesize: 2,
                  maxFiles:1,
                  addRemoveLinks: true,
                  acceptedFiles:"image/*"
              },
              pastDocs:['SSC','HSC','DIPLOMA','ADHARCARD'],
            }
        },
        methods:{
          fileUploaded(file){
              this.fileList.push(file.name);
          }
        }
    }
</script>
<style scoped>
</style>
