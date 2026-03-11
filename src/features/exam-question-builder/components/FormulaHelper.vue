<template>
  <div class="formula-helper">
    <a-collapse v-model:activeKey="activeKeys" :bordered="false">
      <a-collapse-panel key="basic" header="基础运算符">
        <div class="symbol-grid">
          <button
            v-for="item in basicSymbols"
            :key="item.latex"
            class="symbol-btn"
            @click="insertSymbol(item.latex)"
          >
            <span class="symbol-display">{{ item.display }}</span>
            <span class="symbol-name">{{ item.name }}</span>
          </button>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="fraction" header="分数与根式">
        <div class="symbol-grid">
          <button
            v-for="item in fractionSymbols"
            :key="item.latex"
            class="symbol-btn"
            @click="insertSymbol(item.latex)"
          >
            <span class="symbol-display">{{ item.display }}</span>
            <span class="symbol-name">{{ item.name }}</span>
          </button>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="geometry" header="几何符号">
        <div class="symbol-grid">
          <button
            v-for="item in geometrySymbols"
            :key="item.latex"
            class="symbol-btn"
            @click="insertSymbol(item.latex)"
          >
            <span class="symbol-display">{{ item.display }}</span>
            <span class="symbol-name">{{ item.name }}</span>
          </button>
        </div>
      </a-collapse-panel>

      <a-collapse-panel key="templates" header="常用公式模板">
        <div class="template-list">
          <button
            v-for="item in templates"
            :key="item.latex"
            class="template-btn"
            @click="insertSymbol(item.latex)"
          >
            <span class="template-name">{{ item.name }}</span>
            <code class="template-code">{{ item.latex }}</code>
          </button>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'insert', latex: string): void
}

const emit = defineEmits<Emits>()

const activeKeys = ref(['basic'])

const basicSymbols = [
  { latex: '+', display: '+', name: '加' },
  { latex: '-', display: '−', name: '减' },
  { latex: '\\times', display: '×', name: '乘' },
  { latex: '\\div', display: '÷', name: '除' },
  { latex: '\\pm', display: '±', name: '正负' },
  { latex: '=', display: '=', name: '等于' },
  { latex: '\\neq', display: '≠', name: '不等' },
  { latex: '<', display: '<', name: '小于' },
  { latex: '>', display: '>', name: '大于' },
  { latex: '\\leq', display: '≤', name: '小于等于' },
  { latex: '\\geq', display: '≥', name: '大于等于' },
  { latex: '\\approx', display: '≈', name: '约等于' }
]

const fractionSymbols = [
  { latex: '\\frac{1}{2}', display: '½', name: '二分之一' },
  { latex: '\\frac{1}{3}', display: '⅓', name: '三分之一' },
  { latex: '\\frac{1}{4}', display: '¼', name: '四分之一' },
  { latex: '\\frac{a}{b}', display: 'a/b', name: '分数' },
  { latex: '\\sqrt{2}', display: '√2', name: '平方根' },
  { latex: '\\sqrt[3]{8}', display: '∛8', name: '立方根' },
  { latex: 'x^2', display: 'x²', name: '平方' },
  { latex: 'x^3', display: 'x³', name: '立方' },
  { latex: 'x^{n}', display: 'xⁿ', name: '幂次' },
  { latex: 'x_1', display: 'x₁', name: '下标' }
]

const geometrySymbols = [
  { latex: '\\angle', display: '∠', name: '角' },
  { latex: '\\triangle', display: '△', name: '三角形' },
  { latex: '\\perp', display: '⊥', name: '垂直' },
  { latex: '\\parallel', display: '∥', name: '平行' },
  { latex: '\\pi', display: 'π', name: '圆周率' },
  { latex: '\\circ', display: '○', name: '圆' },
  { latex: '^\\circ', display: '°', name: '度' },
  { latex: '\\infty', display: '∞', name: '无穷' }
]

const templates = [
  { latex: 'S = a \\times b', name: '长方形面积' },
  { latex: 'S = a^2', name: '正方形面积' },
  { latex: 'S = \\pi r^2', name: '圆面积' },
  { latex: 'S = \\frac{1}{2} \\times b \\times h', name: '三角形面积' },
  { latex: 'C = 2 \\times (a + b)', name: '长方形周长' },
  { latex: 'C = 4a', name: '正方形周长' },
  { latex: 'C = 2\\pi r', name: '圆周长' },
  { latex: 'V = a \\times b \\times c', name: '长方体体积' },
  { latex: 'V = a^3', name: '正方体体积' }
]

const insertSymbol = (latex: string) => {
  emit('insert', latex)
}
</script>

<style scoped>
.formula-helper {
  background: #fff;
  border-radius: 4px;
}

.symbol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.symbol-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 70px;
}

.symbol-btn:hover {
  border-color: #13a8a8;
  background: #e6f7f7;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(19, 168, 168, 0.2);
}

.symbol-display {
  font-size: 24px;
  color: #262626;
  margin-bottom: 4px;
  font-weight: 500;
}

.symbol-name {
  font-size: 12px;
  color: #8c8c8c;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.template-btn:hover {
  border-color: #13a8a8;
  background: #e6f7f7;
}

.template-name {
  font-size: 14px;
  color: #262626;
  margin-bottom: 6px;
  font-weight: 500;
}

.template-code {
  font-size: 12px;
  color: #d4380d;
  background: #fff7e6;
  padding: 4px 8px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  border: 1px solid #ffa39e;
}

:deep(.ant-collapse) {
  background: transparent;
}

:deep(.ant-collapse-item) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-collapse-header) {
  padding: 12px 16px !important;
  font-weight: 500;
  color: #262626;
}

:deep(.ant-collapse-content-box) {
  padding: 16px;
}
</style>
