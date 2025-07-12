import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export interface WebVitalsOptions {
  /** 是否在控制台输出性能指标，默认为 false */
  enableLogging?: boolean;
  /** 自定义回调函数，当指标更新时触发 */
  onMetricUpdate?: (metricName: string, metric: any) => void;
}

export interface WebVitalsMetrics {
  cls: number;
  fcp: number;
  inp: number;
  lcp: number;
  ttfb: number;
}

// 创建并自动初始化 Web Vitals 监控

const metrics: WebVitalsMetrics = {
  cls: 0,
  fcp: 0,
  inp: 0,  // 注意：web-vitals v4+ 使用 INP 替代了 FID
  lcp: 0,
  ttfb: 0
};

let isInitialized = false;


const init = () => {
  if (isInitialized) return;

  // 检查是否在浏览器环境
  if (typeof window === 'undefined') {
    console.warn('initWebVitals: Web Vitals can only be measured in browser environment');
    return;
  }

  try {
    onCLS((metric) => {
      metrics.cls = metric.value;
      console.log('CLS:', metric);

    });

    onFCP((metric) => {
      metrics.fcp = metric.value;
      console.log('FCP:', metric);

    });

    onINP((metric) => {
      metrics.inp = metric.value;
      console.log('INP:', metric);

    });

    onLCP((metric) => {
      metrics.lcp = metric.value;
      console.log('LCP:', metric);
    });

    onTTFB((metric) => {
      metrics.ttfb = metric.value;
      console.log('TTFB:', metric);
    });

    isInitialized = true;
  } catch (error) {
    console.error('initWebVitals: Failed to initialize Web Vitals:', error);
  }
};



// 自动初始化
init();
