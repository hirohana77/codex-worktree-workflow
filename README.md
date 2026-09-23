# 极简前后端分离待办系统 (Todo App)

本项目是一个基于前后端分离架构与 Git 多分支/Worktree 并行协作流程开发的极简待办事项应用（Todo App）。

---

## 目录

- [一、 系统架构设计](#一-系统架构设计)
- [二、 核心数据模型 (Schema)](#二-核心数据模型-schema)
- [三、 后端接口规范 (API Specification)](#三-后端接口规范-api-specification)
- [四、 项目结构](#四-项目结构)
- [五、 本地快速启动指南](#五-本地快速启动指南)
- [六、 研发与分支演进记录](#六-研发与分支演进记录)

---

## 一、 系统架构设计

系统采用经典的前后端分离架构，并在研发流程上遵循“物理边界隔离 + 契约优先”的无冲突并行模式：

1. **后端架构 (Server)**：
   - 运行环境：Node.js
   - Web 框架：Express
   - 跨域策略：使用 `cors` 中间件实现跨域资源共享（CORS），支持前端独立服务或静态文件访问。
   - 接口风格：RESTful JSON 契约。
2. **前端架构 (Client)**：
   - 原生标准化技术栈（HTML5 / CSS3 / Vanilla JS），无重型构建依赖。
   - 采用**挂载工厂（Mount Factory）**与**组件物理隔离**设计：
     - `TodoInput`：独立输入与新增组件，支持键盘 Enter 与按钮提交防抖。
     - `TodoList`：状态响应列表渲染，支持标记完成、删除与 XSS 防护。
     - `TodoFooter`：独立过滤与状态统计组件，支持 All / Active / Completed 切换与清除已完成项。
   - 具备容灾降级能力：当后端服务不可用时，前端自动切换至本地 Mock 状态以保障交互可用性。

---

## 二、 核心数据模型 (Schema)

所有待办项统一遵循以下 TypeScript 风格的数据模型定义：

```typescript
interface TodoItem {
  id: string;          // 待办唯一标识（字符串形式的 UUID 或自增 ID）
  title: string;       // 待办内容/标题（必填，trim 后非空）
  completed: boolean;  // 完成状态（true: 已完成, false: 待办中）
  createdAt: string;   // 创建时间（ISO-8601 格式，如 2026-09-23T10:00:00.000Z）
  updatedAt?: string;  // 更新时间（ISO-8601 格式，可选）
}
```

---

## 三、 后端接口规范 (API Specification)

所有接口统一采用 JSON 作为数据交换格式，通用响应结构如下：

```json
{
  "code": 0,
  "message": "success",
  "data": ...
}
```

### 1. 服务健康检查

- **URL**: `/health`
- **Method**: `GET`
- **说明**: 用于检测后端服务存活状态及时间戳。
- **响应示例**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-23T14:00:00.000Z"
  }
  ```

### 2. 获取待办事项列表

- **URL**: `/api/todos`
- **Method**: `GET`
- **Headers**:
  - `Accept: application/json`
- **Query 参数 (可选扩展)**:
  - `status`: 过滤状态（`all` | `active` | `completed`，默认 `all`）
- **响应示例**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": [
      {
        "id": "1",
        "title": "购买日用品",
        "completed": false,
        "createdAt": "2026-09-23T10:00:00.000Z",
        "updatedAt": "2026-09-23T10:00:00.000Z"
      },
      {
        "id": "2",
        "title": "完成架构设计与集成",
        "completed": true,
        "createdAt": "2026-09-23T09:30:00.000Z",
        "updatedAt": "2026-09-23T09:50:00.000Z"
      }
    ]
  }
  ```

---

## 四、 项目结构

```text
todo-app/
├── client/
│   └── components/
│       ├── todo-input/          # TodoInput 新增组件
│       │   ├── demo.html        # 独立组件预览 Demo
│       │   ├── todo-input.css   # 组件样式
│       │   └── todo-input.js    # 组件逻辑工厂
│       └── todo-footer/         # TodoFooter 统计与过滤组件
│           ├── demo.html        # 独立组件预览 Demo
│           ├── todo-footer.css  # 组件样式
│           └── todo-footer.js   # 组件逻辑工厂
├── server/
│   ├── package.json             # 服务端依赖配置
│   ├── package-lock.json        # 依赖锁文件
│   └── src/
│       └── index.js             # Express 服务端入口
├── index.html                   # 前端整合入口单页面
├── README.md                    # 项目文档与架构说明
└── .gitignore                   # Git 忽略配置
```

---

## 五、 本地快速启动指南

### 1. 启动后端服务

进入 `server` 目录，安装依赖并启动服务（默认监听端口 3000，或可通过环境变量 `PORT` 指定）：

```bash
# 1. 进入服务端目录
cd server

# 2. 安装依赖
npm install

# 3. 启动服务 (默认端口: 3000)
npm start

# 或指定端口启动（例如 3001）
PORT=3001 npm start
```

启动成功后，终端将输出：
```text
Server is running at http://localhost:3000
```
可通过浏览器访问 `http://localhost:3000/health` 或 `http://localhost:3000/api/todos` 验证接口。

### 2. 启动前端页面

前端无需任何复杂打包工具，可使用任意静态服务器或直接浏览器打开：

- **方式一（推荐：本地静态服务）**：
  ```bash
  # 在项目根目录下，使用 npx serve
  npx serve .
  
  # 或使用 Python 内置 HTTP 模块
  python -m http.server 8080
  ```
  在浏览器中打开提示的 URL（如 `http://localhost:8080/index.html`）。

- **方式二（直接双击预览）**：
  直接在资源管理器中双击打开根目录下的 `index.html` 即可进入待办界面。如果服务端未启动，前端将自动进入本地交互降级模式。

---

## 六、 研发与分支演进记录

本项目通过 Git Worktree 及特性分支进行严格的并行开发与架构审查：

- `codex/todo-01-backend-setup` (TODO-01): 搭建服务端基础框架与跨域（CORS）配置。
- `feat/todo-02-frontend-list` (TODO-02): 搭建极简待办列表页面与契约响应。
- `feat/todo-03-frontend-input` (TODO-03): 开发 TodoInput 新增组件（目录边界隔离）。
- `feat/todo-04-frontend-footer` (TODO-04): 开发 TodoFooter 状态统计与过滤组件（目录边界隔离）。
- `feat/todo-05-frontend-integrate` (TODO-05): 前端交付：整合组件至主页面并完成交互闭环。
- `docs/todo-06-readme-api` (TODO-06): 完善系统架构文档、接口规范与启动指引。
