const userMxn={
  data(){
    return {
      loggedInUser:{},
      currAcademicyearId:null
    }
  },
computed:{
  currentUser(){
    return this.$store.getters['employeeStore/getCurrentEmployee']
  }
},

watch:{
  currentUser(){
    this.loggedInUser=this.currentUser
  }
},
methods: {
  getCurrentAcademicyear(){
    this.$store.dispatch('acadyearStore/getCurrentAcademiyearId')
      .then(rr=>{
        this.currAcademicyearId=rr.ayId

      })
      .catch(error=>{
        console.log('****',error);
        this.currAcademicyearId=null
      })
  },
  isEmployee(){
    return this.$store.getters['loginStore/isEmployee']
  },
  isAuthorizedRoleList(roleNameList){
    return this.$store.getters['loginStore/isAuthorizedRoleList'](roleNameList);
  }
},
  created() {
    const id=this.$store.getters['loginStore/getLoggedInUserId']
    this.$store.dispatch('userAccountStore/getUserAccountById',id)
    .then(rr=>{
      const user=rr


      if(user.userType==0){
        this.loggedInUser={}
        return;
      }
      else if (user.userType==2) {
        this.$store.dispatch('studentStore/get_student_by_code',user.username)
        .then(rr=>{
          this.loggedInUser=rr
        })
        .catch(error=>{
          console.log('****',error);
        })
      }
      else {
        this.$store.dispatch('employeeStore/get_employee_by_code',user.username)
          // .then(rr=>{
          //   this.loggedInUser=rr
          // })
          // .catch(error=>{
          //   console.log('****',error);
          // })
      }
    })
    .catch(error=>{
      console.log('****',error);
    })

    this.getCurrentAcademicyear()
  }
}
export default userMxn
