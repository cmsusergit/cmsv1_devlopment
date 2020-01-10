<template>
  <div class="is-radiusless box">

    <div>
      <table class="table is-fullwidth is-bordered">
        <thead>
          <th>GTU Unit Number</th>
          <th>GTU Unit Name</th>
          <th>Unit Hrs.</th>
        </thead>



      <tr>
        <td>
          <input class="input is-radiusless" v-model="lpUnit.gtuUnitno" type='Number' min='0' required/>
        </td>
        <td>
            <input class="input is-radiusless" v-model="lpUnit.gtuUnitname" required/>
        </td>
        <td>
            <input class="input is-radiusless" v-model="lpUnit.gtuUnithrs" type='Number' min='0'/>
        </td>
      </tr>
      <!-- <tr><td colspan="4">
      <table class="table is-fullwidth">
        <thead>
            <th>
              Sr.
            </th>
            <th>Topic Description</th>
            <th>Teaching Method</th>
            <th>Teaching Aid</th>
            <th width='140'>Is Online Posted?</th>
            <th width='110'>CO</th>
            <th></th>
        </thead>

        <tr v-for="(topic, index) in topicList" :key="index">
          <td>{{index+1}}</td>
          <td><b-input v-model="topic.topic"/></td>
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
          <td>
            <b-checkbox v-model="topic.onlinePost" />
          </td>
          <td>
            <b-input v-model="topic.coId"/>
          </td>
          <td>
            <button :disabled="!topic.topic || !topic.tAid || !topic.tMethod" v-if="index==topicList.length-1" @click='addTopic' class="button is-info">+</button>
            <button v-else @click='removeTopic(topic,index)' class="button is-danger ">-</button>
          </td>
        </tr>
      </table>
      </td></tr> -->
      </table>
      <div class="is-clearfix">
        <button :disabled='!inputLpUnit || !lpUnit || !lpUnit.gtuUnitno || !lpUnit.gtuUnitname || !lpUnit.gtuUnithrs' @click="$emit('editUnit',lpUnit)" class="button is-radiusless is-info is-pulled-right" style="margin-left:.5em;">Edit Unit</button>
        <button :disabled='!lpUnit || !lpUnit.gtuUnitno || !lpUnit.gtuUnitname || !lpUnit.gtuUnithrs' @click="addUnit(lpUnit)" class="button is-radiusless is-info is-pulled-right">Add Unit</button>
      </div>
      </div>
  </div>
</template>
<script>
export default {
  name:'LPUnit',
  props: ['inputLpUnit'],
  data(){
    return {
      lpUnit:{unitId:0},
      teachingAidList:['PPT','video Lecture','Model','Chart','Handout','Application Software'],
      teachingMethodList:['Chalk & Talk', 'Lecture','Quiz','Seminar','Demostration','Industrial Visit','Group Discussion'],
      topicList:[{}]
    }
  },
  watch:{
    inputLpUnit(v1,v2){
      this.lpUnit=JSON.parse(JSON.stringify(this.inputLpUnit))
      this.load_topiclist(v1.unitId)
    }
  },
  methods: {
    addUnit(unit){
      if(unit && unit.unitId!==0){
        this.$buefy.dialog.confirm({
                  message: 'This Will Add New Unit,Really want to Continue?',
                  onConfirm: () => {
                    this.$emit('addUnit',unit)
                  }
              })
            }
        else{
          this.$emit('addUnit',unit)
        }
    },
    addTopic() {
      if(this.lpUnit.unitId && this.lpUnit.unitId!=0){
          let ob=this.topicList[this.topicList.length-1]
          ob.unitId=this.lpUnit.unitId
          this.$store.dispatch('lessonPlanStore/add_lp_topic',ob)
          this.topicList.push({})
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
    removeTopic(topic,indx){
      this.$store.dispatch('lessonPlanStore/remove_lp_topic',topic.topicId)
        .then(rr=>{
          this.topicList.splice(indx,1)
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
  load_topiclist(id) {
        this.topicList=[{topicId:0,topic:'',tAid:'',tMethod:'',coId:0}]
        if(id && id!=0)
          this.$store.dispatch('lessonPlanStore/load_lessonplan_topic',id)
          .then(rr=>{
            this.topicList=rr
            this.topicList.push({topicId:0,topic:'',tAid:'',tMethod:'',coId:0})
          })
          .catch(error=>{
              this.$buefy.toast.open({
              duration: 5500,
              message: error.response.data.error.message,
              position: 'is-top',
              type: 'is-danger'
            })
          })
  }
},
mounted() {
  this.load_topiclist(this.lpUnit.unitId)
}
}
</script>
<style lang="css" scoped>
</style>
