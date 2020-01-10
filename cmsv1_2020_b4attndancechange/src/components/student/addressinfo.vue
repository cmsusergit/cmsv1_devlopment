<template>
      <section style="padding-top:.5em;border-top:1px solid gray;">

              <p class="subtitle has-text-weight-bold">Permanent Address</p>
              <b-field grouped>
                <b-field label="Address" expanded>
                    <b-input v-model="addressInfo.stuPerAddress" required></b-input>
                </b-field>

                <b-field label="City" expanded>
                  <b-input v-model="addressInfo.stuPerCity" required></b-input>
                </b-field>

              </b-field>
              <b-field grouped>
                <b-field label="State" expanded>
                    <b-input v-model="addressInfo.stuPerState" required></b-input>
                </b-field>
                <b-field label="Country" expanded>
                    <b-input v-model="addressInfo.stuPerCountry" required></b-input>
                </b-field>
                <b-field label=" Pincode" expanded>
                    <b-input v-model="addressInfo.stuPerPincode" required></b-input>
                </b-field>
            </b-field>
        <p style="padding-top:.5em;border-top:1px solid grey" class="subtitle has-text-weight-bold">Present Address</p>
        <div class="field">
            <b-checkbox @input='addressCopy' v-model="sameAsAbove ">
                Same As Above
            </b-checkbox>
          </div>
            <b-field grouped>
              <b-field label="Address" expanded>
                 <b-input v-model="addressInfo.stuCurrAddress" required></b-input>
              </b-field>
              <b-field label="City" expanded>
                 <b-input v-model="addressInfo.stuCurrCity" required></b-input>
              </b-field>
              </b-field>

          <b-field grouped>
              <b-field label="State" expanded>
                 <b-input v-model="addressInfo.stuCurrState" required></b-input>
              </b-field>
                <b-field label="Country" expanded>
                 <b-input v-model="addressInfo.stuCurrCountry" required></b-input>
              </b-field>
                <b-field label="Pincode" expanded>
                 <b-input v-model="addressInfo.stuCurrPincode" required></b-input>
              </b-field>
          </b-field>
      </section>
</template>
<script>
    export default {
        name: 'StudentAddressInfo',
        props:[
          'addressInfo'
        ],
        data() {
            return {
              file:null,
              sameAsAbove:false,
              gender:'',
            }
        },
        methods:{
          addressCopy(value){
            if(value){
              this.addressInfo.stuCurrAddress=this.addressInfo.stuPerAddress
              this.addressInfo.stuCurrCity=this.addressInfo.stuPerCity
              this.addressInfo.stuCurrState=this.addressInfo.stuPerState
              this.addressInfo.stuCurrCountry=this.addressInfo.stuPerCountry
              this.addressInfo.stuCurrPincode=this.addressInfo.stuPerPincode
            }
            else {
              this.addressInfo.stuCurrAddress=""
              this.addressInfo.stuCurrCity=""

              this.addressInfo.stuCurrState=""
              this.addressInfo.stuCurrCountry=""
              this.addressInfo.stuCurrPincode=""
            }
          }
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
