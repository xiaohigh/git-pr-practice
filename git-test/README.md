# 学生管理系统 API

GitHub Pull Request 完整流程练习项目，基于 Express 的 REST API。

## 快速开始

```bash
git clone git@github.com:xiaohigh/git-pr-practice.git
cd git-pr-practice
npm install
npm start
```

服务器启动后访问 `http://localhost:3000`

## API 接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | /api/students | 获取所有学生 | 已实现 |
| GET | /api/students/:id | 根据 ID 获取学生 | 已实现 |
| POST | /api/students | 创建学生 | 待实现 |
| PUT | /api/students/:id | 更新学生 | 待实现 |
| DELETE | /api/students/:id | 删除学生 | 待实现 |

## PR 练习场景

### 场景 1：标准功能开发 — 创建学生接口

- 从 main 创建 `feature/add-create-student` 分支
- 实现 `POST /api/students` 接口（验证 name 必填、age 为数字）
- 提交 → 推送 → 创建 PR → Review → Merge Commit 合并

### 场景 2：带冲突解决 — 修改学生接口

- 先在 main 上修改 GET 路由添加排序功能
- 再从旧节点创建 `feature/update-student` 分支，修改同一文件
- 创建 PR 时发现冲突 → 本地解决冲突 → 重新推送 → Squash and Merge

### 场景 3：Review 反馈修改 — 删除学生接口

- 创建 `feature/delete-student` 分支
- 实现删除接口（故意留瑕疵：不处理 404、不返回确认信息）
- 提交 PR → Reviewer 提出 Request Changes → 修改代码 → 重新 push → Rebase and Merge

### 场景 4：Draft PR — 搜索功能

- 创建 `feature/search-students` 分支
- 开发一半时创建 Draft PR
- 继续开发完成后标记 Ready for review → Review → Merge

## 项目结构

```
├── src/
│   ├── app.js          # Express 应用入口
│   ├── students.js     # 学生数据模型（内存数组）
│   └── utils.js        # 工具函数
├── routes/
│   └── students.js     # 学生 CRUD 路由
├── package.json
└── README.md
```
