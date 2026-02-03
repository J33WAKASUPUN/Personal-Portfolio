import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from '../pages/DashboardHome';
import HeroManagement from '../pages/HeroManagement';
import ProjectsManagement from '../pages/ProjectsManagement';
import TechStackManagement from '../pages/TechStackManagement';
import ExperienceManagement from '../pages/ExperienceManagement';
import BlogsManagement from '../pages/BlogsManagement';
import CertificationsManagement from '../pages/CertificationsManagement';
import SocialLinksManagement from '../pages/SocialLinksManagement';
import AnalyticsPage from '../pages/AnalyticsPage';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="home" element={<DashboardHome />} />
            <Route path="hero" element={<HeroManagement />} />
            <Route path="projects" element={<ProjectsManagement />} />
            <Route path="tech-stack" element={<TechStackManagement />} />
            <Route path="experience" element={<ExperienceManagement />} />
            <Route path="blogs" element={<BlogsManagement />} />
            <Route path="certifications" element={<CertificationsManagement />} />
            <Route path="social-links" element={<SocialLinksManagement />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;