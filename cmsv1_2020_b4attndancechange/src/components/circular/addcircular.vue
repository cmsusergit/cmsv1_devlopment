<template>
  <div class="modal-card" style="overflow:auto">

    <form @submit.prevent="addCircular" class="is-radiusless box">
      <b-field grouped>
        <b-field label="Circular ID" expanded>
          <b-input disabled v-model="circularInfo.circId" required></b-input>
        </b-field>
        <b-field label="Circular ExpiryDate" expanded>
          <b-datepicker v-model="circularInfo.circExpiryDate" required/>
        </b-field>

      </b-field>
    <b-field label="Circular Title" expanded>
      <b-input v-model="circularInfo.circTitle" required></b-input>
    </b-field>
    <b-field label="Circular Content" expanded>
      <b-input type="textarea" v-model="circularInfo.circContent" required></b-input>
    </b-field>
    <div class="level">
      <div class="level">
      <b-upload @input="documentUploaded" v-model="file">
          <a class="button is-radiusless is-primary">
              <b-icon icon="upload"></b-icon>
              <span>Upload File</span>
          </a>
      </b-upload>
          <div class="tags">
            <span v-if="circularInfo.fileName" class="tag is-success" >
                {{circularInfo.fileName}}
                <button class="delete is-small"
                    type="button"
                    @click="removeFile">
                </button>
            </span>
        </div>
     </div>
     <button type="submit" class="button is-radiusless is-info is-pulled-right">Post Circular</button>
    </div>
  </form>
</div>
</template>
<script>
import {mapState} from 'vuex'
import apiObject from '@/dataserve/student_serve.js'
export default {
  name: 'AddCircular',
  props: ['circularInfo'],
  data() {
      return {
        file:null
      }
  },
  watch:{
    file(){
      if(this.file && this.file[0])
        this.circularInfo.fileName=this.file[0].name
    }
  },
  methods:{
    saveCircular(){
        this.circularInfo.circDate=new Date(this.circularInfo.circDate.getTime() + Math.abs(this.circularInfo.circDate.getTimezoneOffset()*60000))
        this.circularInfo.circExpiryDate=new Date(this.circularInfo.circExpiryDate.getTime() + Math.abs(this.circularInfo.circExpiryDate.getTimezoneOffset()*60000))
        if(this.file && this.file[0])
          this.circularInfo.fileName=this.file[0].name
          let methodName='circularStore/add_circular'
          if(this.circularInfo.circId!=0)
            methodName='circularStore/update_circular'
          this.$store.dispatch(methodName,this.circularInfo)
          .then(response=>{
            this.$buefy.toast.open({
                  duration: 5500,
                  message: "Circular Posted",
                  position: 'is-top',
                  type: 'is-success'
            })
            this.$parent.close()
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
    addCircular(){
      if(!this.file){
          this.saveCircular()
      }
      else{
      this.documentUploaded()
        .then(rr=>this.saveCircular())
        .catch(error=>{
          this.$buefy.toast.open({
                      duration: 5500,
                      message: error.response.data.error.message,
                      position: 'is-top',
                      type: 'is-danger'
        })

      })
      }
    },
    removeFile(){
      const url1="/containers/circulars/files/"+this.circularInfo.fileName
      apiObject.delete(url1)
        .then(rr=>{
          this.circularInfo.fileName=""
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
    documentUploaded(){
      const url1="/containers/circulars/upload"
      let fd=new FormData()
      fd.append('file',this.file[0])
      return apiObject.post(url1,fd)
    }
//       addCourse(){
//         if(this.courseInfo.courseName!==''){
//           this.$buefy.dialog.confirm({
//                     message: 'This Will Add New Course,Really want to Continue?',
//                     onConfirm: () => {
//                       this.addCourse1();
//                     }
//                 })
//         }
//         else{
//           this.addCourse1();
//         }
// },
//
// addCourse1(){
//         this.loading=true;
//
//         this.courseInfo.courseId=0;
//         this.$store.dispatch('courseStore/add_course',this.courseInfo)
//           .then(rr=>{
//             this.$buefy.toast.open({
//                     duration: 5500,
//                     message: "Course Added Successfully",
//                     position: 'is-top',
//                     type: 'is-success'
//                 });
//                 this.loading=false;
//           })
//           .catch(error=>{
//             this.$buefy.toast.open({
//                     duration: 5500,
//                     message: "Error in Adding Course\n"+error.response.data.error.message,
//                     position: 'is-top',
//                     type: 'is-danger'
//                 });
//                 this.loading=false;
//           });
//       },
//       updateCourse(){
//         this.loading=true;
//         this.$store.dispatch('courseStore/update_course',this.courseInfo)
//           .then(rr=>{
//             this.$buefy.toast.open({
//                     duration: 5500,message: "Course Updated Successfully",
//                     position: 'is-top',type: 'is-success'
//                 });
//                 this.loading=false;
//           })
//           .catch(error=>{
//             this.$buefy.toast.open({
//                     duration: 5500,message: "Error in Adding Course\n"+error.response.data.error.message,
//                     position: 'is-top',type: 'is-danger'
//                 });
//                 this.loading=false;
//           });
//       }
  },
  created(){
  }
}
</script>
<style lang="css" scoped>
</style>
