<template>
  <div class="formula-test-page">
    <h1>数学公式编辑器测试</h1>
    
    <div class="test-section">
      <h2>方式 1：直接输入 LaTeX 代码</h2>
      <p class="description">
        点击工具栏的 <strong>"插入公式"</strong> 按钮（fx 图标），在弹出的输入框中输入 LaTeX 代码。
      </p>
      <RichTextEditor
        v-model="question1"
        placeholder="请输入题干，可以插入数学公式"
        :rows="4"
      />
      <div class="preview">
        <h3>预览：</h3>
        <div v-html="question1"></div>
      </div>
    </div>

    <div class="test-section">
      <h2>方式 2：使用公式辅助面板（推荐）</h2>
      <p class="description">
        使用下方的符号面板，点击符号即可快速插入常用数学符号和公式模板。
      </p>
      
      <div class="editor-with-helper">
        <div class="editor-area">
          <RichTextEditor
            ref="editorRef"
            v-model="question2"
            placeholder="请输入题干"
            :rows="6"
          />
        </div>
        <div class="helper-area">
          <FormulaHelper @insert="handleInsertSymbol" />
        </div>
      </div>
      
      <div class="preview">
        <h3>预览：</h3>
        <div v-html="question2"></div>
      </div>
    </div>

    <div class="test-section">
      <h2>常用公式示例</h2>
      <div class="formula-examples">
        <div class="example-item">
          <strong>分数：</strong>
          <code>\frac{1}{2}</code>
          <span>→</span>
          <span class="formula-preview">½</span>
        </div>
        <div class="example-item">
          <strong>根号：</strong>
          <code>\sqrt{2}</code>
          <span>→</span>
          <span class="formula-preview">√2</span>
        </div>
        <div class="example-item">
          <strong>平方：</strong>
          <code>x^2</code>
          <span>→</span>
          <span class="formula-preview">x²</span>
        </div>
        <div class="example-item">
          <strong>乘号：</strong>
          <code>3 \times 5</code>
          <span>→</span>
          <span class="formula-preview">3 × 5</span>
        </div>
        <div class="example-item">
          <strong>除号：</strong>
          <code>10 \div 2</code>
          <span>→</span>
          <span class="formula-preview">10 ÷ 2</span>
        </div>
        <div class="example-item">
          <strong>小于等于：</strong>
          <code>x \leq 10</code>
          <span>→</span>
          <span class="formula-preview">x ≤ 10</span>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>使用说明</h2>
      <div class="instructions">
        <div class="instruction-card">
          <h3>📝 方式 1：手动输入</h3>
          <ol>
            <li>点击输入框进入编辑模式</li>
            <li>点击工具栏中的 <strong>"插入公式"</strong> 按钮（fx 图标）</li>
            <li>在弹出的输入框中输入 LaTeX 代码</li>
            <li>点击"确定"，公式将插入到编辑器中</li>
          </ol>
        </div>
        
        <div class="instruction-card">
          <h3>🎯 方式 2：使用辅助面板（推荐）</h3>
          <ol>
            <li>在右侧的公式辅助面板中浏览符号</li>
            <li>点击需要的符号或模板</li>
            <li>LaTeX 代码会自动复制到剪贴板</li>
            <li>在编辑器中点击"插入公式"，粘贴代码即可</li>
          </ol>
          <p class="tip">💡 提示：辅助面板包含小学数学常用的所有符号和公式模板</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import RichTextEditor from './RichTextEditor.vue'
import FormulaHelper from './FormulaHelper.vue'

const question1 = ref('')
const question2 = ref('')

const handleInsertSymbol = (latex: string) => {
  // 复制到剪贴板
  navigator.clipboard.writeText(latex).then(() => {
    message.success(`已复制公式代码：${latex}`)
    message.info('请点击编辑器工具栏的"插入公式"按钮，然后粘贴代码')
  }).catch(() => {
    message.error('复制失败，请手动输入：' + latex)
  })
}
</script>

<style scoped>
.formula-test-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  color: #262626;
  margin-bottom: 32px;
}

.test-section {
  background: #fff;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #434343;
  font-size: 18px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #13a8a8;
}

h3 {
  color: #595959;
  font-size: 14px;
  margin: 16px 0 8px;
}

.description {
  color: #595959;
  margin-bottom: 16px;
  line-height: 1.6;
}

.editor-with-helper {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  margin-bottom: 16px;
}

.editor-area {
  min-width: 0;
}

.helper-area {
  border-left: 1px solid #f0f0f0;
  padding-left: 24px;
}

.preview {
  margin-top: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}

.formula-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.example-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.example-item strong {
  color: #434343;
  min-width: 80px;
}

.example-item code {
  background: #fff;
  padding: 4px 8px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #d4380d;
  border: 1px solid #ffa39e;
}

.example-item span {
  color: #8c8c8c;
}

.formula-preview {
  font-size: 18px;
  color: #13a8a8 !important;
  font-weight: 600;
}

.instructions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.instruction-card {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.instruction-card h3 {
  color: #262626;
  font-size: 16px;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #13a8a8;
}

.instruction-card ol {
  padding-left: 24px;
  margin: 0;
}

.instruction-card ol li {
  margin-bottom: 8px;
  line-height: 1.8;
  color: #595959;
}

.tip {
  margin-top: 16px;
  padding: 12px;
  background: #e6f7f7;
  border-left: 3px solid #13a8a8;
  color: #434343;
  border-radius: 4px;
}

@media (max-width: 1200px) {
  .editor-with-helper {
    grid-template-columns: 1fr;
  }
  
  .helper-area {
    border-left: none;
    border-top: 1px solid #f0f0f0;
    padding-left: 0;
    padding-top: 24px;
  }
}
</style>
