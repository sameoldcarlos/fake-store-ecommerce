<script setup lang="ts">
import { RouterView } from 'vue-router'
import '@/scss/vars.scss'
import '@/scss/main.scss'
</script>

<template>
  <RouterView :key="$route.path" />
</template>
