const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置 CORS 允许跨域请求
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 按照设计规范提供的 GET /api/todos 路由骨架
app.get('/api/todos', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: []
  });
});

// 启动服务器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
