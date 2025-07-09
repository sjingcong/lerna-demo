import inquirer from 'inquirer';
import { spawn } from 'child_process';
import path from 'path';

// 项目配置
const projects = [
  {
    name: 'Vue-pc',
    value: 'vue-pc',
    script: 'vue-pc',
    description: '运行 pc 端 vue'
  },
  {
    name: 'vue-mobile',
    value: 'vue-mobile',
    script: 'vue-mobile',
    description: '运行 h5 端 vue'
  }
];

async function selectProject() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'project',
        message: '请选择要运行的项目:',
        choices: projects.map(project => ({
          name: `${project.name} - ${project.description}`,
          value: project.value
        })),
        pageSize: 10
      }
    ]);

    const selectedProject = projects.find(p => p.value === answers.project);
    
    if (selectedProject) {
      console.log(`\n🚀 启动项目: ${selectedProject.name}`);
      console.log(`📝 执行命令: npm run ${selectedProject.script}\n`);
      
      // 执行对应的npm脚本
      const child = spawn('npm', ['run', selectedProject.script], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
      });

      child.on('error', (error) => {
        console.error(`❌ 执行错误: ${error.message}`);
        process.exit(1);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ 进程退出，退出码: ${code}`);
          process.exit(code);
        }
      });
    }
  } catch (error) {
    if (error.isTtyError) {
      console.error('❌ 当前环境不支持交互式界面');
    } else {
      console.error('❌ 发生错误:', error.message);
    }
    process.exit(1);
  }
}

// 显示欢迎信息
console.log('\n🎯 项目开发环境启动器');
console.log('=' .repeat(30));

// 启动选择器
selectProject();