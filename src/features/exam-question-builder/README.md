# 试题组卷系统 (Exam Question Builder)

## 目录结构

```
exam-question-builder/
├── components/          # Vue 组件
│   ├── forms/          # 题型表单组件
│   ├── QuestionBuilder.vue
│   ├── QuestionEditor.vue
│   ├── QuestionList.vue
│   └── ...
├── stores/             # Pinia 状态管理
│   ├── questionStore.ts
│   ├── metadataStore.ts
│   └── index.ts
├── services/           # API 服务层
│   ├── api/
│   │   ├── client.ts
│   │   ├── metadata.ts
│   │   └── question.ts
│   └── index.ts
├── types/              # TypeScript 类型定义
│   ├── question.ts
│   ├── metadata.ts
│   ├── api.ts
│   └── index.ts
├── utils/              # 工具函数
└── README.md

```

## 技术栈

- **Vue 3**: 使用 Composition API
- **TypeScript**: 类型安全
- **Ant Design Vue**: UI 组件库
- **Pinia**: 状态管理
- **Vitest**: 单元测试
- **fast-check**: 属性测试

## 测试策略

### 单元测试
- 使用 Vitest 和 @vue/test-utils
- 测试组件的核心功能和边缘情况
- 测试文件命名: `*.test.ts` 或 `*.spec.ts`

### 属性测试
- 使用 fast-check 库
- 每个属性测试至少运行 100 次迭代
- 标签格式: `Feature: exam-question-builder, Property {number}: {property_text}`

## 开发指南

### 运行测试
```bash
# 运行所有测试
npm run test

# 运行测试并监听变化
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 类型检查
```bash
# 运行 TypeScript 类型检查
npx tsc --noEmit
```

## 参考文档

- [需求文档](.kiro/specs/exam-question-builder/requirements.md)
- [设计文档](.kiro/specs/exam-question-builder/design.md)
- [任务列表](.kiro/specs/exam-question-builder/tasks.md)
