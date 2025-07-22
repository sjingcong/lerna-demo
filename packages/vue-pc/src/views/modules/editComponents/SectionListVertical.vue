<template>
  <div class="section-list-vertical">
    <!-- 标题部分 -->
    <div class="section-header">
      <a-input v-model:value="localData.title" size="large" class="title-input" placeholder="请输入标题"
        @input="debouncedHandleDataChange" allow-clear />
    </div>

    <!-- Tab组件 -->
    <div class="tabs-container">
      <a-tabs v-model:activeKey="activeTabKey" type="editable-card" @edit="onTabEdit" class="custom-tabs">
        <a-tab-pane v-for="(item, itemIndex) in localData.items" :key="itemIndex.toString()"
          :closable="localData.items.length > 1">
          <template #tab>
            <div class="tab-title-wrapper">
              <a-input v-if="editingTabIndex === itemIndex" ref="tabTitleInput" v-model:value="item.title"
                @blur="stopEditingTab" @keyup.enter="stopEditingTab" class="tab-title-input" allow-clear />
              <span v-else class="tab-title-text" @click="startEditingTab(itemIndex)">
                {{ item.title }}
                <EditOutlined class="edit-icon" />
              </span>
            </div>
          </template>

          <!-- Tab内容 -->
          <div class="tab-content">
            <div class="item-content">
              <a-textarea v-model:value="item.description" placeholder="请输入描述内容" :rows="6" class="desc-textarea"
                @input="debouncedHandleDataChange" allow-clear />
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, nextTick, ref } from 'vue'
import { Input as AInput, Button as AButton, Textarea as ATextarea, Tabs as ATabs, TabPane as ATabPane, TabsProps } from 'ant-design-vue'
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue'
import { debounce } from 'lodash-es'

interface SectionItem {
  title: string
  description: string
}

interface SectionData {
  title: string
  items: SectionItem[]
}

interface Props {
  data: SectionData
}

interface Emits {
  (e: 'update:data', data: SectionData): void
  (e: 'change', data: SectionData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 创建响应式数据副本
const localData = reactive<SectionData>({
  title: props.data.title,
  items: JSON.parse(JSON.stringify(props.data.items))
})

// Tab相关响应式数据
const activeTabKey = ref('0')
const editingTabIndex = ref<number | null>(null)
const tabTitleInput = ref()

// 监听props变化
watch(() => props.data, (newData) => {
  localData.title = newData.title
  localData.items = JSON.parse(JSON.stringify(newData.items))
}, { deep: true })

// 数据变化处理
const handleDataChange = async () => {
  await nextTick() // 确保DOM更新完成
  const updatedData = {
    title: localData.title,
    items: JSON.parse(JSON.stringify(localData.items))
  }
  emit('update:data', updatedData)
  emit('change', updatedData)
}

// 防抖处理的数据变化函数
const debouncedHandleDataChange = debounce(handleDataChange, 300)

// 添加新项目
const addItem = () => {
  const newIndex = localData.items.length
  localData.items.push({
    title: '新项目',
    description: '请输入描述内容'
  })
  activeTabKey.value = newIndex.toString()
  debouncedHandleDataChange()
}

// Tab编辑相关方法
const startEditingTab = (index: number) => {
  editingTabIndex.value = index
  nextTick(() => {
    if (tabTitleInput.value) {
      tabTitleInput.value.focus()
    }
  })
}

const stopEditingTab = () => {
  editingTabIndex.value = null
  debouncedHandleDataChange()
}

// Tab操作处理
const onTabEdit: TabsProps['onEdit'] = (targetKey, action) => {
  if (action === 'add') {
    addItem()
  } else if (action === 'remove') {
    const index = parseInt(targetKey as string)
    deleteItem(index)
  }
}

// 删除项目
const deleteItem = (itemIndex: number) => {
  if (localData.items.length <= 1) return // 至少保留一个tab

  localData.items.splice(itemIndex, 1)

  // 调整activeTabKey
  const currentActive = parseInt(activeTabKey.value)
  if (currentActive >= itemIndex && currentActive > 0) {
    activeTabKey.value = (currentActive - 1).toString()
  } else if (currentActive >= localData.items.length) {
    activeTabKey.value = (localData.items.length - 1).toString()
  }

  debouncedHandleDataChange()
}
</script>

<style scoped>
.section-list-vertical {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  color: #262626;
  font-size: 16px;
  font-weight: 600;
}

.tabs-container {
  width: 100%;
}

.custom-tabs {
  background: #fff;
}

.custom-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.custom-tabs :deep(.ant-tabs-content-holder) {
  border: 1px solid #f0f0f0;
  border-top: none;
  padding: 8px;
}

.tab-title-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 120px;
}

.tab-title-text {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.tab-title-text:hover {
  background-color: #f0f0f0;
}

.tab-title-input {
  width: 100px;
}

.edit-icon {
  font-size: 12px;
  color: #999;
  opacity: 0;
  transition: opacity 0.2s;
}

.tab-title-text:hover .edit-icon {
  opacity: 1;
}

.tab-content {
  padding: 16px 0;
}

.item-content {
  width: 100%;
}

.desc-textarea {
  width: 100%;
  resize: vertical;
}

/* 清空图标悬浮显示 */
:deep(.ant-input-clear-icon),
:deep(.ant-input-textarea-clear-icon) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.ant-input-affix-wrapper:hover .ant-input-clear-icon),
:deep(.ant-input-affix-wrapper-focused .ant-input-clear-icon),
:deep(.ant-input:hover + .ant-input-clear-icon),
:deep(.ant-input-focused + .ant-input-clear-icon) {
  opacity: 1;
}

/* Textarea 清空图标 */
:deep(.ant-input:hover .ant-input-textarea-clear-icon),
:deep(.ant-input-focused .ant-input-textarea-clear-icon) {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-list-vertical {
    padding: 16px;
  }

  .tab-title-wrapper {
    max-width: 80px;
  }

  .tab-title-input {
    width: 80px;
  }
}
</style>