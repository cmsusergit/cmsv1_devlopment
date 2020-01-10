<template>
    <div class="card">

        <form @submit.prevent='changePassword' class="card-content is-radiusless">
          <p v-if="confirmationError" class="has-text-danger">{{confirmationError}}</p>

          <b-field label='Old Password:'>
            <b-input @input="passwordChanged" v-model="pwdOb.oldPassword" type="password" password-reveal required/>
          </b-field>
          <b-field label='New Password:'>
            <b-input @input="passwordChanged" v-model="pwdOb.newPassword" type="password" password-reveal required/>
          </b-field>


          <b-field label='Confirm Password:'>
            <b-input @input="passwordChanged" v-model="confirmPassword" type="password" password-reveal required/>
          </b-field>
          <button type="submit" class="button is-info is-fullwidth">Change</button>
        </form>
  </div>
</template>
<script>

    export default {
            name:'ChangePassword',
            data(){
              return{
                confirmationError:'',
                confirmPassword:'',
                pwdOb:{
                  oldPassword:'',
                  newPassword:''
                }
              }
            },
            methods: {
              passwordChanged(){
                if(this.pwdOb.newPassword != this.confirmPassword){
                  this.confirmationError="Password !matching"
                }
                else {
                    this.confirmationError=""
                }
              },
              changePassword(){
                this.$store.dispatch('userAccountStore/changePassword',this.pwdOb)
                  .then(rr=>{
                    this.$buefy.toast.open({
                      duration: 5500,
                      message: 'Password Changed',
                      position: 'is-top',
                      type: 'is-success'
                    })
                    this.$parent.close()
                  })
                  .catch(error=>{
                    this.$buefy.toast.open({
                            duration: 5500,
                            message: error.response.data.error.message,
                            position: 'is-top',
                            type: 'is-danger'
                        });
                  })
              }
            }
    }
</script>
