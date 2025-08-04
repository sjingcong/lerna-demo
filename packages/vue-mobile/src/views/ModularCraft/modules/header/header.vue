<template>
  <div class="header-module">
    <div class="header-content">
      <div class="title-section">
        <h2>{{ moduleData.title }}</h2>
        <p class="subtitle">{{ moduleData.subtitle }}</p>
      </div>

      <div class="user-section">
        <div
          v-if="moduleData.isLoggedIn"
          class="user-info"
        >
          <img
            :src="moduleData.user.avatar"
            :alt="moduleData.user.name"
            class="user-avatar"
          />
          <div class="user-details">
            <span class="user-name">{{ moduleData.user.name }}</span>
            <span class="user-role">
              {{ getRoleText(moduleData.user.role) }}
            </span>
          </div>
          <button
            @click="logout"
            class="btn btn-logout"
          >
            退出
          </button>
        </div>
        <div
          v-else
          class="guest-info"
        >
          <span>欢迎访客</span>
          <button
            @click="login"
            class="btn btn-login"
          >
            登录
          </button>
          <button
            @click="testLoading"
            class="btn btn-test"
          >
            测试Loading
          </button>
        </div>
      </div>
    </div>

    <div class="header-meta">
      <span class="timestamp">最后更新: {{ moduleData.timestamp }}</span>
      <span class="module-id">模块: header</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useModuleData, useEvent } from '../../core';
  import { usePageStore } from '../../examples/store';
  import { HeaderModuleData } from './config';
  const pageStore = usePageStore();
  // 使用模块数据 - 现在有精确的类型推断
  const { data: moduleData, update } = useModuleData<HeaderModuleData>(
    pageStore,
    'header'
  );

  // 使用事件系统
  const { emit } = useEvent();

  // 获取角色文本
  const getRoleText = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: '管理员',
      user: '用户',
      guest: '访客',
    };
    return roleMap[role] || '未知';
  };

  // 登录
  const login = () => {
    const newData = {
      user: {
        name: '新用户',
        avatar: 'https://via.placeholder.com/40/00ff00',
        role: 'user',
      },
    };
    update(newData);
  };

  // 退出登录
  const logout = () => {
    const newData = {
      user: {
        name: '访客',
        avatar: '',
        role: 'guest',
      },
    };
    update(newData);
  };

  // 测试Loading功能
  const testLoading = () => {
    // 开始loading
    pageStore.startLoading();
    
    // 模拟异步操作，3秒后停止loading
    setTimeout(() => {
      pageStore.stopLoading();
    }, 3000);
  };
</script>

<style scoped>
  .header-module {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .title-section h2 {
    margin: 0 0 5px 0;
    font-size: 28px;
    font-weight: 600;
  }

  .subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 16px;
  }

  .user-section {
    display: flex;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 600;
    font-size: 16px;
  }

  .user-role {
    font-size: 12px;
    opacity: 0.8;
  }

  .guest-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;
  }

  .btn-login {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .btn-login:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .btn-logout {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .btn-logout:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .btn-test {
    background-color: rgba(52, 152, 219, 0.8);
    color: white;
    border: 1px solid rgba(52, 152, 219, 0.9);
  }

  .btn-test:hover {
    background-color: rgba(52, 152, 219, 1);
  }

  .header-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    opacity: 0.7;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 10px;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }

    .title-section h2 {
      font-size: 24px;
    }
  }
</style>
