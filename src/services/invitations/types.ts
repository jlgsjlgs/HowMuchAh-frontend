
export type InvitationStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'REVOKED';

export interface Invitation {
  id: string;
  groupId: string;
  groupName: string;
  invitedEmail: string;
  invitedBy: string;
  invitedByEmail: string;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SendInvitationRequest {
  invitedEmail: string;
}