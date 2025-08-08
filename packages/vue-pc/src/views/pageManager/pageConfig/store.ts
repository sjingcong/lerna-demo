import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getPageConfigDetail, getChannelList, getSalesProductList } from './api';

// 页面状态类型
export type PageStatus = 'add' | 'edit' | 'preview';

// 表单数据类型
export interface FormData {
  channelAttribution: string;
  salesProduct: string;
  effectiveDate: string;
  description: string;
  selectedTemplate: string;
}

// 选项数据类型
export interface OptionItem {
  label: string;
  value: string;
}

// 页面配置Store
export const usePageConfigStore = defineStore('pageConfig', () => {
  // 页面状态
  const pageStatus = ref<PageStatus>('add');
  
  // 配置ID
  const configId = ref<string>('');
  
  // 表单数据
  const formData = ref<FormData>({
    channelAttribution: '',
    salesProduct: '',
    effectiveDate: '',
    description: '',
    selectedTemplate: ''
  });
  
  // 初始数据（用于重置）
  const initialData = ref<FormData>({
    channelAttribution: '',
    salesProduct: '',
    effectiveDate: '',
    description: '',
    selectedTemplate: ''
  });
  
  // 选项数据
  const channelOptions = ref<OptionItem[]>([]);
  const salesProductOptions = ref<OptionItem[]>([]);
  
  // 加载状态
  const loading = ref(false);
  const optionsLoading = ref(false);
  
  // 计算属性
  const isEditMode = computed(() => pageStatus.value === 'edit');
  const isPreviewMode = computed(() => pageStatus.value === 'preview');
  const isAddMode = computed(() => pageStatus.value === 'add');
  const hasConfigId = computed(() => !!configId.value);
  
  // 设置页面状态
  const setPageStatus = (status: PageStatus) => {
    pageStatus.value = status;
  };
  
  // 设置配置ID
  const setConfigId = (id: string) => {
    configId.value = id;
  };
  

  
  // 重置表单数据
  const resetFormData = () => {
    formData.value = { ...initialData.value };
  };
  
  // 设置初始数据
  const setInitialData = (data: FormData) => {
    initialData.value = { ...data };
    formData.value = { ...data };
  };
  
  // 加载渠道选项
  const loadChannelOptions = async () => {
    try {
      optionsLoading.value = true;
      const response = await getChannelList();
      channelOptions.value = response || [];
      console.log('渠道选项加载完成:', channelOptions.value);
    } catch (error) {
      console.error('加载渠道选项失败:', error);
      channelOptions.value = [];
    } finally {
      optionsLoading.value = false;
    }
  };
  
  // 加载销售商品选项
  const loadSalesProductOptions = async (channelAttribution: string) => {
    try {
      optionsLoading.value = true;
      const response = await getSalesProductList(channelAttribution);
      salesProductOptions.value = response || [];
      console.log('销售商品选项加载完成:', salesProductOptions.value);
    } catch (error) {
      console.error('加载销售商品选项失败:', error);
      salesProductOptions.value = [];
    } finally {
      optionsLoading.value = false;
    }
  };
  
  // 加载配置详情
  const loadConfigDetail = async (id: string) => {
    try {
      loading.value = true;
      const response = await getPageConfigDetail(id);
      if (response) {
        setInitialData(response);
        console.log('配置详情加载完成:', response);
        return response;
      }
      throw new Error('获取配置详情失败');
    } catch (error) {
      console.error('加载配置详情失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  
  // 初始化页面数据
  const initPageData = async (urlParams: { id?: string; mode?: string }) => {
    try {
      loading.value = true;
      
      // 根据URL参数判断页面状态
      if (urlParams.id) {
        if (urlParams.mode === 'preview') {
          setPageStatus('preview');
        } else {
          setPageStatus('edit');
        }
        setConfigId(urlParams.id);
        
        // 加载配置详情
        await loadConfigDetail(urlParams.id);
      } else {
        setPageStatus('add');
        setConfigId('');
        resetFormData();
      }
      
      // 加载渠道选项
      await loadChannelOptions();
      
      // 如果是编辑/预览模式且有渠道归属，加载对应的销售商品选项
      if ((isEditMode.value || isPreviewMode.value) && formData.value.channelAttribution) {
        await loadSalesProductOptions(formData.value.channelAttribution);
      }
      
      console.log('页面数据初始化完成', {
        status: pageStatus.value,
        configId: configId.value,
        formData: formData.value
      });
    } catch (error) {
      console.error('页面数据初始化失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  

  
  // 清空所有数据
  const clearAllData = () => {
    pageStatus.value = 'add';
    configId.value = '';
    formData.value = {
      channelAttribution: '',
      salesProduct: '',
      effectiveDate: '',
      description: '',
      selectedTemplate: ''
    };
    initialData.value = {
      channelAttribution: '',
      salesProduct: '',
      effectiveDate: '',
      description: '',
      selectedTemplate: ''
    };
    channelOptions.value = [];
    salesProductOptions.value = [];
    loading.value = false;
    optionsLoading.value = false;
  };
  
  return {
    // 状态
    pageStatus,
    configId,
    formData,
    initialData,
    channelOptions,
    salesProductOptions,
    loading,
    optionsLoading,
    
    // 计算属性
    isEditMode,
    isPreviewMode,
    isAddMode,
    hasConfigId,
    
    // 方法
    setPageStatus,
    setConfigId,
    resetFormData,
    setInitialData,
    loadChannelOptions,
    loadSalesProductOptions,
    loadConfigDetail,
    initPageData,
    clearAllData
  };
});