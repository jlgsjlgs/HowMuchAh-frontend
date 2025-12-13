import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import AuthenticatedNavBar from "@/components/layout/AuthenticatedNavBar";
import Footer from "@/components/layout/Footer";
import CreateGroupCard from '@/components/dashboard/CreateGroupCard';
import CreateGroupModal from '@/components/dashboard/CreateGroupModal';
import { groupQueries } from "@/services/groups/queries";

function Dashboard() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupQueries.getAll,
  });

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
            <CreateGroupCard onClick={() => setCreateModalOpen(true)} />
            {groups?.map((group) => (
              <div key={group.id}>
                {/* TODO: Replace with GroupCard component */}
                <p>{group.name}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
      
      <CreateGroupModal 
        open={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </div>
  );
}

export default Dashboard;