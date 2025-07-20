<template>
  <div class="section-group-horizontal">
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
              <a-input v-if="editingTabIndex === itemIndex" v-model:value="item.title" size="small"
                class="tab-title-input" @blur="stopEditingTab" @pressEnter="stopEditingTab"
                @input="debouncedHandleDataChange" ref="tabTitleInput" allow-clear />
              <span v-else class="tab-title-text" @click="startEditingTab(itemIndex)">
                {{ item.title }}
                <EditOutlined class="edit-icon" />
              </span>
            </div>
          </template>

          <!-- Tab内容 -->
          <div class="tab-content">
            <div class="content-list">
              <div v-for="(content, contentIndex) in item.content" :key="contentIndex" class="content-item">
                <div class="content-header">
                  <a-input v-model:value="content.subTitle" placeholder="请输入子标题" class="subtitle-input"
                    @input="debouncedHandleDataChange" allow-clear />
                  <a-button type="text" danger size="small" class="delete-content-btn"
                    @click="deleteContent(itemIndex, contentIndex)">
                    <DeleteOutlined />
                  </a-button>
                </div>

                <a-textarea v-model:value="content.subDesc" placeholder="请输入描述内容" :rows="3" class="desc-textarea"
                  @input="debouncedHandleDataChange" allow-clear />
              </div>

              <!-- 添加内容项按钮 -->
              <a-button type="dashed" block class="add-content-btn" @click="addContent(itemIndex)">
                <PlusOutlined /> 添加内容项
              </a-button>
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

interface ContentItem {
  subTitle: string
  subDesc: string
}

interface SectionItem {
  title: string
  content: ContentItem[]
}

interface SectionData {
  title: string
  items: SectionItem[]
}

interface Props {
  data: SectionData
}

interface Emits {
  (e: 'update:data', value: SectionData): void
  (e: 'change', value: SectionData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 创建响应式数据副本
const localData = reactive<SectionData>({
  title: props.data.title,
  items: JSON.parse(JSON.stringify(props.data.items))
})

// Tab相关状态
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
    content: [
      {
        subTitle: '子标题',
        subDesc: '描述内容'
      }
    ]
  })
  activeTabKey.value = newIndex.toString()
  debouncedHandleDataChange()
}

// Tab编辑相关方法
const startEditingTab = (index: number) => {
  editingTabIndex.value = index
  nextTick(() => {
    if (tabTitleInput.value && tabTitleInput.value[0]) {
      tabTitleInput.value[0].focus()
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

// 添加内容项
const addContent = (itemIndex: number) => {
  localData.items[itemIndex].content.push({
    subTitle: '子标题',
    subDesc: '描述内容'
  })
  handleDataChange()
}

// 删除内容项
const deleteContent = (itemIndex: number, contentIndex: number) => {
  localData.items[itemIndex].content.splice(contentIndex, 1)
  handleDataChange()
}
</script>

<style scoped>
.section-group-horizontal {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.title-input {
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

.content-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-item {
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.subtitle-input {
  flex: 1;
}

.delete-content-btn {
  color: #ff4d4f;
  padding: 4px;
}

.delete-content-btn:hover {
  background-color: #fff2f0;
}

.desc-textarea {
  width: 100%;
  resize: vertical;
}

.add-content-btn {
  width: 100%;
  border-style: dashed;
  color: #1890ff;
}

.add-content-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.add-item-btn {
  width: 100%;
  border-style: dashed;
  color: #1890ff;
  padding: 12px;
  height: auto;
}

.add-item-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
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
  .section-group-horizontal {
    padding: 16px;
  }

  .tab-title-wrapper {
    max-width: 80px;
  }

  .tab-title-input {
    width: 80px;
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style>