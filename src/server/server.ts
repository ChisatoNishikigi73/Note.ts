import express from 'express';
import { Request, Response } from 'express';
import { logger } from '../index';

const app = express();
const port = 3000;

// 中间件
app.use(express.json());

// 路由
app.get('/', (req: Request, res: Response) => {
  res.send('欢迎来到便利贴应用！');
});

// 获取所有便利贴
app.get('/api/get/notes', (req: Request, res: Response) => {
  // TODO: 实现获取所有便利贴的逻辑
  res.json({ message: '这里将返回所有便利贴' });
});

// 创建新便利贴
app.post('/api/post/notes', (req: Request, res: Response) => {
  // TODO: 实现创建新便利贴的逻辑
  res.json({ message: '便利贴创建成功' });
});

// 启动服务器函数
export function startServer() {
  app.listen(port, () => {
    logger.info(`服务器运行在 http://localhost:${port}`);
  });
}