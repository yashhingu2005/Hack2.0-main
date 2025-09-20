import React, { useState } from 'react';
import { 
  User, 
  UserCheck, 
  Settings, 
  Info, 
  Phone,
  Menu,
  X
} from 'lucide-react';

const SideMenuBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: UserCheck, label: 'Doctors', id: 'doctors' },
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: Info, label: 'About Us', id: 'about' },
    { icon: Phone, label: 'Emergency Contacts', id: 'emergency' }
  ];

  const [activeItem, setActiveItem] = useState('profile');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-[#00B3FF] to-[#5603BD] text-white transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          {isOpen && <h2 className="text-xl font-semibold">Medical Portal</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-6">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
                      activeItem === item.id
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    title={!isOpen ? item.label : ''}
                  >
                    <IconComponent size={20} className="min-w-[20px]" />
                    {isOpen && (
                      <span className="ml-3 text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-4 left-4 right-4 text-xs text-white/60 text-center">
            <p>© 2025 Medical Portal</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {menuItems.find(item => item.id === activeItem)?.label}
          </h1>
          <div className="text-gray-600">
            <p>Welcome to the {menuItems.find(item => item.id === activeItem)?.label.toLowerCase()} section.</p>
            <p className="mt-2">Select different menu items to navigate through the application.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenuBar;