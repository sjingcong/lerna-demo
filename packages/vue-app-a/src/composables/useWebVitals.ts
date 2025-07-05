import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { ref, readonly } from 'vue';

export function useWebVitals() {
  const metrics = ref({
    cls: 0,
    fcp: 0,
    inp: 0,  // 注意：web-vitals v4+ 使用 INP 替代了 FID
    lcp: 0,
    ttfb: 0
  });

  const initWebVitals = () => {
    onCLS((metric) => {
      metrics.value.cls = metric.value;
      console.log('CLS:', metric);
    });

    onFCP((metric) => {
      metrics.value.fcp = metric.value;
      console.log('FCP:', metric);
    });

    onINP((metric) => {
      metrics.value.inp = metric.value;
      console.log('INP:', metric);
    });

    onLCP((metric) => {
      metrics.value.lcp = metric.value;
      console.log('LCP:', metric);
    });

    onTTFB((metric) => {
      metrics.value.ttfb = metric.value;
      console.log('TTFB:', metric);
    });
  };

  return {
    metrics: readonly(metrics),
    initWebVitals
  };
}