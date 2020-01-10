<template>
    <div class="" style="width:100%">

        <div class="is-radiusless box">
          <b-field label="Location Name" expanded>

            <b-select @input='locationChanged' v-model="locationId" expanded>
              <option v-for="(location,index) in locationList" :key="index" :value="location.locId">
                {{location.locName}}
              </option>
            </b-select>
          </b-field>

        </div>
        <div class="is-radiusless box">
          <ReportPanel :isLocationName="locationId" :isLocationTtbl='true' :generateEvent='false'/>
        </div>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    export default {
        name: "TTLocationReport",
        props: ['timeTblId','ayId'],
        data() {
            return {
                locationId: ""
            };
        },
        components: {
            ReportPanel
        },
        computed: {
            locationList(){
              return this.$store.state.locStore.locationList
            }
        },
        watch:{
          locationList(){
              if(this.locationList && this.locationList[0]){
            this.locationId=this.locationList[0].locId
            this.locationChanged()
        }
        else{
            this.locationId=-1;
            this.locationChanged()
        }
          }
        },
        mounted() {
        },
        methods: {
          locationChanged(){
            this.$store.dispatch('ttStore/loadTTblRecordListByLocation', {ayid: this.ayId,locationId:this.locationId})
                    .then(rr => {
                        //
                        //this.timeTblDt.timeTableList = this.$store.state.ttStore.timeTblDt.timeTableList;
                    }).catch(error => {
                console.log("****", error);
            });
          }
        }
};
</script>
<style>
</style>
