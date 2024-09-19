<template>
  <div class="hello-world" :class="{ 'fade-in': showContent, 'fade-out': !showContent }">
    <h1>Note.ts</h1>
    <p class="subtitle">基于 Vue 3 和 TypeScript 的在线笔记应用</p>
    <div class="card">
      <div class="input-container">
        <input v-model="roomNumber" type="text" placeholder="房间号" />
        <span class="separator">-</span>
        <input v-model="password" type="password" placeholder="密码" />
      </div>
      <button type="button" @click="handleButtonClick">进入</button>
    </div>

    <p class="read-the-docs"><a href="https://github.com/ChisatoNishikigi73/note-vue">Github</a></p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const roomNumber = ref('')
const password = ref('')
const showContent = ref(false)

const enterRoom = () => {
  showContent.value = false
  setTimeout(() => {
    console.log('房间号:', roomNumber.value, '密码:', password.value)
    router.push({ name: 'Room', params: { id: roomNumber.value } })
  }, 500) // 等待淡出动画完成
}

// 添加新的函数来处理按钮点击效果
const handleButtonClick = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLButtonElement
  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  button.style.setProperty('--x', `${x}px`)
  button.style.setProperty('--y', `${y}px`)
  button.classList.add('pulse')

  button.addEventListener('animationend', () => {
    button.classList.remove('pulse')
  }, { once: true })

  enterRoom()
}

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 100)
})

onBeforeUnmount(() => {
  showContent.value = false
})
</script>

<style scoped>
.hello-world {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.hello-world.fade-in {
  opacity: 1;
}

.hello-world.fade-out {
  opacity: 0;
}

.card {
  padding: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1.5em;
}

.separator {
  font-size: 1.2em;
  color: #ffffff;
}

input, button {
  padding: 0.8em 1em;
  font-size: 1em;
  font-weight: 400;
  font-family: inherit;
  background-color: #333333;
  border: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: #ffffff;
  width: 150px;
  text-align: center;
}

input::placeholder {
  color: #999999;
  transition: opacity 0.3s ease;
}

input:hover, input:focus, button:hover, button:focus {
  background-color: #444444;
}

input:focus, button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}

button {
  background-color: #1a1a1a;
  cursor: pointer;
  font-weight: 500;
  padding: 0.6em 2em;
  width: 120px;
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: var(--y);
  left: var(--x);
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
  opacity: 1;
  transition: transform 0.5s, opacity 0.5s;
}

button.pulse::after {
  animation: pulse 0.5s ease-out;
}

@keyframes pulse {
  to {
    transform: scale(20);
    opacity: 0;
  }
}

.read-the-docs {
  margin-top: 2em;
}

.read-the-docs a {
  color: #cccccc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.read-the-docs a:hover {
  color: #ffffff;
}

h1 {
  color: #ffffff;
  margin-bottom: 0.2em;  /* 减小底部边距 */
  font-size: 3.2em;
  line-height: 1.1;
}

.subtitle {
  color: #cccccc;
  font-size: 1em;
  margin-top: 0;
  margin-bottom: 2em;  /* 增加与下方内容的间距 */
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}
</style>
