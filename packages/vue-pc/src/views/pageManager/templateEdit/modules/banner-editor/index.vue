<template>
  <div class="banner-editor-module">
    <div class="module-header">
      <h2 class="module-title">
        <PictureOutlined />
        Banner位编辑器
      </h2>
      <p class="module-description">配置销售商品的Banner展示内容</p>
    </div>

    <div class="module-content">
      <!-- 销售商品名称 -->
      <div class="form-section full-width">
        <label class="form-label required">销售商品名称</label>
        <a-input
          v-model:value="moduleData.productName"
          placeholder="请输入销售商品名称"
          size="large"
          :maxlength="50"
          show-count
          @change="handleProductNameChange"
        />
      </div>

      <!-- 上下布局容器 -->
      <div class="vertical-layout">
        <!-- 图片上传区域 -->
        <div class="form-section horizontal-form">
          <div class="form-label-section">
            <label class="form-label">Banner图片</label>
            <div class="upload-description">
              支持格式：jpg、PNG、JPEG；最多3张
            </div>
          </div>
          <div class="form-control-section">
            <ImageList
              v-model:value="moduleData.bannerImages"
              :max-count="3"
              :accept="['jpg', 'png', 'jpeg']"
              @change="handleBannerImagesChange"
            />
          </div>
        </div>

        <!-- 视频上传区域 -->
        <div class="form-section horizontal-form">
          <div class="form-label-section">
            <label class="form-label">上传视频</label>
            <div class="upload-description">
              支持格式：avi、mp4、mov、wmv、rmvb、mkv；最多1个
            </div>
          </div>
          <div class="form-control-section">
            <FileUpload
              ref="videoUploadRef"
              v-model:file-list="moduleData.videoFiles"
              accept=".avi,.mp4,.mov,.wmv,.rmvb,.mkv"
              :max-count="1"
              :max-size="100"
              list-type="video"
              @change="handleVideoFilesChange"
            />
          </div>
        </div>

        <!-- 视频封面上传 -->
        <div class="form-section horizontal-form">
          <div class="form-label-section">
            <label class="form-label">视频封面</label>
            <div class="upload-description">
              支持格式：jpg、PNG、JPEG；最多1张
            </div>
          </div>
          <div class="form-control-section">
            <ImageList
              v-model:value="moduleData.videoCoverImages"
              :max-count="1"
              :accept="['jpg', 'png', 'jpeg']"
              @change="handleVideoCoverChange"
            />
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
  PictureOutlined,
  SaveOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons-vue';
import ImageList from '@giom/shared/components/ImageList.vue';
import FileUpload from '@/components/FileUpload/index.vue';
import { useModuleStore } from '../../store';
import type { BannerEditorModuleData, ImageItem } from './config';
import type { UploadFile } from 'ant-design-vue';

// 模块数据管理
const { data: moduleData, update: updateModuleData } = useModuleStore<BannerEditorModuleData>('banner-editor');

// 组件引用
const videoUploadRef = ref();

// 计算属性
const hasContent = computed(() => 
  moduleData.value.productName || 
  moduleData.value.bannerImages.length > 0 || 
  moduleData.value.videoFiles.length > 0 || 
  moduleData.value.videoCoverImages.length > 0
);

// 事件处理函数
const handleProductNameChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  updateModuleData({
    ...moduleData.value,
    productName: target.value
  });
};

const handleBannerImagesChange = (images: ImageItem[]) => {
  updateModuleData({
    ...moduleData.value,
    bannerImages: images
  });
};

const handleVideoFilesChange = (files: UploadFile[]) => {
  updateModuleData({
    ...moduleData.value,
    videoFiles: files
  });
  
  // 如果没有视频文件，清空视频封面
  if (files.length === 0) {
    updateModuleData({
      ...moduleData.value,
      videoFiles: files,
      videoCoverImages: []
    });
  }
};

const handleVideoCoverChange = (images: ImageItem[]) => {
  updateModuleData({
    ...moduleData.value,
    videoCoverImages: images
  });
};



const handleSave = () => {
  // 基础验证
  if (!moduleData.value.productName.trim()) {
    message.warning('请输入销售商品名称');
    return;
  }

  if (moduleData.value.bannerImages.length === 0 && moduleData.value.videoFiles.length === 0) {
    message.warning('请至少上传一张Banner图片或一个视频');
    return;
  }

  if (moduleData.value.videoFiles.length > 0 && moduleData.value.videoCoverImages.length === 0) {
    message.warning('上传视频时必须设置视频封面');
    return;
  }

  // 保存逻辑
  console.log('保存Banner配置:', moduleData.value);
  message.success('Banner配置保存成功！');
};

const handleReset = () => {
  updateModuleData({
    productName: '',
    bannerImages: [],
    videoFiles: [],
    videoCoverImages: []
  });
  
  // 清空文件上传组件
  if (videoUploadRef.value) {
    videoUploadRef.value.clearFiles();
  }
  
  message.info('已重置所有配置');
};

const handlePreview = () => {
  if (!hasContent.value) {
    message.warning('暂无内容可预览');
    return;
  }
  
  console.log('预览数据:', moduleData.value);
  message.info('预览功能开发中...');
};
</script>

<style scoped lang="less">
.banner-editor-module {
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

.form-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  &.full-width {
    width: 100%;
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
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}



.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #262626;
  font-size: 14px;

  &.required::after {
    content: ' *';
    color: #ff4d4f;
  }
}

.upload-description {
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
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