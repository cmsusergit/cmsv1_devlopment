<template>
  <div class="is-radiusless box" style="height:100%;">

    <p class="title">Lessonplan Report</p>
    <div class="is-radiusless box">
      <b-field grouped>
      <b-field label="Academic Year" expanded>
          <b-select @input="ayearChanged" v-model="lpOb.ayId" expanded>
              <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
          </b-select>
      </b-field>


      <b-field label="Faculty Department" expanded>
          <b-select :disabled="!isAuthorizedRoleList(['CMSADMIN'])" @input="loadFacultyList" v-model="lpOb.deptId" expanded>
              <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
          </b-select>
      </b-field>
    </b-field>
    <b-field label="Faculty Name" expanded>
        <b-select @input="load_lessonplan_list" :disabled="!isAuthorizedRoleList(['CMSADMIN'])" v-model="facultyId" expanded>
            <option :value="faculty.empId" v-for="faculty in facultyList">
              {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
            </option>
        </b-select>
    </b-field>
    <b-table v-if="lessonPlanList" :data='lessonPlanList' bordered>
      <template slot-scope='props'>
        <b-table-column label="Sr." width="40" numeric centered>
              {{ props.index+1 }}
        </b-table-column>
        <b-table-column label="Department" field="deptId" sortable centered>
          {{getDeptName(props.row.deptId)}}
        </b-table-column>
        <b-table-column label="Course" field="courseId" sortable centered>
          {{getCourseName(props.row.courseId)}}
        </b-table-column>
        <b-table-column label="Subject" centered>
          {{getSubject(props.row.subId)}}
        </b-table-column>
        <b-table-column label="Sem." field="semId" sortable centered>
          {{props.row.semId}}
        </b-table-column>
        <b-table-column label="Class Name" centered>
          {{getClassName(props.row.classId)}}
        </b-table-column>
        <b-table-column label="" centered>
          <router-link :to="{ name: 'LessonPlan', params: {selectedLP:props.row}}">Goto</router-link>

<!--
          <button @click="gotoLessonplan(props.row)" class="button is-radiusless is-info is-small" >Goto Lessonplan</button> -->
        </b-table-column>
      </template>
    </b-table>
  </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import userMxn from '@/mixin/user'
export default {
  name: "LpReport",
  mixins: [userMxn],
  data(){
    return {
        lpOb:{
          ayId:1,deptId:1
        },
        facultyId:-1
    }
  },
  computed:{
    ...mapState([
      'departmentList',
      'classList',
      'courseList'
    ]),//....
    aYearList() {
        return this.$store.state.acadyearStore.acadyearList
    },
    facultyList(){
        return this.$store.state.employeeStore.facultyList
    },
    lessonPlanList(){
      return this.$store.getters['lessonPlanStore/getLessonPlanList']
    },
    lessonPlanList(){
      return this.$store.getters['lessonPlanStore/getLessonPlanList']
    },
    getDeptName(){
      return id=>this.departmentList.find(ob=>id==ob.deptId).deptAlias
    },
    getCourseName(){
      return id=>this.courseList.find(ob=>id==ob.courseId).courseAlias
    },
    subjectList(){
      return this.$store.state.subjectStore.subjectList
    },
    getSubject(){
      return id=>{
        const temp=this.subjectList.find(ob=>id==ob.subId)
        return `${temp.subName}(${temp.subAlias})`
      }
    },
    getClassName(){
      return id=>this.classList.find(ob=>id==ob.classId).className
    }
  },
  mounted() {
      this.$store.dispatch('acadyearStore/load_academicyear_list')
      this.$store.dispatch('load_dept_list')
      this.$store.dispatch('load_course_list')
      this.$store.dispatch('subjectStore/LOAD_SUBJECT_LIST')
      this.$store.dispatch('load_class_list')
  },

  watch:{
    currAcademicyearId(){
      this.lpOb.ayId=this.currAcademicyearId
    },
    facultyList(){
      if(this.loggedInUser)
        this.facultyId=this.loggedInUser.empId
    },
    loggedInUser(){
      this.lpOb.deptId=this.loggedInUser.deptId
      this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.loggedInUser.deptId)
    }
  },
  methods: {
    ayearChanged(){
      if(this.facultyId) this.load_lessonplan_list()
    },
    loadFacultyList() {
      this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.lpOb.deptId)
    },
    load_lessonplan_list(){
      const ob={ayId:this.lpOb.ayId,facultyId:this.facultyId}
      this.$store.dispatch('lessonPlanStore/load_lessonplan_list',ob)
    }
  }
}
</script>
<style scoped>
</style>
<!-- <template>
  <div class="section is-radiusless box" style="width:100%">

    <p hidden>{{loggedInUser}}</p>
    <h1 class="title is-size-4">Lessonplan</h1>
    <div class="is-radiusless box">
        <b-field grouped>
            <b-field label="Academic Year" expanded>
                <b-select v-model="lpRecord.ayId" expanded>
                    <option v-for="ay in aYearList" :value="ay.ayId">{{ay.ayBatchYear}}</option>
                </b-select>
            </b-field>

            <b-field label="Department" expanded>
                <b-select @input="deptChanged" v-model="deptId" expanded>
                    <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
                </b-select>
            </b-field>
        </b-field>
        <b-field grouped>
          <b-field label="Faculty Name" expanded>
              <b-select v-model="lpRecord.facultyId" expanded>
                  <option :value="faculty.empId" v-for="faculty in facultyList">
                    {{faculty.title}} {{faculty.firstName}} {{faculty.middleName}} {{faculty.lastName}}
                  </option>
              </b-select>
          </b-field>
        <b-field label="Course" >
          <b-select @input="optionChanged" v-model="lpRecord.courseId" expanded>
            <option v-for="course in courseList" :value="course.courseId">{{course.courseName}}({{course.courseAlias}})</option>
        </b-select>
        </b-field>
        <b-field label="Department" expanded>
            <b-select @input="optionChanged" v-model="lpRecord.deptId" expanded>
                <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}({{dd.deptAlias}})</option>
            </b-select>
        </b-field>
        <b-field label="Class Name" >
            <b-select v-model="lpRecord.classId" expanded>
                <option :key="indx" v-for="(cl, indx) in classList" :value="cl.classId">
                    {{cl.className}}
                </option>
            </b-select>
        </b-field>
      <b-field label="Current Sem">
      <b-Select @input="optionChanged" v-model="lpRecord.semId" expanded>
          <option v-for="cl in 10">{{cl}}</option>
      </b-select>
      </b-field>
      </b-field>
      <b-field label="Select Subject" >
        <b-select @input='optionChanged' v-model="lpRecord.subId" expanded>
          <option v-for="subject in subjectList" :value="subject.subId">{{subject.subName}}</option>
      </b-select>
    </b-field>
      <b-field label='Reference Books'>
          <b-input v-model="lessonPlan.refBook" type='textarea'/>
      </b-field>
    </div>
    <div v-if="lessonPlan">
      <table class="table is-striped is-bordered is-narrowed is-fullwidth">
        <thead class="has-background-primary has-text-weight-bold">
          <th>
            Unit Number <br/>
            Name of Unit <br/>
            Hrs. Alloted by GTU
          </th>
          <th>
            Lecture Number
          </th>
          <th>
            Topics
          </th>
          <th>
            Teaching Method
          </th>
          <th>
            Teaching Aid
          </th>
          <th>
            CO
          </th>
          <th>
            Online Posts(Y/N)
          </th>
        </thead>
        <template v-for="(lpUnit,indx) in lpUnitList">
          <template v-for="(topic, index) in lpUnit.topicList">
          <tr :class="indx%2==1?'has-background-secondary has-text-grey':'' " v-if="index==0">
            <td :rowspan="lpUnit.topicList.length">
              {{lpUnit.gtuUnitno}} <br/>
              {{lpUnit.gtuUnitname}} <br/>
              {{lpUnit.gtuUnithrs}}
            </td>
            <td>{{index+1}}</td>
            <td>
              {{topic.topic}}
            </td>
            <td>
              {{topic.tMethod}}
            </td>
            <td>
              {{topic.tAid}}
            </td><td>
              {{topic.coId}}
            </td>
            <td>
              {{topic.onlinePost?'Y':'N'}}
            </td>
          </tr>

          <tr :class="indx%2==1?'has-background-secondary has-text-grey':'' " v-else>
          <td>{{index+1}}</td>
          <td>
            {{topic.topic}}
          </td>
          <td>
            {{topic.tMethod}}
          </td>
          <td>
            {{topic.tAid}}
          </td>
          <td>
            {{topic.coId}}
          </td>
          <td>
            {{topic.onlinePost?'Y':'N'}}
          </td>
        </tr>
        </template>
      </template>
    </table>
    </div>
    <div v-else class="is-radiusless box">
      <p>Lesson Plan !Found</p>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import userMxn from '@/mixin/user'
import config from "@/../static/test1.json";
export default {
  name:"LessonplanReport",
  components: {
  },
  mixins: [userMxn],
  data(){
    return {
      lpRecord:{
          lp_id:0
      },
      lessonPlan:null,
      lpUnitList:[{}]
    }
  },
  computed: {
      ...mapState([//....
        'courseList',
        'classList',
        'departmentList']),
        subjectList() {
            return this.$store.state.subjectStore.subjectList;
        },
        aYearList() {
            return this.$store.state.acadyearStore.acadyearList
        },
        facultyList(){
          return this.$store.state.employeeStore.facultyList
        },
  },
  watch: {
    currAcademicyearId(){
      this.lpRecord.ayId=this.currAcademicyearId
    },
    loggedInUser(){
      this.lpRecord.deptId=this.loggedInUser.deptId
      this.lpRecord.facultyId=this.loggedInUser.empId
    }
  },
  mounted() {
      this.$store.dispatch('acadyearStore/load_academicyear_list')
      this.$store.dispatch('load_dept_list');
      this.$store.dispatch('load_course_list')
      this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.lpRecord.deptId)
      this.$store.dispatch('load_class_list_by_dept', this.lpRecord.deptId);
      const ob={
        dept:this.lpRecord.deptId,
        course:this.lpRecord.courseId,
        sem:this.lpRecord.semId
      }
      this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
      this.loadLessonPlan()
  },
  methods: {
    deptChanged(){
      this.$store.dispatch('employeeStore/load_facultylist_by_dept',this.deptId)
    },
    loadLessonPlan(){
      const ob={
        facultyId: this.lpRecord.facultyId,
        deptId: this.lpRecord.deptId,
        courseId: this.lpRecord.courseId,
        subId: this.lpRecord.subId,
        ayId: this.lpRecord.ayId,
        semId: this.lpRecord.semId,
        classId: this.lpRecord.classId
      }
      this.$store.dispatch('lessonPlanStore/load_lessonplan',ob)
      .then(rr=>{
        this.lessonPlan=rr
        if(rr.lpId)
          this.loadLpunitList(rr.lpId)
      })
      .catch(error=>{
        this.lessonPlan=null
        console.log('****',error);
      })
    },
    loadLpunitList(id){
      console.log(id,this.lessonPlan.lpId);
      this.$store.dispatch('lessonPlanStore/load_lessonplan_unit',id)
      .then(rr=>{
        this.lpUnitList=rr
        for (let indx = 0; indx < this.lpUnitList.length;indx++) {
          this.loadLptopicList(this.lpUnitList[indx])
        }
      })
      .catch(error=>{
        this.lpUnitList=null
        console.log('****',error);
      })
    },
    loadLptopicList(unit){
      this.$store.dispatch('lessonPlanStore/load_lessonplan_topic',unit.unitId)
      .then(rr=>{
        this.$set(unit,'topicList',rr)
      })
      .catch(error=>{
        console.log('****',error);
        return null;
      })
    },
    optionChanged(){
      this.$store.dispatch('load_class_list_by_dept', this.lpRecord.deptId);
      const ob={
        dept:this.lpRecord.deptId,
        course:this.lpRecord.courseId,
        sem:this.lpRecord.semId
      }
      this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
      this.loadLessonPlan()
    }
  }
}
</script>
<style lang="css" scoped>
</style> -->
