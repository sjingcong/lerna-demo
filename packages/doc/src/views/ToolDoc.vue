<template>
  <div class="tool-doc">
    <!-- 左侧工具列表 -->
    <div class="tool-sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="home-link">
          <Icon icon="mdi:home" />
          <span>首页</span>
        </router-link>
      </div>

      <div class="menu-tree">
        <div v-for="(category, categoryKey) in toolsData" :key="categoryKey" class="menu-category">
          <!-- 分类头部 -->
          <div class="menu-category-header" :class="{ expanded: expandedCategories[categoryKey] }"
            @click="toggleCategory(categoryKey)">
            <Icon :icon="expandedCategories[categoryKey] ? 'mdi:chevron-down' : 'mdi:chevron-right'" class="expand-icon"
              :style="{ transform: expandedCategories[categoryKey] ? 'rotate(0deg)' : 'rotate(0deg)' }" />
            <Icon :icon="getCategoryIcon(categoryKey)" class="category-icon" />
            <span class="category-name">{{ getCategoryLabel(categoryKey) }}</span>
          </div>

          <!-- 分类内容 -->
          <div v-if="expandedCategories[categoryKey]" class="menu-category-content">
            <!-- 主分类下的直接工具 -->
            <div v-if="category.tools && category.tools.length > 0" class="menu-tools">
              <router-link v-for="tool in category.tools" :key="tool.name" :to="`/tools/${categoryKey}/${tool.name}`"
                class="menu-tool-item"
                :class="{ active: currentCategory === categoryKey && currentToolName === tool.name && !currentSubCategory }">
                <Icon :icon="tool.icon || 'mdi:file-document'" class="tool-icon" />
                <span class="tool-name">{{ tool.title }}</span>
              </router-link>
            </div>

            <!-- 子分类 -->
            <div v-if="category.subCategories">
              <div v-for="(subCategory, subCategoryKey) in category.subCategories" :key="subCategoryKey"
                class="menu-subcategory">
                <!-- 子分类头部 -->
                <div class="menu-subcategory-header"
                  :class="{ expanded: expandedSubCategories[`${categoryKey}-${subCategoryKey}`] }"
                  @click="toggleSubCategory(categoryKey, subCategoryKey)">
                  <Icon
                    :icon="expandedSubCategories[`${categoryKey}-${subCategoryKey}`] ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                    class="expand-icon" />
                  <Icon :icon="subCategory.icon || 'mdi:folder-outline'" class="subcategory-icon" />
                  <span class="subcategory-name">{{ subCategory.title }}</span>
                </div>

                <!-- 子分类内容 -->
                <div v-if="expandedSubCategories[`${categoryKey}-${subCategoryKey}`]" class="menu-subcategory-content">
                  <router-link v-for="tool in subCategory.tools" :key="tool.name"
                    :to="`/tools/${categoryKey}/${subCategoryKey}/${tool.name}`" class="menu-tool-item subcategory-tool"
                    :class="{ active: currentCategory === categoryKey && currentSubCategory === subCategoryKey && currentToolName === tool.name }">
                    <Icon :icon="tool.icon || 'mdi:file-document'" class="tool-icon" />
                    <span class="tool-name">{{ tool.title }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧文档内容 -->
    <div class="doc-main">
      <div v-if="!currentTool" class="not-found">
        <Icon icon="mdi:file-document-remove" class="not-found-icon" />
        <h2>工具文档未找到</h2>
        <p>请从左侧列表选择一个工具查看文档。</p>
      </div>

      <div v-else class="doc-content">
        <div class="doc-header">
          <div class="breadcrumb">
            <router-link to="/" class="breadcrumb-item">
              <Icon icon="mdi:home" />
              首页
            </router-link>
            <Icon icon="mdi:chevron-right" class="breadcrumb-separator" />
            <span class="breadcrumb-item">{{ getCategoryLabel(currentCategory) }}</span>
            <Icon icon="mdi:chevron-right" class="breadcrumb-separator" />
            <span class="breadcrumb-item current">{{ currentTool.title }}</span>
          </div>

          <div class="doc-title">
            <Icon :icon="currentTool.icon || 'mdi:file-document'" class="title-icon" />
            <h1>{{ currentTool.title }}</h1>
            <div v-if="currentTool.version" class="version-badge">
              v{{ currentTool.version }}
            </div>
          </div>

          <p v-if="currentTool.description" class="doc-description">
            {{ currentTool.description }}
          </p>

          <div v-if="currentTool.tags" class="doc-tags">
            <span v-for="tag in currentTool.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="doc-body">
          <!-- 动态加载MDX内容 -->
          <Suspense>
            <template #default>
              <component :is="mdxComponent" v-if="mdxComponent" />
            </template>
            <template #fallback>
              <div class="loading">
                <Icon icon="mdi:loading" class="loading-icon" />
                <span>加载文档中...</span>
              </div>
            </template>
          </Suspense>

          <!-- 如果没有MDX文档，显示默认内容 -->
          <div v-if="!mdxComponent && !loading" class="no-content">
            <Icon icon="mdi:file-document-plus" class="no-content-icon" />
            <h3>文档正在完善中</h3>
            <p>该工具的详细文档正在编写中，敬请期待。</p>
            <div class="basic-info">
              <h4>基本信息</h4>
              <ul>
                <li><strong>名称：</strong>{{ currentTool.title }}</li>
                <li v-if="currentTool.description"><strong>描述：</strong>{{ currentTool.description }}</li>
                <li><strong>分类：</strong>{{ getCategoryLabel(currentCategory) }}</li>
                <li v-if="currentTool.version"><strong>版本：</strong>v{{ currentTool.version }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const mdxComponent = ref(null)
const loading = ref(false)

// 展开状态管理
const expandedCategories = ref<Record<string, boolean>>({})
const expandedSubCategories = ref<Record<string, boolean>>({})

// 类型定义
interface Tool {
  name: string
  title: string
  description: string
  icon: string
  version: string
  tags: string[]
}

interface SubCategory {
  title: string
  description: string
  icon: string
  tools: Tool[]
}

interface Category {
  title: string
  description: string
  icon: string
  tools: Tool[]
  subCategories?: Record<string, SubCategory>
}

type ToolsData = Record<string, Category>

// 动态获取docs目录结构
const mdxFiles = import.meta.glob('../docs/**/*.mdx', { eager: true })
const descFiles = import.meta.glob('../docs/**/desc.json', { eager: true })

// 获取分类的desc.json数据
const getCategoryDesc = (categoryPath: string) => {
  const descPath = `../docs/${categoryPath}/desc.json`
  const descModule = descFiles[descPath] as any
  return descModule ? (descModule.default || descModule) : null
}

// 从MDX文件和desc.json动态生成工具数据
const generateToolsData = (): ToolsData => {
  const toolsData: ToolsData = {}

  // 首先处理desc.json文件，建立分类结构
  Object.keys(descFiles).forEach(filePath => {
    const descModule = descFiles[filePath] as any
    const descData = descModule.default || descModule

    // 解析路径: ../docs/category/desc.json 或 ../docs/category/subcategory/desc.json
    const pathMatch = filePath.match(/\.\.\/docs\/(.+)\/desc\.json$/)
    if (!pathMatch) return

    const pathParts = pathMatch[1].split('/')

    if (pathParts.length === 1) {
      // 主分类
      const category = pathParts[0]
      if (!toolsData[category]) {
        toolsData[category] = {
          title: descData.title || category,
          description: descData.description || '',
          icon: descData.icon || 'mdi:folder',
          tools: [],
          subCategories: {}
        }
      }
    } else if (pathParts.length === 2) {
      // 子分类
      const [category, subCategory] = pathParts
      if (!toolsData[category]) {
        const categoryDesc = getCategoryDesc(category)
        toolsData[category] = {
          title: categoryDesc?.title || category,
          description: categoryDesc?.description || '',
          icon: categoryDesc?.icon || 'mdi:folder',
          tools: [],
          subCategories: {}
        }
      }
      if (!toolsData[category].subCategories) {
        toolsData[category].subCategories = {}
      }
      toolsData[category].subCategories![subCategory] = {
        title: descData.title || subCategory,
        description: descData.description || '',
        icon: descData.icon || 'mdi:folder-outline',
        tools: []
      }
    }
  })

  // 然后处理MDX文件
  Object.keys(mdxFiles).forEach(filePath => {
    // 解析文件路径: ../docs/category/toolName.mdx 或 ../docs/category/subcategory/toolName.mdx
    const pathMatch = filePath.match(/\.\.\/docs\/(.+)\.mdx$/)
    if (!pathMatch) return

    const pathParts = pathMatch[1].split('/')
    const mdxModule = mdxFiles[filePath] as any
    const metadata = mdxModule.frontmatter || {}

    // 生成工具名称
    const generateTitle = (name: string) => {
      // 直接返回文件名，支持中文
      return name
    }

    // 生成描述
    const generateDescription = (name: string) => {
      return `${name}的详细文档`
    }

    // 生成图标
    const generateIcon = (name: string) => {
      return 'mdi:file-document'
    }

    const toolName = pathParts[pathParts.length - 1]
    const tool: Tool = {
      name: toolName,
      title: metadata.title || generateTitle(toolName),
      description: metadata.description || generateDescription(toolName),
      icon: metadata.icon || generateIcon(toolName),
      version: metadata.version || '1.0.0',
      tags: metadata.tags || []
    }



    if (pathParts.length === 2) {
      // 直接在主分类下的工具
      const category = pathParts[0]
      if (!toolsData[category]) {
        const categoryDesc = getCategoryDesc(category)
        toolsData[category] = {
          title: categoryDesc?.title || category,
          description: categoryDesc?.description || '',
          icon: categoryDesc?.icon || 'mdi:folder',
          tools: [],
          subCategories: {}
        }
      }
      toolsData[category].tools.push(tool)
    } else if (pathParts.length === 3) {
      // 在子分类下的工具
      const [category, subCategory] = pathParts
      if (!toolsData[category]) {
        const categoryDesc = getCategoryDesc(category)
        toolsData[category] = {
          title: categoryDesc?.title || category,
          description: categoryDesc?.description || '',
          icon: categoryDesc?.icon || 'mdi:folder',
          tools: [],
          subCategories: {}
        }
      }
      if (!toolsData[category].subCategories) {
        toolsData[category].subCategories = {}
      }
      if (!toolsData[category].subCategories![subCategory]) {
        const subCategoryDesc = getCategoryDesc(`${category}/${subCategory}`)
        toolsData[category].subCategories![subCategory] = {
          title: subCategoryDesc?.title || subCategory,
          description: subCategoryDesc?.description || '',
          icon: subCategoryDesc?.icon || 'mdi:folder-outline',
          tools: []
        }
      }
      toolsData[category].subCategories![subCategory].tools.push(tool)
    }
  })

  return toolsData
}

// 生成工具数据
const toolsData = ref<ToolsData>(generateToolsData())

const currentCategory = computed(() => route.params.category as string)
const currentSubCategory = computed(() => route.params.subcategory as string)
const currentToolName = computed(() => route.params.tool as string)

const currentTool = computed(() => {
  const category = toolsData.value[currentCategory.value]
  if (!category) return null

  // 如果有子分类，从子分类中查找工具
  if (currentSubCategory.value && category.subCategories?.[currentSubCategory.value]) {
    return category.subCategories[currentSubCategory.value].tools.find(tool => tool.name === currentToolName.value) || null
  }

  // 否则从主分类中查找工具
  return category.tools.find(tool => tool.name === currentToolName.value) || null
})

const getCategoryLabel = (category: string) => {
  return toolsData.value[category]?.title || category
}

const getCategoryIcon = (category: string) => {
  return toolsData.value[category]?.icon || 'mdi:folder'
}

// 切换分类展开状态
const toggleCategory = (categoryKey: string) => {
  expandedCategories.value[categoryKey] = !expandedCategories.value[categoryKey]
}

// 切换子分类展开状态
const toggleSubCategory = (categoryKey: string, subCategoryKey: string) => {
  const key = `${categoryKey}-${subCategoryKey}`
  expandedSubCategories.value[key] = !expandedSubCategories.value[key]
}

// 动态加载MDX文档
const loadMdxDoc = async () => {
  if (!currentCategory.value || !currentToolName.value) return

  loading.value = true
  mdxComponent.value = null

  try {
    let mdxPath = ''
    if (currentSubCategory.value) {
      // 子分类下的工具
      mdxPath = `../docs/${currentCategory.value}/${currentSubCategory.value}/${currentToolName.value}.mdx`
    } else {
      // 主分类下的工具
      mdxPath = `../docs/${currentCategory.value}/${currentToolName.value}.mdx`
    }

    const mdxModule = await import(mdxPath)
    mdxComponent.value = mdxModule.default
  } catch (error) {
    const path = currentSubCategory.value
      ? `${currentCategory.value}/${currentSubCategory.value}/${currentToolName.value}.mdx`
      : `${currentCategory.value}/${currentToolName.value}.mdx`
    console.warn(`MDX文档未找到: ${path}`)
    mdxComponent.value = null
  } finally {
    loading.value = false
  }
}

// 初始化展开状态
const initializeExpandedState = () => {
  if (currentCategory.value) {
    expandedCategories.value[currentCategory.value] = true
    if (currentSubCategory.value) {
      const key = `${currentCategory.value}-${currentSubCategory.value}`
      expandedSubCategories.value[key] = true
    }
  }
}

// 监听路由变化
watch(
  () => [currentCategory.value, currentSubCategory.value, currentToolName.value],
  () => {
    initializeExpandedState()
    loadMdxDoc()
  },
  { immediate: true }
)

onMounted(() => {
  initializeExpandedState()
  loadMdxDoc()
})
</script>

<style scoped>
.tool-doc {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 左侧工具列表样式 */
.tool-sidebar {
  width: 350px;
  background: #f8f9fa;
  border-right: 1px solid #e1e4e8;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e1e4e8;
  background: white;
}

.home-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007acc;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.home-link:hover {
  background: #f1f8ff;
}

.menu-tree {
  padding: 0.5rem 0;
}

.menu-category {
  margin-bottom: 0.5rem;
}

.menu-category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.menu-category-header:hover {
  background: #f5f5f5;
}

.menu-category-header.expanded {
  background: #f0f7ff;
}

.expand-icon {
  font-size: 1rem;
  color: #666;
  transition: transform 0.2s;
}

.category-icon {
  font-size: 1.25rem;
  color: #007acc;
}

.category-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.menu-category-content {
  padding-left: 1rem;
}

.menu-tools {
  margin-bottom: 0.5rem;
}

.menu-subcategory {
  margin-bottom: 0.5rem;
}

.menu-subcategory-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.menu-subcategory-header:hover {
  background: #f5f5f5;
}

.menu-subcategory-header.expanded {
  background: #f0f7ff;
}

.subcategory-icon {
  font-size: 1rem;
  color: #666;
}

.subcategory-name {
  font-weight: 500;
  color: #586069;
  font-size: 0.9rem;
}

.menu-subcategory-content {
  padding-left: 1rem;
}

.menu-tool-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #586069;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  margin-bottom: 1px;
}

.menu-tool-item:hover {
  background: #f1f8ff;
  color: #007acc;
}

.menu-tool-item.active {
  background: #e6f3ff;
  color: #007acc;
  border-left-color: #007acc;
  font-weight: 500;
}

.menu-tool-item.subcategory-tool {
  padding-left: 2rem;
}

.tool-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.tool-name {
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右侧文档内容样式 */
.doc-main {
  flex: 1;
  overflow-y: auto;
  background: white;
}

.doc-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found-icon {
  font-size: 4rem;
  color: #6a737d;
  margin-bottom: 1rem;
}

.not-found h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.not-found p {
  color: #6a737d;
  margin-bottom: 2rem;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #007acc;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.back-home-btn:hover {
  background: #005a9e;
}

.doc-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e1e4e8;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: #007acc;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.breadcrumb-item.current {
  color: #6a737d;
}

.breadcrumb-separator {
  color: #6a737d;
  font-size: 0.75rem;
}

.doc-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  color: #007acc;
}

.doc-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.version-badge {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.doc-description {
  font-size: 1.2rem;
  color: #6a737d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f1f8ff;
  color: #007acc;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  border: 1px solid #c8e1ff;
}

.doc-body {
  line-height: 1.7;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: #6a737d;
}

.loading-icon {
  font-size: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.no-content {
  text-align: center;
  padding: 4rem 2rem;
}

.no-content-icon {
  font-size: 4rem;
  color: #6a737d;
  margin-bottom: 1rem;
}

.no-content h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.no-content p {
  color: #6a737d;
  margin-bottom: 2rem;
}

.basic-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.basic-info h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.basic-info ul {
  list-style: none;
  padding: 0;
}

.basic-info li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e1e4e8;
}

.basic-info li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .tool-doc {
    flex-direction: column;
    height: auto;
  }

  .tool-sidebar {
    width: 100%;
    height: auto;
    max-height: 40vh;
    order: 2;
  }

  .doc-main {
    order: 1;
    height: auto;
  }

  .doc-content {
    padding: 1rem;
  }

  .doc-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .doc-title h1 {
    font-size: 2rem;
  }

  .breadcrumb {
    flex-wrap: wrap;
  }

  .tool-link {
    padding: 0.5rem 1rem;
  }

  .tool-name {
    font-size: 0.8rem;
  }

  .tool-desc {
    font-size: 0.7rem;
    -webkit-line-clamp: 1;
  }
}
</style>