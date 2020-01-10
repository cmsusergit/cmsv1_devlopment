<template>
    <section style="padding-top:.5em;border-top:1px solid gray;">

        <b-field grouped>
            <b-field label="User Name" expanded>
               <b-input v-model="userInfo.username" required></b-input>
            </b-field>
            <b-field label="User Email" expanded>
               <b-input v-model="userInfo.email" required></b-input>
            </b-field>
          </b-field>


          <p v-if="confirmationError" class="has-text-danger">{{confirmationError}}</p>
          <b-field grouped>
             <b-field label="Password" expanded>
                <b-input @input="passwordChanged" v-model="userInfo.password" type="password" required expanded></b-input>
              </b-field>
            <b-field label="Confirm Password" expanded>
               <b-input @input="passwordChanged" v-model="confirmPassword" type="password" required expanded></b-input>
            </b-field>
          </b-field>
    </section>
</template>
<script>
  import {mapState} from 'vuex'
    export default {
        name: 'AddUserAccount',
        props: [
            'userInfo'
        ],
        data() {
            return {
                confirmPassword:'',
                confirmationError:''
            }
        },
        methods:{
            passwordChanged(){
              if(this.userInfo.password != this.confirmPassword){
                this.confirmationError="Password !matching"
              }
              else {
                  this.confirmationError=""
              }
            }
        },
        created(){
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .footrbox{
        background-color: floralwhite;
        padding:.4em;
        color:#224444;
        border-top:1px solid #224444;
    }
</style>
