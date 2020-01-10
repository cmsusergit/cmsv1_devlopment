<template>
    <div class="dashboard is-radiusless box boxbg">

        <div class="level">
            <h1 class="level-left is-size-4 title">Course Configuration </h1>
        </div>
        <AddCourse :courseInfo='courseInfo'></AddCourse>
        <div class="tablebox">
            <b-table class="is-radiusless box"
                     :data="courseList"
                     :paginated=true
                     :per-page=20
                     :loading='loading'>
                     <template slot-scope="props">
                    <b-table-column field="index" label="Sr.No."  centered sortable>
                        {{ props.index+1 }}
                    </b-table-column>
<!--
                   <b-table-column field="courseId" label="Course ID"  centered sortable>
                       {{ props.row.courseId }}
                   </b-table-column> -->
                    <b-table-column field="courseName" label="Course Name"  sortable>
                        {{ props.row.courseName }}
                    </b-table-column>
                    <b-table-column field="courseAlias" label="Alias" centered sortable>
                        {{ props.row.courseAlias}}
                    </b-table-column>
                    <b-table-column label="Operation" centered>
                        <div>
                             <button @click="updateCourse(props.row)" style="width:40%;" class="button is-small is-info">Edit</button>
                            <button @click="removeCourse(props.row.courseId)" style="width:40%;" class="button is-small is-danger">Delete</button>
                        </div>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </div>
</template>
<script>




import AddCourse from "@/components/course/addcourse"
import {mapState} from 'vuex'
export default{
    name: 'CourseConfiguration',
    components: {
      AddCourse
    },
    data() {
        return {
          loading:false,
          courseInfo:{courseName:""}
        };
    },
    computed:{
      ...mapState("courseStore",[
        "courseList"
    ])
    },
    methods: {
        removeCourse(id){
          this.$buefy.dialog.confirm({
                    message: 'Do you Really want to Delete course?',
                    onConfirm: () => {
                        this.$store.dispatch('locStore/remove_course',id)
                        .then(rr=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "course Removed Successfully",
                                  position: 'is-top',
                                  type: 'is-success'
                              });
                              this.loading=false;
                        })
                        .catch(error=>{
                          this.$buefy.toast.open({
                                  duration: 5500,
                                  message: "Error in Removing Course\n"+error.response.data.error.message,
                                  position: 'is-top',
                                  type: 'is-danger'
                              });
                              this.loading=false;
                        });
                      }
                })

        },
        updateCourse(info){
          this.courseInfo=info;
        }
    },
    mounted() {
        this.$store.dispatch('courseStore/load_course_list');
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
