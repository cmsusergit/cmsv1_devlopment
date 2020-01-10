import apiObject from '@/dataserve/student_serve.js'
import _ from 'lodash'

const state = {
  courseList:[]
};
const getters = {
};
const mutations = {
SET_COURSE_LIST:(state,dt)=>{
  state.courseList=dt;
},

UPDATE_COURSE:(state,dt)=>{
  // const temp=_.find(state.courseList,ob=>{
  //   return ob.locId==dt.locId;
  // });
  // console.log('----',JSON.stringify(temp));
},
ADD_COURSE:(state,dt)=>{
  state.courseList.push(dt);
},

  REMOVE_COURSE:(state,id)=>{
    if(state.courseList.length==1){

      state.courseList=[]
      return;
    }
    state.courseList=_.remove(state.courseList,(ob)=>{
      return ob.courseId==id
    })
    console.log('----',state.courseList);
  }
};
const actions = {
load_course_list:({commit})=>{
  const url1 = '/CourseInfos';
  apiObject.get(url1).then(response=>{
    commit('SET_COURSE_LIST',response.data)
  }).catch(error=>{
    console.log(error);
  })
},
getCourseNameByID:({commit},id)=>{
  const url1='/CourseInfos/'+id
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
update_course:({commit},dt)=>{
      const url1 = '/CourseInfos/'+dt.courseId;
      return new Promise((resolve,reject)=>{
        apiObject.put(url1,dt)
          .then(rr=>{
            commit('UPDATE_COURSE',rr.data)
            resolve(rr.data)
          })
          .catch(error=>{
            console.log('****',error);
            reject(error)
          });
    });
},
add_course:({commit},dt)=>{
      const url1 = '/CourseInfos';
      return new Promise((resolve,reject)=>{
        apiObject.post(url1,dt)
      .then(rr=>{
        commit('ADD_COURSE',rr.data)
        resolve(rr.data)
      })
      .catch(error=>{
        console.log('****',error);
        reject(error)
      });
    });
},
remove_course:({commit},id)=>{
      const url1 = '/CourseInfos/'+id;
      return new Promise((resolve,reject)=>{
        apiObject.delete(url1)
      .then(rr=>{
        commit('REMOVE_COURSE',id)
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
