import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, SquarePlusIcon, ListIcon, ListCollapseIcon } from 'lucide-react';
import { useSelector } from 'react-redux';


const AdminSidebar = () => {
  const location = useLocation();
  const admin = useSelector((admin)=>admin.data.adminTheater?.theater)

  const adminNavLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Shows', path: '/admin/add-shows', icon: SquarePlusIcon },
    { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
    { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon }
  ];


  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
        alt="sidebar"
        src="/profile.png"
      />
      <p className="mt-2 text-base max-md:hidden text-center">{admin?.theater_name}</p>
      <div className="w-full">

        {adminNavLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 ${location.pathname === link.path
              ? 'text-primary bg-primary/15'
              : 'text-gray-400'
              } group`}
          >
            <link.icon />
            <p className="max-md:hidden">{link.name}</p>
            {location.pathname === link.path && (
              <span className="w-1.5 h-10 rounded-l right-0 absolute bg-primary"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
