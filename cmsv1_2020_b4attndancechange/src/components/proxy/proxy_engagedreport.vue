<template>
    <div class="is-radiusless box" style="width:100%">

      {{getFacultyNameById(ownerId)}}
      <div class="subtitle">Adjusted Proxy List

      <!-- <button @click='refreshProxyList' class="button is-pulled-right is-primary is-small" :class="loading?'is-loading':'' ">
        <b-icon pack="fas" icon="sync"></b-icon>
        <span>Refresh</span>
      </button> -->
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
                  <p class="tag is-large has-text-weight-bold has-text-white" :class="props.row.isApproved?'has-background-success':'has-background-danger' ">{{ new Date(props.row.proxyDate).toLocaleDateString() }}</p>
              </b-table-column>
              <b-table-column label="Load Detail" centered>
                  <LoadDetail :recordId="props.row.fTtid"/>
              </b-table-column>
              <b-table-column field="fFacultyid" label="Faculty">
                {{getFacultyNameById(props.row.fFacultyid)}}
              </b-table-column>
              <b-table-column v-if="!props.row.isApproved" label="">
                <button @click="$emit('editProxy',props.row.proxyId)" class="button is-dark is-small">
                  <b-icon pack="fas" icon="edit"></b-icon>
                </button>
                <button @click="$emit('deleteProxy',props.row.proxyId)" class="button is-small is-danger">
                  <b-icon pack="fas" icon="trash"></b-icon>
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
        name: "ProxyEngagedReport",
        components: {
          LoadDetail
        },
        props: ['ownerId'],
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
            return this.$store.getters['proxyStore/proxyList']
          }
        },
        watch:{
          ownerId(){
              this.$store.dispatch('proxyStore/load_proxy_list',this.ownerId);
          }
        },
        mounted() {
          this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
        },
        methods: {
          refreshProxyList(){
            this.loading=true
            if(this.ownerId)
              this.$store.dispatch('proxyStore/load_proxy_list',this.ownerId)
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
