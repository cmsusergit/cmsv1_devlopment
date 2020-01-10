 <template>
    <section style="padding-top:.5em;border-top:1px solid gray;">

             <b-field grouped>
               <b-field label="Theory" expanded >
                          <b-input type="number" min=0 max=8 required></b-input>
                      </b-field>
               <b-field label="Practical" expanded>
                             <b-input type="number" min=0 max=20 required></b-input>
                         </b-field>
                         <b-field label="Tutorial" expanded>
                                    <b-input type="number" min=0 max=8 required></b-input>
                                </b-field>
                </b-field >
                <b-field v-show="otherLoadType.length!=0" :key="indx"  v-for="(load,indx) in otherLoadType" grouped>
                  <b-field label="Load Type" expanded>
                      <b-autocomplete v-model="load.loadType" :data="otherList"></b-autocomplete>
                    </b-field>
                    <b-field label="Number Of Hours" expanded>
                        <b-input v-model="load.loadHours" type="number" min=1 max=8 required></b-input>
                    </b-field>
                    <button @click="removeLoadType(indx)" class="button is-pulled-right is-small is-outlined">x</button>
                </b-field>
                <button @click="addOtherLoadType()" class="button is-primary" style="margin-top:.5em">
                  Add Other
                </button>
    </section>
</template>
<script>
    export default {
        name: 'SubjectInfo',
        props: [
            'subjectInfo'
        ],
        data() {
            return {
                otherLoadType:[],
                otherList:['Studio']

            }
        },
        methods:{

          addOtherLoadType(){
            this.otherLoadType.push({loadType:"",loadHours:null});
          },
          removeLoadType(index){

            this.otherLoadType.splice(index,1);
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
