<template>
  <div class="service-promise-container">
    <!-- 时效承诺部分 -->
    <div class="section" v-if="props.data?.section1">
      <h2 class="section-title">{{ props.data.section1.title }}</h2>
      <div class="promise-grid">
        <div 
          v-for="(item, index) in props.data.section1.items" 
          :key="index"
          class="promise-card"
        >
          <div class="promise-header">
            <div class="promise-icon">!</div>
            <h3 class="promise-name">{{ item.title }}</h3>
          </div>
          <div class="promise-content">
            <div v-for="(contentItem, contentIndex) in item.content" :key="contentIndex" class="promise-item">
              <div class="promise-sub-item">
                <span class="item-label">{{ contentItem.subTitle }}:</span>
                <span class="item-desc">{{ contentItem.subDesc }}</span>
              </div>
            </div>
          </div>
          <div class="promise-actions">
            <button class="action-btn delete-btn">🗑️ 删除</button>
            <button class="action-btn edit-btn">✏️ 编辑</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务安排部分 -->
    <div class="section" v-if="props.data?.section2">
      <h2 class="section-title">{{ props.data.section2.title }}</h2>
      <div class="service-list">
        <div 
          v-for="(item, index) in props.data.section2.items" 
          :key="index"
          class="service-card"
        >
          <div class="service-header">
            <div class="service-icon">!</div>
            <h3 class="service-name">{{ item.title }}</h3>
            <div class="service-actions">
              <button class="action-btn delete-btn">🗑️ 删除</button>
              <button class="action-btn edit-btn">✏️ 编辑</button>
            </div>
          </div>
          <div class="service-description">
            {{ item.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IModule } from './types'

interface Props {
  data?: {
    section1?: {
      title: string
      items: Array<{
        title: string
        content: Array<{
          subTitle: string
          subDesc: string
        }>
      }>
    }
    section2?: {
       title: string
       items: Array<{
         title: string
         description: string
       }>
     }
     [key: string]: any
  }
  config?: IModule
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({})
})

// Emits
const emit = defineEmits<{
  update: [data: any]
}>()

// 处理数据更新
const handleUpdate = () => {
  emit('update', props.data)
}
</script>

<style scoped>
.service-promise-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: #f5f7fa;
  border-radius: 12px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: left;
  position: relative;
  padding-left: 0;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  border-radius: 2px;
}

/* 时效承诺样式 */
.promise-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.promise-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
}

.promise-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
}

.promise-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.2rem;
}

.promise-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.promise-content {
  margin-bottom: 20px;
}

.promise-item {
  margin-bottom: 12px;
  padding: 8px 0;
}

.promise-sub-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-weight: 600;
  color: #5a6c7d;
  font-size: 1rem;
}

.item-desc {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
  line-height: 1.4;
  padding-left: 0;
}

.promise-desc {
  color: #7b8794;
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.5;
  padding-left: 78px;
  margin-top: -5px;
}

.promise-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 服务安排样式 */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecf0;
}

.service-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
}

.service-header .service-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.2rem;
  color: white;
}

.service-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.service-actions {
  display: flex;
  gap: 12px;
}

.service-description {
  color: #5a6c7d;
  line-height: 1.6;
  font-size: 1rem;
}

/* 按钮样式 */
.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  color: #666;
  font-weight: 500;
}

.delete-btn {
  border-color: #ff4757;
  color: #ff4757;
}

.edit-btn {
  border-color: #5352ed;
  color: #5352ed;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .promise-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .promise-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .service-promise-container {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .promise-card,
  .service-card {
    padding: 20px;
  }
  
  .service-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .service-actions {
    align-self: flex-end;
  }
}
</style>