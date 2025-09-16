import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BotDetectionGuard implements CanActivate {
  private readonly suspiciousUserAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
  ];

  private readonly requiredHeaders = [
    'Accept',
    'Accept-Language',
    'Accept-Encoding',
  ];

  private requestTimestamps = new Map<string, number>(); // key: IP, value: last request timestamp
  private minInterval = 5000; // 5 ວິນາທີ່ລະຫວ່າງ request ຕໍ່ IP

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    // ກວດສອບ User-Agent
    const userAgent = request.get('User-Agent') || '';
    if (this.isSuspiciousUserAgent(userAgent)) {
      throw new HttpException('Bot detected', HttpStatus.FORBIDDEN);
    }

    // ກວດສອບ Headers ທີ່ຈຳເປັນ
    if (!this.hasRequiredHeaders(request)) {
      throw new HttpException(
        'Missing required headers',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ກວດສອບຄວາມໄວຂອງ request (simple check)
    if (this.isTooFast(request)) {
      throw new HttpException(
        'Too many requests too fast',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    if (!userAgent || userAgent.length < 10) return true;
    return this.suspiciousUserAgents.some((pattern) => pattern.test(userAgent));
  }

  private hasRequiredHeaders(request: Request): boolean {
    return this.requiredHeaders.every((header) => request.get(header));
  }

  private isTooFast(request: Request): boolean {
    const ip = request.ip; // ໃຊ້ IP เป็น key
    const now = Date.now();

    const lastRequestTime = this.requestTimestamps.get(ip) || 0;

    if (now - lastRequestTime < this.minInterval) {
      // ຖ້າ request ເກີດຂື້ນໄວເກີນໄປ
      return true;
    }

    // ອັບເດດເວລາ request ສຸດທ້າຍ
    this.requestTimestamps.set(ip, now);
    return false;
  }
}
