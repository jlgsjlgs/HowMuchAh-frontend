import AuthenticatedNavBar from "@/components/layout/AuthenticatedNavBar";
import Footer from "@/components/layout/Footer";

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavBar/>

      <Footer/>
    </div>
  )
}


export default Dashboard