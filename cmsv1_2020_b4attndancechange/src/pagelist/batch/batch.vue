<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Batch Configuration </h1>
        </div>
        <AddBatch :studentBatchInfo='studentBatchInfo'></AddBatch>
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="batchList"
                     :paginated=true
                     :per-page=20

                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column field="index" label="Sr.No."  centered>
                        {{ props.index+1 }}
                    </b-table-column>
<!--
                   <b-table-column field="batchId" label="Batch ID"  centered sortable>
                       {{ props.row.batchId }}
                   </b-table-column> -->
                    <b-table-column field="batchName" label="Batch Name"  sortable>
                        {{ props.row.batchName }}
                    </b-table-column>
                    <b-table-column field="fClassId" label="Class"  sortable>
                        {{ getClassName(props.row.fClassId)}}
                    </b-table-column>
                    <b-table-column field="fDeptId" label="Department" centered sortable>
                        {{ getDeptName(props.row.fDeptId)}}
                    </b-table-column>
                    <b-table-column label="Operation" centered>
                        <div>
                           <button @click="updateBatch(props.row)" style="width:40%;" class="button is-small is-info">Edit</button>
                           <button @click="removeBatch(props.row.batchId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import AddBatch from "@/components/student_batch/addbatch"
import {mapState} from 'vuex'
export default{
    name: 'Addbatch',
    components: {
      AddBatch
    },
    data() {
        return {
          loading:false,
          studentBatchInfo:{}
        };
    },
    computed:{
      ...mapState(
        "classStore",[
          "classList"
    ]),
      batchList(){
        return this.$store.state.classStore.allBatchList
      },
      deptList(){
        return this.$store.state.departmentList
      }
    },
    methods: {
        removeBatch(id){
          this.$buefy.dialog.confirm({
                    message: 'Do you Really want to Delete batch?',
                    onConfirm: () => {
                        this.$store.dispatch('classStore/remove_batch',id)
                        .then(rr=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Batch Removed Successfully",
                                  position: 'is-top',
                                  type: 'is-success'
                              });
                              this.loading=false;
                        })
                        .catch(error=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Error in Removing Batch\n"+error.response.data.error.message,
                                  position: 'is-top',
                                  type: 'is-danger'
                              });
                              this.loading=false;
                        });
                      }
                })
        },
        updateBatch(info){
          this.studentBatchInfo=info;
        },
        getClassName(id){
          let cn=''
          this.classList.map(ob=>{
            if(ob.classId==id)
              cn= ob.className
          })
          return cn
        },
        getDeptName(id){
          let dn=''
          this.deptList.map(ob=>{
            if(ob.deptId==id)
              dn= ob.deptName
          })
          return dn
        }

    },
    mounted() {
        this.$store.dispatch('classStore/load_class_list');
        this.$store.dispatch('load_dept_list');
        this.$store.dispatch('classStore/load_batch_list');
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
