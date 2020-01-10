import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  todoList:[]
};
const getters = {
};
const mutations = {
SET_TODO_LIST:(state,dt)=>{
  state.todoList=dt;
},

ADD_TODO:(state,dt)=>{
  state.todoList.push(dt);
},
  REMOVE_TODO:(state,id)=>{
    if(state.todoList.length==1){

      state.todoList=[]
      return;
    }
    state.todoList=_.remove(state.todoList,(ob)=>{
      return ob.todoId!=id
    })
  },
  PENDING_TODO:(state,id)=>{
    _find(state.todoList,{todoId:id}).todoCompled=false
  },
  COMPLETE_TODO:(state,id)=>{
    _.find(state.todoList,{todoId:id}).todoCompled=true
  }
};
const actions = {





load_todo_list:({commit},id)=>{
  const ob={
    where:{todoOwner:id}
  }
  const url1 = '/Todos?filter='+JSON.stringify(ob);
  apiObject.get(url1).then(response=>{
    commit('SET_TODO_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
getTodoByID:({commit},id)=>{
  const url1='/Todos/'+id
  return new Promise((resolve, reject)=>{
    apiObject.get(url1)
    .then(response=>{
      resolve(response.data)
    })
    .catch(error=>{
      console.log('****',error);
      reject(error)
    })
  });
},
update_todo:({commit},dt)=>{
      const url1 = '/Todos/'+dt.todoId;
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,dt)
          .then(rr=>{
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          });
    });
},
add_todo:({commit},dt)=>{
      const url1 = '/Todos';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
      .then(rr=>{
        commit('ADD_TODO',rr.data)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
pending_todo({commit},dt){
  const url1='/Todos/'+dt.todoId


    apiObject.put(url1,dt)
      .then(rr=>{
        commit('PENDING_TODO',id)
      })
      .catch(error=>{
        console.log('****',error);
      })
},
complete_todo({commit},dt){
  const url1='/Todos/'+dt.todoId
    apiObject.put(url1,dt)
      .then(rr=>{
        commit('COMPLETE_TODO',id)
      })
      .catch(error=>{
        console.log('****',error);
      })
},
remove_todo:({commit},id)=>{
      const url1 = '/Todos/'+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
        .then(rr=>{
          commit('REMOVE_TODO',id)
          resolve(rr.data)
        })
        .catch(error=>{
          console.log('****',error);
          reject(error)
        });
    });
}
}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
