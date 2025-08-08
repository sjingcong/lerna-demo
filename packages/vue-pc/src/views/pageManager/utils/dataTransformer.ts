/**
 * 数据转换工具
 * 将templateEdit的模块数据转换为templateReview需要的格式
 */

// 转换器接口
interface DataTransformer {
  transform(editData: any): any;
}

// Banner数据转换器
class BannerTransformer implements DataTransformer {
  transform(editData: any): any {
    const bannerEditData = editData['banner-editor'];
    if (!bannerEditData) return null;

    const banners: any[] = [];

    // 转换Banner图片
    if (bannerEditData.bannerImages && Array.isArray(bannerEditData.bannerImages)) {
      bannerEditData.bannerImages.forEach((img: any) => {
        if (img && img.url) {
          banners.push({
            type: 'image',
            image: img.url,
            link: img.link || ''
          });
        }
      });
    }

    // 转换视频文件
    if (bannerEditData.videoFiles && Array.isArray(bannerEditData.videoFiles)) {
      bannerEditData.videoFiles.forEach((video: any, index: number) => {
        if (video) {
          const videoUrl = video.url || video.response?.url || '';
          if (videoUrl) {
            const videoCover = bannerEditData.videoCoverImages?.[index];
            banners.push({
              type: 'video',
              video: videoUrl,
              poster: videoCover?.url || '',
              link: video.link || ''
            });
          }
        }
      });
    }

    // 如果没有任何banner数据，提供默认数据
    if (banners.length === 0) {
      banners.push({
        type: 'image',
        image: 'https://via.placeholder.com/800x400?text=默认Banner图片',
        link: ''
      });
    }

    return { banner: { banners } };
  }
}

// 产品详情数据转换器
class ProductDetailTransformer implements DataTransformer {
  transform(editData: any): any {
    const tabDetailData = editData['tab-detail'];
    if (!tabDetailData) return null;

    let productContent = '';

    // 如果有多个tab，合并所有内容
    if (tabDetailData.tabs && Array.isArray(tabDetailData.tabs)) {
      tabDetailData.tabs.forEach((tab: any, index: number) => {
        if (tab && tab.content) {
          if (index > 0) {
            productContent += '<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">';
          }
          if (tab.title) {
            productContent += `<h3 style="color: #333; margin: 16px 0 12px 0;">${tab.title}</h3>`;
          }
          productContent += tab.content;
        }
      });
    }

    // 如果没有内容，提供默认内容
    if (!productContent.trim()) {
      productContent = `
        <div style="text-align: center; padding: 40px 20px; color: #666;">
          <h2 style="color: #333; margin-bottom: 16px;">产品详情</h2>
          <p>暂无产品详情内容，请在编辑页面添加相关信息。</p>
          <div style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px;">💡 提示：您可以在Tab详情配置模块中添加产品介绍、特色功能等内容</p>
          </div>
        </div>
      `;
    }

    return { 'product-detail': { content: productContent } };
  }
}

// 理赔流程数据转换器
class ClaimProcessTransformer implements DataTransformer {
  transform(editData: any): any {
    const insurancePlanData = editData['insurance-plan'];
    if (!insurancePlanData) return null;

    let claimContent = '<div style="padding: 20px;"><h2 style="color: #333; margin-bottom: 20px;">理赔流程指南</h2>';
    
    if (insurancePlanData.title && insurancePlanData.title.trim()) {
      claimContent += `<h3 style="color: #1890ff; margin: 16px 0 12px 0;">${insurancePlanData.title}</h3>`;
    }

    if (insurancePlanData.plans && Array.isArray(insurancePlanData.plans) && insurancePlanData.plans.length > 0) {
      claimContent += '<div class="insurance-plans" style="margin: 20px 0;"><ul style="list-style: none; padding: 0;">';
      insurancePlanData.plans.forEach((plan: any, index: number) => {
        if (plan && plan.name && plan.content) {
          claimContent += `
            <li style="margin: 12px 0; padding: 16px; background: #f8f9fa; border-left: 4px solid #1890ff; border-radius: 4px;">
              <strong style="color: #333; font-size: 16px;">${index + 1}. ${plan.name}</strong>
              <div style="margin-top: 8px; color: #666; line-height: 1.6;">${plan.content}</div>
            </li>
          `;
        }
      });
      claimContent += '</ul></div>';
    } else {
      claimContent += `
        <div style="margin: 20px 0; padding: 20px; background: #f0f8ff; border-radius: 8px; border: 1px solid #d6e4ff;">
          <p style="margin: 0 0 16px 0; color: #666;">暂无保障方案信息，以下是标准理赔流程：</p>
          <ul style="margin: 0; padding-left: 20px; color: #333;">
            <li style="margin: 8px 0;"><strong>第一步</strong>：及时报案，在事故发生后24小时内联系我们</li>
            <li style="margin: 8px 0;"><strong>第二步</strong>：准备理赔材料，包括保单、身份证明、事故证明等</li>
            <li style="margin: 8px 0;"><strong>第三步</strong>：提交理赔申请，通过线上或线下渠道提交完整材料</li>
            <li style="margin: 8px 0;"><strong>第四步</strong>：配合调查，如需现场查勘请积极配合</li>
            <li style="margin: 8px 0;"><strong>第五步</strong>：等待审核结果，我们将在规定时间内完成审核</li>
          </ul>
        </div>
      `;
    }

    claimContent += '</div>';

    return { 'claim-process': { content: claimContent } };
  }
}

// 主数据转换器
export class ModuleDataTransformer {
  private transformers: DataTransformer[] = [
    new BannerTransformer(),
    new ProductDetailTransformer(),
    new ClaimProcessTransformer()
  ];

  /**
   * 转换模块数据
   * @param editData templateEdit的模块数据
   * @returns templateReview需要的数据格式
   */
  transform(editData: any): any {
    const transformedData: any = {};

    try {
      // 应用所有转换器
      this.transformers.forEach(transformer => {
        const result = transformer.transform(editData);
        if (result) {
          Object.assign(transformedData, result);
        }
      });

      // 记录转换结果
      console.log('🔄 数据转换完成:', {
        input: editData,
        output: transformedData,
        timestamp: new Date().toISOString()
      });

      return transformedData;

    } catch (error) {
      console.error('❌ 数据转换过程中发生错误:', error);
      
      // 提供默认的转换数据
      return this.getDefaultTransformedData();
    }
  }

  /**
   * 获取默认转换数据
   */
  private getDefaultTransformedData(): any {
    return {
      banner: {
        banners: [{
          type: 'image',
          image: 'https://via.placeholder.com/800x400?text=默认Banner',
          link: ''
        }]
      },
      'product-detail': {
        content: `
          <div style="text-align: center; padding: 40px 20px; color: #666;">
            <h2 style="color: #333;">产品详情</h2>
            <p>数据转换失败，请检查编辑页面的数据格式。</p>
          </div>
        `
      },
      'claim-process': {
        content: `
          <div style="padding: 20px;">
            <h2 style="color: #333;">理赔流程</h2>
            <p style="color: #666;">数据转换失败，请检查编辑页面的数据格式。</p>
          </div>
        `
      }
    };
  }

  /**
   * 验证输入数据
   */
  validateInputData(data: any): boolean {
    if (!data || typeof data !== 'object') {
      console.warn('⚠️ 输入数据无效:', data);
      return false;
    }
    return true;
  }

  /**
   * 获取转换统计信息
   */
  getTransformStats(editData: any, transformedData: any): any {
    const stats = {
      inputModules: Object.keys(editData || {}).length,
      outputModules: Object.keys(transformedData || {}).length,
      transformedModules: [] as string[],
      skippedModules: [] as string[]
    };

    // 统计转换的模块
    if (editData) {
      Object.keys(editData).forEach(key => {
        const mappedKey = this.getOutputModuleKey(key);
        if (mappedKey && transformedData[mappedKey]) {
          stats.transformedModules.push(`${key} → ${mappedKey}`);
        } else {
          stats.skippedModules.push(key);
        }
      });
    }

    return stats;
  }

  /**
   * 获取输出模块键名映射
   */
  private getOutputModuleKey(inputKey: string): string | null {
    const mapping: Record<string, string> = {
      'banner-editor': 'banner',
      'tab-detail': 'product-detail',
      'insurance-plan': 'claim-process'
    };
    return mapping[inputKey] || null;
  }
}

// 导出单例实例
export const moduleDataTransformer = new ModuleDataTransformer();