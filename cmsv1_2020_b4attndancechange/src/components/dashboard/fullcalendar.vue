<template>
  <div class="tile">

         <div class="tile is-child is-radiusless box">
           <full-calendar @eventClick="eventSelected" :events="demoEvents" locale="en"></full-calendar>
         </div>
         <div v-if="isEventSelected" class="tile is-child box is-radiusless is-4 panel">
           <div class="panel-heading is-radiusless is-size-5" :class="currSelectedEvent.cssClass">
             <span class="is-clearfix">
                 {{currSelectedEvent.title}}
                 <a @click='isEventSelected=false' class="delete is-large is-pulled-right"></a>
             </span>

           </div>
           <div class="panel-block is-size-5">
               <p class="is-size-5">
                 {{currSelectedEvent.start}}
               <template v-if="currSelectedEvent.start!=currSelectedEvent.end">
                 <b>to</b>
                 {{currSelectedEvent.end}}
              </template>
              </p>
            </div>
              <div class="" v-if="currSelectedEvent.YOUR_DATA && currSelectedEvent.YOUR_DATA.coordinator">
                <p class="panel-block panel-heading is-radiusless is-size-5 has-text-weight-bold" >Coordinators:</p>
                <p class="panel-block is-size-5" :key="indx" v-for="(ob,indx) in currSelectedEvent.YOUR_DATA.coordinator">{{ob}}</p>
              </div>
              <div v-if="currSelectedEvent.YOUR_DATA && currSelectedEvent.YOUR_DATA.description">
                <p class="panel-block panel-heading is-radiusless is-size-5 has-text-weight-bold">Description:</p>
                <p class="panel-block is-size-5">{{currSelectedEvent.YOUR_DATA.description}}</p>
              </div>
        </div>
  </div>
</template>
<script>
import fullCalendar from 'vue-fullcalendar'
export default {
  name: "FullCalendar",
  components: {
    fullCalendar
  },
  data(){
    return {
        demoEvents : [
          {
              title : 'Midsem Examination',
              start : '2019-10-02',
              end : '2019-10-10',
              cssClass:['has-background-success','has-text-white'],
              YOUR_DATA:{
                  description:"Hello There"
                }
            },
            {
                title : 'Holiday',
                start : '2019-10-05',
                end : '2019-10-05',
                cssClass:['has-background-danger','has-text-white'],
                YOUR_DATA:{
                  description:"test1",
                  coordinator:["Milin M. Patel","Rashmin B. Prajapati"]
                }
              }
        ],
        currSelectedEvent:'',
        isEventSelected:false
    }
  },
  methods: {
    eventSelected(event, jsEvent, pos) {
      this.currSelectedEvent=event
      this.isEventSelected=this.currSelectedEvent?true:false
    }
  }
}
</script>
<style scoped>
</style>
