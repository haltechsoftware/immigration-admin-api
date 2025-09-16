import { SetMetadata } from '@nestjs/common';

export const RECAPTCHA_KEY = 'recaptcha';

/**
 * Decorator ສຳຫລັບໃຫ້ບັງຄັບໃຊ້ reCAPTCHA
 * @param required - true ຫາກຕ້ອງການໃຫ້ບັງຄັບໃຊ້ reCAPTCHA
 */
export const RequireRecaptcha = (required: boolean = true) =>
  SetMetadata(RECAPTCHA_KEY, required);
