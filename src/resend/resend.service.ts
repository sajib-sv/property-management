import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { Resend } from 'resend';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class ResendService {
  private resend: Resend;
  private readonly logger = new Logger(ResendService.name);

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.get<string>(ENVEnum.RESEND_API_KEY),
    );
  }

  private compileTemplate(
    templatePath: string,
    data: Record<string, any>,
  ): string {
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(data);
  }

  async sendOTPCode(
    to: string,
    otpCode: string,
    subject: string = 'Your OTP Code',
  ): Promise<void> {
    const templatePath = path.join(__dirname, 'templates', 'otp-template.hbs');
    const htmlContent = this.compileTemplate(templatePath, { otpCode });

    try {
      await this.resend.emails.send({
        from: this.configService.get<string>(ENVEnum.RESEND_FROM_EMAIL)!,
        to,
        subject,
        html: htmlContent,
      });
      this.logger.log(`OTP sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${to}`, error);
      throw error;
    }
  }
}
