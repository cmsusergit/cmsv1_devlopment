<template>
  <div class="is-radiusless box has-text-centered"  style="width:100%;">

    <div class="">
      <button @click="scale -= scale >0.2?0.1:0" class="button is-secondary is-radiusless is-small" style="margin:0.4em;width:25%;">ZoomOut-</button>
      <button @click="scale += scale < 2?0.1:0" class="button is-secondary is-radiusless is-small" style="margin:0.4em;width:25%;">ZoomIn+</button>
      <a  class="button is-radiusless is-secondary is-small"  style="margin:0.4em;width:25%;" :href="pdfFile">Save PDF</a>
    </div>





    <div class="box is-radiusless is-paddingless is-clearfix has-text-centered" style="height:20em;overflow:auto;">
      <pdf :src="pdfdata" v-for="i in numPages" :key="dynamicT" :id="i" :page="i"
      :scale.sync="scale" style="width:20em;margin:10px auto;">
      <template slot="loading">
        loading content here...
      </template>
    </pdf>
    </div>
  </div>
</template>
<script>
import pdfvuer from 'pdfvuer'
export default {
  name:'PDFVuer',
  props: ['pdfFile'],
  components: {
    pdf: pdfvuer
  },
  data () {
    return {
      page: 1,
      numPages: 0,
      pdfdata: undefined,
      errors: [],
      scale: 'page-width',
      dynamicT:0
    }
  },
  computed: {
    formattedZoom () {
        return Number.parseInt(this.scale * 100);
    },
  },
  mounted () {
    this.getPdf()
  },
  watch: {
    show: function (s) {
      if(s) {
        this.getPdf();
      }
    },
    pdfFile:function(v1){
      this.getPdf()
    },
    // page: function (p) {
    //   if( window.pageYOffset <= this.findPos(document.getElementById(p)) || ( document.getElementById(p+1) && window.pageYOffset >= this.findPos(document.getElementById(p+1)) )) {
    //     // window.scrollTo(0,this.findPos(document.getElementById(p)));
    //     document.getElementById(p).scrollIntoView();
    //   }
    // }
  },
  methods: {
    getPdf () {
      var self = this;

      self.pdfdata=''
      self.pdfdata = pdfvuer.createLoadingTask(this.pdfFile);
      self.dynamicT=self.dynamicT+1
      self.pdfdata.then(pdf => {
        self.numPages = pdf.numPages;
        window.onscroll = function() {
          changePage()
        }
        function changePage () {
          var i = 1, count = Number(pdf.numPages);
          do {
            if(window.pageYOffset >= self.findPos(document.getElementById(i)) &&
                window.pageYOffset <= self.findPos(document.getElementById(i+1))) {
              self.page = i
            }
            i++
          } while ( i < count)
          if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
            self.page = i
          }
        }
      });
    },
    findPos(obj) {
      return obj.offsetTop;
    }
  }
}
</script>
<style lang="css" scoped>
  /* #buttons {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  /* Page content */
  /* .content {
    padding: 16px;
  } */
</style>
