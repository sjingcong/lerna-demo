// Banner 模块数据类型
export interface BannerModuleData {
  banners: {
    type: 'image' | 'video'; // 媒体类型：图片或视频
    image?: string; // 图片URL（type为image时使用）
    video?: string; // 视频URL（type为video时使用）
    poster?: string; // 视频封面图（type为video时使用）
    link?: string;
  }[];
}

export const banner = {
  defaultValue: {
    banners: [],
  },
  processor(globalData: any, updateData: any) {
    const moduleData: BannerModuleData = {
      banners: [
        {
          type: 'image',
          image:
            'https://cdn.pixabay.com/photo/2022/08/28/01/34/studio-ghibli-7415572_1280.jpg',
        },
        {
          type: 'image',
          image:
            'https://cdn.pixabay.com/photo/2022/08/28/01/33/wallpaper-7415568_1280.jpg',
        },
        {
          type: 'video',
          video:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          poster:
            'https://cdn.pixabay.com/photo/2022/10/07/15/57/mushrooms-7505404_640.jpg',
        },
      ],
    };
    updateData(moduleData);
  },
};
export default banner;
