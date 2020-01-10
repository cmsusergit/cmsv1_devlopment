<template>
    <div class="" style="width:100%;height:100%;">

      <h1 class="is-radiusless has-background-grey box has-text-white is-size-4">Welcome {{userName}}</h1>
      <div class="tile">
        <div class="tile is-child box is-radiusless">
          <h1 class="subtitle">Circulars</h1>
          <CircularPanel :totalPage="4"/>
        </div>
          <div style="margin:.1em;"></div>
          <div class="tile is-child box is-radiusless">
              <h1 class="subtitle">TODO List</h1>

          </div>
        </div>
        <div style="margin:.2em">
        </div>

        <div class="is-radiusless box">
          <ReportPanel :generateEvent="false"/>
        </div>
      </div>
</template>
<script>
import userMxn from '@/mixin/user'
import { mapState} from 'vuex';
import ReportPanel from "@/components/report/report";
import CircularPanel from '@/components/dashboard/circularpanel'
import config from '@/../static/test1.json'
    export default {
        name: 'StudentDetail',
        components: {
          CircularPanel,
          ReportPanel
        },
        mixins: [userMxn],
        data() {
            return {
            }
        },
        computed:{
          userName(){
            return this.loggedInUser.stuFirstname+" "+this.loggedInUser.stuMiddlename+" "+this.loggedInUser.stuLastname
          }
        },
        watch:{
          currAcademicyearId(){
            this.getTT()

          },
          loggedInUser(){
            this.getTT()
          }
        },
        methods: {
          getTT(){
            const ob = {
                aYearId:this.currAcademicyearId,
                dept: this.loggedInUser.deptId
            };
            console.log('----',JSON.stringify(ob));
            this.$store.dispatch('ttStore/getTimeTableId', ob).then(response => {
                if (response.data[0]) {
                    const temp={
                      tblId:response.data[0].timetableId,
                      batchId:this.loggedInUser.fBatchId,
                      classId:this.loggedInUser.fClassId
                    }
                    this.$store.dispatch('ttStore/loadTTblRecordListByCl',temp)
                            .then(rr => {
                            }).catch(error => {
                        console.log("****", error);
                    });
                }
            }).catch(error => {
                console.log('****', error);
                this.timeTblId="";
            });
          }
        },
        mounted(){
            this.getTT()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .boxv{
        background-color: white;
        color:#224444;
    }
</style>
