// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
import AuthenticatedNavBar from '@/components/layout/AuthenticatedNavBar';
import Footer from '@/components/layout/Footer';

function GroupDetail() {
  // const { groupId } = useParams<{ groupId: string }>();
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavBar />

      <Footer />
    </div>
  )
}

export default GroupDetail;