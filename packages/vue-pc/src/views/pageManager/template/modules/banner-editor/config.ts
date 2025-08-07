import type { UploadFile } from 'ant-design-vue';

// Banner编辑器模块数据类型
export interface BannerEditorModuleData {
  productName: string;           // 销售商品名称
  bannerImages: ImageItem[];     // Banner图片列表
  videoFiles: UploadFile[];      // 视频文件列表
  videoCoverImages: ImageItem[]; // 视频封面列表
}

// 图片数据类型
export interface ImageItem {
  url: string;    // 图片URL
  ratio: number;  // 宽高比
  [key: string]: any;
}

export const bannerEditor = {
  defaultValue: {
    productName: '',
    bannerImages: [],
    videoFiles: [],
    videoCoverImages: []
  },
  processor(globalData: any, updateData: any) {
    // 从全局数据中获取Banner编辑器的数据
    const moduleData: BannerEditorModuleData = {
      productName: globalData?.bannerEditor?.productName || '',
      bannerImages: globalData?.bannerEditor?.bannerImages || [],
      videoFiles: globalData?.bannerEditor?.videoFiles || [],
      videoCoverImages: globalData?.bannerEditor?.videoCoverImages || []
    };
    
    // 更新模块数据
    updateData(moduleData);
  },
};

export default bannerEditor;