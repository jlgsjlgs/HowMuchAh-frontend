import { Settings, UserPlus, LogOut, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Group } from '@/services/groups/types';

interface GroupCardProps {
  group: Group;
  currentUserId: string;
  onSettingsClick: () => void;
  onManageMembersClick: () => void;
  onLeaveClick: () => void;
  onDeleteClick: () => void;
}

function GroupCard({
  group,
  currentUserId,
  onSettingsClick,
  onManageMembersClick,
  onLeaveClick,
  onDeleteClick,
}: GroupCardProps) {
  const isOwner = group.ownerId === currentUserId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="break-all overflow-hidden">{group.name}</CardTitle>
        {group.description && (
          <p className="text-sm text-muted-foreground mt-1 break-words line-clamp-2">
            {group.description.length > 100 
              ? `${group.description.substring(0, 100)}...` 
              : group.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-sm">
          <p className="text-muted-foreground">
            Owner: <span className="font-medium">{group.ownerName}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        {isOwner ? (
          <>
            {/* Owner buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onManageMembersClick}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Members
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        ) : (
          <>
            {/* Non-owner buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLeaveClick}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Leave
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default GroupCard;