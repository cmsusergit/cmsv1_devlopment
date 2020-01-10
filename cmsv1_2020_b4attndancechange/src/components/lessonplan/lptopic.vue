<template>
  <div class="section is-radiusless box">

    <div>
      <div class="is-radiusless is-clearfix box">
        <div class="is-size-4 is-pulled-left">
            {{lpUnit.gtuUnitno}}-{{lpUnit.gtuUnitname}} ({{lpUnit.gtuUnithrs}} Hrs.)
        </div>
        <button @click="$emit('gotoUnitList')" class="button is-info is-radiusless is-pulled-right">Go To Unit List</button>
      </div>



      <table class="table is-bordered is-fullwidth">
        <thead>
            <th>Sr.</th>
            <th width="50%">Topic Description</th>
            <th>Teaching Method</th>
            <th>Teaching Aid</th>
            <th width='140'>Is Online Posted?</th>
            <!-- <th width='110'>
            CO
            </th>
            -->
            <th></th>
        </thead>
        <tr v-for="(topic, index) in topicList" :key="index">
          <td>{{index+1}}</td>
          <td width="50%"><b-input v-model="topic.topic"/></td>
          <td>
            <b-select v-model="topic.tMethod">
              <option v-for="(teachingMethod, index) in teachingMethodList" :key="index">{{teachingMethod}}</option>
            </b-select>
        </td>
          <td>
            <b-select v-model="topic.tAid">
              <option v-for="(teachingAid, index) in teachingAidList" :key="index">{{teachingAid}}</option>
            </b-select>
          </td>
          <td class="has-text-centered">
            <b-checkbox v-model="topic.onlinePost" />
          </td>
          <!--
          <td>
            <b-input disabled v-model="topic.coId"/>
          </td> -->
          <td class="has-text-centered">
          <b-tooltip v-if="index==topicList.length-1" type="is-info" label="Add Topic">
            <button :disabled="!topic.topic || !topic.tAid || !topic.tMethod"  @click='addTopic' class="button is-radiusless is-small is-info">+</button>
          </b-tooltip>
            <b-field v-else grouped>
              <b-tooltip type="is-info" label="Edit Topic">
            <button @click='editTopic(topic,index)' class="button is-dark is-radiusless is-small">
              <b-icon pack="fas" icon="edit"></b-icon>
            </button>
          </b-tooltip>
          <b-tooltip type="is-info" label="Remove Topic">
            <button @click='removeTopic(topic,index)' class="button is-radiusless is-small is-danger">-</button>
          </b-tooltip>
          </b-field>
          </td>
        </tr>
      </table>
      </div>
      <div class="is-radiusless is-clearfix box" style="margin-top:1em;">
        <button @click="$emit('gotoUnitList')" class="button is-info is-radiusless is-pulled-right">Go To Unit List</button>
      </div>
  </div>
</template>
<script>
export default {
  name:'LPTopic',
  props: ['lpUnit'],
  data(){
    return {
      teachingAidList:['Chalk & Talk','PPT','Video Lecture','Model','Chart','Handout','Other','Application Software'],
      teachingMethodList:[ 'Lecture','Quiz','Seminar','Demostration','Industrial Visit','Group Discussion'],
      topicList:[{topicId:0,topic:'',tAid:'',tMethod:'',coId:0}]
    }
  },
  watch:{
    lpUnit(v1,v2){
      this.load_topiclist()
    }
  },
  methods: {
    addTopic() {
      if(this.lpUnit.unitId && this.lpUnit.unitId!=0){
          let ob=this.topicList[this.topicList.length-1]
          ob.unitId=this.lpUnit.unitId
          this.$store.dispatch('lessonPlanStore/add_lp_topic',ob)
          this.lpUnit.topicList=JSON.parse(JSON.stringify(this.topicList))
          this.topicList.push({topicId:0,topic:'',tAid:'',tMethod:'',coId:0})
        }
        else {
          this.$buefy.toast.open({
              duration: 5500,
              message: "Please Add Unit Before Add Topic",
              position: 'is-top',
              type: 'is-danger'
            })
        }
        // else{
        //       let temp=this.lpUnit;
        //       temp.lpId=this.lpUnit.lpId
        //       this.$store.dispatch('lessonPlanStore/add_lessonplan_unit',temp)
        //         .then(rr=>{
        //           let ob=this.topicList[this.topicList.length-1]
        //           ob.unitId=rr.unitId
        //           this.$store.dispatch('lessonPlanStore/add_lp_topic',ob)
        //           this.topicList.push({})
        //         })
        //         .catch(error=>{
        //           this.$buefy.toast.open({
        //                       duration: 5500,
        //                       message: error.response.data.error.message,
        //                       position: 'is-top',
        //                       type: 'is-danger'
        //                   })
        //         })
        // }

    },
    editTopic(topic,indx){
      this.$store.dispatch('lessonPlanStore/update_lp_topic',topic)
        .then(rr=>{
          this.$buefy.toast.open({
              duration: 5500,
              message: 'Topic Updated',
              position: 'is-top',
              type: 'is-success'
            })
        })
        .catch(error=>{
          this.$buefy.toast.open({
              duration: 5500,
              message: error.response.data.error.message,
              position: 'is-top',
              type: 'is-danger'
            })
        })
    },
    removeTopic(topic,indx){
      this.$store.dispatch('lessonPlanStore/remove_lp_topic',topic.topicId)
        .then(rr=>{
          this.topicList.splice(indx,1)
          this.lpUnit.topicList=JSON.parse(JSON.stringify(this.topicList))

          this.lpUnit.topicList.splice(this.lpUnit.topicList.length-1)
          this.$buefy.toast.open({
              duration: 5500,
              message: 'Topic Removed',
              position: 'is-top',
              type: 'is-success'

            })
        })
        .catch(error=>{
          this.$buefy.toast.open({
              duration: 5500,
              message: error.response.data.error.message,
              position: 'is-top',
              type: 'is-danger'
            })
        })
    },
  load_topiclist() {
        if(!this.lpUnit || !this.lpUnit.topicList)
          return
        this.lpUnit.topicList.map(temp=>{
          temp.onlinePost=temp.onlinePost==1?true:false
        })
        this.topicList=JSON.parse(JSON.stringify(this.lpUnit.topicList))
        this.topicList.push({topicId:0,topic:'',tAid:'',tMethod:'',coId:0})
        // this.topicList=[{topicId:0,topic:'',tAid:'',tMethod:'',coId:0}]
        // if(id && id!=0)
        //   this.$store.dispatch('lessonPlanStore/load_lessonplan_topic',id)
        //   .then(rr=>{
        //     this.topicList=rr
        //     this.topicList.push({topicId:0,topic:'',tAid:'',tMethod:'',coId:0})
        //   })
        //   .catch(error=>{
        //       this.$buefy.toast.open({
        //       duration: 5500,
        //       message: error.response.data.error.message,
        //       position: 'is-top',
        //       type: 'is-danger'
        //     })
        //   })
  }
},
mounted() {
  this.load_topiclist()
}
}
</script>
<style lang="css" scoped>
</style>
