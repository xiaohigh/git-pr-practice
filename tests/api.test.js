const request = require('supertest');
const app = require('../src/app');
const { getAll, remove } = require('../src/students');

beforeEach(() => {
  while (getAll().length > 0) {
    remove(getAll()[0].id);
  }
  getAll().push(
    { id: '1', name: '张三', age: 20, major: '计算机科学' },
    { id: '2', name: '李四', age: 22, major: '软件工程' },
    { id: '3', name: '王五', age: 21, major: '数据科学' }
  );
});

// GET /api/students
test('GET /api/students 返回 200 和学生列表', async () => {
  const res = await request(app).get('/api/students');
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data).toHaveLength(3);
  expect(res.body.total).toBe(3);
});

test('GET /api/students?major=软件工程 按专业过滤', async () => {
  const res = await request(app).get('/api/students?major=软件工程');
  expect(res.body.data).toHaveLength(1);
  expect(res.body.data[0].name).toBe('李四');
});

test('GET /api/students 返回按年龄排序的结果', async () => {
  const res = await request(app).get('/api/students');
  const ages = res.body.data.map(s => s.age);
  expect(ages).toEqual([20, 21, 22]);
});

// GET /api/students/:id
test('GET /api/students/1 返回 200 和指定学生', async () => {
  const res = await request(app).get('/api/students/1');
  expect(res.status).toBe(200);
  expect(res.body.data.name).toBe('张三');
});

test('GET /api/students/999 返回 404', async () => {
  const res = await request(app).get('/api/students/999');
  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('学生不存在');
});

// POST /api/students
test('POST /api/students 正常创建返回 201', async () => {
  const res = await request(app)
    .post('/api/students')
    .send({ name: '赵六', age: 19, major: '人工智能' });
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.data.name).toBe('赵六');
  expect(res.body.data.id).toBeDefined();
});

test('POST /api/students name 为空返回 400', async () => {
  const res = await request(app)
    .post('/api/students')
    .send({ age: 20 });
  expect(res.status).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('name 为必填项');
});

test('POST /api/students age 非数字返回 400', async () => {
  const res = await request(app)
    .post('/api/students')
    .send({ name: '测试', age: '二十' });
  expect(res.status).toBe(400);
  expect(res.body.message).toBe('age 必须为数字');
});

// PUT /api/students/:id
test('PUT /api/students/:id 正常更新', async () => {
  const res = await request(app)
    .put('/api/students/1')
    .send({ age: 25 });
  expect(res.status).toBe(200);
  expect(res.body.data.age).toBe(25);
  expect(res.body.data.name).toBe('张三');
});

test('PUT /api/students/999 返回 404', async () => {
  const res = await request(app)
    .put('/api/students/999')
    .send({ age: 25 });
  expect(res.status).toBe(404);
});

test('PUT /api/students/:id age 非数字返回 400', async () => {
  const res = await request(app)
    .put('/api/students/1')
    .send({ age: 'abc' });
  expect(res.status).toBe(400);
});

// DELETE /api/students/:id
test('DELETE /api/students/:id 正常删除', async () => {
  const res = await request(app).delete('/api/students/1');
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.name).toBe('张三');
  expect(res.body.message).toBe('删除成功');
});

test('DELETE /api/students/999 返回 404', async () => {
  const res = await request(app).delete('/api/students/999');
  expect(res.status).toBe(404);
});

// GET /api/students/search
test('GET /api/students/search?name=张 搜索学生', async () => {
  const res = await request(app).get('/api/students/search?name=张');
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(1);
  expect(res.body.data[0].name).toBe('张三');
});

test('GET /api/students/search?major=科学 按专业搜索', async () => {
  const res = await request(app).get('/api/students/search?major=科学');
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(2);
});

test('GET /api/students/search?name=不存在的名字 返回空', async () => {
  const res = await request(app).get('/api/students/search?name=不存在');
  expect(res.body.data).toHaveLength(0);
});
