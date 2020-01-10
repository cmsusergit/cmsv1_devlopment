<template>
    <div class="">

        <div class="tile is-parent">
            <div class="tile is-child is-4 is-radiusless box">
                <aside class="menu" v-for="(dayName,index) in dayList">
                  <b-tooltip :label="currentIndex!=index?'Click to Expand':'' " style="width:100%;" type="is-success">
                    <span @click='currentIndex=index' class="menu-label has-background-info level " style="padding:.2em;margin-bottom: .2em;width:100%;cursor:pointer;">
                        <strong class="level-item-left has-text-white">{{dayName}}</strong>
                        <a @click="addLoad(dayName)" class="has-text-white level-item-right">+ Add</a>
                    </span>
                  </b-tooltip>

                    <ul v-if="currentIndex==index" class="menu-list">
                        <li v-for="(load,indx) in loadList">
                          <a v-bind:class="[indx%2==1?'has-background-secondary':'']"  @click="slotSelected(load)" v-if="load.ttDay==dayName">
                                <TtPanelRecordInfo :recordInfo="load"/>
                                <p @click.stop="deleteLoad(load)" class="is-bold has-text-danger has-text-centered" style="border-top:1px solid;border-bottom:1px solid">Delete</p>
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class="tile is-child is-8">
                <TTCellPanel @applyChange="applyChange" v-if="loadDetail.ttDay"  :detail="JSON.stringify(loadDetail)"/>
                <p class="has-text-centered" style="height:100%;width:100%" v-else>
                    Press Add to add Load OR<br/>
                    Clic on Record to Update
                </p>
            </div>
        </div>
        <b-loading :is-full-page="true" :active.sync="loading">
        </b-loading>
    </div>
</template>
<script>
    import TtPanelRecordInfo from "@/components/timetable/ttPanelRecordInfo"
    import TTCellPanel from "@/components/timetable/ttdialog";
    import Vue from 'vue'
    import {TTRecordModel} from '@/store/modules/timetable.js'
    export default {
        name: "IPanel",
        props: ["tblDt", "timeTblId"],
        data() {
            return {
                loading: false,
                currentIndex:0,
                loadDetail: {},
                loadList: this.tblDt.timeTableList | []
            }
        },
        components: {
            TTCellPanel,TtPanelRecordInfo
        },
        computed: {
            tblDtObject() {
                return JSON.parse(this.tblDt);
            },
            dayList() {
                return this.$store.state.ttStore.timeTblDayList;
            }
        },
        watch: {
            tblDt(val1, val2) {
                this.loadList = JSON.parse(val1).timeTableList
                this.currentIndex=0
                this.loadList.map((ob, indx) => {
                    if (ob.ttStartTime.split(':').length > 2)
                        ob.ttStartTime = ob.ttStartTime.substring(0, ob.ttStartTime.lastIndexOf(':'));
                    if (ob.ttEndTime.split(':').length > 2)
                        ob.ttEndTime = ob.ttEndTime.substring(0, ob.ttEndTime.lastIndexOf(':'));
                });
            }
        },

        methods: {
            addLoad(dayName) {
                this.loadDetail = new TTRecordModel();
                this.loadDetail.fFacultyId = this.tblDtObject.pFacultyId;
                this.loadDetail.ttDay = dayName;
                Vue.set(this.loadDetail, 'ttDay', dayName);
            },
            addTTblRecord(load) {
                this.loading = true;
                let flag = false;
                if (!this.loadList)
                    this.loadList = [];
                this.loadList.map((ob, indx) => {
                    if ((ob.ttDay == load.ttDay) && (ob.ttStartTime == load.ttStartTime || ob.ttEndTime == load.ttEndTime))
                    {
                        flag = true;
                    }
                });
                if (flag) {
                    this.$buefy.toast.open({
                        duration: 5500,
                        message: "Load Record Conflit Found,StartTime or EndTime conflict on same Day",
                        position: 'is-top',
                        type: 'is-warning'
                    });
                    this.loading=false;
                    return;
                }
                const record = {
                    timeTblId: this.timeTblId,
                    load: load
                }
                this.$store.dispatch('ttStore/saveTimeTblRecord', record)
                        .then(rr => {
                            this.$buefy.toast.open({
                                duration: 5500,
                                message: "TimeTable Record Added",
                                position: 'is-top',
                                type: 'is-success'
                            });
                            this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: load.fFacultyId, tblId: load.fTimetableId});
                            this.addLoad();
                            this.loading = false;
                        })
                        .catch(error => {
                            this.$buefy.toast.open({
                                duration: 5500,
                                message: "Error in Save TimeTable Record" + error,
                                position: 'is-top',
                                type: 'is-danger'
                            });
                            this.loading = false;
                        });
            },
            updateTTblRecord(load) {
                this.loading = true;
                  console.log('++++',JSON.stringify(load));
                this.$store.dispatch('ttStore/updateTimeTblRecord', load).then(rr => {
                    this.$buefy.toast.open({
                        duration: 5500,
                        message: "TimeTable Record Updated",
                        position: 'is-top',
                        type: 'is-success'
                    });
                    this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: load.fFacultyId, tblId: load.fTimetableId});
                    this.addLoad();
                    this.loading = false;
                })
                        .catch(error => {
                            this.$buefy.toast.open({
                                duration: 5500,
                                message: "Error in Update TimeTable Record" + error,
                                position: 'is-top',
                                type: 'is-danger'
                            });
                            this.loading = false;
                        });
            },
            applyChange(load) {
                const loadTemp = JSON.parse(JSON.stringify(load));
                if (load.ttId) {
                    this.$buefy.dialog.confirm({
                        message: 'Record Exists.Want to Update?',
                        onConfirm: () => {
                            this.updateTTblRecord(loadTemp);
                        }
                    });
                } else {
                    this.addTTblRecord(loadTemp);
                }
            },
            slotSelected(load) {
                this.loadDetail = load;
            },
            deleteLoad(load) {
                this.$buefy.dialog.confirm({
                    message: 'Record Exists.Want to Delete?',
                    onConfirm: () => {
                        this.loading = true;
                        this.$store.dispatch('ttStore/deleteTimeTblRecord', load).then(rr => {
                            this.$buefy.toast.open({
                                duration: 5500,
                                message: "TimeTable Record Deleted",
                                position: 'is-top',
                                type: 'is-success'
                            });
                            this.addLoad();
                            this.$store.dispatch('ttStore/loadTTblRecordList', {facultyId: load.fFacultyId, tblId: load.fTimetableId});
                            this.loading = false;
                        })
                                .catch(error => {
                                    this.$buefy.toast.open({
                                        duration: 5500,
                                        message: "Error in Delete TimeTable Record" + error,
                                        position: 'is-top',
                                        type: 'is-danger'
                                    });
                                    this.loading = false;
                                });
                    }
                });
            },
            // subjectName(id) {
            //   return _.find(this.subjectNameList,ob=>{
            //     return ob.subId==id
            //   }).subName;
            // },
            // getSubjectNameList() {
            //   this.loading=true;
            //     this.$store.dispatch('subjectStore/getSubjectNameList')
            //             .then(rr => {
            //                 this.subjectNameList = rr.data;
            //                 this.loading=false;
            //             })
            //             .catch(error => {
            //                 console.log('****', error)
            //                 this.loading=false;
            //             });
            //
            // }
        },
        mounted() {
            this.loadList = this.tblDt.timeTableList;
            //
            // this.getSubjectNameList()
        }
    };
</script>
<style scoped>
    .allottedslotbg {
        background-color: gray;
        color: white;
    }
</style>
