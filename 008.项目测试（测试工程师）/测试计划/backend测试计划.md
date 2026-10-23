# 财务管家 - 后端API测试计划

## 1. 项目概述

| 项目 | 财务管家后端API |
|------|----------------|
| 位置 | 003.前端代码（前端工程师）/backend |
| 类型 | Node.js REST API |
| 端口 | 3001 |
| 数据库 | MySQL |

## 2. 技术栈分析

- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: MySQL + mysql2
- **认证**: JWT
- **加密**: bcryptjs
- **Excel**: xlsx

## 3. 目录结构

```
backend/
├── server.js          # 主入口
├── package.json     # 依赖
└── node_modules/    # 依赖包
```

## 4. 启动方式

```bash
cd backend
npm install  # 首次安装
npm start    # 启动服务，端口3001
```

## 5. API接口清单

### 5.1 认证接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/login | POST | 用户登录 |
| /api/register | POST | 用户注册 |
| /api/verify | GET | 验证Token |

### 5.2 用户接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/user | GET | 获取用户信息 |
| /api/user | PUT | 更新用户信息 |

### 5.3 账户接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/accounts | GET | 获取账户列表 |
| /api/accounts | POST | 添加账户 |
| /api/accounts/:id | PUT | 更新账户 |
| /api/accounts/:id | DELETE | 删除账户 |

### 5.4 分类接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/categories | GET | 获取分类列表 |
| /api/categories | POST | 添加分类 |
| /api/categories/:id | PUT | 更新分类 |
| /api/categories/:id | DELETE | 删除分类 |

### 5.5 交易接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/transactions | GET | 获取交易记录 |
| /api/transactions | POST | 添加交易 |
| /api/transactions/:id | DELETE | 删除交易 |

### 5.6 数据接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/home | GET | 首页数据 |
| /api/statistics | GET | 统计数据 |
| /api/export | GET | 导出Excel |

### 5.7 类型接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/account-types | GET | 账户类型列表 |
| /api/category-types | GET | 分类类型列表 |

## 6. 核心业务模块

### 6.1 认证模块
- 用户注册
- 用户登录
- Token验证
- 密码加密

### 6.2 数据CRUD模块
- 账户管理（增删改查）
- 分类管理（增删改查）
- 交易记录管理

### 6.3 统计模块
- 首页汇总（本月收支）
- 年度统计
- 分类占比
- 月度趋势

### 6.4 导出模块
- Excel导出

## 7. 风险功能识别

| 功能 | 风险等级 | 风险说明 |
|------|----------|----------|
| JWT Token验证 | 🔴高 | 安全漏洞导致未授权访问 |
| 密码加密存储 | 🔴高 | 密码明文存储风险 |
| SQL注入 | 🔴高 | 参数拼接可能存在注入 |
| Excel文件生成 | 🔴高 | 大数据量内存溢出 |
| 数据库连接 | 🔴高 | 连接池耗尽 |
| 数据类型转换 | 🟡中 | number/string混用导致计算错误 |
| 日期格式处理 | 🟡中 | 时区问题 |

## 8. 测试分层方案

### 8.1 单元测试（UT）
- 工具函数测试
- 数据格式化测试
- 密码加密/验证测试

### 8.2 接口测试（API Test）
- 各接口请求/响应测试
- 参数验证测试
- 错误处理测试

### 8.3 集成测试（IT）
- 多接口业务流
- 数据库一致性

### 8.4 安全测试（Security Test）
- SQL注入测试
- XSS测试
- 认证绕过测试
- 权限测试

### 8.5 性能测试（Performance Test）
- 并发请求测试
- 大数据量测试

## 9. 测试用例设计

### 9.1 接口测试用例

| 用例ID | 接口 | 用例名��� | 预期结果 | 优先级 |
|--------|------|---------|---------|--------|
| API-001 | /api/register | 正常注册 | 返回成功 | P0 |
| API-002 | /api/register | 用户名已存在 | 返回错误 | P0 |
| API-003 | /api/register | 空参数 | 返回错误 | P0 |
| API-004 | /api/login | 正确凭证 | 返回token | P0 |
| API-005 | /api/login | 错误密码 | 返回错误 | P0 |
| API-006 | /api/login | 用户不存在 | 返回错误 | P0 |
| API-007 | /api/verify | 有效token | 验证成功 | P0 |
| API-008 | /api/verify | 无效token | 返回错误 | P0 |
| API-009 | /api/user | 获取信息 | 返回用户信息 | P0 |
| API-010 | /api/user | 更新信息 | 更新成功 | P0 |
| API-011 | /api/accounts | 获取列表 | 返回账户列表 | P0 |
| API-012 | /api/accounts | 添加账户 | 保存成功 | P0 |
| API-013 | /api/accounts/:id | 更新账户 | 更新成功 | P0 |
| API-014 | /api/accounts/:id | 删除账户 | 删除成功 | P0 |
| API-015 | /api/categories | 获取列表 | 返回分类列表 | P0 |
| API-016 | /api/categories | 添加分类 | 保存成功 | P0 |
| API-017 | /api/categories | 筛选类型 | 返回筛选结果 | P0 |
| API-018 | /api/categories/:id | 更新分类 | 更新成功 | P0 |
| API-019 | /api/categories/:id | 删除分类 | 删除成功 | P0 |
| API-020 | /api/transactions | 获取列表 | 返回交易列表 | P0 |
| API-021 | /api/transactions | 分页参数 | 正确分页 | P0 |
| API-022 | /api/transactions | 筛选类型 | 正确筛选 | P0 |
| API-023 | /api/transactions | 筛选月份 | 正确筛选 | P0 |
| API-024 | /api/transactions | 添加交易 | 保存成功 | P0 |
| API-025 | /api/transactions | 缺少参数 | 返回错误 | P0 |
| API-026 | /api/transactions/:id | 删除交易 | 删除成功 | P0 |
| API-027 | /api/home | 获取首页数据 | 返回收支数据 | P0 |
| API-028 | /api/home | 指定年月 | 返回指定数据 | P1 |
| API-029 | /api/statistics | 获取统计 | 返回统计数据 | P0 |
| API-030 | /api/statistics | 指定年份 | 返回当年数据 | P0 |
| API-031 | /api/export | 导出Excel | 返回文件 | P1 |

### 9.2 安全测试用例

| 用例ID | 用例名称 | 预期结果 | 优先级 |
|--------|---------|---------|--------|
| SEC-001 | SQL注入尝试 | 正确拦截/过滤 | P0 |
| SEC-002 | XSS注入尝试 | 正确处理 | P0 |
| SEC-003 | 未授权访问 | 返回401 | P0 |
| SEC-004 | 越权访问他人数据 | 正确拦截 | P0 |
| SEC-005 | Token伪造 | 正确拦截 | P0 |
| SEC-006 | 暴力登录 | 限制访问 | P1 |

### 9.3 边界测试用例

| 用例ID | 用例名称 | 预期结果 | 优先级 |
|--------|---------|---------|--------|
| BT-001 | 金额为空 | 返回错误 | P0 |
| BT-002 | 金额为负数 | 返回错误 | P0 |
| BT-003 | 金额为非数字 | 返回错误 | P0 |
| BT-004 | 分页为负数 | 正确处理 | P0 |
| BT-005 | 分页超出范围 | 返回空列表 | P0 |
| BT-006 | 无效日期格式 | 正确处理 | P0 |
| BT-007 | 超长字符串 | 正确处理 | P1 |
| BT-008 | 特殊字符 | 正确处理 | P1 |

### 9.4 性能测试用例

| 用例ID | 用例名称 | 预期结果 | 优先级 |
|--------|---------|---------|--------|
| PT-001 | 100并发请求 | 正常响应 | P1 |
| PT-002 | 1000条交易查询 | 3秒内响应 | P1 |
| PT-003 | Excel导出大数据 | 正常生成 | P1 |

## 10. 测试环境

- Node.js 18+
- MySQL 8.0
- 请求工具（curl/postman）

## 11. 测试数据准备

### 11.1 测试用户
```json
{
  "username": "testuser",
  "password": "Test123456",
  "nickname": "测试用户"
}
```

### 11.2 测试数据
- 3个账户
- 5个分类（收入2个，支出3个）
- 10条交易记录
- 跨越3个月

## 12. 测试工具建议

- curl
- Postman
- JMeter（压力测试）

## 13. 发布检查清单

- [ ] 所有认证接口正常
- [ ] 所有CRUD接口��常
- [ ] 统计计算正确
- [ ] 安全测试通过
- [ ] 并发测试通过
- [ ] 无控制台错误
- [ ] 数据库连接正常