<template>
    <div class="dashboard is-radiusless box boxbg" style="width:100%;height:100%;">

        Employee Dashboard        
      </div>
</template>

<script>
    export default {
        name: 'EmployeeDetail',
        data() {
            return {
                deptName:'',
                designation:'',
                employeeInfo:null
            }
        },
        methods: {
          getDesignationById(id){
            this.$store.dispatch('designationStore/getDesignationById',id)
              .then(response=>{
                this.designation=`${response.desgName}(${response.desgAlias})`
              })
              .catch(error=>{
                this.designation=''
              })
          },
          getDeptNameById(id){
            this.$store.dispatch('deptStore/getDeptNameByID',id)
              .then(response=>{
                this.deptName=`${response.deptName}(${response.deptAlias})`
              })
              .catch(error=>{
                this.deptName=''
              })
          }
        },
        mounted(){
          this.$store.dispatch('employeeStore/get_employee_by_id',this.$route.params.id)
            .then(rr=>{
                this.employeeInfo=rr.data
                this.getDesignationById(rr.data.designationId)
                this.getDeptNameById(rr.data.deptId)
            })
            .catch(error=>{
              console.log('****',error);
            })
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .boxv{
        background-color: white;
        color:#224444;
    }
</style>
