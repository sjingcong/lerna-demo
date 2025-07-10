<template>
  <div class="user-card">
    <div class="avatar">
      <!-- <img :src="avatar || '/default-avatar.png'" :alt="name" /> -->
    </div>
    <div class="info">
      <h3>{{ name }}</h3>
      <p>{{ email }}</p>
      <p>{{ department }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  email: string;
  avatar?: string;
  department?: string;
}

defineProps<Props>();
</script>

<style scoped>
.user-card {
  display: flex;
  min-height: 600px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
}

.avatar {
  margin-right: 16px;
}

.avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.info p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}
</style>