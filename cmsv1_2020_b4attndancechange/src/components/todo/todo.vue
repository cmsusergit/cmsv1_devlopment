<template>
  <div>

    <form v-if="isNewTodo" @submit.prevent="saveTodo" class="is-radiusless box">
        <b-field label="To Do" expanded>
          <b-input v-model="todo.todoContent" required></b-input>
          </b-field>
        <b-field label="Target Date" expanded>
          <b-datepicker v-model="todo.todoExpDate" required/>
        </b-field>
    <div class="is-pulled-right">
     <button type="submit" style="margin-right:.5em" class="button is-radiusless is-info">Save</button>

     <button @click="isNewTodo=false" type="button" class="button is-radiusless is-info ">Close</button>
   </div>
     <div class="is-clearfix"></div>
  </form>

  <button @click="addTodo" class="button is-radiusless is-info is-small is-pulled-right">+ New</button>
  <div class="is-clearfix"></div>
  <p class="has-text-danger is-size-7">*Double Click to Change TODO Status</p>
  <div class="">
    <b-table @dblclick="completeTodo" :data="todoList"
    paginated
    :per-page="5"
    pagination-size="is-small"
    striped narrowed
    style="height:250px;overflow-x:hidden">
      <template slot-scope="props">
        <b-table-column  field="todoExpDate" label="Target Date" sortable>
          <span class="tag" :class="compare(props.row.todoExpDate)?'is-danger':'is-secondary' ">{{new Date(props.row.todoExpDate).toLocaleDateString()}}</span>
        </b-table-column>
        <b-table-column field="todoContent" label='Title'><span :style="props.row.todoCompleted?{'color':'grey','text-decoration':'line-through'}:{} ">{{props.row.todoContent}}</span>
        </b-table-column>
        <b-table-column>
          <button @click="removeTodo(props.row.todoId)" class="button is-danger is-radiusless is-small">x</button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</div>
</template>
<script>
import _ from 'lodash'
import {mapState} from 'vuex'
export default {
  name: 'Todo',
  data() {
      return {
        isNewTodo:false,
        todo:{todoId:0,todoCompleted:false}
      }
  },
  computed:{
    todoList(state){
      return _.sortBy(this.$store.state.todoStore.todoList,['todoCompleted','todoExpDate'])
    }
  },
  mounted() {
    const id=localStorage.getItem('loggedInUser')
    this.$store.dispatch('todoStore/load_todo_list',id)
  },
  methods:{
    completeTodo(ob){
      ob.todoCompleted=!ob.todoCompleted
      this.$store.dispatch('todoStore/update_todo',ob)
    },
    removeTodo(id){
      this.$store.dispatch('todoStore/remove_todo',id)
    },
    compare(d1){
      return new Date(d1).getTime() < new Date().getTime()
    },
    addTodo(){
      this.isNewTodo=true
    },
    saveTodo(){
      this.todo.todoOwner=localStorage.getItem('loggedInUser')
      this.todo.todoExpDate=new Date(this.todo.todoExpDate.getTime() + Math.abs(this.todo.todoExpDate.getTimezoneOffset()*60000))
      this.$store.dispatch('todoStore/add_todo',this.todo)
          .then(response=>{
            this.isNewTodo=false
          })
        .catch(error=>{
          this.$buefy.toast.open({
                      duration: 5500,
                      message: error.response.data.error.message,
                      position: 'is-top',
                      type: 'is-danger'
                  })
        })
      }
  }
}
</script>
<style lang="css" scoped>
</style>
