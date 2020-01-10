<template>
    <div class="" style="width:100%;height:100%;">

        <h1 class="title">CMSAdmin Dashboard</h1>
        <div class="tile">
              <router-link to='/studentmanagement' class="tile is-child box is-radiusless boxv has-text-dark"><!-- StudentManagement Page-->
                <div>
                  <h1 class="title is-size-5">Student</h1>
                  <p class="is-size-5">{{studentCount}}</p>
                </div>
              </router-link><!-- StudentManagement Page-->
              <div style="margin:.1em;"></div>

            <router-link to='/employeemanagement' class="tile is-child box is-radiusless boxv has-text-dark">
                <div>
                    <h1 class="title is-size-5">Employee</h1>
                    <p class="is-size-5">{{employeeCount}}</p>
                </div>
            </router-link>
        </div>
        <div style="margin:.2em;"></div>
        <div class="tile">
         <div class="tile is-child is-6 box is-radiusless">
                  <p  class="title is-size-5">Circulars</p>
                  <CircularPanel :totalPage="4"/>
        </div>
        <div style="margin:.1em"></div>
        <div class="tile is-child box is-radiusless boxv">
            <h1  class="title is-size-5">To Do</h1>
            <TodoPanel/>
        </div>
        </div>
        <div style="margin:.2em;"></div>
        <!-- <div class="tile">
 -->




          <div class='box is-radiusless'>
              <DeptCountChart/>
          </div>
          <div style="margin:.1em;"></div>

          <!-- <div class="is-child tile box is-radiusless is-4">
            <ul>
              <li :key="indx" v-for="(file,indx) in fileList">
                <a :href="file.fileName" class="is-size-5">
                  {{file.fileLabel}}
              </a>
            </li>
          </ul>
          </div> -->
        <!-- </div>
 -->
        <div style="margin:.2em;"></div>
        <div class="tile">
              <FullCalendar/>
        </div>
        <!-- <div style="margin:.1em;"></div>
        <div class="tile">
          <div class="tile is-child">
            <b-select @input="selectFile" expanded>
              <option :key="indx" v-for="(file,indx) in fileList" :value="file">{{file.fileLabel}}</option>
            </b-select>
            <PDFVuer :pdfFile="currPDFFile.fileName"></PDFVuer>
          </div>
          </div>
        </div> -->
    </div>
</template>
<script>
import TodoPanel from '@/components/todo/todo'
import PDFVuer from '@/components/pdfvuer/pdfvuer'
import CircularPanel from '@/components/dashboard/circularpanel'
import FullCalendar from '@/components/dashboard/fullcalendar'
import DeptCountChart from '@/components/report/general/dept_count_chart'

export default {
        name: 'CMSAdminDashboard',
        components: {
          FullCalendar,
          PDFVuer,
          CircularPanel,
          TodoPanel,
          DeptCountChart
         },
        data() {
            return {
                currPDFFile:{fileName:'@/../static/SLAM Dummy.pdf',fileLabel:'Academic Calendar'},
                studentCount:null,
                currEvent:false,
                fileList:[
                  {fileName:'@/../static/SLAM Dummy.pdf',fileLabel:'Academic Calendar'},
                  {fileName:'@/../static/studentform.pdf',fileLabel:'Holiday List'}
                ],
                eventList:[{
                  date:new Date(2019,10,10),title:'Test1',type:'is-info',description:'Hello There'
                }, {
                  date:new Date(2019,8+1,4),type:'is-danger',
                  title:'Holiday',description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore, doloribus beatae rem reprehenderit hic quis repudiandae fuga modi molestiae voluptatum consectetur eveniet sint, est iusto, iste commodi fugiat quasi exercitationem.</div><div>Doloremque molestias, rem ad iure omnis distinctio in perferendis reiciendis aperiam cupiditate voluptate at tempore atque saepe aliquid rerum perspiciatis. Repudiandae tempore ullam ab laudantium, et dolores, error distinctio autem.Mollitia explicabo, sit error expedita officiis veniam quis quod fugit cum nobis commodi nemo, harum quo quos quam optio, placeat. Quia id sequi, velit, commodi a expedita minus quam inventore.</div><div>Quo accusantium tempora temporibus corporis nesciunt vitae illo, ratione expedita! Reprehenderit iste nemo optio quo asperiores accusantium aliquam vitae, ex corporis hic praesentium iusto delectus explicabo magnam.'
                }
              ],
                employeeCount:null
            }
        },
        computed:{
          upcomingEventList(){
              return _.filter(this.eventList,ob=>{
                return ob.date>new Date()
              })
          }
        },
        watch:{
          fileList(){this.currPDFFile=this.fileList[0]}
        },



        methods: {
          selectFile(file){
            this.currPDFFile=file
          },
          onChange(dd){
            let temp=false
            this.eventList.map(ob=>{
              if(ob.date.getTime()==dd.getTime())
                temp=ob
            })
            this.currEvent=temp
          }
        },
        mounted(){
          const studentCountUrl="/StudentInfos/count";
          this.$root.apiObject.get(studentCountUrl).then(response => {
              this.studentCount = response.data.count;
          }).catch(error => {
              console.log('****', error);
          });
          const employeeCountUrl="/EmpProfiles/count";
          this.$root.apiObject.get(employeeCountUrl).then(response => {
              this.employeeCount = response.data.count;
          }).catch(error => {
              console.log('****', error);
          });
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .boxbg{
        background-color: lightgrey;
        color:white;
    }
    .boxv{
        background-color: white;
        color:#224444;
    }
</style>
