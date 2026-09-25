import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, BookmarkCheck, BarChart3, Info, Search, Plus } from 'lucide-react';

export default function Navbar({ search, setSearch, onOpenAddModal }) {
  const navItems = [
    { to: '/', label: 'Catalogue', icon: BookOpen },
    { to: '/emprunts', label: 'Mes Emprunts', icon: BookmarkCheck },
    { to: '/statistiques', label: 'Statistiques', icon: BarChart3 },
    { to: '/a-propos', label: 'À Propos', icon: Info },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-indigo-400 hover:text-indigo-300 transition-colors">
            <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="hidden sm:inline">SmartLibrary</span>
          </NavLink>

          {/* Recherche rapide */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-400 text-sm border border-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Actions & Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau livre</span>
            </button>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800 text-indigo-400 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

        </div>
      </div>
    </header>
  );
}