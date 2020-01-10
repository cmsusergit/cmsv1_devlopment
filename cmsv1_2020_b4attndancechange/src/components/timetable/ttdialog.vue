<template>
    <div class="card" style="height:100%">

        <h1 class="card-header-title">{{ title }}</h1>
        <div class="card-content">

            <b-field label="Select Slot">
                <b-select @input='slotChanged' v-model='selectedSlotName' :disabled="dt.ttId" expanded>
                    <option :value="slot" v-for="slot in slotList">{{slot.name}}</option>
                </b-select>
            </b-field>
            <b-field grouped>
                <b-field label="Department" expanded>

                    <b-select @input="deptChanged" v-model="dt.fDeptId" expanded>
                        <option v-for="dd in departmentList" :value="dd.deptId">{{dd.deptName}}</option>
                    </b-select>
                </b-field>
                <b-field label="Course" expanded>
                    <b-select @input="changeSubjectList" v-model="dt.fCourseId" expanded>
                        <option v-for="course in courseList" :value="course.courseId">{{course.courseAlias}}</option>
                    </b-select>
                </b-field>
                <b-field label="Class Name" >
                    <b-select @input="classChanged" v-model="dt.fClassId" expanded>
                        <option :key="indx" v-for="(cl, indx) in classList" :value="cl.classId">
                            {{cl.className}}
                        </option>
                    </b-select>
                </b-field>
                <b-field label="Sem">
                   <b-select @input="changeSubjectList" v-model="dt.ttSem" >
                        <option :key="indx" v-for="indx in 10">{{ indx }}</option>
                    </b-select>
                </b-field>
            </b-field>
            <b-field grouped>
                <b-field  label="Subject Name" expanded>
                        <b-select v-model="dt.fSubjectId" expanded>
                          <option v-for="(subject, index) in subjectList" :key="index" :value="subject.subId">
                            {{subject.subName}}
                          </option>
                        </b-select>
                </b-field>
                <b-field label="Location Name" expanded>
                  <b-select v-model="dt.fLocationId" expanded>
                    <option v-for="(location,index) in locationList" :key="index" :value="location.locId">
                      {{location.locName}}
                    </option>
                  </b-select>
                </b-field>
            </b-field>
            <b-field grouped>
                <b-field label="Select LoadType" expanded>
                    <b-select :disabled="dt.ttId" v-model="dt.ttLoadType" @input="loadTypeChanged" expanded>
                        <option :key="indx"  v-for="(type, indx) in loadTypeList">
                            {{ type }}
                        </option>
                    </b-select>
                </b-field>

                <b-field label="Duration(Hour)">
                    <input v-model="dt.ttDuration"
                           type="number"
                           class="input"
                           min="1"
                           max="2"
                           disabled
                           />
                </b-field>
                <b-field v-show="dt.ttLoadType !== 'Theory'" label="Select Batch">
                    <b-select v-model="dt.fBatchId">
                        <option :key="indx" v-for="(batch, indx) in batchList" :value="batch.batchId">
                            {{ batch.batchName }}
                        </option>
                    </b-select>
                </b-field>
            </b-field>
            <b-field grouped>
                <button @click="confirmChange();" class="button is-radiusless  is-primary is-fullwidth" expanded>
                    <template v-if="!dt.ttId">+Add</template>
                    <template v-else>Update</template>
                </button>
            </b-field>
        </div>
        <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="true">
        </b-loading>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { TTRecordModel } from "@/store/modules/timetable.js";
    import { mapState} from 'vuex';
    export default {
        name: "TTpanel",
        props: ["detail"],
        data() {
            return {
                loading: false,
                dt: JSON.parse(this.detail),
                selectedSlotName: '',
                loadTypeList: ["Theory", "Practical", "Tutorial", "Other", "Free"]
            };
        },
        computed: {
            ...mapState([//....
                    'departmentList', 'classList', 'courseList'
            ]),
            subjectList() {
                return this.$store.state.subjectStore.subjectList;
            },
            slotList() {
                return this.$store.state.ttStore.timeTblSlotNameList;
            },
            locationList(){
              return this.$store.state.locStore.allLocationList
            },
            batchList(){
              return this.$store.state.classStore.batchList
            },
            title() {
                let temp = this.dt.ttDay;
                if (this.selectedSlotName)
                    temp = temp + "    " + this.dt.ttStartTime + "  to  " + this.dt.ttEndTime;
                return temp;
            }
        },
        watch: {
            detail: {
                immediate: true,
                handler(val1, val2) {
                    this.loading = true;
                    this.dt = JSON.parse(val1);
                    // const temp = _.find(this.slotList, {startTime: this.dt.ttStartTime, endTime: this.dt.ttEndTime});
                    // if (temp){
                    //     this.selectedSlotName = temp;
                    // }
                    // else{
                    //     this.selectedSlotName = '';
                    //     this.subName='';
                    //   }
                    // if (this.dt.fSubjectId)
                    //     this.$store.dispatch("subjectStore/getSubjectName", this.dt.fSubjectId)
                    //             .then(rr => {
                    //                 if (rr.data)
                    //                     this.subName = rr.data.subName;
                    //                 this.loading = false;
                    //             })
                    //             .catch(error => {
                    //                 console.log('****', error);
                    //                 this.loading = false;
                    //             });
                    this.loading=false;
                    this.updateCombobox();
                }}
        },
        created() {
            this.updateCombobox();
        },
        methods: {
            updateCombobox() {
                const temp = _.find(this.slotList, {startTime: this.dt.ttStartTime, endTime: this.dt.ttEndTime});
                if (temp){
                    this.selectedSlotName = temp;
                }
                else{
                    this.selectedSlotName = '';
                  }
                this.$store.dispatch('load_dept_list');
                this.$store.dispatch("locStore/load_loc_list")
                this.deptChanged()
                this.$store.dispatch('load_course_list');
            },
            classChanged(vv){
              this.$store.dispatch('classStore/load_batch_list_by_classid',vv)
            },
            slotChanged() {
                if (!this.selectedSlotName)
                    return;
                this.dt.ttStartTime = this.selectedSlotName.startTime;
                this.dt.ttEndTime = this.selectedSlotName.endTime;
                if (this.selectedSlotName.duration >= 2) {
                    this.dt.ttLoadType = "Practical"
                    this.dt.ttDuration=this.selectedSlotName.duration
                    //
                    // this.loadTypeList = ["Practical"]
                } else {
                    this.dt.ttLoadType = "Theory"
                    this.dt.ttDuration = this.selectedSlotName.duration
                    this.loadTypeList = ["Theory", "Tutorial", "Other", "Free"]
                }
            },
            loadTypeChanged() {
                this.dt.studentBatchName = this.batchList[0];
                if (this.dt.ttLoadType == "Practical") {
                    //
                    // this.dt.ttDuration = this.selectedSlotName.duration;
                } else if (this.dt.ttLoadType == "Theory")
                    this.dt.studentBatchName = "-";
                else{}
                    // this.dt.ttDuration = 1;
            },
            confirmChange() {
                this.$emit("applyChange", this.dt)
            },
            deptChanged() {
                this.$store.dispatch('load_class_list_by_dept', this.dt.fDeptId);
                this.changeSubjectList()
            },
            changeSubjectList(){
              const ob={
                dept:this.dt.fDeptId,
                course:this.dt.fCourseId,
                sem:this.dt.ttSem
              }
              this.$store.dispatch("subjectStore/load_subject_for_ttable",ob)
            }
        }
    };
</script>
<style></style>
