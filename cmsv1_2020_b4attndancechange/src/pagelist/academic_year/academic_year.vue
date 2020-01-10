<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Academic Year Configuration </h1>
        </div>
        <AddAcademicYear :academicYearInfo='academicYearInfo'></AddAcademicYear>
      <!-- <router-link to="/addupdatedept" class="button  is-pulled-right is-primary">Add Department</router-link>
        <div class="is-clearfix" style="margin-bottom: .5em;padding-bottom:.4em;"></div> -->
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="acadyearList"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column label="Sr."  centered>
                        {{ props.index+1 }}
                    </b-table-column>
                    <b-table-column field="ayBatchYear" label="Batch Year"  sortable>
                        {{ props.row.ayBatchYear }}
                    </b-table-column>
                    <b-table-column field="ayStartDate" label="Start Date" centered sortable>
                        {{ new Date(props.row.ayStartDate).toLocaleDateString()}}
                    </b-table-column>
                    <b-table-column field="ayEndDate" label="End Date" centered sortable>
                        {{ new Date(props.row.ayEndDate).toLocaleDateString() }}
                    </b-table-column>
                    <b-table-column field="ayComment" label="Comments" centered sortable>
                        {{ props.row.ayComment }}
                    </b-table-column>
                    <b-table-column label="Operation" centered>
                        <div>
                            <button @click="updateacademicyear(props.row)" style="width:40%;" class="button is-small is-info">Edit</button>
                            <button @click="removeacademicyear(props.row.ayId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import AddAcademicYear from "@/components/academicYear/addacademicyear.vue"
import {mapState} from 'vuex'
export default{
    name: 'academicYearConfiguration',
    components: {
      AddAcademicYear
    },
    data() {
        return {
          loading:false,
          academicYearInfo:{ayId:0}
        };
    },
    computed:{
      ...mapState("acadyearStore",[
        "acadyearList"
    ])
    },
    methods: {
        removeacademicyear(id){
          this.$buefy.dialog.confirm({
                    message: 'Do you Really want to Delete academicYear?',
                    onConfirm: () => {
                        this.$store.dispatch('acadyearStore/remove_academic_year',id)
                        .then(rr=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Academicyear Removed Successfully",
                                  position: 'is-top',
                                  type: 'is-success'
                              });
                              this.loading=false;
                        })
                        .catch(error=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Error in Removing academicYear\n"+error.response.data.error.message,
                                  position: 'is-top',
                                  type: 'is-danger'
                              });
                              this.loading=false;
                        });
                      }
                })

        },
        updateacademicyear(info){
          info.ayStartDate=new Date(info.ayStartDate)
          info.ayEndDate=new Date(info.ayEndDate)
          this.academicYearInfo=info;
        }
    },
    mounted() {
        this.$store.dispatch('acadyearStore/load_academicyear_list');
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
