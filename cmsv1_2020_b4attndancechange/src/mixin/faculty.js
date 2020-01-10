const facultyMxn={
  data(){
    return {
    }
  },

  computed:{
  designationList(){
    return this.$store.state.designationStore.designationList
  },
  facultyList(){
    return this.$store.state.employeeStore.facultyList

  }
},
methods: {
  getFacultyNameById(id){
    const faculty=_.find(this.facultyList,{empId:id})
    if(!faculty)return;
    const temp='('+faculty.firstName.charAt(0)+faculty.middleName.charAt(0)+faculty.lastName.charAt(0)+')'
    return faculty.firstName+" "+faculty.middleName+" "+faculty.lastName+" "+temp
  },
  getDesignationById(id){
    const ob=_.find(this.designationList,{desgId:id})
    if(ob)
      return ob.desgName
    else
      return ""
  }
},
created() {
  this.$store.dispatch('designationStore/load_desg_list')
  this.$store.dispatch('employeeStore/load_facultylist_by_dept',-1)
}
}

export default facultyMxn
