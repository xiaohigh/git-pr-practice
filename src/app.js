const express = require('express');
const studentRouter = require('../routes/students');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '学生管理系统 API',
    version: '1.0.0',
    endpoints: {
      'GET /api/students': '获取所有学生',
      'GET /api/students/:id': '根据 ID 获取学生',
      'POST /api/students': '创建学生（待实现）',
      'PUT /api/students/:id': '更新学生（待实现）',
      'DELETE /api/students/:id': '删除学生（待实现）'
    }
  });
});

app.use('/api/students', studentRouter);

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
