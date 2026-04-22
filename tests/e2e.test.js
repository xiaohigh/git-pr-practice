const request = require('supertest');
const app = require('../src/app');
const { getAll, remove } = require('../src/students');

beforeEach(() => {
  while (getAll().length > 0) {
    remove(getAll()[0].id);
  }
});

// 场景1: 完整学生生命周期
test('E2E: 创建 → 搜索确认 → 修改 → 再查询 → 删除 → 确认不存在', async () => {
  // 1. 创建学生
  const createRes = await request(app)
    .post('/api/students')
    .send({ name: '测试学生', age: 20, major: '计算机科学' });
  expect(createRes.status).toBe(201);
  const studentId = createRes.body.data.id;

  // 2. 搜索确认已入库
  const searchRes = await request(app)
    .get('/api/students/search?name=测试学生');
  expect(searchRes.status).toBe(200);
  expect(searchRes.body.data).toHaveLength(1);
  expect(searchRes.body.data[0].id).toBe(studentId);

  // 3. 修改年龄和专业
  const updateRes = await request(app)
    .put(`/api/students/${studentId}`)
    .send({ age: 23, major: '人工智能' });
  expect(updateRes.status).toBe(200);
  expect(updateRes.body.data.age).toBe(23);
  expect(updateRes.body.data.major).toBe('人工智能');

  // 4. 单独查询确认修改生效
  const getRes = await request(app).get(`/api/students/${studentId}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body.data.age).toBe(23);
  expect(getRes.body.data.name).toBe('测试学生');

  // 5. 删除
  const deleteRes = await request(app).delete(`/api/students/${studentId}`);
  expect(deleteRes.status).toBe(200);
  expect(deleteRes.body.message).toBe('删除成功');

  // 6. 再查 → 404
  const goneRes = await request(app).get(`/api/students/${studentId}`);
  expect(goneRes.status).toBe(404);
});

// 场景2: 批量创建 + 过滤 + 排序 + 分页
test('E2E: 批量创建5人 → 专业过滤 → 年龄排序 → 分页查询', async () => {
  const students = [
    { name: '张三', age: 22, major: '计算机科学' },
    { name: '李四', age: 20, major: '软件工程' },
    { name: '王五', age: 21, major: '计算机科学' },
    { name: '赵六', age: 19, major: '软件工程' },
    { name: '钱七', age: 23, major: '数据科学' },
  ];

  // 1. 批量创建
  for (const s of students) {
    const res = await request(app).post('/api/students').send(s);
    expect(res.status).toBe(201);
  }

  // 2. 列表查询确认共5人，且按年龄排序
  const listRes = await request(app).get('/api/students');
  expect(listRes.body.total).toBe(5);
  const ages = listRes.body.data.map(s => s.age);
  expect(ages).toEqual([19, 20, 21, 22, 23]);

  // 3. 按专业过滤：计算机科学 → 2人
  const filterRes = await request(app).get('/api/students?major=计算机科学');
  expect(filterRes.body.total).toBe(2);

  // 4. 搜索 + 分页：每页2条，第1页
  const page1 = await request(app).get('/api/students/search?limit=2&page=1');
  expect(page1.body.data).toHaveLength(2);
  expect(page1.body.total).toBe(5);
  expect(page1.body.page).toBe(1);

  // 5. 第3页应为空
  const page3 = await request(app).get('/api/students/search?limit=2&page=3');
  expect(page3.body.data).toHaveLength(1);
});

// 场景3: 错误链路 — 创建失败不影响后续正常操作
test('E2E: 多次错误提交 → 最终正确创建 → 数据完整', async () => {
  // 1. 缺少 name → 400
  let res = await request(app)
    .post('/api/students')
    .send({ age: 20 });
  expect(res.status).toBe(400);
  expect(res.body.message).toBe('name 为必填项');

  // 2. age 非数字 → 400
  res = await request(app)
    .post('/api/students')
    .send({ name: '测试', age: 'abc' });
  expect(res.status).toBe(400);
  expect(res.body.message).toBe('age 必须为数字');

  // 3. 修改不存在的人 → 404
  res = await request(app)
    .put('/api/students/notexist')
    .send({ name: '测试' });
  expect(res.status).toBe(404);

  // 4. 以上错误不影响数据，列表应为空
  res = await request(app).get('/api/students');
  expect(res.body.total).toBe(0);

  // 5. 正确创建
  res = await request(app)
    .post('/api/students')
    .send({ name: '最终成功', age: 25, major: '软件工程' });
  expect(res.status).toBe(201);

  // 6. 确认只有1条数据
  res = await request(app).get('/api/students');
  expect(res.body.total).toBe(1);
  expect(res.body.data[0].name).toBe('最终成功');
});

// 场景4: 并发创建 + 统一查询验证
test('E2E: 并发创建3人 → 全部入库 → 按专业搜索 → 逐个删除 → 最终为空', async () => {
  // 1. 并发创建
  const [res1, res2, res3] = await Promise.all([
    request(app).post('/api/students').send({ name: '甲', age: 20, major: '前端' }),
    request(app).post('/api/students').send({ name: '乙', age: 21, major: '后端' }),
    request(app).post('/api/students').send({ name: '丙', age: 22, major: '前端' }),
  ]);
  expect(res1.status).toBe(201);
  expect(res2.status).toBe(201);
  expect(res3.status).toBe(201);

  // 2. 全部入库
  const listRes = await request(app).get('/api/students');
  expect(listRes.body.total).toBe(3);

  // 3. 搜索"前端"专业
  const searchRes = await request(app).get('/api/students/search?major=前端');
  expect(searchRes.body.data).toHaveLength(2);

  // 4. 逐个删除
  const ids = listRes.body.data.map(s => s.id);
  for (const id of ids) {
    const delRes = await request(app).delete(`/api/students/${id}`);
    expect(delRes.status).toBe(200);
  }

  // 5. 最终为空
  const finalRes = await request(app).get('/api/students');
  expect(finalRes.body.total).toBe(0);
});
