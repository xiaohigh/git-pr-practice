const express = require('express');
const studentRouter = require('../routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <html>
    <head><title>学生管理系统</title></head>
    <body style="font-family:sans-serif;max-width:800px;margin:50px auto;padding:0 20px">
      <h1>学生管理系统 API v1.2.0</h1>
      <p>自建服务器自动部署测试中 🚀</p>
      <h2>接口列表</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tr><th>方法</th><th>路径</th><th>说明</th></tr>
        <tr><td>GET</td><td>/api/students</td><td>获取所有学生</td></tr>
        <tr><td>GET</td><td>/api/students/stats</td><td>获取统计数据</td></tr>
        <tr><td>GET</td><td>/api/students/search</td><td>搜索学生</td></tr>
        <tr><td>GET</td><td>/api/students/health</td><td>健康检查</td></tr>
        <tr><td>GET</td><td>/api/students/:id</td><td>根据ID获取</td></tr>
        <tr><td>POST</td><td>/api/students</td><td>创建学生</td></tr>
        <tr><td>PUT</td><td>/api/students/:id</td><td>更新学生</td></tr>
        <tr><td>DELETE</td><td>/api/students/:id</td><td>删除学生</td></tr>
      </table>
      <p style="color:#888;margin-top:20px">部署地址: student.xiaohigh.com | 持续集成: GitHub Actions</p>
    </body>
    </html>
  `);
});

app.use('/api/students', studentRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

module.exports = app;
