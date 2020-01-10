<template>
  <div class="">

  <input v-model="content" @input="handelInput" class="input">

  {{required}}  </div>
</template>

<script>

export default{
  props:['value','required'],
  data(){
    return {
      content:this.value
    }
  },
  methods:{
    handelInput(ee){
      ee.target.value=ee.target.value.toUpperCase()
      this.content=ee.target.value
    }
  }
}
</script>
