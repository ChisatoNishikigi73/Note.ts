<template>
  <div 
    class="note" 
    :style="{ 
      left: position.x + 'px', 
      top: position.y + 'px',
      width: size.width + 'px',
      height: size.height + 'px'
    }"
  >
    <div class="note-header" @mousedown.stop="startDrag" @touchstart.stop="startDrag">
      <div class="drag-handle">||</div>
      <button class="delete-btn" @click="deleteNote">×</button>
    </div>
    <div class="note-content">
      <TextLayer
        :modelValue="content"
        @update:modelValue="updateContent"
      />
    </div>
    <div class="resize-handle" @mousedown="startResize" @touchstart="startResize"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import TextLayer from './layers/TextLayer.vue'

const props = defineProps<{
  id: number
  content: string
  initialPosition: { x: number; y: number }
}>()

const emit = defineEmits(['update', 'delete', 'position-change', 'size-change'])

const position = ref(props.initialPosition)
const size = ref({ width: 200, height: 150 })
const content = ref(props.content)

let isDragging = false
let isResizing = false
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

const updateContent = (newValue: string) => {
  content.value = newValue
  emit('update', props.id, newValue)
}

const deleteNote = () => {
  emit('delete', props.id)
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.note-header') && !target.closest('.drag-handle')) return;
  
  e.preventDefault();
  isDragging = true;
  if (e instanceof MouseEvent) {
    startX = e.clientX - position.value.x;
    startY = e.clientY - position.value.y;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  } else if (e instanceof TouchEvent) {
    startX = e.touches[0].clientX - position.value.x;
    startY = e.touches[0].clientY - position.value.y;
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);
  }
};

const drag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return;
  e.preventDefault();
  let clientX, clientY;
  if (e instanceof MouseEvent) {
    clientX = e.clientX;
    clientY = e.clientY;
  } else if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    return;
  }

  // 获取房间容器的尺寸
  const roomContainer = document.querySelector('.notes-container');
  if (!roomContainer) return;
  const roomRect = roomContainer.getBoundingClientRect();

  // 计算新位置
  let newX = clientX - startX;
  let newY = clientY - startY;

  // 限制便利贴在房间内
  newX = Math.max(0, Math.min(newX, roomRect.width - size.value.width));
  newY = Math.max(0, Math.min(newY, roomRect.height - size.value.height));

  position.value = { x: newX, y: newY };
  emit('position-change', props.id, position.value);
};

const stopDrag = () => {
  isDragging = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', drag)
  document.removeEventListener('touchend', stopDrag)
}

const startResize = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isResizing = true
  if (e instanceof MouseEvent) {
    startX = e.clientX
    startY = e.clientY
  } else if (e instanceof TouchEvent) {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }
  startWidth = size.value.width
  startHeight = size.value.height
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', resize)
  document.addEventListener('touchend', stopResize)
}

const resize = (e: MouseEvent | TouchEvent) => {
  if (!isResizing) return
  e.preventDefault()
  let clientX, clientY
  if (e instanceof MouseEvent) {
    clientX = e.clientX
    clientY = e.clientY
  } else if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    return
  }
  const newWidth = startWidth + (clientX - startX)
  const newHeight = startHeight + (clientY - startY)
  size.value = {
    width: Math.max(150, newWidth),
    height: Math.max(100, newHeight)
  }
  emit('size-change', props.id, size.value)
}

const stopResize = () => {
  isResizing = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', resize)
  document.removeEventListener('touchend', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('touchend', stopDrag);
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
  document.removeEventListener('touchmove', resize);
  document.removeEventListener('touchend', stopResize);
})
</script>

<style scoped>
.note {
  position: absolute;
  background-color: #242424;
  border: 1px solid #333;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 确保便利贴显示在其他内容之上 */
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  user-select: none;
}

.drag-handle {
  cursor: move;
  user-select: none;
  padding: 0 5px;
}

.layer-manager-btn {
  background: none;
  border: 1px solid #555;
  color: #888;
  cursor: pointer;
  padding: 2px 5px;
}

.delete-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.2em;
  cursor: pointer;
}

.note-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  background-color: #646cff;
  cursor: nwse-resize;
}

.layer-manager {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 10px;
  z-index: 1001;
}

.layer-manager ul {
  list-style-type: none;
  padding: 0;
}

.layer-manager li {
  margin-bottom: 5px;
}
</style>