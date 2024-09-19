<template>
  <div class="room" :class="{ 'fade-in': showRoom }">
    <header class="toolbar">
      <div class="room-id">房间号: {{ $route.params.id }}</div>
      <button @click="createNote" class="create-note-btn">创建便利贴</button>
    </header>
    <div class="notes-container">
      <!-- <div class="debug-info">容器大小: {{ containerSize.width }}x{{ containerSize.height }}</div> -->
      
      <Note 
        v-for="note in notes" 
        :key="note.id"
        :content="note.content" 
        :id="note.id" 
        :initial-position="note.position"
        @update="updateNote" 
        @delete="deleteNote"
        @position-change="updateNotePosition"
        @size-change="updateNoteSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Note from './note/Note.vue'

const route = useRoute()
const notes = ref<{ id: number; content: string; position: { x: number; y: number } }[]>([])
const showRoom = ref(false)

const containerSize = ref({ width: 0, height: 0 })

const createNote = () => {
  const container = document.querySelector('.notes-container');
  const maxX = container ? container.clientWidth - 200 : 300; // 假设便利贴初始宽度为200
  const maxY = container ? container.clientHeight - 150 : 300; // 假设便利贴初始高度为150
  const newNote = {
    id: Date.now(),
    content: '哦咪咪超级大便利贴',
    position: { x: Math.random() * maxX, y: Math.random() * maxY }
  }
  notes.value.push(newNote)
}

const updateNote = (id: number, content: string) => {
  const note = notes.value.find(n => n.id === id)
  if (note) note.content = content
}

const deleteNote = (id: number) => {
  notes.value = notes.value.filter(n => n.id !== id)
}

const updateNotePosition = (id: number, position: { x: number; y: number }) => {
  const note = notes.value.find(n => n.id === id)
  if (note) note.position = position
}

const updateNoteSize = (id: number, size: { width: number; height: number }) => {
  const note = notes.value.find(n => n.id === id)
  if (note) {
    note.size = size
  }
}

const updateContainerSize = () => {
  const container = document.querySelector('.notes-container')
  if (container) {
    containerSize.value = {
      width: container.clientWidth,
      height: container.clientHeight
    }
  }
}

onMounted(() => {
  updateContainerSize()
  window.addEventListener('resize', updateContainerSize)
  
  // 添加淡入效果
  setTimeout(() => {
    showRoom.value = true
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize)
})
</script>

<style scoped>
.room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.room.fade-in {
  opacity: 1;
}

.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem; /* 减小上下内边距 */
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  z-index: 1000;
  height: 40px; /* 减小高度 */
}

.notes-container {
  flex: 1;
  position: absolute;
  top: 40px; /* 调整顶部位置以匹配新的 toolbar 高度 */
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  overflow: auto;
  /* background-color: rgba(255, 0, 0, 0.1); */
}

.room-id {
  font-size: 0.8em; /* 稍微减小字体大小 */
  color: #888;
}

.create-note-btn {
  background-color: #646cff;
  color: white;
  border: none;
  padding: 0.3em 0.8em; /* 减小按钮内边距 */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9em; /* 稍微减小字体大小 */
}

.create-note-btn:hover {
  background-color: #535bf2;
}

.debug-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  font-size: 12px;
  z-index: 1000;
}
</style>