import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RECAPTCHA_KEY } from '../decorators/recaptcha.decorator';
import { GoogleRecaptchaService } from '../google-recaptcha/recaptcha.service';

@Injectable()
export class GoogleRecaptchaGuard implements CanActivate {
  constructor(
    private readonly _googleRecaptchaService: GoogleRecaptchaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ກວດສອບວ່າ route ນີ້ຕ້ອງການ reCAPTCHA ຫຼື ບໍ່
    const requireRecaptcha = this.reflector.getAllAndOverride<boolean>(
      RECAPTCHA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireRecaptcha) {
      return true; // ບໍ່ຕ້ອງການ reCAPTCHA
    }

    const request = context.switchToHttp().getRequest<Request>();
    const recaptchaToken = this.extractRecaptchaToken(request);

    if (!recaptchaToken) {
      return false;
    }

    // ດຶງ IP address
    const clientIp = this.getClientIp(request);

    try {
      // ກວດສອບ reCAPTCHA token
      const isValid = await this._googleRecaptchaService.verifyRecaptchaToken(
        recaptchaToken,
      );
      return isValid;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error('reCAPTCHA Guard error:', message);

      // ຖ້າ error ເເມ່ນ NestJS HttpException ຢູ່ເເລ້ວໃຫ້ throw ເໝືອນເດີມ
      if (error instanceof HttpException) {
        throw error;
      }

      // ຖ້າບໍ່ແມ່ນ HttpException ຈະ throw ເປັນ BadRequestException
      throw new BadRequestException(message);
    }
  }

  /**
   * ດຶງ reCAPTCHA token ຈາກ request
   */
  private extractRecaptchaToken(request: Request): string | null {
    // ລອງຫາຈາກ body
    if (request.body?.recaptchaToken) {
      return request.body.recaptchaToken;
    }

    // ລອງຫາຈາກ headers
    const headerToken = request.headers['x-recaptcha-token'];
    if (headerToken && typeof headerToken === 'string') {
      return headerToken;
    }

    // ລອງຫາຈາກ query parameters
    if (
      request.query?.recaptchaToken &&
      typeof request.query.recaptchaToken === 'string'
    ) {
      return request.query.recaptchaToken;
    }

    return null;
  }

  /**
   * ดึง IP address ของ client
   */
  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (request.headers['x-real-ip'] as string) ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      '0.0.0.0'
    );
  }
}
