<template>
  <div class="modal-card">

    <header class="modal-card-head is-radiusless">
      <h1 class="modal-card-title">Attendance Detail</h1>
    </header>
    <section class="modal-card-body">
      <div v-if="attendanceDetail && attendanceDetail.list" style="padding:1em;">
        <p><b>Enrollment:</b>  {{attendanceDetail.list[0].enrollment}}</p>
      </div>



        <table class="table is-bordered is-fullwidth">
        <thead class="has-background-grey has-text-white">
          <th class="has-text-white has-text-centered">Sr.</th>
          <th class="has-text-white has-text-centered">Date</th>
          <th class="has-text-white has-text-centered">Attendance Status</th>
          <th class="has-text-white has-text-centered">Faculty Name(Proxy)</th>
          <th class="has-text-white has-text-centered">Content Covered</th>
        </thead>
        <tr :key="indx" v-for="(ob,indx) in attendanceDetail.list">
          <td>{{indx+1}}</td>
          <td>{{new Date(ob.csDateConducted).toDateString()}}</td>
          <td width="20%" class="has-text-centered">
            <p class="tag is-radiusless" :class="ob.present?'is-success':'is-danger' ">
            {{ob.present?'PRESENT':'ABSENT'}}</p>
          </td>
          <td class="has-text-centered" width="25">{{ob.fproxyfacultyid!=-1?getFacultyNameById(ob.fproxyfacultyid):'-'}}</td>
          <td>{{ob.csContentCovered}}</td>
        </tr>
      </table>
    </section>
  </div>
</template>
<script>
import facultyMxn from '@/mixin/faculty'
export default {
  name: "AttendanceDetail",
  props: ['attendanceDetail'],
  data(){
    return {}
  },
    mixins: [facultyMxn],
  methods: {
    getFacultyName(id) {
      return 'test1';
    }
  }
}
</script>
<style scoped>
</style>
