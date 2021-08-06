import { registerAs } from '@nestjs/config';

export default registerAs('sendGrid', () => ({
  apiKey: process.env.SENDGRID_API_KEY,
  hdConfirmationGuest: process.env.HEALTH_DECLARATION_CONFIRMATION_GUEST,
  hdConfirmationMemberOnSite:
    process.env.HEALTH_DECLARATION_CONFIRMATION_MEMBER_ON_SITE,
  hdConfirmationMemberWorkingFromHome:
    process.env.HEALTH_DECLARATION_CONFIRMATION_MEMBER_WORKING_FROM_HOME,
  hdConfirmationMemberOnLeave:
    process.env.HEALTH_DECLARATION_CONFIRMATION_MEMBER_ON_LEAVE,
  hdGuestApproval: process.env.HEALTH_DECLARATION_GUEST_APPROVAL,
  hdGuestRejectionNotification:
    process.env.HEALTH_DECLARATION_GUEST_REJECTION_NOTIFICATION,
  hdGuestAdminNotification:
    process.env.HEALTH_DECLARATION_GUEST_ADMIN_NOTIFICATION,
  hdBuildingNotification: process.env.HEALTH_DECLARATION_BUILDING_NOTIFICATION,
  hdNeedsAttention: process.env.HEALTH_DECLARATION_NEEDS_ATTENTION,
  dhClearanceStatus: process.env.HEALTH_DECLARATION_CLEARANCE_STATUS,
}));
