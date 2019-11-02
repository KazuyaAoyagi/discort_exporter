<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

export default {
  data() {
    return {
      msg: 'Discord Exporter'
    }
  },

  methods:{
    test: function(e)  {
      chrome.runtime.sendMessage("めっせぇじ",
 function (response){
	      console.log("受け取ったデータ：",
 response)
      })
    }
  }
}
</script>

<style lang="scss">

div {
  padding: 10px;
  text-align :center;

  button {
    padding: 10px;
  }
}
</style>
