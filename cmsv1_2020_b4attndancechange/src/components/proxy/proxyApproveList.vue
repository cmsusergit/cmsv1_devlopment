<template>
    <div class="is-radiusless box" style="width:100%">

      <div class="subtitle">Adjusted Proxy List,Pending Approval
        <button @click='refreshProxyList' class="button is-pulled-right is-primary is-small" :class="loading?'is-loading':'' ">
          <b-icon pack="fas" icon="sync"></b-icon>
          <span>Refresh</span>
        </button>
      </div>
      <b-table v-if="proxyList"
               :data="proxyList"
               :paginated=true
               :per-page=10
               default-sort-direction="asc"
               bordered>
          <template slot-scope="props">


              <b-table-column label="Sr." width="40" sortable numeric>
                  {{ props.index+1 }}
              </b-table-column>
              <b-table-column field="fFacultyid" label="Faculty">
                {{getFacultyNameById(props.row.fOwnerid)}}
              </b-table-column>
              <b-table-column field="proxyDate" label="Date" width="140" sortable>
                  {{ new Date(props.row.proxyDate).toLocaleDateString() }}
              </b-table-column>
              <b-table-column label="Load Detail" centered>
                  <LoadDetail :recordId="props.row.fTtid"/>
              </b-table-column>
              <b-table-column field="fFacultyid" label="Assigned Faculty">
                {{getFacultyNameById(props.row.fFacultyid)}}
              </b-table-column>
              <b-table-column label="">
                <button v-if="!props.row.isApproved" @click="approveProxy(props.row.proxyId)" class="button  is-success is-small">
                  Approve
                </button>
                  <button v-else @click="disapproveProxy(props.row.proxyId)" class="button is-small is-danger">
                  Disapprove
                </button>
            </b-table-column>
          </template>
          <template slot="empty">
              <h1 class="title has-text-centered">
                No Proxy to Approve
              </h1>
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
        name: "ProxyList",
        components: {
          LoadDetail
        },

        props: ['deptId'],
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
            return this.$store.getters['proxyStore/proxyPendingList']
          }
        },
        watch:{
          deptId(){
              this.$store.dispatch('proxyStore/load_pending_proxy_list_by_dept',this.deptId);
          }
        },
        mounted() {
          this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
          this.$store.dispatch('proxyStore/load_pending_proxy_list_by_dept',this.deptId)
        },
        methods: {
          getFacultyNameById(id){
            const faculty=_.find(this.facultyList,{empId:id})
            if(!faculty)return;
            const temp='('+faculty.firstName.charAt(0)+faculty.middleName.charAt(0)+faculty.lastName.charAt(0)+')'
            return faculty.firstName+" "+faculty.middleName+" "+faculty.lastName+" "+temp
          },
          approveProxy(id){
            this.$store.dispatch('proxyStore/approveProxy',id)
              .then(rr=>{
                this.$store.dispatch('proxyStore/load_pending_proxy_list_by_dept',this.deptId)
              })
              .catch(error=>{
                console.log('****',error);
              })
          },
          disapproveProxy(id){
            this.$store.dispatch('proxyStore/disapproveProxy',id)
              .then(rr=>{
                this.$store.dispatch('proxyStore/load_pending_proxy_list_by_dept',this.deptId)
              })
              .catch(error=>{
                console.log('****',error);
              })
            },

            refreshProxyList(){
              this.loading=true

              if(this.deptId)
                this.$store.dispatch('proxyStore/load_pending_proxy_list_by_dept',this.deptId)
                .then(rr=>{
                    this.loading=false
                })
                .catch(error=>{
                  this.loading=false
                })
            }
        }
};
</script>
<style>
</style>
