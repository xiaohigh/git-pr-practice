const express = require('express');
const router = express.Router();
const { getAll, getById, create, update } = require('../src/students');

router.get('/', (req, res) => {
  const students = getAll();
  const { major } = req.query;
  const filtered = major ? students.filter(s => s.major === major) : students;
  res.json({ success: true, data: filtered, total: filtered.length });
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
  res.status(501).json({ success: false, message: '接口待实现' });
});

module.exports = router;
