import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import FreeshipBanner from '@/components/common/freeship-banner';
import MobileHeader from './MobileHeader';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <FreeshipBanner />
      <Header />
      <MobileHeader />
      <main className="flex-grow container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
