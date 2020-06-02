<template>
  <div id="app">
    <div id="nav">
      <v-text-field v-model="name" label="이름을 입력하세요"></v-text-field>
      <div v-if="name=='김대용'" style="height:100px;width:200px;border:1px solid red">평생 백수입니다.</div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  data(){
    return{
      name:''
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
