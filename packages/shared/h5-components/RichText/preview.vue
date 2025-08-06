<template>
  <div class="rich-text-preview">
    <div 
      class="rich-text-content"
      v-html="content"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    /** 富文本内容，支持HTML格式 */
    content?: string;
    /** 是否显示边框 */
    bordered?: boolean;
    /** 自定义样式类名 */
    customClass?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    content: '',
    bordered: false,
    customClass: ''
  });

  // 计算样式类
  const containerClass = computed(() => {
    const classes = ['rich-text-preview'];
    if (props.bordered) {
      classes.push('rich-text-preview--bordered');
    }
    if (props.customClass) {
      classes.push(props.customClass);
    }
    return classes.join(' ');
  });
</script>

<style scoped lang="less">
  .rich-text-preview {
    width: 100%;
    
    &--bordered {
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 12px;
    }

    .rich-text-content {
      line-height: 1.6;
      color: #303133;
      word-wrap: break-word;
      word-break: break-all;

      // 标题样式
      :deep(h1),
      :deep(h2),
      :deep(h3),
      :deep(h4),
      :deep(h5),
      :deep(h6) {
        margin: 16px 0 12px 0;
        font-weight: 600;
        line-height: 1.4;
      }

      :deep(h1) {
        font-size: 24px;
        color: #1f2329;
      }
      
      :deep(h2) {
        font-size: 20px;
        color: #1f2329;
      }
      
      :deep(h3) {
        font-size: 18px;
        color: #1f2329;
      }
      
      :deep(h4) {
        font-size: 16px;
        color: #1f2329;
      }
      
      :deep(h5) {
        font-size: 14px;
        color: #1f2329;
      }
      
      :deep(h6) {
        font-size: 12px;
        color: #1f2329;
      }

      // 段落样式
      :deep(p) {
        margin: 8px 0;
        line-height: 1.6;
      }

      // 列表样式
      :deep(ul),
      :deep(ol) {
        margin: 12px 0;
        padding-left: 20px;

        li {
          margin: 4px 0;
          line-height: 1.5;
        }
      }

      // 表格样式
      :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        font-size: 14px;

        th,
        td {
          padding: 8px 12px;
          border: 1px solid #e4e7ed;
          text-align: left;
        }

        th {
          background-color: #f5f7fa;
          font-weight: 600;
          color: #1f2329;
        }

        tr:nth-child(even) {
          background-color: #fafafa;
        }
      }

      // 引用样式
      :deep(blockquote) {
        margin: 16px 0;
        padding: 12px 16px;
        background-color: #f5f7fa;
        border-left: 4px solid #409eff;
        font-style: italic;
        color: #606266;
      }

      // 代码样式
      :deep(code) {
        padding: 2px 4px;
        background-color: #f5f7fa;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        color: #e6a23c;
      }

      :deep(pre) {
        margin: 16px 0;
        padding: 12px;
        background-color: #f5f5f5;
        border-radius: 4px;
        overflow-x: auto;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.4;

        code {
          padding: 0;
          background: none;
          color: #303133;
        }
      }

      // 图片样式
      :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin: 8px 0;
        display: block;
      }

      // 链接样式
      :deep(a) {
        color: #409eff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      // 强调样式
      :deep(strong) {
        font-weight: 600;
        color: #1f2329;
      }

      :deep(em) {
        font-style: italic;
        color: #606266;
      }

      // 分割线样式
      :deep(hr) {
        margin: 20px 0;
        border: none;
        border-top: 1px solid #e4e7ed;
      }

      // Quill特定样式
      :deep(.ql-align-center) {
        text-align: center;
      }

      :deep(.ql-align-right) {
        text-align: right;
      }

      :deep(.ql-align-justify) {
        text-align: justify;
      }

      :deep(.ql-indent-1) {
        padding-left: 3em;
      }

      :deep(.ql-indent-2) {
        padding-left: 6em;
      }

      :deep(.ql-indent-3) {
        padding-left: 9em;
      }

      :deep(.ql-font-serif) {
        font-family: Georgia, Times New Roman, serif;
      }

      :deep(.ql-font-monospace) {
        font-family: Monaco, Courier New, monospace;
      }

      :deep(.ql-size-small) {
        font-size: 0.75em;
      }

      :deep(.ql-size-large) {
        font-size: 1.5em;
      }

      :deep(.ql-size-huge) {
        font-size: 2.5em;
      }
    }
  }

  // 移动端适配
  @media (max-width: 768px) {
    .rich-text-preview {
      &--bordered {
        padding: 8px;
      }

      .rich-text-content {
        :deep(h1) {
          font-size: 20px;
        }
        
        :deep(h2) {
          font-size: 18px;
        }
        
        :deep(h3) {
          font-size: 16px;
        }
        
        :deep(table) {
          font-size: 12px;

          th,
          td {
            padding: 6px 8px;
          }
        }
      }
    }
  }
</style>