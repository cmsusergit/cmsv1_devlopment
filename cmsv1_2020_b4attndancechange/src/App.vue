<template>
<div id="app" style="">

  <div class="app-header">
    <Header></Header>
  </div>
  <div v-if="loggedIn">
    <div class="app-container" style="overflow:auto;width:100%;">





      <transition name="slide">
        <div ref="sidebar" v-if="!isGuest && issidebar" class="app-sidebar"
        :style="fixedPosition">
          <Sidebar ></Sidebar>
        </div>
      </transition>
      <div class="app-dashboard">
        <transition name="fade">
        <router-view />
      </transition>
      </div>
    </div>
    <button @click="openSideBar"
      :style="{width:buttonWidth}"
      class="button is-radiusless sidebar-button is-info" style="position:fixed;bottom:0;"
      >
    {{menuText}}
  </button>
    </div>
    <div v-else style="background:url('@/../static/login.jpeg') no-repeat; background-size:cover;width:100%;color:grey;">
      <!--<div class="level-item"> <div style="background:url(@/../static/login.jpeg) no-repeat;background-size:cover;height:100vh;">
    </div>     <img src="@/../static/login.jpeg" alt="">
  </div>
-->   <div class="is-pulled-right"><Login/></div>
  </div>
  <div class="app-foot">
    <Footr></Footr>
  </div>
</div>
</template>
<script>

import Login from '@/components/login/login'
import Header from '@/components/common/header'
import Sidebar from '@/components/dashboard/sidebar'
import Footr from '@/components/common/foot'
export default {
  name: 'App',
  components: {
    Header,
    Sidebar,
    Footr,
    Login
  },
  data(){
    return {
      fixedPosition:{},
      menuText: "<",
      issidebar: true,
      buttonWidth: '14em',
      scrollY:0,
      originalTop:0
    }
  },
  computed:{
    loggedIn(){
      console.log(`****${this.$store.getters['loginStore/isLoggedIn']}****`);
      return this.$store.getters['loginStore/isLoggedIn']
    },
    isGuest(){ return this.$store.getters['loginStore/isGuest']}
  },
  mounted() {

    // this.originalTop=Math.round(this.$el.getBoundingClientRect().top);
    // const ttop=Math.round(this.$refs['sidebar'].getBoundingClientRect().top);
    // window.addEventListener('scroll',event=>{
    //   this.scrollY=Math.round(window.pageYOffset)
    //   //
    //   // const t1=this.scrollY +ttop
    //   if(t1 >0){
    //     this.fixedPosition=`position:absolute;top:${this.originalTop}px`
    //   }
    // })
  },
  methods: {
      openSideBar() {
      if (!this.issidebar) {
        this.issidebar = true;
        this.menuText = "<";
        this.buttonWidth = '14em';
      } else {
        this.issidebar=false
         this.menuText = ">";
        this.buttonWidth='2em'
      }
    }
  }
}
</script>
<style>
* {
}
html,
body {
  margin: 0px;
  min-height: 100vh;
}



#app {
  display: flex;
  flex-direction: column;
}
.sidebar-button {
  position:fixed;
  left:0;
  bottom:.1em;
  width:14em;
  height: 2em;
  opacity: 0.7;
}
.sidebar-button:hover{
   opacity:1;
   height:2em;
}
.app-container {
  background-color: rgb(170, 180, 180);
  color: rgb(0, 0, 0);
  border: 1px solid lightgray;
  width: 100%;
  display: flex;
  flex: 1;
}
.app-header {
  background-color: #224a5d;
  padding: 0.4em;
}

.app-dashboard {
  /* background-color: rgb(187, 184, 141);
  height: 100%; */
  width: 100%;
  min-height: 100vh;
}
.app-foot {
  background-color: #224a5d;
  font-size: 100%;
  color: white;
  padding: 0.4em;
}
.app-sidebar {
  background: #224a5e;
  color: white;
  overflow-y: auto;
  word-wrap: wrap;
  flex: 0 0 14em;
}
.app-sidebar p,
.app-sidebar a {
  font-size: 100%;
  color: white;
}
@media (max-width: 750px) {
  .sidebar-button{
    display: none;
  }
  .app-container {
    flex-direction: column;
    flex: 1;
  }
}
.slide-enter-active, .slide-leave-active{
  transition: all .4s;
}
.slide-enter, .slide-leave-to{
    transform: scaleY(0);
    flex: 0em;
}
.fade-enter-active,.fade-leave-active{
  transition: all .2s
}
.fade-enter,.fade-leave-to{
  transform: scaleX(0.5);
}
/*
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 80%;
  margin: 0 auto;
  margin-top: 2em;
  padding: 1em;
  border: 1px solid lightgray;
}
/*
  #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      text-align: center;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      margin-top: 60px;
    }*/
</style>
