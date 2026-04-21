const { generateId } = require('./utils');

let students = [
  { id: '1', name: '张三', age: 20, major: '计算机科学' },
  { id: '2', name: '李四', age: 22, major: '软件工程' },
  { id: '3', name: '王五', age: 21, major: '数据科学' },
  { id: '4', name: '赵六', age: 19, major: '人工智能' },
  { id: '5', name: '钱七', age: 23, major: '网络安全' }
];

function getAll() {
  return students;
}

function getById(id) {
  return students.find(s => s.id === id) || null;
}

function create(data) {
  return null;
}

function update(id, data) {
  return null;
}

function remove(id) {
  return null;
}

module.exports = { getAll, getById, create, update, remove };
