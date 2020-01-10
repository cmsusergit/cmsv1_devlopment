  <template>
    <div style="width:100%;" class="is-radiusless box">

      <b-loading :active.sync="isLoading"></b-loading>
      <h1 class="subtitle has-text-weight-bold has-text-centered">
        <u>PART-D</u>
        <br>
        <b>OTHER ACTIVITIES PERFORMED</b>
      </h1>
        <div class="is-clearfix" style="margin-bottom:0.2em;">
          <p class="subtitle has-text-weight-bold is-pulled-left is-radiusless tag is-large is-info" style="margin-bottom:.5em;padding:1em;">Total Score: {{scoreTotal}}</p>
      </div>

      <div class="is-clearfix" style="margin-bottom:1em;border-bottom:1px solid grey;">
          <p class="subtitle has-text-weight-bold is-pulled-left is-radiusless tag is-large is-info" style="margin-bottom:.5em;padding:1em;">Score of This Section: {{scoreSectionTotal}}</p>
          <button @click="downloadDocumentZip" class="button is-info is-radiusless is-pulled-right">Download Zip</button>
    </div>
    <div class="has-text-weight-bold">
      <b-tabs v-if="apiFormType==0"  @change="tabChanged" type="is-boxed" size="is-small" expanded>
        <b-tab-item v-for="(temp,indx) in sectionHeaderListTF" :key="indx" :label="temp.sectionHeading">
          <SelfAppraisalPartDTable :apiFormType='apiFormType' :user='user' :sfAyid='1' :sfSectionId='temp.sectionId'/>
        </b-tab-item>
      </b-tabs>
      <b-tabs v-else-if="apiFormType==1" @change="tabChanged" type="is-boxed" size="is-small" expanded>
        <b-tab-item v-for="(temp,indx) in sectionHeaderListNTF" :key="indx" :label="temp.sectionHeading">
          <SelfAppraisalPartDTable :apiFormType='apiFormType' :user='user' :sfAyid='1' :sfSectionId='temp.sectionId'/>
        </b-tab-item>
      </b-tabs>
      <b-tabs v-else-if="apiFormType==2" @change="tabChanged" type="is-boxed" size="is-small" expanded>
        <b-tab-item v-for="(temp,indx) in sectionHeaderListMCA" :key="indx" :label="temp.sectionHeading">
          <SelfAppraisalPartDTable :apiFormType='apiFormType' :user='user' :sfAyid='1' :sfSectionId='temp.sectionId'/>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import SelfAppraisalPartDTable from '@/components/SelfAppraisal/part_d_table'
import config from '@/../static/test1.json'
import {mapGetters} from 'vuex'
import JSZipUtils from 'jszip-utils'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
export default {
  name: 'SelfAppraisalPartD',
  props: ['user','apiFormType'],
  components: {
    SelfAppraisalPartDTable
  },
  data() {
    return {
      isLoading:false,
      scoreTotal:0,
      sectionHeaderListTF:[{sectionId:1,sectionHeading:"D-1 CURRICULAR ACTIVITIES"},{sectionId:2,sectionHeading:"D-2 CO-CURRICULAR ACTIVITIES"},
                            {sectionId:3,sectionHeading:"D-3 EXTRA-CURRICULAR ACTIVITIES"},{sectionId:4,sectionHeading:"D-4 DEVELOPMENTAL ACTIVITIES"}],
      sectionHeaderListNTF:[{sectionId:1,sectionHeading:"D-1 CURRICULAR & CO-CURRICULAR ACTIVITIES"},{sectionId:2,sectionHeading:"D-2 EXTRA-CURRICULAR ACTIVITIES"},
                            {sectionId:3,sectionHeading:"D-3 DEVELOPMENTAL ACTIVITIES"}],
      sectionHeaderListMCA:[{sectionId:1,sectionHeading:"D-1 CURRICULAR ACTIVITIES"},{sectionId:2,sectionHeading:"D-2 CO-CURRICULAR ACTIVITIES"},
                                                  {sectionId:3,sectionHeading:"D-3 EXTRA-CURRICULAR ACTIVITIES"},{sectionId:4,sectionHeading:"D-4 PROFESSIONAL DEVELOPMENTAL ACTIVITIES"}],
      scoreSectionTotal:0
    }
  },
  computed: {
    ...mapGetters([
    ]), //....
  },
  watch:{
    user(){
       this.getTotalScoreForEmployee()
       this.getTotalScoreForEmployee(1)
     }
  },
  mounted()
  {

    if(this.user){
    this.getTotalScoreForEmployee()
    this.getTotalScoreForEmployee(1)
  }
  },
  methods: {
      downloadDocumentZip(){
        this.isLoading=true
        this.$store.dispatch('selfAppraisalStore/loadProofFileList',this.user.empCode)
          .then(rr=>{
            let urlList=[]
            rr.map(ob=>{
              urlList.push(config.db_configuration.baseURL+`/apicontainers/${ob.container}/download/${ob.name}`)
            })
            const zip = new JSZip();
            let count = 0;
            const zipFilename = this.user.empCode+".zip"
            urlList.forEach((url1, indx)=> {
                const filename=url1.substring(url1.lastIndexOf('/')+1,url1.length)
                JSZipUtils.getBinaryContent(url1, (err, data)=> {
                  if (err) {
                    console.log(err)
                    this.isLoading=false
                  }
                  zip.file(filename, data, { binary: true });
                  count++;
                  if (count == urlList.length) {
                    zip.generateAsync({ type: 'blob' }).then( (content)=> {
                      FileSaver.saveAs(content, zipFilename);
                      this.isLoading=false
                    });
                  }
                });
              });
          })



          .catch(error=>{
            this.isLoading=false
          })
      },
      getTotalScoreForEmployee(indx){
        this.$store.dispatch('selfAppraisalStore/getApprovedMetaDt',{empCode:this.user.empCode,sectionId:indx})
          .then(rr=>{
            if(indx){
                this.scoreSectionTotal=rr
            }
            else {
                this.scoreTotal=rr
            }
          })
          .catch(error=>{
            console.log('****',error);
          })
      },
      tabChanged(indx){
        this.getTotalScoreForEmployee(indx+1)
      }
  }
}
</script>
<style>
</style>
