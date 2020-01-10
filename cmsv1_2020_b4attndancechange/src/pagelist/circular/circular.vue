<template>
    <div class="dashboard is-radiusless box">

        <div class="level">
            <h1 class="level-left is-size-4 title">Circular List</h1>
        </div>
        <div v-if="isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','TRUSTEE'])">
            <button @click="addCircular" class="button is-radiusless is-info is-pulled-right">+New Circular</button>
        </div>
        <div class="">
          <CircularPanel @updateCircular="updateCircular" @removeCircular="removeCircular" :totalPage="10"/>
        </div>

        <b-modal :active.sync="isAddCircular" scroll="keep" :width="800" has-modal-card>
            <AddCircular :circularInfo="circularInfo"/>
        </b-modal>
    </div>
</template>

<script>
import AddCircular from '@/components/circular/addcircular'
import CircularPanel from "@/components/dashboard/circularpanel"
import UserMxn from '@/mixin/user'
import {mapState} from 'vuex'
export default{
    name: 'Circular',
    components: {
      AddCircular,
      CircularPanel
    },
    mixins: [UserMxn],
    data() {
        return {
          isAddCircular:false,
          circularInfo:''
        };
    },
    computed:{
    },
    methods: {
        addCircular(){
          this.circularInfo={
            circId:0,
            circDate:new Date()
          }
          this.isAddCircular=true
        },
        removeCircular(circularOb){

          this.$store.dispatch('circularStore/remove_circular',circularOb.circId)
          this.$store.dispatch('circularStore/remove_circular_file',circularOb.fileName)
        },
        updateCircular(ob){
          ob.circExpiryDate=new Date(ob.circExpiryDate)
          ob.circDate=new Date(ob.circDate)
          this.circularInfo=ob
          this.isAddCircular=true
        },
        // removeCourse(id){
        //   this.$buefy.dialog.confirm({
        //             message: 'Do you Really want to Delete course?',
        //             onConfirm: () => {
        //                 this.$store.dispatch('locStore/remove_course',id)
        //                 .then(rr=>{
        //                   this.$buefy.toast.open({
        //                           duration: 5500,
        //                           message: "course Removed Successfully",
        //                           position: 'is-top',
        //                           type: 'is-success'
        //                       });
        //                       this.loading=false;
        //                 })
        //                 .catch(error=>{
        //                   this.$buefy.toast.open({
        //                           duration: 5500,
        //                           message: "Error in Removing Course\n"+error.response.data.error.message,
        //                           position: 'is-top',
        //                           type: 'is-danger'
        //                       });
        //                       this.loading=false;
        //                 });
        //               }
        //         })
        //
        // },
        // updateCourse(info){
        //   this.courseInfo=info;
        // }
    },
    mounted() {
    }
}
</script>
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .tablebox{
        width:80vw;
        border:2px solid lightgrey;
        /*        border:1px solid white;
                overflow-y: auto;
                overflow-x: auto;
                height:  120vh;*/
    }
</style>
