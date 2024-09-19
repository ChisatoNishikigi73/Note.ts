import { startServer } from './server/server';
import log4js from 'log4js';

// 配置log4js
log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'info' } }
});

export const logger = log4js.getLogger();

logger.info('正在启动便利贴应用...');
startServer();
logger.info('便利贴应用已成功启动');
