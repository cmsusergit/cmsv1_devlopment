<template>
      <section>

        <b-field grouped>
          <b-field label="Name" expanded>
              <b-input v-model='guardianInfo.stuGuardianName' required></b-input>
          </b-field>
          <b-field label="Relation" expanded>
              <b-input v-model='guardianInfo.stuGuardianRelation'  required></b-input>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field label="Phone Number" >
            <b-input v-model='guardianInfo.stuGuardianPhone'></b-input>
          </b-field>
          <b-field label="Mobile Number">
            <b-input v-model='guardianInfo.stuGuardianMobile' required></b-input>
          </b-field>
          <b-field label="Email" expanded>
              <b-input type="Email" v-model='guardianInfo.stuGuardianEmail' required></b-input>
          </b-field>
      </b-field>

        <b-field grouped>
          <b-field label="Home Address" expanded>
            <b-input v-model='guardianInfo.stuGuardianHomeAddress' maxlength="200" type="textarea" required></b-input>
          </b-field>
          <b-field label="Office Address" expanded>
            <b-input v-model='guardianInfo.stuGuardianOfficeAddress' maxlength="200" type="textarea"  required></b-input>
          </b-field>
      </b-field>
      <b-field grouped>
        <b-field label="Occupation" expanded>
            <b-input v-model='guardianInfo.stuGuardianOccupation' required></b-input>
        </b-field>
        <b-field label="Annual Income" expanded>
            <b-input type='number' v-model='guardianInfo.stuGuardianIncome' required></b-input>
        </b-field>
      </b-field>
      </section>
</template>
<script>
    export default {
        name: 'StudentGuardianInfo',
        props:[
          'guardianInfo'
        ],
        data() {
            return {}
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
