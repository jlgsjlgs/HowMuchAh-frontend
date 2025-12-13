import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedNavBar from "@/components/layout/AuthenticatedNavBar";
import Footer from "@/components/layout/Footer";
import CreateGroupCard from '@/components/dashboard/CreateGroupCard';
import CreateGroupModal from '@/components/dashboard/CreateGroupModal';
import GroupCard from '@/components/dashboard/GroupCard';
import ManageMembersModal from '@/components/dashboard/ManageMembersModal';
import SettingsModal from '@/components/dashboard/SettingsModal';
import DeleteGroupModal from '@/components/dashboard/DeleteGroupModal';
import LeaveGroupModal from '@/components/dashboard/LeaveGroupModal';
import { groupQueries } from "@/services/groups/queries";

type ModalType = 'create' | 'settings' | 'members' | 'leave' | 'delete' | null;

function Dashboard() {
  const { user } = useAuth();
  
  const [activeModal, setActiveModal] = useState<{
    type: ModalType;
    groupId: string | null;
  }>({ type: null, groupId: null });

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupQueries.getAll,
  });

  const handleOpenModal = (type: ModalType, groupId: string | null = null) => {
    setActiveModal({ type, groupId });
  };

  const handleCloseModal = () => {
    setActiveModal({ type: null, groupId: null });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavBar />
      
      {/* Main content area */}
      <main className="flex-1 container mx-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CreateGroupCard onClick={() => handleOpenModal('create')} />
            {groups
              ?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                currentUserId={user?.id || ''}
                onSettingsClick={() => handleOpenModal('settings', group.id)}
                onManageMembersClick={() => handleOpenModal('members', group.id)}
                onLeaveClick={() => handleOpenModal('leave', group.id)}
                onDeleteClick={() => handleOpenModal('delete', group.id)}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
      
      <CreateGroupModal 
        open={activeModal.type === 'create'} 
        onClose={handleCloseModal} 
      />

      <SettingsModal 
        open={activeModal.type === 'settings'} 
        onClose={handleCloseModal}
        group={groups?.find(g => g.id === activeModal.groupId) || null}
      />
      
      <ManageMembersModal 
        open={activeModal.type === 'members'} 
        onClose={handleCloseModal}
        groupId={activeModal.groupId}
      />
      
      <LeaveGroupModal 
        open={activeModal.type === 'leave'} 
        onClose={handleCloseModal}
        groupId={activeModal.groupId}
        groupName={groups?.find(g => g.id === activeModal.groupId)?.name}
      />
      
      <DeleteGroupModal 
        open={activeModal.type === 'delete'} 
        onClose={handleCloseModal}
        groupId={activeModal.groupId}
        groupName={groups?.find(g => g.id === activeModal.groupId)?.name}
      />
    </div>
  );
}

export default Dashboard;