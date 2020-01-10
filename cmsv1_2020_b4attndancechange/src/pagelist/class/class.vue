<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Class Configuration </h1>
        </div>
        <AddClass :studentClassInfos='studentClassInfos'></AddClass>
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="classList"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column field="index" label="Sr.No."  centered sortable>
                        {{ props.index+1 }}
                    </b-table-column>
                    <!--
                   <b-table-column field="classId" label="Class ID"  centered sortable>
                       {{ props.row.classId }}
                   </b-table-column> -->
                    <b-table-column field="className" label="Class Name"  sortable>
                        {{ props.row.className }}
                    </b-table-column>
                    <b-table-column field="fDeptName" label="Department" centered sortable>
                        {{ getDeptName(props.row.fDeptId)}}
                    </b-table-column>
                    <b-table-column label="Operation" centered>
                        <div>
                             <button @click="updateClass(props.row)" style="width:40%;" class="button is-small is-info">Edit</button>
                            <button @click="removeClass(props.row.classId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>




import AddClass from "@/components/student_class/addclass"
import {mapState} from 'vuex'
export default{
    name: 'Addclass',
    components: {
      AddClass
    },
    data() {
        return {
          loading:false,
          studentClassInfos:{}
        };
    },
    computed:{
      deptList(){
        return this.$store.state.departmentList
      },
      ...mapState("classStore",[
        "classList"
    ])
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
        removeClass(id){
          this.$buefy.dialog.confirm({
                    message: 'Do you Really want to Delete class?',
                    onConfirm: () => {
                        this.$store.dispatch('classStore/remove_class',id)
                        .then(rr=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Class Removed Successfully",
                                  position: 'is-top',
                                  type: 'is-success'
                              });
                              this.loading=false;
                        })
                        .catch(error=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Error in Removing Class\n"+error.response.data.error.message,
                                  position: 'is-top',
                                  type: 'is-danger'
                              });
                              this.loading=false;
                        });
                      }
                })

        },
        updateClass(info){
          this.studentClassInfos=info;
        }
    },
    mounted() {
        this.$store.dispatch('classStore/load_class_list');
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
