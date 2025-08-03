// Header 模块数据类型
export interface HeaderModuleData {
  title: string;
  subtitle: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  timestamp: string;
  isLoggedIn: boolean;
}

export const header = {
  defaultValue: {
    title: 'ModularCraft',
    subtitle: '模块化页面构建系统',
    user: { name: '访客', avatar: '', role: 'guest' },
  },
  processor(globalData: any, updateData: any) {
    const moduleData: HeaderModuleData = {
      title: globalData.title || 'ModularCraft',
      subtitle: globalData.subtitle || '模块化页面构建系统',
      user: globalData.user || { name: '访客', avatar: '', role: 'guest' },
      timestamp: new Date().toLocaleString(),
      isLoggedIn: !!globalData.user?.name && globalData.user.name !== '访客',
    };
    updateData(moduleData);
  },
};
