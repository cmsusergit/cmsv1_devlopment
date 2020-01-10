<template>
    <div class="section is-radiusless box" style="width:100%">

        <h1 class="title is-size-4">Approve Proxy</h1>
        <div v-show="isAuthorizedRoleList(['CMSADMIN','HOD'])" class="is-radiusless box">
            <b-field grouped>
                <b-field label="Academic Year" expanded>
                    <b-select :disabled="isAuthorizedRoleList(['HOD'])" @input="deptChanged" v-model="academicYear" expanded>
                      <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                    </b-select>
                </b-field>
                <b-field label="Department" expanded>
                    <b-select :disabled="isAuthorizedRoleList(['HOD'])" @input="deptChanged" v-model="dept" expanded>

                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
            </b-field>
        </div>

        <div>
          <ProxyApproveList :deptId='dept'/>
        </div>
    </div>
</template>
<script>
    import config from "@/../static/test1.json";
    import userMxn from '@/mixin/user'
    import { mapState} from 'vuex';
    import ProxyApproveList from '@/components/proxy/proxyApproveList'
    import ReportPanel from "@/components/report/report";
    export default {
        name: "ProxyInfo",
        data() {
            return {
                academicYear:"",
                dept: ""
            };
        },
        components: {
          ProxyApproveList
        },
        mixins: [userMxn],
        computed: {
            ...mapState([//....
                    'departmentList']
                    ),

             aYearList() {
              return this.$store.state.acadyearStore.acadyearList
            }
        },
        watch: {
            currAcademicyearId(){
              this.academicYear=this.currAcademicyearId
            },
            loggedInUser(){
              this.dept=this.loggedInUser.deptId
            }
        },
        mounted() {
            this.$store.dispatch('acadyearStore/load_academicyear_list')
            this.$store.dispatch('load_dept_list');
        },
        methods: {

          deptChanged() {
                const ob = {
                    aYearId: this.academicYear,
                    dept: this.dept
                };
            }
}};
</script>
<style>
</style>
