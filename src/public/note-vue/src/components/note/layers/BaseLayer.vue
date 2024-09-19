<template>
    <div class="layer">
      <slot></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    active: boolean
  }>()
  </script>
  
  <style scoped>
  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
  }
  .layer.active {
    display: block;
  }
  </style>