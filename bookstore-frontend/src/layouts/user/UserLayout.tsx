import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
