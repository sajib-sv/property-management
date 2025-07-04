import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: this.configService.get<string>(ENVEnum.MAIL_USER),
        pass: this.configService.get<string>(ENVEnum.MAIL_APP_PASSWORD),
      },
    });
  }

  async sendEmail(
    email: string,
    subject: string,
    mailTemplate: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const mailOptions = {
      from: `"No Reply" <${this.configService.get<string>(ENVEnum.MAIL_USER)}>`,
      to: email,
      subject,
      html: mailTemplate,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
