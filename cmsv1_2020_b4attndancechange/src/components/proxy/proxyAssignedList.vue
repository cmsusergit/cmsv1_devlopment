<template>
    <div class="is-radiusless box" style="width:100%">

      {{getFacultyNameById(assignedFacultyId)}}
      <div class="subtitle">Adjusted Proxy List

      <button @click='refreshProxyList' class="button is-pulled-right is-primary is-small" :class="loading?'is-loading':'' ">
        <b-icon pack="fas" icon="sync"></b-icon>
        <span>Refresh</span>
      </button>
    </div>


      <b-table v-if="proxyList"
               :data="proxyList"
               :paginated=true
               :per-page=10
               default-sort-direction="asc">
          <template slot-scope="props">
              <b-table-column label="Sr." width="40" sortable numeric>
                  {{ props.index+1 }}
              </b-table-column>
              <b-table-column field="proxyDate" label="Date" width="140" sortable>
                  {{ new Date(props.row.proxyDate).toLocaleDateString() }}
              </b-table-column>
              <b-table-column label="Load Detail" centered>
                  <LoadDetail :recordId="props.row.fTtid"/>
              </b-table-column>
              <b-table-column field="fOwnerid" label="AssignedBy">
                {{getFacultyNameById(props.row.fOwnerid)}}
              </b-table-column>








              <b-table-column label="" centered>
                <button @click="getAttendance(props.row)" class="button is-dark is-small">
                  Attendance
                </button>
            </b-table-column>
          </template>
        </b-table>
    </div>
</template>
<script>
    import _ from 'lodash'
    import config from "@/../static/test1.json";
    import LoadDetail from '@/components/proxy/loadDetail'
    import { mapState} from 'vuex';
    export default {
        name: "AssignedProxyList",
        components: {
          LoadDetail
        },
        props: ['assignedFacultyId'],
        data() {
            return {
              loading:false
            };
        },
        computed: {
          facultyList(){
            return this.$store.state.employeeStore.facultyList
          },
          proxyList(){
            return this.$store.getters['proxyStore/proxyAssignedList']
          }
        },
        watch:{
          assignedFacultyId(){
              this.$store.dispatch('proxyStore/load_assigned_proxy_list',this.assignedFacultyId);
          }
        },
        mounted() {
          this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
        },
        methods: {
          getAttendance(proxy){
            this.$store.dispatch('ttStore/loadTTrecordById',proxy.fTtid)
              .then(rr=>{
                  const ob={
                    isProxy:1,
                    proxyFacultyId:this.assignedFacultyId,
                    proxyDate:proxy.proxyDate,
                    proxyId:proxy.proxyId
                  }
                  this.$router.push({name:'Attendance',params:{ttRecord:rr,proxyInfo:ob}})
                })
                .catch(error=>{
                  console.log('****',error);
                })
          },
          refreshProxyList(){
            this.loading=true
            if(this.assignedFacultyId)
              this.$store.dispatch('proxyStore/load_assigned_proxy_list',this.assignedFacultyId)
              .then(rr=>{
                  this.loading=false
              })
              .catch(error=>{
                this.loading=false
              })
          },
          getFacultyNameById(id){
            const faculty=_.find(this.facultyList,{empId:id})
            if(!faculty)return;
            const temp='('+faculty.firstName.charAt(0)+faculty.middleName.charAt(0)+faculty.lastName.charAt(0)+')'
            return faculty.firstName+" "+faculty.middleName+" "+faculty.lastName+" "+temp
          }
        }
};
</script>
<style>
</style>
