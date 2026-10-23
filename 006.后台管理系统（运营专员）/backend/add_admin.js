/**
 * 添加管理员账户
 * 运行: node add_admin.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function addAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'finance_manager'
  });

  try {
    // 添加管理员 lee
    const hashedPassword = await bcrypt.hash('123456', 10);
    await connection.execute(
      'INSERT INTO admins (username, password, nickname) VALUES (?, ?, ?)',
      ['lee', hashedPassword, '李管理员']
    );
    console.log('✅ 管理员lee创建成功');
    console.log('   用户名: lee');
    console.log('   密码: 123456');

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️ 管理员lee已存在');
    } else {
      console.error('❌ 错误:', error.message);
    }
  } finally {
    await connection.end();
  }
}

addAdmin();