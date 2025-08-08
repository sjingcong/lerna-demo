<template>
  <div class="banner-editor-module">
    <!-- 销售商品名称 -->
    <div
      class="form-section"
      style="padding: 0 24px"
    >
      <a-form
        layout="horizontal"
        :label-col="{ style: { width: '120px' } }"
      >
        <a-form-item
          label="销售商品名称"
          v-bind="validateInfos.productName"
        >
          <a-input
            v-model:value="moduleData.productName"
            placeholder="请输入销售商品名称"
            size="large"
            :maxlength="50"
            show-count
            :disabled="isPreview"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="module-header">
      <h2 class="module-title">Banner位</h2>
    </div>

    <div class="module-content">
      <!-- 上下布局容器 -->
      <a-form
        layout="horizontal"
        :label-col="{ style: { width: '120px' } }"
      >
        <!-- 图片上传区域 -->
        <a-form-item
          label="图片"
          v-bind="validateInfos.bannerImages"
        >
          <template #extra>
            <div class="upload-description">
              支持格式：jpg、PNG、JPEG；最多3张
            </div>
          </template>
          <ImageList
            v-model:value="moduleData.bannerImages"
            :max-count="3"
            :accept="['jpg', 'png', 'jpeg']"
            :disabled="isPreview"
          />
        </a-form-item>

        <!-- 视频上传区域 -->
        <a-form-item
          label="上传视频"
          v-bind="validateInfos.videoFiles"
        >
          <template #extra>
            <div class="upload-description">
              支持格式：avi、mp4、mov、wmv、rmvb、mkv；最多1个
            </div>
          </template>
          <FileUpload
            ref="videoUploadRef"
            v-model:file-list="moduleData.videoFiles"
            accept=".avi,.mp4,.mov,.wmv,.rmvb,.mkv"
            :max-count="1"
            :max-size="100"
            list-type="video"
            :disabled="isPreview"
          />
        </a-form-item>

        <!-- 视频封面上传 -->
        <a-form-item
          label="视频封面"
          v-bind="validateInfos.videoCoverImages"
        >
          <template #extra>
            <div class="upload-description">
              支持格式：jpg、PNG、JPEG；最多1张
            </div>
          </template>
          <ImageList
            v-model:value="moduleData.videoCoverImages"
            :max-count="1"
            :accept="['jpg', 'png', 'jpeg']"
            :disabled="isPreview"
          />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, reactive } from 'vue';
  import { message, Form } from 'ant-design-vue';
  import ImageList from '@giom/shared/components/ImageList.vue';
  import FileUpload from '@/components/FileUpload/index.vue';
  import {
    useModuleStore,
    useEvent,
    useCommonData,
  } from '@giom/shared/modular-craft';
  import type { BannerEditorModuleData } from './config';

  // Props定义
  interface Props {
    moduleId?: string;
    status?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    moduleId: '',
    status: '',
  });
  const commonData = useCommonData();
  // 计算是否为预览模式
  const isPreview = computed(() => commonData.status === 'preview');
  // 模块数据管理
  const { data: moduleData, update: updateModuleData } =
    useModuleStore<BannerEditorModuleData>(props.moduleId);

  // 事件总线
  const { registerValidation } = useEvent();

  // 组件引用
  const videoUploadRef = ref();

  // 使用useForm
  const useForm = Form.useForm;

  // 表单校验规则
  const formRules = reactive({
    productName: [
      {
        required: true,
        message: '请输入销售商品名称',
        trigger: 'blur',
      },
      {
        min: 1,
        max: 100,
        message: '销售商品名称长度应在1-100个字符之间',
        trigger: 'blur',
      },
    ],
    bannerImages: [
      {
        validator: (rule: any, value: any) => {
          if (value.length === 0 && moduleData.value.videoFiles.length === 0) {
            return Promise.reject('请至少上传一张Banner图片或一个视频');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
    videoFiles: [
      {
        validator: (rule: any, value: any) => {
          if (
            value.length === 0 &&
            moduleData.value.bannerImages.length === 0
          ) {
            return Promise.reject('请至少上传一张Banner图片或一个视频');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
    videoCoverImages: [
      {
        validator: (rule: any, value: any) => {
          if (moduleData.value.videoFiles.length > 0 && value.length === 0) {
            return Promise.reject('上传视频时必须设置视频封面');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
  });

  // 创建表单实例
  const { resetFields, validate, validateInfos } = useForm(
    moduleData,
    formRules
  );

  // 校验函数
  const validateBannerEditor = async () => {
    try {
      // 触发所有表单校验
      await validate();
      // 校验成功，返回空错误数组
    } catch (error: any) {
      throw error;
    }
  };

  // 注册校验函数
  registerValidation('banner-editor', validateBannerEditor);
</script>

<style scoped lang="less">
  .banner-editor-module {
    background: white;
    border-radius: 8px;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .module-header {
    padding: 8px 24px;
    border-bottom: 1px solid #f0f0f0;

    .module-title {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: #262626;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .module-description {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .module-content {
    padding: 24px;
  }

  .preview-section {
    margin-top: 32px;
    padding: 20px;
    background: #fafafa;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
  }

  .preview-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: #262626;
  }

  .preview-content {
    > div {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    strong {
      color: #262626;
      margin-right: 8px;
    }
  }

  .preview-product-name {
    font-size: 14px;
    line-height: 1.5;
  }

  .image-grid {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .preview-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
  }

  .video-info {
    margin-top: 4px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    font-size: 13px;
    color: #666;
  }

  .preview-cover-image {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    margin-top: 8px;
  }

  .action-buttons {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e8e8e8;
    display: flex;
    gap: 12px;
    justify-content: flex-start;

    .ant-btn {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .module-header {
      padding: 16px;

      .module-title {
        font-size: 18px;
      }
    }

    .module-content {
      padding: 16px;
    }

    .image-grid {
      gap: 6px;
    }

    .preview-image {
      width: 60px;
      height: 60px;
    }

    .preview-cover-image {
      width: 100px;
      height: 67px;
    }

    .action-buttons {
      flex-direction: column;

      .ant-btn {
        width: 100%;
        justify-content: center;
      }
    }
  }
</style>
