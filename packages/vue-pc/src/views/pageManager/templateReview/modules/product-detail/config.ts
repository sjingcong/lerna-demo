// 产品详情模块数据类型
export interface ProductModuleData {
  content: string; // Quill富文本内容（HTML格式）
}

export const product = {
  defaultValue: {
    content: '',
  },
  processor(globalData: any, updateData: any) {
    const moduleData: ProductModuleData = {
      content: `
        <h2>产品特色</h2>
        <p>这是一款创新的产品，具有以下特点：</p>
        <ul>
          <li><strong>高性能</strong>：采用最新技术，性能卓越</li>
          <li><strong>易使用</strong>：简洁的界面设计，操作便捷</li>
          <li><strong>安全可靠</strong>：多重安全保障，数据安全</li>
        </ul>
        <h3>技术规格</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr>
            <td><strong>处理器</strong></td>
            <td>高性能芯片</td>
          </tr>
          <tr>
            <td><strong>内存</strong></td>
            <td>8GB RAM</td>
          </tr>
          <tr>
            <td><strong>存储</strong></td>
            <td>256GB SSD</td>
          </tr>
        </table>
        <p><em>注：以上规格仅供参考，实际配置可能有所不同。</em></p>
      `,
    };
    updateData(moduleData);
  },
};

export default product;
