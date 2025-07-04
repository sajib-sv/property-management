import { Injectable, NestMiddleware } from '@nestjs/common';
import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '[Unable to stringify]';
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // * Capture request details
    const { method, originalUrl, headers } = req;
    const body = req.body as unknown;
    const cookies = req.cookies as unknown;
    const query = req.query as unknown;
    const params = req.params as unknown;

    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    console.group(chalk.bgGreen.black.bold('📥 Incoming Request'));

    console.info(`${chalk.cyan('🔗 URL:')} ${chalk.white(originalUrl)}`);
    console.info(`${chalk.yellow('📬 Method:')} ${chalk.white(method)}`);
    console.info(`${chalk.magenta('🌐 IP:')} ${chalk.white(ip)}`);
    console.info(
      `${chalk.green('🎯 Headers:')} ${chalk.gray(safeStringify(headers))}`,
    );
    console.info(
      `${chalk.blue('📦 Body:')} ${chalk.gray(safeStringify(body))}`,
    );
    console.info(
      `${chalk.red('🍪 Cookies:')} ${chalk.gray(safeStringify(cookies))}`,
    );
    console.info(
      `${chalk.gray('🔍 Query:')} ${chalk.gray(safeStringify(query))}`,
    );
    console.info(
      `${chalk.gray('🔑 Params:')} ${chalk.gray(safeStringify(params))}`,
    );

    console.groupEnd();

    // * Capture response body
    const oldJson = res.json.bind(res);
    res.json = (data: unknown) => {
      const duration = Date.now() - startTime;

      console.group(chalk.bgCyan.white.bold('📤 Outgoing Response'));
      console.info(`${chalk.green('📨 Status Code:')} ${res.statusCode}`);
      console.info(`${chalk.blue('🕒 Response Time:')} ${duration} ms`);
      console.info(
        `${chalk.cyan('📦 Response Body:')} ${chalk.gray(JSON.stringify(data, null, 2))}`,
      );
      console.groupEnd();
      console.info(chalk.gray('-'.repeat(60)));

      return oldJson(data);
    };

    next();
  }
}
