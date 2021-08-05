export interface SendEmailWithTemplate {
  to: string;
  from: string;
  templateId: string;
  dynamicTemplateData: Record<string, unknown>;
  groupId: number;
  groupsToDisplay: number[];
}
