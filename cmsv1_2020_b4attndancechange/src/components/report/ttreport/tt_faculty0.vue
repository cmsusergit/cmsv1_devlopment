<template>
    <div class="" style="width:100%">

        <div class="is-radiusless box">
            <b-field label="Faculty Name">
                <b-select @input="fNameChanged" v-model="facultyId" expanded>
                    <option :value="faculty.empId" v-for="faculty in facultyList">
                      {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                    </option>
                </b-select>
            </b-field>


        </div>
        <div class="is-radiusless box">
          <ReportPanel :generateEvent='false'/>
        </div>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    export default {
        name: "TTFacultyReport",

        props: ['timeTblId'],
        data() {
            return {
                facultyId: "",
                dept: ""
            };
        },
        components: {
            ReportPanel
        },
        computed: {
            facultyList(){
              return this.$store.state.employeeStore.facultyList
            }
        },
        mounted() {
        },
        methods: {
          fNameChanged(){

            this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: this.facultyId, tblId: this.timeTblId})
                    .then(rr => {
                        this.timeTblDt.timeTableList = this.$store.state.ttStore.timeTblDt.timeTableList;
                    }).catch(error => {
                console.log("****", error);
            });
          }
        }
};
</script>
<style>
</style>
