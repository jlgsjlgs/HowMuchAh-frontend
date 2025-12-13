export interface Group {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string | null;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface GroupMember {
  id: string;
  userName: string;
  userEmail: string;
  joinedAt: string;
  isOwner: boolean;
}