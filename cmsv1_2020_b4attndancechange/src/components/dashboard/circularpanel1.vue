<template>
        <div class="" style="height:100%;">

            <b-table
            :data="circularList"
            paginated
            :per-page="totalPage"
            pagination-size="is-small"
            striped narrowed>
            <template slot-scope="props">
                <b-table-column width="140" field="circDate" label="Date" sortable centered>


                    <span class="tag is-success">
                        {{ new Date(props.row.circDate).toLocaleDateString() }}
                    </span>
                </b-table-column>
                <b-table-column field="circTitle" label="Title">
                    {{ props.row.circTitle }}
                </b-table-column>
                <b-table-column v-if="totalPage>5" field="circContent" label="Content">
                    {{ props.row.circContent }}
                </b-table-column>
                <b-table-column width='140'>
                  <div>
                    <button @click="detailCircular(props.row.circId)" class="button is-small is-info">
                      <b-icon pack="fas" icon="eye"></b-icon>
                    </button>
                    <button @click="$emit('updateCircular',props.row)" v-if="isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','TRUSTEE']) && totalPage>5"  class="button is-dark is-small ">
                          <b-icon pack="fas" icon="edit"></b-icon>
                      </button>
                      <button @click="$emit('removeCircular',props.row)" v-if="isAuthorizedRoleList(['CMSADMIN','DIRECTOR','PRINCIPAL','TRUSTEE']) && totalPage>5" class="button is-small is-danger">
                          <b-icon pack="fas" icon="trash"></b-icon>
                      </button>
                  </div>
                </b-table-column>
            </template>
            <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                        <p class="subtitle">Nothing here.</p>
                    </div>
                </section>
            </template>
        </b-table>
        <b-modal :active.sync="isContent" scroll="keep" :width="800" has-modal-card>
          <div class="modal-card">
            <div class="is-radiusless modal-card-head">
                <p class="modal-card-title is-size-5">{{currCircular.circTitle}}</p>
            </div>
            <section class="modal-card-body">
            {{currCircular.circContent}}
          </section>
            <a :href="downloadDocument" v-if="currCircular.fileName" class="button is-radiusless is-info is-text">Download</a>
          </div>
        </b-modal>
        </div>
</template>
<script>
import config from '@/../static/test1.json'
import  {mapState} from 'vuex'
import UserMxn from '@/mixin/user'
export default {
  name:"CircularList",
  props: ['totalPage'],
  mixins: [UserMxn],
  data(){
    return {
    isContent:false,
    currCircular:''
  }
},

computed:{
      ...mapState("circularStore",[
      "circularList"
  ]),
  downloadDocument(){
    return config.db_configuration.baseURL+'/containers/circulars/download/'+this.currCircular.fileName
  }
},
methods: {
  detailCircular(id) {
      this.isContent=true
      this.currCircular=_.find(this.circularList,{circId:id})
  }
},
mounted() {
  this.$store.dispatch('circularStore/load_circular_list')
}
}
</script>





<style lang="css" scoped>
</style>
