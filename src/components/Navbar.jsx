import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, ChevronDown, LayoutDashboard, Ticket, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reserve', label: 'Reservation', icon: Ticket },
  ];

  const currentPage = navItems.find((i) => i.path === location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bus-darker border-b border-bus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-bus-accent rounded-lg flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform duration-200">
                <Bus size={18} className="text-white" />
              </div>
              <div className="absolute -inset-1 bg-bus-accent/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-800 text-lg text-bus-text tracking-tight">BusRoute</span>
              <span className="text-[10px] font-mono text-bus-accent tracking-widest uppercase">Ticket System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bus-panel border border-bus-border text-bus-text hover:border-bus-accent/50 hover:text-bus-accent transition-all duration-200 font-body text-sm font-medium"
              >
                {currentPage ? (
                  <>
                    <currentPage.icon size={15} />
                    {currentPage.label}
                  </>
                ) : (
                  <>
                    <Menu size={15} />
                    Navigate
                  </>
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-bus-panel border border-bus-border rounded-xl shadow-panel overflow-hidden animate-slide-in">
                  <div className="p-1.5">
                    {navItems.map(({ path, label, icon: Icon }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all duration-150 ${
                          location.pathname === path
                            ? 'bg-bus-accent text-white'
                            : 'text-bus-text hover:bg-bus-border hover:text-bus-accent'
                        }`}
                      >
                        <Icon size={15} />
                        {label}
                        {location.pathname === path && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick links */}
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? 'text-bus-accent'
                    : 'text-bus-muted hover:text-bus-text'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-bus-muted hover:text-bus-text hover:bg-bus-panel transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-bus-border bg-bus-darker animate-slide-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all ${
                  location.pathname === path
                    ? 'bg-bus-accent text-white'
                    : 'text-bus-text hover:bg-bus-panel'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
