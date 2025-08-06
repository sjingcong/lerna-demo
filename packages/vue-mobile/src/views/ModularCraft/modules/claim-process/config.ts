// 产品详情模块数据类型
export interface ProductModuleData {
  content: string; // Quill富文本内容（HTML格式）
}

export const claimProcess = {
  defaultValue: {
    content: '',
  },
  processor(globalData: any, updateData: any) {
    const moduleData: ProductModuleData = {
      content: `
        <h2>理赔流程指南</h2>
        <p>为了确保您的理赔申请能够快速、顺利地处理，请按照以下流程操作：</p>
        <ul>
          <li><strong>第一步</strong>：及时报案，在事故发生后24小时内联系我们</li>
          <li><strong>第二步</strong>：准备理赔材料，包括保单、身份证明、事故证明等</li>
          <li><strong>第三步</strong>：提交理赔申请，通过线上或线下渠道提交完整材料</li>
          <li><strong>第四步</strong>：配合调查，如需现场查勘请积极配合</li>
          <li><strong>第五步</strong>：等待审核结果，我们将在规定时间内完成审核</li>
        </ul>
        <h3>理赔时效说明</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr>
            <td><strong>理赔类型</strong></td>
            <td><strong>处理时效</strong></td>
          </tr>
          <tr>
            <td>简单案件</td>
            <td>3-5个工作日</td>
          </tr>
          <tr>
            <td>复杂案件</td>
            <td>10-15个工作日</td>
          </tr>
          <tr>
            <td>重大案件</td>
            <td>30个工作日内</td>
          </tr>
        </table>
        <p><em>注：具体处理时间可能因案件复杂程度而有所差异，我们会及时与您沟通进展情况。</em></p>
      `,
    };
    updateData(moduleData);
  },
};

export default claimProcess;
