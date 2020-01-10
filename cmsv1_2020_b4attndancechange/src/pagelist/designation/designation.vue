<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Designation Configuration</h1>
        </div>
        <AddDesignation :designationInfo='designationInfo'></AddDesignation>
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="designationList"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column field="index" label="Sr.No."  centered sortable>
                        {{ props.index+1 }}
                    </b-table-column>
<!--
                   <b-table-column field="desgId" label="Designation ID"  centered sortable>
                       {{ props.row.desgId }}
                   </b-table-column> -->
                    <b-table-column field="desgName" label="Designation Name"  sortable>
                        {{ props.row.desgName }}
                    </b-table-column>
                    <b-table-column field="desgAlias" label="Alias" centered sortable>
                        {{props.row.desgAlias}}
                    </b-table-column>
                    <b-table-column label="Operation" centered>
                        <div>
                            <button @click="updateDesignation(props.row)" style="width:40%;" class="button is-small is-info">Edit</button>
                            <button @click="removeDesignation(props.row.desgId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import AddDesignation from "@/components/designation/designation"
import {mapState} from 'vuex'
export default{
    name: 'Designation',
    components: {
      AddDesignation
    },
    data() {
        return {
          loading:false,
          designationInfo:{}
        };
    },
    computed:{
      ...mapState("designationStore",[
        "designationList"
    ])
    },
    methods: {
        removeDesignation(id){
          this.$buefy.dialog.confirm({
                    message: 'Do you Really want to Delete Designation?',
                    onConfirm: () => {
                        this.$store.dispatch('designationStore/remove_designation',id)
                        .then(rr=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Designation Removed Successfully",
                                  position: 'is-top',
                                  type: 'is-success'
                              });
                              this.loading=false;
                        })
                        .catch(error=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Error in Removing Designation\n"+error.response.data.error.message,
                                  position: 'is-top',
                                  type: 'is-danger'
                              });
                              this.loading=false;
                        });
                      }
                })
        },
        updateDesignation(info){
          info.isTeaching=true
          this.designationInfo=info;
        }
    },
    mounted() {
        this.$store.dispatch('designationStore/load_desg_list')
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
