<template>
  <div>
    <InfoPanel :value="infoPanelValue" />
    <UserController />

  </div>
</template>

<script setup lang="ts">
import InfoPanel from '@/components/InfoPanel.vue';
import UserController from '@/components/UserController.vue';
import { computed } from 'vue';

const infoPanelValue = computed(() => {
  return 'Для указания нескольких меток для одной пары логин/пароль используйте разделитель;'
})
</script>

<style scoped></style>
