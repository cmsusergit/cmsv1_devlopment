<template>
    <div style="height:100vh;" class="has-background-bis card">

        <b-loading is-full-page :active.sync="loading" ></b-loading>
        <h1 class="card-header card-header-title title">Login</h1>
        <form @submit.prevent='login' class="card-content is-radiusless">
          <b-field label='User Name:'>
            <b-input v-model="user.username" required/>
          </b-field>
          <b-field label='Password:'>
            <b-input v-model="user.password" type="password" password-reveal required/>
          </b-field>

          <div style="margin-top:2em;margin-bottom:2em;" class="level">
            <button class="level-item is-radiusless button is-success" type="submit">Login</button>
<!--
            <button @click='signUp' type="button" style="margin-left:.5em" class="level-item is-radiusless button is-primary">SignUp</button> -->
        </div>
        <div class="card-footer">
          <a class="card-footer-item level-left">Forgot Password?</a>
        </div>
        </form>
  </div>
</template>
<script>
    export default {
            name:'Login',
            data(){
              return{
                user:{
                  username:'',
                  password:''
                },
                loading:false
              }
            },
            methods: {
              login() {
                this.loading=true
                this.$store.dispatch('loginStore/login',this.user)
                  .then(rr=>{
                      this.loading=false
                      this.$buefy.toast.open({
                        duration: 2200,
                        message: `Successfully LoggedIn`,
                        position: 'is-top',
                        type: 'is-success'
                      })

                      this.$router.push({path:'/'})
                    })
                    .catch(error=>{
                      this.loading=false
                      this.$buefy.toast.open({
                        duration: 2200,
                        message: `Login:${error}`,
                        position: 'is-top',
                        type: 'is-danger'
                      })
                    })
              },
              signUp(){
                this.user.emailVerify=false
                this.user.roleList="GUEST;"
                this.user.email='nehasoni.comp@svitvasad.ac.in'
                this.loading=true
                this.$store.dispatch('loginStore/signUp',this.user)
                  .then(rr=>{
                      this.$buefy.toast.open({
                        duration: 2200,
                        message: `Successfully SignUp`,
                        position: 'is-top',
                        type: 'is-success'
                      })
                      this.loading=false
                    })
                    .catch(error=>{
                      this.$buefy.toast.open({
                        duration: 2200,
                        message: `SignUp:${error}`,
                        position: 'is-top',
                        type: 'is-danger'
                      })
                      this.loading=false
                    })
              }
            }
    }
</script>
