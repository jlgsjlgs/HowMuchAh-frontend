export type InvitationLinkStatus = 
  | 'ACTIVE'
  | 'EXPIRED';

export interface InvitationLink {
  id: string;
  token: string;
  link: string;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  createdAt: string;
}

export interface LinkDetails {
  linkId: string;
  groupId: string;
  groupName: string;
  createdByName: string;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
}

export interface ValidateLinkResponse {
  valid: boolean;
  linkDetails: LinkDetails;
}

export interface ClaimLinkRequest {
  linkId: string;
  token: string;
  email: string;
}