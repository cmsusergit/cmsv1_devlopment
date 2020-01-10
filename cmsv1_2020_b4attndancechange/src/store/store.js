import Vue from "vue";
import Vuex from "vuex";
import state from "./state.js";
import subjectStore from "./modules/subject/subjectstore.js";
import studentStore from "./modules/student/studentstore.js";
import employeeStore from "./modules/employee/employeestore.js";
import attendanceStore from "./modules/attendence/attendenceStore.js"
import ttStore from "./modules/tt_store.js"
import deptStore from "./modules/dept/deptstore"
import lessonPlanStore from "./modules/lessonplan/lessonPlanStore"
import locStore from "./modules/location/loc_Store.js"
import courseStore from "./modules/Course/course_Store.js"
import classStore from "./modules/Student_class/Student_class.js"
import loginStore from "./modules/login/login.js"
import loadCalcStore from "./modules/loadcalculation/loadcalculation.js"
import designationStore from "./modules/designation/designation.js"
import acadyearStore from "./modules/academic_year/acad_year.js"
import todoStore from "./modules/todo/todo_Store.js"
import circularStore from "./modules/Circular/circular_Store.js"
import proxyStore from "./modules/proxy/proxyStore"
import userAccountStore from "./modules/useraccount/useraccount"
import feesDetailStore from "./modules/fees_detail/feedetail_Store"
import selfAppraisalStore from "./modules/selfappraisal/selfAppraisal_Store"
//import axios from 'axios'
//import config from '@/../static/test1.json'
Vue.use(Vuex);
import _ from 'lodash'
import apiObject from '@/dataserve/student_serve.js'
//const apiObject=axios.create({
//  baseURL:config.db_configuration.baseURL
//})
export const store = new Vuex.Store({
  state:{
    departmentList:[],
    classList:[],
    batchList:[],
    courseList:[]
  },
  getters:{
      getDeptNameById:(state)=>(id)=>{
        return _.find(state.departmentList,{deptId:id})
      }
  },
  actions:{
    load_dept_list({commit}){
      apiObject.get('/DepartmentInfos').then(response=>{
        commit('SET_DEPT_LIST',{dt:response.data})
     }).catch(error=>{
        console.log('****',error)
      });
    },
    load_course_list({commit}){
      apiObject.get('/CourseInfos').then(response=>{
        commit('SET_COURSE_LIST',{dt:response.data})
      }).catch(error=>{
        console.log('****',error)
      });
    },
    // load_class_list({commit}){
    //   apiObject.get('/DepartmentInfos').then(response=>{
    //     commit('SET_CLASS_LIST',{dt:response.data})
    //   }).catch(error=>{
    //     console.log('****',error)
    //   });
    // },




    load_class_list_by_dept({commit},deptId){
        let url1=''
        if(!deptId || deptId=='All'){
          url1="/studentClassInfos"
        }
        else
        {
          url1="/DepartmentInfos/"+deptId+"/studentClassInfos"
        }
      console.log(url1);
      apiObject.get(url1).then(response=>{
        commit('SET_CLASS_LIST',{dt:response.data})
      }).catch(error=>{
        console.log('****',error)
      });
    },
    load_class_list({commit}){
      const url1="/studentClassInfos"
      console.log(url1);
      apiObject.get(url1).then(response=>{
        commit('SET_CLASS_LIST',{dt:response.data})
      }).catch(error=>{
        console.log('****',error)
      });
    },
    load_batch_list({commit}){
      apiObject.get('/studentBatchInfos').then(response=>{
        commit('SET_BATCH_LIST',{dt:response.data})
      }).catch(error=>{
        console.log('****',error)
      });
    }
  },
  mutations:{
    SET_DEPT_LIST:(state,{dt})=>{
      state.departmentList=dt
    },
    SET_COURSE_LIST:(state,{dt})=>{
      state.courseList=dt;
    },
    SET_CLASS_LIST:(state,{dt})=>{
        state.classList=dt;
      },
      SET_BATCH_LIST:(state,{dt})=>{
        state.batchList=dt;
      }
  },
  modules: {
    loginStore:loginStore,
    studentStore:studentStore,
    ttStore:ttStore,
    classStore:classStore,
    subjectStore:subjectStore,
    deptStore:deptStore,
    locStore:locStore,
    courseStore:courseStore,
    attendanceStore:attendanceStore,
    employeeStore:employeeStore,
    lessonPlanStore:lessonPlanStore,
    designationStore:designationStore,
    acadyearStore:acadyearStore,
    loadCalcStore:loadCalcStore,
    proxyStore:proxyStore,
    circularStore:circularStore,
    todoStore:todoStore,
    userAccountStore:userAccountStore,
    selfAppraisalStore:selfAppraisalStore,

    feesDetailStore:feesDetailStore
  }
})
