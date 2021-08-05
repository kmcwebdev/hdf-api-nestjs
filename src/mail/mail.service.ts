import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { SendEmailWithHtmlDTO } from './interface/send-email-with-html.interface';
import { SendEmailWithTemplate } from './interface/send-email-with-template.interface';

/**
 * Unsubscribe group
 * 15220 - KMC Health notification
 */
@Injectable()
export class MailService {
  constructor(@InjectSendGrid() private client: SendGridService) {}

  async sendEmailWithHtml(data: SendEmailWithHtmlDTO) {
    try {
      const { to, subject, html, groupId, groupsToDisplay } = data;

      const sendEmailWithHtml = await this.client.send({
        to,
        subject,
        from: 'christian.sulit@kmc.solutions',
        html,
        asm: {
          groupId,
          groupsToDisplay,
        },
      });

      return sendEmailWithHtml;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async sendEmailWithTemplate(data: SendEmailWithTemplate) {
    const {
      to,
      from,
      templateId,
      dynamicTemplateData,
      groupId,
      groupsToDisplay,
    } = data;

    try {
      const sendEmailWithTemplate = await this.client.send({
        to,
        from,
        templateId,
        dynamicTemplateData,
        asm: {
          groupId,
          groupsToDisplay,
        },
      });

      return sendEmailWithTemplate;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
