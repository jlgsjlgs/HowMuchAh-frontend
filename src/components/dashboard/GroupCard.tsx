import { Settings, UserPlus, LogOut, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const isOwner = group.ownerId === currentUserId;

  const handleCardClick = () => {
    navigate(`/group/${group.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation(); 
    callback();
  };

  return (
    <Card 
      className="flex flex-col h-full max-w-full overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="break-words pb-2 min-w-0">{group.name}</CardTitle>
        <div className="h-10 min-w-0">
          {group.description && (
            <p className="text-sm text-muted-foreground mt-1 break-words line-clamp-2 min-w-0">
              {group.description.length > 100 
                ? `${group.description.substring(0, 100)}...` 
                : group.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-sm">
          <p className="text-muted-foreground">
            Owner: <span className="font-medium break-words">{group.ownerName}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 mt-auto">
        {isOwner ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleButtonClick(e, onSettingsClick)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleButtonClick(e, onManageMembersClick)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Members
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => handleButtonClick(e, onDeleteClick)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleButtonClick(e, onLeaveClick)}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Leave
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default GroupCard;