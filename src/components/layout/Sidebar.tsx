import React from 'react';
import { BookOpen, Search, Settings, Menu, X, Mic } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar }) => {
  const { t, lastTopicId } = useSettings();

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
        className={`fixed md:sticky top-0 left-0 z-50 bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 ease-in-out flex flex-col h-screen ${
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

          </ul>

          <ul className="space-y-2 px-2 mt-auto">
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
        </nav>
      </aside>
    </>
  );
};
