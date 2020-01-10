import Vue from 'vue'
import _ from 'lodash'

import Router from 'vue-router'
import Dashboard from '@/pagelist/Dashboard'
import AddUserAccount from '@/pagelist/useraccount/adduseraccount'
import UserAccount from '@/pagelist/useraccount/useraccount'
import StudentAllocation from '@/pagelist/student/student_allocation'
import AddUpdateStudent from '@/pagelist/student/addupdatestudent'
import StudentManagement from '@/pagelist/student/student'
import SubjectManagement from '@/pagelist/subject/subject'
import AddSubject from '@/pagelist/subject/addsubject'
import DeptManagement from '@/pagelist/department/department'
import AddUpdateDept from '@/pagelist/department/addupdatedept'
import  ComposeMessge from '@/pagelist/message/composeMessage'
import  LoadCalculation from '@/pagelist/LoadCalculation/load_cal'
import  Location from '@/pagelist/location/location'
import TimeTable from '@/pagelist/timetable/timetable'
import TimeTableReport from '@/pagelist/timetable/timetable_report'
import Attendance from '@/pagelist/attendance/attendance'
import AttendanceDashboard from '@/pagelist/attendance/main_attendance'
import EmployeePersonalProfile from '@/pagelist/employee/employeepersonal'
import AddUpdateEmpPersonalProfile from '@/pagelist/employee/addupdatemployee'
import  Course from '@/pagelist/course/course'
import  ClassName from '@/pagelist/class/class'
import Circular from '@/pagelist/circular/circular'
import  StudentDetail from '@/pagelist/detailpanel/student'
import  EmployeeDetail from '@/pagelist/detailpanel/employee'
import LoadCalculationReport from '@/pagelist/LoadCalculation/load_cal_report'
import ProxyDetail from '@/pagelist/proxy/proxy'
import ProxyApprove from '@/pagelist/proxy/proxyapprove'
import LessonPlan from '@/pagelist/lessonplan/lessonplan'
import LessonplanReport from '@/pagelist/lessonplan/lp_report'
import Academicyear from '@/pagelist/academic_year/academic_year'
import MainAttdReport from '@/pagelist/report/main_attd_report'
import Designation from '@/pagelist/designation/designation'
import BatchName from '@/pagelist/batch/batch'
import  SelfAppraisalReport from '@/pagelist/SelfAppraisal/appraisal_report'
import  ProxyReport from '@/pagelist/proxy/proxyReport'
import  SelfAppraisalSummary from '@/pagelist/SelfAppraisal/appraisal_summary'
import  SelfAppraisalTF from '@/pagelist/SelfAppraisal/appraisal_tf'
import  FeesCollection from '@/pagelist/feesdetail/feescollection'
import  FeesDetailReport from '@/pagelist/feesdetail/feesreport'
import {store} from '@/store/store.js'
Vue.use(Router)
const routeList=new Router({
    mode: 'history',
    scrollBehavior(){
      return{x:0,y:0}
    },
    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/useraccount',
            name: 'UserAccount',
            component: UserAccount,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/addupdateuser/:id?',
            name: 'AddUserAccount',
            component: AddUserAccount,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/studentmanagement',
            name: 'StudentManagement',
            component: StudentManagement,
            meta:{role:['CMSADMIN','ADMIN','STUDENT_COORD','HOD','DIRECTOR','PRINCIPAL','FACULTY']}
        },
        {
            path: '/employeemanagement',
            name: 'EmployeePersonalProfile',
            component: EmployeePersonalProfile,
            meta:{role:['CMSADMIN','HOD','DIRECTOR','PRINCIPAL','EMPLOYEE']}
        },
        {
            path: '/studentallocation',
            name: 'StudentAllocation',
            component: StudentAllocation,
            meta:{role:['CMSADMIN','STUDENT_COORD','HOD','DIRECTOR','PRINCIPAL','FACULTY']}
        },
        {
            path: '/addupdatestudent/:id?',
            name: 'AddUpdateStudent',
            component: AddUpdateStudent,
              meta:{role:['CMSADMIN','STUDENT_COORD','HOD']}
        },
        {
            path: '/addupdateemployee/:id?',
            name: 'AddUpdateEmpPersonalProfile',
            component: AddUpdateEmpPersonalProfile,
            meta:{role:['CMSADMIN','HOD']}
        },
        {
            path: '/subject',
            name: 'Subject',
            component: SubjectManagement,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/addupdatesubject/:id?',
            name: 'AddUpdateSubject',
            component: AddSubject,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/department',
            name: 'Department',
            component: DeptManagement,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/addupdatedept/:id?',
            name: 'AddUpdateDept',
            component: AddUpdateDept,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/timetable',
            name: 'TimeTable',
            component: TimeTable,
              meta:{role:['CMSADMIN','TT_COORD']}
        },
        {
            path: '/timetablereport',
            name: 'TimeTableReport',
            component: TimeTableReport,
            meta:{
              role:['CMSADMIN','PRINCIPAL','DIRECTOR','HOD','TT_COORD','FACULTY']
            }
        },
        {
            path: '/loadcalreport',
            name: 'LoadCalculationReport',
            component: LoadCalculationReport,
            meta:{role:['CMSADMIN','TT_COORD']}
        },
        {
            path: '/loadcal',
            name: 'LoadCalculation',
            component: LoadCalculation,
            meta:{role:['CMSADMIN','TT_COORD']}
        },
        {
            path: '/location',
            name: 'Location',
            component: Location,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/course',
            name: 'Course',
            component: Course,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/classname',
            name: 'ClassName',
            component: ClassName,
            meta:{role:['CMSADMIN']}
        },{
            path: '/batchname',
            name: 'BatchName',
            component: BatchName,
            meta:{role:['CMSADMIN']}
        },
        {
            path: '/composemessage',
            name: 'ComposeMessage',
            component: ComposeMessge,
            meta:{role:['CMSADMIN','STUDENT_COORD']}
        },
        {
            path: '/mainattendance',
            name: 'AttendanceDashboard',
            component: AttendanceDashboard,
            meta:{role:['CMSADMIN','DIRECTOR','PRINCIPAL','STUDENT_COORD','TRUSTEE','FACULTY']}
        },
        {
            path: '/attendance',
            name: 'Attendance',
            component: Attendance,
            props:true,
            meta:{
              role:['CMSADMIN','FACULTY']
            }
        },
        {
            path: '/lessonplan',
            name: 'LessonPlan',
            props:true,
            component: LessonPlan,
            meta:{
              role:['CMSADMIN','FACULTY']
            }
        },
        {
            path: '/employeedetail/:id?',
            name: 'EmployeeDetail',
            component: EmployeeDetail
        },
        {
            path: '/studentdetail/:id?',
            name: 'StudentDetail',
            component: StudentDetail,
        },
        {
          path:'/attendancereport',
          name:'MainAttdReport',
          component:MainAttdReport,
          meta:{role:['CMSADMIN','STUDENT_COORD','DIRECTOR','PRINCIPAL','FACULTY','HOD']}
        },
        {
          path:'/lpreport',
          name:'LessonplanReport',
          component:LessonplanReport,
          meta:{
            role:['CMSADMIN','FACULTY']
          }
        },
        {
          path:'/academicyear',
          name:'Academicyear',
          component:Academicyear,
          meta:{role:['CMSADMIN']}
        },
        {
          path:'/designation',
          name:'Designation',
          component:Designation,
          meta:{role:['CMSADMIN']}
        },
        {
          path:'/proxy',
          name:'ProxyDetail',
          component:ProxyDetail,
          meta:{role:['CMSADMIN','FACULTY']}
        },
        {
          path:'/proxyreport',
          name:'ProxyReport',
          component:ProxyReport,
          meta:{role:['CMSADMIN','FACULTY']}
        },
        {
          path:'/proxyapprove',
          name:'ProxyApprove',
          component:ProxyApprove,
          meta:{role:['CMSADMIN','HOD']}
        },
        {
          path:'/circular',
          name:'Circular',
          component:Circular,
          meta:{role:['CMSADMIN','DIRECTOR','HOD','PRINCIPAL','STUDENT','EMPLOYEE']}
        },
        {
          path:'/selfappraisaltf',
          name:'SelfAppraisalTF',
          component:SelfAppraisalTF,
          meta:{role:['CMSADMIN','EMPLOYEE']}
        },
        {
          path:'/selfappraisalreport/:facultyDetail?',
          name:'SelfAppraisalReport',
          component:SelfAppraisalReport,
          props:true,
          meta:{role:['CMSADMIN','EMPLOYEE']}
        },
        {
          path:'/selfappraisalsummary',
          name:'SelfAppraisalSummary',
          component:SelfAppraisalSummary,
          meta:{role:['CMSADMIN','TRUSTEE','DIRECTOR','PRINCIPAL']}
        },
        {
          path:'/feesdetail',
          name:'FeesDetail',
          component:FeesDetailReport,
          meta:{role:['CMSADMIN','ADMIN','TRUSTEE','DIRECTOR','PRINCIPAL']}
        },
        {
          path:'/feescollection',
          name:'FeesCollection',
          component:FeesCollection,
          meta:{role:['CMSADMIN','ADMIN']}
        }
    ]
})
routeList.beforeEach((to, from, next) => {
  if(to.meta.role && !store.getters['loginStore/isAuthorizedRoleList'](to.meta.role)){
    next('/')
  }
  else {
    next()
  }
})
export default routeList;
