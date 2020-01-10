<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Location Configuration </h1>
        </div>
        <AddLocation :locationInfo='locationInfo'></AddLocation>
      <!-- <router-link to="/addupdatedept" class="button  is-pulled-right is-primary">Add Department</router-link>
        <div class="is-clearfix" style="margin-bottom: .5em;padding-bottom:.4em;"></div> -->
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="locationList"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column field="index" label="Sr.No."  centered sortable>
                        {{ props.index+1 }}
                    </b-table-column>
                    <b-table-column field="locName" label="Location Name"  sortable>
                        {{ props.row.locName }}
                    </b-table-column>
                    <b-table-column field="locDescription" label="Description" centered sortable>
                        {{ props.row.locDescription}}
                    </b-table-column>

                    <b-table-column field="fDeptId" label="Department Name" centered sortable>
                        {{ getDeptName(props.row.fDeptId)}}
                    </b-table-column>
                    <b-table-column label="Operation" centered>
                        <div>
                            <button @click="updateLocation(props.row)" style="width:40%;" class="button is-small is-info">Edit</button>
                            <button @click="removeLocation(props.row.locId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>
import AddLocation from "@/components/location/addlocation"
import {mapState} from 'vuex'
export default{
    name: 'LocationConfiguration',
    components: {
      AddLocation
    },
    data() {
        return {
          loading:false,
          locationInfo:{locId:0}
        };
    },















    computed:{
      ...mapState("locStore",[
        "locationList"
    ]),
    deptList(){
      return this.$store.state.departmentList
    }
    },
    methods: {
      getDeptName(id){
        let dn=''
        this.deptList.map(ob=>{
          if(ob.deptId==id)
            dn= ob.deptName
        })
        return dn
      },
        removeLocation(id){
          this.$buefy.dialog.confirm({
                    message: 'Do you Really want to Delete location?',
                    onConfirm: () => {
                        this.$store.dispatch('locStore/remove_location',id)
                        .then(rr=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Location Removed Successfully",
                                  position: 'is-top',
                                  type: 'is-success'
                              });
                              this.loading=false;
                        })
                        .catch(error=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Error in Removing Location\n"+error.response.data.error.message,
                                  position: 'is-top',
                                  type: 'is-danger'
                              });
                              this.loading=false;
                        });
                      }
                })

        },
        updateLocation(info){
          this.locationInfo=info;
        }
    },
    mounted() {
        this.$store.dispatch('locStore/load_loc_list');
        this.$store.dispatch('load_dept_list');
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
