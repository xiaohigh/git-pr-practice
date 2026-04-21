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
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    return { error: 'name 为必填项' };
  }
  if (data.age !== undefined && typeof data.age !== 'number') {
    return { error: 'age 必须为数字' };
  }
  const student = {
    id: generateId(),
    name: data.name.trim(),
    age: data.age || 0,
    major: data.major || '未指定'
  };
  students.push(student);
  return student;
}

function update(id, data) {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;
  if (data.name !== undefined && (typeof data.name !== 'string' || !data.name.trim())) {
    return { error: 'name 不能为空' };
  }
  if (data.age !== undefined && typeof data.age !== 'number') {
    return { error: 'age 必须为数字' };
  }
  students[index] = { ...students[index], ...data };
  if (data.name) students[index].name = data.name.trim();
  return students[index];
}

function remove(id) {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;
  students.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
