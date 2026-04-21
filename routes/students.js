const express = require('express');
const router = express.Router();
const { getAll, getById, create } = require('../src/students');

router.get('/', (req, res) => {
  const students = getAll();
  const sorted = [...students].sort((a, b) => a.age - b.age);
  res.json({ success: true, data: sorted, total: sorted.length });
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
  res.status(501).json({ success: false, message: '接口待实现' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ success: false, message: '接口待实现' });
});

module.exports = router;
