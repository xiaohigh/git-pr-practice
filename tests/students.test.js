const { getAll, getById, create, update, remove } = require('../src/students');

beforeEach(() => {
  // 每个测试前重置数据
  while (getAll().length > 0) {
    remove(getAll()[0].id);
  }
  getAll().push(
    { id: '1', name: '张三', age: 20, major: '计算机科学' },
    { id: '2', name: '李四', age: 22, major: '软件工程' },
    { id: '3', name: '王五', age: 21, major: '数据科学' }
  );
});

// getAll
test('getAll 返回所有学生', () => {
  const list = getAll();
  expect(list).toHaveLength(3);
  expect(list[0].name).toBe('张三');
});

// getById
test('getById 正常查找', () => {
  const student = getById('1');
  expect(student).not.toBeNull();
  expect(student.name).toBe('张三');
});

test('getById 找不到返回 null', () => {
  expect(getById('999')).toBeNull();
});

// create
test('create 正常创建学生', () => {
  const student = create({ name: '赵六', age: 19, major: '人工智能' });
  expect(student.name).toBe('赵六');
  expect(student.age).toBe(19);
  expect(student.id).toBeDefined();
  expect(getAll()).toHaveLength(4);
});

test('create name 为空时报错', () => {
  const result = create({ age: 20 });
  expect(result.error).toBe('name 为必填项');
});

test('create age 非数字时报错', () => {
  const result = create({ name: '测试', age: '二十' });
  expect(result.error).toBe('age 必须为数字');
});

test('create 未传 age 默认为 0', () => {
  const student = create({ name: '测试' });
  expect(student.age).toBe(0);
});

test('create 未传 major 默认为 未指定', () => {
  const student = create({ name: '测试', age: 20 });
  expect(student.major).toBe('未指定');
});

// update
test('update 正常更新', () => {
  const updated = update('1', { age: 25 });
  expect(updated.age).toBe(25);
  expect(updated.name).toBe('张三'); // name 没改
});

test('update 学生不存在返回 null', () => {
  expect(update('999', { age: 25 })).toBeNull();
});

test('update name 为空时报错', () => {
  const result = update('1', { name: '' });
  expect(result.error).toBe('name 不能为空');
});

test('update age 非数字时报错', () => {
  const result = update('1', { age: 'abc' });
  expect(result.error).toBe('age 必须为数字');
});

// remove
test('remove 正常删除', () => {
  const result = remove('1');
  expect(result).toBe(true);
  expect(getAll()).toHaveLength(2);
  expect(getById('1')).toBeNull();
});

test('remove 学生不存在返回 null', () => {
  expect(remove('999')).toBeNull();
});
