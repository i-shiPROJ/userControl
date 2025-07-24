<template>
  <div class="infoPanel">
    <div>
      <el-icon>
        <WarningFilled />
      </el-icon>
    </div>
    <span>
      {{ props.value }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.infoPanel {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background-color: #e7f3ff;
  border-radius: 10px;
  padding: 5px;
}
</style>
