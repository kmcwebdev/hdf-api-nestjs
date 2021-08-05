export interface SendEmailWithHtmlDTO {
  to: string;
  subject: string;
  html: string;
  groupId: number;
  groupsToDisplay: number[];
}
