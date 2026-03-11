# 学科网风格教育资源平台

基于 Vue 3 + Ant Design Vue 构建的教育资源平台，参考学科网设计风格。

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Ant Design Vue - 企业级 UI 组件库
- Pinia - Vue 状态管理
- Vite - 下一代前端构建工具
- UnoCSS - 即时按需原子化 CSS 引擎

## 主要功能

### 页面布局
- 顶部导航栏：包含搜索、用户中心、购物车、通知等功能
- 分类导航：学科分类、资源类型导航
- 面包屑导航：清晰的页面层级导航
- 左侧边栏：同步备课资源、热门推荐、AI 小博士
- 主内容区：轮播图、推荐资源、最新资源
- 右侧悬浮工具栏：APP 下载、购物车、客服、反馈、回到顶部
- 页脚：完整的网站信息和链接

### UI 组件优化

#### 使用的 Ant Design Vue 组件
- **Layout 布局组件**：Header、Content、Footer 实现整体布局
- **Menu 菜单**：顶部导航、分类导航、侧边栏菜单
- **Card 卡片**：资源展示、信息分组
- **List 列表**：最新资源列表展示
- **Badge 徽标**：消息提醒、热门标记
- **Tag 标签**：资源分类、热门标签
- **Button 按钮**：各种操作按钮
- **Input 输入框**：搜索框
- **Dropdown 下拉菜单**：用户菜单、地区选择
- **Tooltip 文字提示**：图标说明
- **Avatar 头像**：用户头像、资源图标
- **Space 间距**：元素间距控制
- **Divider 分割线**：内容分隔
- **Row/Col 栅格**：响应式布局
- **Carousel 走马灯**：轮播图
- **Tabs 标签页**：年级选择
- **Affix 固钉**：固定导航、悬浮按钮
- **BackTop 回到顶部**：快速返回顶部
- **Breadcrumb 面包屑**：页面导航
- **Statistic 统计数值**：下载量展示

#### 视觉增强
- 图标系统：使用 Ant Design Icons 提供丰富的图标
- 渐变背景：卡片和按钮使用渐变色增强视觉效果
- 悬停动画：卡片、按钮、列表项的交互动画
- 阴影效果：层次感更强的卡片阴影
- 响应式设计：适配不同屏幕尺寸

## 项目结构

```
src/
├── components/
│   ├── TopNav.vue          # 顶部导航栏
│   ├── CategoryNav.vue     # 分类导航
│   ├── LeftSidebar.vue     # 左侧边栏
│   ├── Banner.vue          # 轮播图和年级选择
│   ├── RecommendResources.vue  # 推荐资源
│   ├── LatestResources.vue     # 最新资源
│   ├── Footer.vue          # 页脚
│   └── XkwFeatures.vue     # 悬浮工具栏
├── store/
│   └── resources.js        # 资源数据管理
├── App.vue                 # 根组件
└── main.js                 # 入口文件
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 主要改进

1. **完整的 Ant Design Vue 集成**
   - 使用 Layout 组件实现标准布局
   - 统一的组件风格和交互体验
   - 中文语言包配置

2. **丰富的交互效果**
   - 卡片悬停动画
   - 按钮交互反馈
   - 列表项高亮效果
   - 平滑滚动

3. **功能性组件**
   - 搜索功能
   - 购物车（带数量提示）
   - 消息通知
   - 用户中心下拉菜单
   - 回到顶部按钮
   - 固定导航栏

4. **视觉优化**
   - 图标系统完善
   - 颜色主题统一
   - 间距和排版优化
   - 渐变色和阴影效果

5. **响应式设计**
   - 栅格布局系统
   - 移动端适配
   - 灵活的组件尺寸

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## License

MIT
