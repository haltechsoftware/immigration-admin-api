import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  score?: number; // ສຳຫລັບ reCAPTCHA v3
}

@Injectable()
export class GoogleRecaptchaService {
  private readonly secretKey: string;
  private readonly verifyUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    if (!secretKey) {
      throw new Error('Recaptcha secret key is not configured');
    }
    this.secretKey = secretKey;

    this.verifyUrl =
      process.env.RECAPTCHA_VERIFY_URL ||
      'https://www.google.com/recaptcha/api/siteverify';
  }

  /**
   * ກວດສອບ reCAPTCHA token
   * @param token - reCAPTCHA response token ຈາກ frontend
   * @param remoteIp - IP address ຂອງ user (optional)
   * @returns Promise<boolean>
   */
  async verifyRecaptchaToken(token: string): Promise<boolean> {
    if (!token) {
      throw new HttpException(
        'reCAPTCHA token is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // ສ້າງ form data ສຳຫລັບສົ່ງ request
      const formData = new URLSearchParams();
      formData.append('secret', this.secretKey);
      formData.append('response', token);

      // ສົ່ງ request ໄປ Google reCAPTCHA API
      const response = await firstValueFrom(
        this.httpService.post<RecaptchaResponse>(this.verifyUrl, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 5000, // 5 seconds timeout
        }),
      );

      const captchaData = response.data;

      // ກວດສອບຜົນການຕອບສະໜອງ
      if (!captchaData.success) {
        throw new ForbiddenException(
          `reCAPTCHA verification failed: ${captchaData['error-codes']}`,
        );
      }

      // ກວດສອບວ່າ hostname ຕ້ອງຖືກຕ້ອງເງື່ອນໄຂ ເເລະ ກວດສອບສະເພາະເເຕ່ (ໃນ production ເທົ່ານັ້ນ)
      if (process.env.NODE_ENV === 'production') {
        const allowedHosts = ['immigration.gov.la', 'www.immigration.gov.la'];

        if (
          !captchaData.hostname ||
          !allowedHosts.includes(captchaData.hostname)
        ) {
          throw new BadRequestException(
            `Invalid hostname: ${captchaData.hostname}`,
          );
        }
      }

      // ສຳຫລັບ reCAPTCHA v3 - ກວດສອບ score
      if (captchaData.score !== undefined) {
        const minScore = 0.5; // ປັບໄດ້ຕາມຕ້ອງການ (0.0 - 1.0)
        if (captchaData.score < minScore) {
          throw new BadRequestException(
            `reCAPTCHA score too low: ${captchaData.score}`,
          );
        }
      }

      return true;
    } catch (error) {
      console.error('Error verifying reCAPTCHA:', error);
      throw error;
    }
  }
}
