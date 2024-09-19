<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// 不需要任何脚本逻辑
</script>

<style>
body {
  background-color: #242424;
  color: #ffffff;
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
</style>