import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CreateGroupCardProps {
  onClick: () => void;
}

function CreateGroupCard({ onClick }: CreateGroupCardProps) {
  return (
    <Card 
      className="cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Plus className="h-8 w-8 mb-2" />
        <h3 className="font-semibold">Create New Expense Group</h3>
        <p className="text-sm mt-1">
          Start tracking expenses with friends
        </p>
      </CardContent>
    </Card>
  );
}

export default CreateGroupCard;