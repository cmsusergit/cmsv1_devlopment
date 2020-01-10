<template>
    <div class="" style="width:100%">

        <div class="is-radiusless box">
            <b-field grouped>
            <b-field label="Class Name" expanded>
              <b-select @input="classChanged" v-model="classId" expanded>
                  <option :key="indx" v-for="(cl, indx) in classList" :value="cl.classId">
                      {{cl.className}}
                  </option>
              </b-select>
            </b-field>
            <b-field label="BatchWise">
                <b-switch size="is-large" @input="loadTTbl" v-model="batchWiseTtbl"></b-switch>
            </b-field>
            <b-field label="Batch Name" expanded>
              <b-select :disabled="!batchWiseTtbl" @input="loadTTbl" v-model="batchId" expanded>
                  <option :key="indx" v-for="(bl, indx) in batchList" :value="bl.batchId">
                      {{bl.batchName}}
                  </option>
              </b-select>
            </b-field>
          </b-field>
        </div>
        <div class="is-radiusless box">
          <template v-if="!batchWiseTtbl">
            <ReportPanel :isClassName="classId" :isClassTtbl='true' :generateEvent='false'/>
          </template>
          <template v-else>
            <ReportPanel :isClassTtbl='true' :generateEvent='false'/>
          </template>
        </div>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import { mapState} from 'vuex';
    import ReportPanel from "@/components/report/report";
    export default {
        name: "TTClassReport",
        props: ['ayId'],
        data() {
            return {
                batchWiseTtbl:false,
                classId: "",
                batchId:""
            };
        },
        components: {
            ReportPanel
        },
        computed: {
          ...mapState([//....
            'classList'
          ]),
          batchList(){
            return this.$store.state.classStore.batchList
          }
        },
        watch:{
          classList(){
              if(this.classList && this.classList[0]){
                    this.classId=this.classList[0].classId
                }
                else{
                    this.classId = -1
                }
            this.classChanged()
          },
          batchList(){
               if(this.batchList && this.batchList[0]){
                    this.batchId=this.batchList[0].batchId
                }
          }
        },
        mounted() {
        },
        methods: {
          classChanged(){
            this.$store.dispatch('classStore/load_batch_list_by_classid',this.classId)
            this.loadTTbl()
          },
          loadTTbl(){
            if(this.batchWiseTtbl){
                    this.$store.dispatch('ttStore/loadTTblRecordListByCl', {ayId:this.ayId,batchId:this.batchId,classId:this.classId})
                          .then(rr => {
                              //
                              // if(!this.timeTblDt)
                              //   this.timeTblDt={}
                              // this.timeTblDt.timeTableList = this.$store.state.ttStore.timeTblDt.timeTableList;
                          }).catch(error => {
                      console.log("****", error);
                    });
            }
            else{
                this.$store.dispatch('ttStore/loadTTblRecordListByCl', {ayId:this.ayId,batchId:-1,classId:this.classId})
                      .then(rr => {
                      }).catch(error => {
                            console.log("****", error);
                    });
            }
          }
        }
};
</script>
<style>
</style>
