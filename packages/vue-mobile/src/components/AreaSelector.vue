<template>
  <div class="area-selector">
    <van-field 
      v-model="fieldValue" 
      is-link 
      readonly 
      label="地区" 
      placeholder="请选择所在地区" 
      @click="show = true" 
    /> 
    <van-popup v-model:show="show" round position="bottom"> 
      <van-cascader 
        v-model="cascaderValue" 
        title="请选择所在地区" 
        :options="options" 
        @close="show = false" 
        @change="onChange" 
        @finish="onFinish" 
      /> 
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'

// 定义组件props
interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择所在地区',
  label: '地区'
})

// 定义组件emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: { provinceId: string, cityId: string, areaId: string, provinceName: string, cityName: string, areaName: string }]
}>()

// 响应式数据
const show = ref(false)
const fieldValue = ref(props.modelValue || '')
const cascaderValue = ref('')
const options = ref<any[]>([])

// 模拟API接口
const getProvince = async () => {
  // 模拟异步请求
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { text: '北京市', value: '110000', children: [] },
        { text: '上海市', value: '310000', children: [] },
        { text: '广东省', value: '440000', children: [] },
        { text: '浙江省', value: '330000', children: [] },
        { text: '江苏省', value: '320000', children: [] }
      ])
    }, 300)
  })
}

const getCities = async (provinceId: string) => {
  // 模拟异步请求
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const cityMap: Record<string, any[]> = {
        '110000': [
          { text: '北京市', value: '110100', children: [] }
        ],
        '310000': [
          { text: '上海市', value: '310100', children: [] }
        ],
        '440000': [
          { text: '广州市', value: '440100', children: [] },
          { text: '深圳市', value: '440300', children: [] },
          { text: '珠海市', value: '440400', children: [] }
        ],
        '330000': [
          { text: '杭州市', value: '330100', children: [] },
          { text: '宁波市', value: '330200', children: [] }
        ],
        '320000': [
          { text: '南京市', value: '320100', children: [] },
          { text: '苏州市', value: '320500', children: [] }
        ]
      }
      resolve(cityMap[provinceId] || [])
    }, 300)
  })
}

const getAreas = async (cityId: string) => {
  // 模拟异步请求
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const areaMap: Record<string, any[]> = {
        '110100': [
          { text: '东城区', value: '110101' },
          { text: '西城区', value: '110102' },
          { text: '朝阳区', value: '110105' }
        ],
        '310100': [
          { text: '黄浦区', value: '310101' },
          { text: '徐汇区', value: '310104' },
          { text: '长宁区', value: '310105' }
        ],
        '440100': [
          { text: '荔湾区', value: '440103' },
          { text: '越秀区', value: '440104' },
          { text: '海珠区', value: '440105' }
        ],
        '440300': [
          { text: '罗湖区', value: '440303' },
          { text: '福田区', value: '440304' },
          { text: '南山区', value: '440305' }
        ],
        '330100': [
          { text: '上城区', value: '330102' },
          { text: '下城区', value: '330103' },
          { text: '江干区', value: '330104' }
        ],
        '320100': [
          { text: '玄武区', value: '320102' },
          { text: '秦淮区', value: '320104' },
          { text: '建邺区', value: '320105' }
        ]
      }
      resolve(areaMap[cityId] || [])
    }, 300)
  })
}

// 级联选择器变化事件
const onChange = async ({ value, selectedOptions, tabIndex }: any) => {
  console.log('onChange:', { value, selectedOptions, tabIndex })
  
  if (tabIndex === 0) {
    // 选择省份，加载城市数据
    const provinceId = value
    const cities = await getCities(provinceId)
    
    // 更新省份的children
    const provinceIndex = options.value.findIndex(item => item.value === provinceId)
    if (provinceIndex !== -1) {
      options.value[provinceIndex].children = cities
    }
  } else if (tabIndex === 1) {
    // 选择城市，加载区域数据
    const cityId = value
    const areas = await getAreas(cityId)
    
    // 更新城市的children
    const provinceId = selectedOptions[0].value
    const provinceIndex = options.value.findIndex(item => item.value === provinceId)
    if (provinceIndex !== -1) {
      const cityIndex = options.value[provinceIndex].children.findIndex((item: any) => item.value === cityId)
      if (cityIndex !== -1) {
        options.value[provinceIndex].children[cityIndex].children = areas
      }
    }
  }
}

// 级联选择器完成事件
const onFinish = ({ selectedOptions }: any) => {
  console.log('onFinish:', selectedOptions)
  
  if (selectedOptions.length === 3) {
    const [province, city, area] = selectedOptions
    const displayText = `${province.text}/${city.text}/${area.text}`
    
    fieldValue.value = displayText
    show.value = false
    
    // 发出事件
    emit('update:modelValue', displayText)
    emit('change', {
      provinceId: province.value,
      cityId: city.value,
      areaId: area.value,
      provinceName: province.text,
      cityName: city.text,
      areaName: area.text
    })
  }
}

// 初始化省份数据
const initProvinces = async () => {
  try {
    const provinces = await getProvince()
    options.value = provinces
  } catch (error) {
    console.error('加载省份数据失败:', error)
    showToast('加载省份数据失败')
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  initProvinces()
})
</script>

<style scoped>
.area-selector {
  width: 100%;
}
</style>