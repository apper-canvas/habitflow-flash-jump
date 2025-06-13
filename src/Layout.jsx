import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;