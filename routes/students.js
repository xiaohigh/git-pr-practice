const express = require('express');
const router = express.Router();
const { getAll, getById } = require('../src/students');

router.get('/', (req, res) => {
  const students = getAll();
  res.json({ success: true, data: students, total: students.length });
});

router.get('/:id', (req, res) => {
  const student = getById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: '学生不存在' });
  }
  res.json({ success: true, data: student });
});

router.post('/', (req, res) => {
  res.status(501).json({ success: false, message: '接口待实现' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ success: false, message: '接口待实现' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ success: false, message: '接口待实现' });
});

module.exports = router;
