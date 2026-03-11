# 实现计划：试题组卷系统

## 概述

本实现计划将试题组卷系统的设计转换为可执行的编码任务。系统基于 Vue 3 + TypeScript + Ant Design Vue 构建，采用组件化架构，通过 Pinia 进行状态管理。

实现策略：
- 自底向上构建：先实现基础组件和服务，再组装成完整功能
- 增量验证：每个阶段完成后通过测试验证核心功能
- 类型优先：先定义 TypeScript 类型和接口，确保类型安全

## 任务

- [x] 1. 项目基础设施搭建
  - 创建目录结构（components、stores、services、types、utils）
  - 配置 TypeScript 类型定义
  - 设置 Pinia store 基础配置
  - 配置 Vitest 和 fast-check 测试环境
  - _需求：15.1_

- [ ] 2. 定义核心类型和接口
  - [x] 2.1 定义题目数据类型
    - 创建 `types/question.ts` 文件
    - 定义 `QuestionType`、`Question`、`QuestionData` 接口
    - 定义各题型的具体数据接口（`SingleChoiceData`、`MultipleChoiceData`、`FillBlankData`、`JudgementData`、`EssayData`、`CompositeData`）
    - 定义 `Option`、`BlankAnswer`、`SubQuestion` 等辅助接口
    - _需求：1.1, 4.1, 5.1, 6.1, 7.1, 8.1, 14.1_
  
  - [x] 2.2 定义元数据类型
    - 创建 `types/metadata.ts` 文件
    - 定义 `CourseLinkageValue`、`KnowledgePoint`、`Tag`、`DifficultyConfig` 接口
    - 定义 `Course`、`Grade`、`Semester`、`Unit` 接口
    - _需求：2.1, 3.1, 10.1, 11.1_
  
  - [x] 2.3 定义 API 响应类型
    - 创建 `types/api.ts` 文件
    - 定义 `ApiResponse<T>`、`PaginatedResponse<T>`、`ApiError` 接口
    - _需求：12.3, 15.4_

- [ ] 3. 实现 API 服务层
  - [x] 3.1 创建 API 客户端基础
    - 创建 `services/api/client.ts` 文件
    - 实现 axios 实例配置（baseURL、拦截器、错误处理）
    - 实现统一的错误处理函数 `handleApiCall`
    - _需求：15.4, 15.5_
  
  - [x] 3.2 实现元数据 API 服务
    - 创建 `services/api/metadata.ts` 文件
    - 实现 `fetchQuestionTypes()`、`fetchCourses()`、`fetchGrades()`、`fetchSemesters()`、`fetchUnits()` 函数
    - 实现 `fetchKnowledgePoints()`、`fetchCourseStandards()`、`fetchDifficultyLevels()`、`fetchCategories()` 函数
    - _需求：1.4, 2.4, 3.5, 10.1, 11.1_
  
  - [x] 3.3 实现题目 API 服务
    - 创建 `services/api/question.ts` 文件
    - 实现 `fetchQuestion(id)`、`fetchQuestionList(params)`、`saveQuestion(question)`、`updateQuestion(id, data)`、`deleteQuestion(id)` 函数
    - _需求：12.3, 18.1, 18.3, 18.4_

- [ ] 4. 实现 Pinia Stores
  - [x] 4.1 实现 questionStore
    - 创建 `stores/questionStore.ts` 文件
    - 定义 state：`currentQuestion`、`questionList`、`loading`、`error`
    - 实现 actions：`fetchQuestion`、`fetchQuestionList`、`saveQuestion`、`deleteQuestion`、`updateQuestion`
    - 实现 getters：`isEditing`、`hasUnsavedChanges`
    - _需求：15.2, 18.1, 18.3, 18.4_
  
  - [x] 4.2 实现 metadataStore
    - 创建 `stores/metadataStore.ts` 文件
    - 定义 state：`questionTypes`、`courses`、`grades`、`semesters`、`units`、`knowledgePoints`、`courseStandards`、`difficultyLevels`、`categories`
    - 实现 actions：对应各个元数据的获取函数
    - 实现缓存机制（避免重复请求）
    - _需求：1.4, 2.4, 3.5, 10.1, 11.1_

- [ ] 5. 实现基础 UI 组件
  - [x] 5.1 实现 QuestionTypeSelector 组件
    - 创建 `components/QuestionTypeSelector.vue` 文件
    - 使用 `a-radio-group` 和 `a-radio-button` 实现题型选择
    - 实现 v-model 双向绑定
    - 添加题型切换确认逻辑（当有未保存内容时）
    - _需求：1.1, 1.2, 1.3_
  
  - [ ] 5.2 编写 QuestionTypeSelector 属性测试
    - **属性 1：题型切换加载对应表单**
    - **验证：需求 1.2**
  
  - [x] 5.3 实现 CourseLinkage 组件
    - 创建 `components/CourseLinkage.vue` 文件
    - 使用 `a-select` 实现课程、年级、学期、单元的级联选择
    - 实现级联加载逻辑（选择上级后加载下级）
    - 实现级联重置逻辑（修改上级后清空下级）
    - 添加加载状态指示器 `a-spin`
    - _需求：2.1, 2.2, 2.3, 2.5_
  
  - [ ] 5.4 编写 CourseLinkage 属性测试
    - **属性 2：级联选择器联动加载**
    - **属性 3：级联选择器重置下级**
    - **验证：需求 2.1, 2.2, 2.3, 2.5**
  
  - [x] 5.5 实现 TagManager 组件
    - 创建 `components/TagManager.vue` 文件
    - 使用 `a-tag` 显示已选标签（带关闭按钮）
    - 使用 `a-button` 实现添加标签按钮
    - 实现标签删除功能
    - 支持不同类型标签的颜色区分
    - _需求：3.2, 3.3, 16.2, 16.3_
  
  - [ ] 5.6 编写 TagManager 属性测试
    - **属性 4：标签添加和显示**
    - **属性 5：标签删除**
    - **验证：需求 3.2, 3.3, 16.2, 16.3**
  
  - [ ] 5.7 实现 DifficultySelector 组件
    - 创建 `components/DifficultySelector.vue` 文件
    - 使用 `a-select` 实现难度等级选择
    - 使用 `a-select` 实现难度方法选择
    - 从 metadataStore 获取选项数据
    - _需求：10.1, 10.2, 10.3_

- [ ] 6. 实现知识点选择器
  - [x] 6.1 实现 KnowledgePointSelector 组件
    - 创建 `components/KnowledgePointSelector.vue` 文件
    - 使用 `a-modal` 作为弹窗容器
    - 使用 `a-tree` 实现树形结构展示
    - 使用 `a-input-search` 实现搜索功能
    - 使用 `a-select` 实现教材筛选
    - 实现树节点的展开/收起功能
    - 实现多选功能（checkable）
    - _需求：3.1, 3.2, 3.4, 3.6_
  
  - [ ] 6.2 编写 KnowledgePointSelector 属性测试
    - **属性 6：知识点筛选**
    - **验证：需求 3.6**

- [ ] 7. 实现富文本编辑器
  - [x] 7.1 集成富文本编辑器
    - 创建 `components/RichTextEditor.vue` 文件
    - 选择并集成第三方富文本编辑器（推荐 WangEditor 或 Quill）
    - 配置工具栏（粗体、斜体、下划线、图片、公式）
    - 实现 v-model 双向绑定
    - 实现 HTML 安全过滤
    - _需求：4.2, 17.1, 17.2, 17.3, 17.4, 17.6_
  
  - [ ] 7.2 编写富文本编辑器单元测试
    - 测试基本文本输入和格式化
    - 测试 HTML 安全过滤功能
    - _需求：17.6_

- [ ] 8. 检查点 - 基础组件验证
  - 确保所有基础组件正常工作，测试通过
  - 如有问题，请向用户询问

- [ ] 9. 实现题型表单组件
  - [ ] 9.1 实现 SingleChoiceForm 组件
    - 创建 `components/forms/SingleChoiceForm.vue` 文件
    - 使用 `a-form` 和 `a-form-item` 构建表单结构
    - 使用 RichTextEditor 实现题干输入
    - 使用 `a-input` 实现选项内容输入（默认 A、B、C、D 四个选项）
    - 使用 `a-radio-group` 实现答案选择
    - 使用 `a-button` 实现"增加选项"功能
    - 实现选项动态添加逻辑
    - _需求：4.1, 4.3, 4.4, 4.5_
  
  - [ ] 9.2 编写 SingleChoiceForm 属性测试
    - **属性 7：动态添加选项**
    - **属性 8：单选题答案唯一性**
    - **验证：需求 4.4, 4.6**
  
  - [ ] 9.3 实现 MultipleChoiceForm 组件
    - 创建 `components/forms/MultipleChoiceForm.vue` 文件
    - 使用 `a-form` 和 `a-form-item` 构建表单结构
    - 使用 RichTextEditor 实现题干输入
    - 使用 `a-input` 实现选项内容输入
    - 使用 `a-checkbox-group` 实现答案选择
    - 使用 `a-button` 实现"增加选项"功能
    - 实现答案验证（至少两个正确答案）
    - _需求：5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 9.4 编写 MultipleChoiceForm 属性测试
    - **属性 9：多选题答案多样性**
    - **验证：需求 5.6**
  
  - [ ] 9.5 实现 FillBlankForm 组件
    - 创建 `components/forms/FillBlankForm.vue` 文件
    - 使用 `a-form` 和 `a-form-item` 构建表单结构
    - 使用 RichTextEditor 实现题干输入（支持标记填空位置）
    - 为每个填空创建答案输入区域（使用 `a-input` 和 `a-tag`）
    - 使用 `a-button` 实现"添加一个空"功能
    - 使用 `a-checkbox` 实现"允许答案顺序不一致"选项
    - 实现填空动态添加/删除逻辑
    - _需求：6.1, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [ ] 9.6 编写 FillBlankForm 属性测试
    - **属性 10：填空数量与答案区域对应**
    - **属性 11：动态添加填空**
    - **属性 12：删除填空移除答案区域**
    - **验证：需求 6.3, 6.4, 6.7**
  
  - [ ] 9.7 实现 JudgementForm 组件
    - 创建 `components/forms/JudgementForm.vue` 文件
    - 使用 `a-form` 和 `a-form-item` 构建表单结构
    - 使用 RichTextEditor 实现题干输入
    - 使用 `a-radio-group` 实现正确/错误选择
    - 实现答案必填验证
    - _需求：7.1, 7.3, 7.4_
  
  - [ ] 9.8 编写 JudgementForm 属性测试
    - **属性 13：判断题必须有答案**
    - **验证：需求 7.4**
  
  - [ ] 9.9 实现 EssayForm 组件
    - 创建 `components/forms/EssayForm.vue` 文件
    - 使用 `a-form` 和 `a-form-item` 构建表单结构
    - 使用 RichTextEditor 实现题干输入
    - 使用 RichTextEditor 实现参考答案输入
    - 实现参考答案必填验证
    - _需求：8.1, 8.4, 8.5_
  
  - [ ] 9.10 编写 EssayForm 属性测试
    - **属性 14：问答题参考答案必填**
    - **验证：需求 8.5**
  
  - [ ] 9.11 实现 CompositeForm 组件
    - 创建 `components/forms/CompositeForm.vue` 文件
    - 使用 `a-form` 和 `a-form-item` 构建表单结构
    - 使用 RichTextEditor 实现主题干输入
    - 使用 `a-card` 为每个子题创建独立编辑区域
    - 使用 `a-select` 实现子题题型选择
    - 使用 `a-button` 实现添加/删除子题功能
    - 实现子题自动编号逻辑
    - 动态加载对应题型的表单组件
    - _需求：14.1, 14.3, 14.4, 14.5_
  
  - [ ] 9.12 编写 CompositeForm 属性测试
    - **属性 20：组合题子题独立编辑**
    - **属性 21：删除子题重新编号**
    - **验证：需求 14.3, 14.4, 14.5**

- [ ] 10. 实现题目编辑器主组件
  - [ ] 10.1 实现 QuestionEditor 组件
    - 创建 `components/QuestionEditor.vue` 文件
    - 使用 `a-form` 作为整体表单容器
    - 集成 QuestionTypeSelector 组件
    - 集成 CourseLinkage 组件
    - 集成 KnowledgePointSelector 和 TagManager（知识点）
    - 集成 TagManager（课程标准）
    - 集成 DifficultySelector 组件
    - 根据选中的题型动态加载对应的表单组件
    - 实现答案录入区域（使用 `a-form-item` 和 `a-textarea`）
    - 实现解析输入区域（使用 RichTextEditor）
    - 实现评分标准输入区域（使用 `a-textarea`）
    - 使用 `a-button` 实现保存和取消按钮
    - _需求：1.2, 2.1, 3.1, 9.1, 9.2, 9.3, 10.1, 11.1_
  
  - [ ] 10.2 实现表单验证逻辑
    - 使用 Ant Design Vue 的表单验证机制
    - 定义各字段的验证规则（题干必填、答案必填等）
    - 实现实时验证反馈
    - 实现提交前的最终验证
    - _需求：12.1, 12.2_
  
  - [ ] 10.3 实现保存逻辑
    - 连接 questionStore 的 saveQuestion action
    - 实现保存前验证
    - 实现保存成功后的处理（显示提示、清空编辑器）
    - 实现保存失败后的处理（显示错误、保留内容）
    - _需求：12.3, 12.4, 12.5_
  
  - [ ] 10.4 编写 QuestionEditor 属性测试
    - **属性 15：所有题型都有答案录入区域**
    - **属性 16：保存前验证必填字段**
    - **属性 17：验证失败阻止保存**
    - **属性 18：保存成功清空编辑器**
    - **属性 19：保存失败保留内容**
    - **属性 22：编辑操作更新状态**
    - **验证：需求 9.1, 12.1, 12.2, 12.4, 12.5, 15.2**

- [ ] 11. 检查点 - 题目编辑功能验证
  - 确保题目编辑器所有功能正常工作
  - 测试各种题型的创建和编辑
  - 如有问题，请向用户询问

- [ ] 12. 实现题目列表和管理功能
  - [ ] 12.1 实现 QuestionList 组件
    - 创建 `components/QuestionList.vue` 文件
    - 使用 `a-table` 显示题目列表
    - 使用 `a-select` 实现题型筛选
    - 使用 `a-select` 实现难度筛选
    - 使用 `a-select` 实现知识点筛选
    - 使用 `a-button` 实现操作按钮（编辑、删除）
    - 使用 `a-checkbox` 实现批量选择
    - 实现点击题目加载到编辑器的功能
    - _需求：18.1, 18.2, 18.3, 18.5_
  
  - [ ] 12.2 实现删除确认逻辑
    - 使用 `a-modal` 实现删除确认对话框
    - 连接 questionStore 的 deleteQuestion action
    - 实现删除成功后刷新列表
    - _需求：18.4_
  
  - [ ] 12.3 编写 QuestionList 属性测试
    - **属性 23：API 失败显示错误并允许重试**
    - **属性 24：试题列表筛选**
    - **属性 25：点击试题加载到编辑器**
    - **属性 26：删除试题触发确认**
    - **验证：需求 15.5, 18.2, 18.3, 18.4**

- [ ] 13. 实现主容器组件
  - [ ] 13.1 实现 QuestionBuilder 组件
    - 创建 `components/QuestionBuilder.vue` 文件
    - 使用 `a-layout` 构建整体布局
    - 使用 `a-layout-sider` 实现左侧导航
    - 使用 `a-menu` 实现导航菜单（试题管理、试卷管理等）
    - 使用 `a-layout-content` 作为主内容区域
    - 集成 QuestionEditor 和 QuestionList 组件
    - 实现路由切换逻辑（创建/编辑/列表视图）
    - _需求：13.1, 13.2_
  
  - [ ] 13.2 实现未保存内容提示
    - 使用 `a-modal` 实现离开页面确认对话框
    - 监听路由变化和页面关闭事件
    - 检查 questionStore 的 hasUnsavedChanges 状态
    - _需求：15.3_

- [ ] 14. 样式和用户体验优化
  - [ ] 14.1 统一样式风格
    - 确保所有组件使用 Ant Design Vue 的主题样式
    - 调整间距、颜色、字体等细节
    - 确保与现有项目风格一致
    - _需求：13.1, 13.2_
  
  - [ ] 14.2 添加加载状态和反馈
    - 为所有 API 调用添加 `a-spin` 加载指示器
    - 使用 `a-message` 显示操作成功/失败提示
    - 使用 `a-notification` 显示详细错误信息
    - _需求：13.4, 13.5_
  
  - [ ] 14.3 优化表单交互
    - 添加表单字段的 placeholder 提示
    - 添加必填字段的星号标记
    - 优化验证错误的显示位置和样式
    - _需求：13.4_

- [ ] 15. 集成测试和端到端测试
  - [ ] 15.1 编写集成测试
    - 测试完整的题目创建流程
    - 测试完整的题目编辑流程
    - 测试完整的题目删除流程
    - 测试课程联动和知识点选择的集成
  
  - [ ] 15.2 编写端到端测试（可选）
    - 使用 Playwright 或 Cypress
    - 测试用户完整的操作流程
    - 测试各种边缘情况

- [ ] 16. 最终检查点
  - 运行所有测试，确保通过
  - 检查代码质量和类型安全
  - 验证所有需求都已实现
  - 如有问题，请向用户询问

## 注意事项

- 每个任务都引用了具体的需求编号，便于追溯
- 检查点任务确保增量验证，及时发现问题
- 属性测试使用 fast-check 库，每个测试至少运行 100 次迭代
- 所有组件优先使用 Ant Design Vue 组件，确保 UI 一致性
- 所有测试任务都是必需的，确保代码质量和正确性
