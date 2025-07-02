<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      这是一个简单的 Vue 3 + TypeScript + Vite + Vant 项目
    </p>
    <p>
      <button @click="count++" type="button">
        点击次数: {{ count }}
      </button>
    </p>
    <p>
      编辑 <code>src/components/HelloWorld.vue</code> 来测试热重载功能。
    </p>
    <p>
      <a href="https://vitejs.dev/guide/features.html" target="_blank">
        Vite 文档
      </a>
      |
      <a href="https://v3.vuejs.org/" target="_blank">Vue 3 文档</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast, showDialog } from 'vant'

defineProps<{
  msg: string
}>()

const count = ref(0)

const showToast2 = () => {
  showToast('这是一个提示消息')
}

const showDialog2 = () => {
  showDialog({
    title: '提示',
    message: '这是一个对话框示例',
  })
}
</script>

<style scoped>
.hello {
  padding: 20px;
}

h1 {
  color: #42b883;
  margin-bottom: 30px;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
}

button:hover {
  background-color: #369870;
}

code {
  background-color: #f1f1f1;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

a {
  color: #42b883;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>