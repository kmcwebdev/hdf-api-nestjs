import { registerAs } from '@nestjs/config';

export default registerAs('sendGrid', () => ({
  apiKey: process.env.SENDGRID_API_KEY,
  hdConfirmation: process.env.HEALTH_DECLARATION_CONFIRMATION,
  hdGuestApproval: process.env.HEALTH_DECLARATION_GUEST_APPROVAL,
  hdGuestRejectionNotification:
    process.env.HEALTH_DECLARATION_GUEST_REJECTION_NOTIFICATION,
  hdGuestAdminNotification:
    process.env.HEALTH_DECLARATION_GUEST_ADMIN_NOTIFICATION,
  hdBuildingNotification: process.env.HEALTH_DECLARATION_BUILDING_NOTIFICATION,
  hdNeedsAttention: process.env.HEALTH_DECLARATION_NEEDS_ATTENTION,
  dhClearanceStatus: process.env.HEALTH_DECLARATION_CLEARANCE_STATUS,
}));
