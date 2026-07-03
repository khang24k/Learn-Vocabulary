import React, { useState } from 'react';
import { BookOpen, Settings, Menu, X, Mic, LogIn, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileModal } from '../auth/ProfileModal';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar }) => {
  const { t, lastTopicId } = useSettings();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 ease-in-out flex flex-col h-[100dvh] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}
      >
        <div className={`flex items-center p-4 border-b border-slate-700 dark:border-slate-800 h-16 ${isCollapsed ? 'md:justify-center justify-between' : 'justify-between'}`}>
          <span className={`font-bold text-xl text-blue-400 truncate ${isCollapsed ? 'md:hidden' : 'block'}`}>
            {t.appTitle}
          </span>
          
          {/* Desktop Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-800 focus:outline-none flex-shrink-0"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={closeMobileSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 focus:outline-none flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col justify-between">
          <ul className="space-y-2 px-2">
            <li>
              <NavLink 
                to="/" 
                end
                onClick={closeMobileSidebar}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors group ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  } ${isCollapsed ? 'md:justify-center' : ''}`
                }
              >
                <Mic className="w-6 h-6 flex-shrink-0" />
                <span className={`ml-3 font-medium ${isCollapsed ? 'block md:hidden' : 'block'}`}>{t.voiceLookup}</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to={lastTopicId ? `/topic/${lastTopicId}` : "/topics"} 
                onClick={closeMobileSidebar}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors group ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  } ${isCollapsed ? 'md:justify-center' : ''}`
                }
              >
                <BookOpen className="w-6 h-6 flex-shrink-0" />
                <span className={`ml-3 font-medium ${isCollapsed ? 'block md:hidden' : 'block'}`}>{t.topics}</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/settings" 
                onClick={closeMobileSidebar}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors group ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  } ${isCollapsed ? 'md:justify-center' : ''}`
                }
              >
                <Settings className="w-6 h-6 flex-shrink-0" />
                <span className={`ml-3 font-medium ${isCollapsed ? 'block md:hidden' : 'block'}`}>{t.settings}</span>
              </NavLink>
            </li>
          </ul>

          <div className="p-4 border-t border-slate-700 dark:border-slate-800">
            {!isAuthenticated ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogIn className="w-6 h-6 shrink-0" />
                {!isCollapsed && <span className="font-medium">Đăng nhập</span>}
              </button>
            ) : (
              <div className="flex items-center justify-between group">
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-3 overflow-hidden text-left hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium truncate text-slate-200">
                      {user?.nickname}
                    </span>
                  )}
                </button>
                {!isCollapsed && (
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      </aside>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};
