const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../src/students');

router.get('/health', (req, res) => {
  const students = getAll();
  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime().toFixed(0) + 's',
      totalStudents: students.length,
      memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + 'MB',
      timestamp: new Date().toISOString()
    }
  });
});

router.get('/', (req, res) => {
  const students = getAll();
  const { major } = req.query;
  const filtered = major ? students.filter(s => s.major === major) : students;
  const sorted = [...filtered].sort((a, b) => a.age - b.age);
  res.json({ success: true, data: sorted, total: sorted.length });
});

router.get('/search', (req, res) => {
  const { name, major, page = 1, limit = 10 } = req.query;
  let results = getAll();
  if (name) results = results.filter(s => s.name.includes(name));
  if (major) results = results.filter(s => s.major.includes(major));
  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + Number(limit));
  res.json({ success: true, data: paged, total, page: Number(page), limit: Number(limit) });
});

router.get('/stats', (req, res) => {
  const students = getAll();
  const total = students.length;
  const avgAge = total ? +(students.reduce((sum, s) => sum + s.age, 0) / total).toFixed(1) : 0;
  const majorCount = {};
  students.forEach(s => {
    majorCount[s.major] = (majorCount[s.major] || 0) + 1;
  });
  res.json({ success: true, data: { total, avgAge, majorCount } });
});

router.get('/majors', (req, res) => {
  const students = getAll();
  const majorSet = [...new Set(students.map(s => s.major))];
  res.json({ success: true, data: majorSet, total: majorSet.length });
});

router.delete('/clear', (req, res) => {
  const students = getAll();
  const count = students.length;
  students.forEach(s => remove(s.id));
  res.json({ success: true, message: `已清空 ${count} 条数据` });
});

router.get('/:id', (req, res) => {
  const student = getById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: '学生不存在' });
  }
  res.json({ success: true, data: student });
});

router.post('/', (req, res) => {
  const result = create(req.body);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }
  res.status(201).json({ success: true, data: result });
});

router.put('/:id', (req, res) => {
  const result = update(req.params.id, req.body);
  if (!result) {
    return res.status(404).json({ success: false, message: '学生不存在' });
  }
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }
  res.json({ success: true, data: result });
});

router.delete('/:id', (req, res) => {
  const student = getById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: '学生不存在' });
  }
  remove(req.params.id);
  res.json({ success: true, data: student, message: '删除成功' });
});

module.exports = router;
