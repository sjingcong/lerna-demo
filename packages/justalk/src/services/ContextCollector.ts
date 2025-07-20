/**
 * Context Collector
 * 负责收集和整理编辑上下文信息
 */

import {
  ComponentInfo,
  EditContext,
  ProjectContext,
  PageContext,
  SourceMapping
} from '../types/index.js';

export class ContextCollector {
  /**
   * 收集完整的编辑上下文
   */
  public collectEditContext(
    component: ComponentInfo,
    instruction: string,
    projectContext?: Partial<ProjectContext>,
    pageContext?: Partial<PageContext>
  ): EditContext {
    return {
      instruction,
      component: this.enrichComponentInfo(component),
      context: this.buildProjectContext(projectContext),
      pageContext: this.buildPageContext(pageContext),
      timestamp: Date.now()
    };
  }

  /**
   * 丰富组件信息
   */
  private enrichComponentInfo(component: ComponentInfo): ComponentInfo {
    return {
      ...component,
      styles: this.normalizeStyles(component.styles),
      props: this.sanitizeProps(component.props)
    };
  }

  /**
   * 构建项目上下文
   */
  private buildProjectContext(partial?: Partial<ProjectContext>): ProjectContext {
    return {
      framework: partial?.framework || this.detectFramework(),
      componentLibrary: partial?.componentLibrary || this.detectComponentLibrary(),
      styleFramework: partial?.styleFramework || this.detectStyleFramework(),
      projectRoot: partial?.projectRoot || process.cwd()
    };
  }

  /**
   * 构建页面上下文
   */
  private buildPageContext(partial?: Partial<PageContext>): PageContext {
    return {
      url: partial?.url || 'unknown',
      title: partial?.title || 'Unknown Page',
      viewport: partial?.viewport || {
        width: 1920,
        height: 1080
      }
    };
  }

  /**
   * 检测项目框架
   */
  public detectFramework(): string {
    try {
      const packageJson = require(process.cwd() + '/package.json');
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (dependencies.react) return 'React';
      if (dependencies.vue) return 'Vue';
      if (dependencies['@angular/core']) return 'Angular';
      if (dependencies.svelte) return 'Svelte';
      
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * 检测组件库
   */
  public detectComponentLibrary(): string {
    try {
      const packageJson = require(process.cwd() + '/package.json');
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // React生态
      if (dependencies.antd) return 'Ant Design';
      if (dependencies['@mui/material']) return 'Material-UI';
      if (dependencies['react-bootstrap']) return 'React Bootstrap';
      if (dependencies.chakra) return 'Chakra UI';
      
      // Vue生态
      if (dependencies['element-plus']) return 'Element Plus';
      if (dependencies['ant-design-vue']) return 'Ant Design Vue';
      if (dependencies.vuetify) return 'Vuetify';
      if (dependencies.quasar) return 'Quasar';
      
      // Angular生态
      if (dependencies['@angular/material']) return 'Angular Material';
      if (dependencies['ng-bootstrap']) return 'NG Bootstrap';
      
      return 'None';
    } catch {
      return 'None';
    }
  }

  /**
   * 检测样式框架
   */
  public detectStyleFramework(): string {
    try {
      const packageJson = require(process.cwd() + '/package.json');
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (dependencies.tailwindcss) return 'Tailwind CSS';
      if (dependencies['styled-components']) return 'Styled Components';
      if (dependencies['@emotion/react']) return 'Emotion';
      if (dependencies.sass || dependencies['node-sass']) return 'Sass';
      if (dependencies.less) return 'Less';
      if (dependencies.stylus) return 'Stylus';
      
      return 'CSS';
    } catch {
      return 'CSS';
    }
  }

  /**
   * 标准化样式对象
   */
  private normalizeStyles(styles: Record<string, string>): Record<string, string> {
    const normalized: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(styles)) {
      // 转换驼峰命名为kebab-case
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      normalized[kebabKey] = value;
    }
    
    return normalized;
  }

  /**
   * 清理组件属性
   */
  private sanitizeProps(props: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(props)) {
      // 过滤掉函数和复杂对象
      if (typeof value === 'function') {
        sanitized[key] = '[Function]';
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        sanitized[key] = this.sanitizeProps(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'object' ? '[Object]' : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * 验证源码映射信息
   */
  public validateSourceMapping(sourceMap: SourceMapping): boolean {
    return !!(sourceMap.filePath && 
             sourceMap.lineNumber > 0 && 
             sourceMap.columnNumber >= 0);
  }

  /**
   * 生成组件摘要信息
   */
  public generateComponentSummary(component: ComponentInfo): string {
    const propsCount = Object.keys(component.props).length;
    const stylesCount = Object.keys(component.styles).length;
    const childrenCount = component.children?.length || 0;
    
    return `${component.name} (${component.type}) - ${propsCount} props, ${stylesCount} styles, ${childrenCount} children`;
  }

  /**
   * 提取关键样式信息
   */
  public extractKeyStyles(styles: Record<string, string>): Record<string, string> {
    const keyStyles = [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'background', 'background-color', 'color', 'font-size', 'font-family',
      'border', 'border-radius', 'box-shadow', 'transform', 'opacity'
    ];
    
    const extracted: Record<string, string> = {};
    
    for (const key of keyStyles) {
      if (styles[key]) {
        extracted[key] = styles[key];
      }
    }
    
    return extracted;
  }
}