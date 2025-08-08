<template>
  <div class="tab-detail-module">
    <div class="module-header">
      <div class="header-content">
        <div class="header-left">
          <TagsOutlined class="module-icon" />
          <h3 class="module-title">Tab详情配置</h3>
        </div>
      </div>
    </div>

    <div class="module-content">
      <!-- Tab页签管理 -->
      <div class="tab-management">
        <div class="tab-header">
          <div class="tab-list">
            <div
              v-for="(tab, index) in moduleData.tabs"
              :key="tab.id"
              class="tab-item"
              :class="{ active: moduleData.activeTab === tab.id }"
              @click="handleTabClick(tab.id)"
            >
              <span class="tab-title">{{ tab.title }}</span>
              <CloseOutlined
                v-if="moduleData.tabs.length > 1"
                class="tab-close"
                @click.stop="handleRemoveTab(index)"
              />
            </div>
            <div
              class="tab-add"
              @click="handleAddTab"
            >
              <PlusOutlined />
            </div>
          </div>
        </div>

        <!-- 当前Tab内容编辑 -->
        <div
          class="tab-content"
          v-if="currentTab"
        >
          <!-- 显示标题编辑 -->
          <div class="form-section horizontal-form">
            <div class="form-label-section">
              <label class="form-label">显示标题</label>
              <div class="upload-description">Tab页签显示的标题</div>
            </div>
            <div class="form-control-section">
              <a-input
                v-model:value="currentTab.title"
                placeholder="请输入Tab标题"
                :maxlength="20"
                show-count
                @change="handleTitleChange"
              />
            </div>
          </div>

          <!-- 富文本编辑器 -->
          <div class="form-section">
            <div class="rich-editor-container">
              <QuillEditor
                ref="quillEditorRef"
                :key="moduleData.activeTab"
                v-model:content="currentTab.content"
                content-type="html"
                :options="editorOptions"
                @update:content="handleContentChange"
                @ready="onEditorReady"
                class="rich-editor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import {
    TagsOutlined,
    PlusOutlined,
    CloseOutlined,
  } from '@ant-design/icons-vue';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css'; // 引入默认样式
  import { useModuleStore } from '../../store';
  import type { TabDetailModuleData, TabItem } from './config';

  // QuillEditor引用
  const quillEditorRef = ref();

  // 模块数据管理
  const { data: moduleData, update: updateModuleData } =
    useModuleStore<TabDetailModuleData>('tab-detail');

  // 富文本编辑器配置
  const editorOptions = {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image'],
      ],
    },
    placeholder: '这是产品介绍',
  };

  // 计算属性
  const currentTab = computed(() => {
    return moduleData.value.tabs.find(
      (tab) => tab.id === moduleData.value.activeTab
    );
  });

  const hasContent = computed(() =>
    moduleData.value.tabs.some((tab) => tab.title || tab.content)
  );

  // 事件处理函数
  const handleTabClick = (tabId: string) => {
    updateModuleData({
      ...moduleData.value,
      activeTab: tabId,
    });
  };

  const handleAddTab = () => {
    const newTabId = Date.now().toString();
    const newTab: TabItem = {
      id: newTabId,
      title: '可选页签',
      content: '',
    };

    const newTabs = [...moduleData.value.tabs, newTab];
    updateModuleData({
      ...moduleData.value,
      tabs: newTabs,
      activeTab: newTabId,
    });
  };

  const handleRemoveTab = (index: number) => {
    if (moduleData.value.tabs.length <= 1) {
      message.warning('至少需要保留一个Tab页签');
      return;
    }

    const newTabs = [...moduleData.value.tabs];
    const removedTab = newTabs.splice(index, 1)[0];

    let newActiveTab = moduleData.value.activeTab;
    if (removedTab.id === moduleData.value.activeTab) {
      // 如果删除的是当前激活的tab，切换到第一个tab
      newActiveTab = newTabs[0]?.id || '';
    }

    updateModuleData({
      ...moduleData.value,
      tabs: newTabs,
      activeTab: newActiveTab,
    });
  };

  // 编辑器准备就绪回调
  const onEditorReady = (quill: any) => {
    // 设置自定义图片上传处理器
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      uploadImage(quill);
    });
  };

  // 自定义图片上传方法
  const uploadImage = (quill: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // 这里调用你的上传方法
        const imageUrl = await uploadImageToServer(file);

        // 获取当前光标位置
        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();

        // 插入图片
        quill.insertEmbed(index, 'image', imageUrl);

        // 移动光标到图片后面
        quill.setSelection(index + 1);
      } catch (error) {
        console.error('图片上传失败:', error);
        message.error('图片上传失败');
      }
    };
  };

  // 上传图片到服务器的方法（需要根据实际接口实现）
  const uploadImageToServer = async (file: File): Promise<string> => {
    // 创建FormData
    const formData = new FormData();
    formData.append('file', file);

    // 这里替换为你的实际上传接口
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('上传失败');
    }

    const result = await response.json();
    // 返回图片URL，根据实际接口返回格式调整
    return result.data.url || result.url;
  };

  const handleTitleChange = () => {
    if (!currentTab.value) return;

    const newTabs = moduleData.value.tabs.map((tab) =>
      tab.id === currentTab.value!.id
        ? { ...tab, title: currentTab.value!.title }
        : tab
    );

    updateModuleData({
      ...moduleData.value,
      tabs: newTabs,
    });
  };

  const handleContentChange = (content: string) => {
    if (!currentTab.value) return;

    const newTabs = moduleData.value.tabs.map((tab) =>
      tab.id === currentTab.value!.id ? { ...tab, content } : tab
    );

    updateModuleData({
      ...moduleData.value,
      tabs: newTabs,
    });
  };
</script>

<style scoped lang="less">
  .tab-detail-module {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .module-header {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 24px;
    border-bottom: 1px solid #e8e8e8;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .module-icon {
        font-size: 24px;
        color: #1890ff;
      }

      .module-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #262626;
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .module-content {
    padding: 24px;
  }

  .tab-management {
    .tab-header {
      margin-bottom: 24px;
    }

    .tab-list {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 8px;
    }

    .tab-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #f5f5f5;
      border: 1px solid #d9d9d9;
      border-radius: 6px 6px 0 0;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        background: #1890ff;
        color: white;
        border-color: #1890ff;
      }

      &:hover:not(.active) {
        background: #e6f7ff;
        border-color: #91d5ff;
      }

      .tab-title {
        font-size: 14px;
      }

      .tab-close {
        font-size: 12px;
        opacity: 0.7;
        transition: opacity 0.3s;

        &:hover {
          opacity: 1;
        }
      }
    }

    .tab-add {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: #f5f5f5;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #e6f7ff;
        border-color: #91d5ff;
        color: #1890ff;
      }
    }
  }

  .form-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    &.horizontal-form {
      display: flex;
      align-items: flex-start;
      gap: 20px;

      .form-label-section {
        flex: 0 0 140px;
        min-width: 140px;
      }

      .form-control-section {
        flex: 1;
        min-width: 0;
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .toolbar-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .font-size {
          font-size: 12px;
          color: #666;
        }

        .format-buttons {
          display: flex;
          gap: 4px;

          .format-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background: #f5f5f5;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              background: #e6f7ff;
              border-color: #91d5ff;
            }
          }
        }
      }
    }
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #262626;
    font-size: 14px;
  }

  .upload-description {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 4px;
  }

  .rich-editor-container {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    overflow: hidden;

    :deep(.ql-editor) {
      min-height: 400px;
      font-size: 14px;
      line-height: 1.6;
    }

    :deep(.ql-toolbar) {
      border-bottom: 1px solid #e8e8e8;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .module-header {
      padding: 16px;

      .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }

    .module-content {
      padding: 16px;
    }

    .form-section.horizontal-form {
      flex-direction: column;
      gap: 8px;

      .form-label-section {
        flex: none;
        min-width: auto;
      }

      .form-control-section {
        flex: none;
      }
    }

    .tab-list {
      flex-wrap: wrap;
    }

    .rich-editor-container {
      .rich-editor {
        min-height: 200px;

        :deep(.ql-editor) {
          min-height: 200px;
        }
      }
    }
  }
</style>
