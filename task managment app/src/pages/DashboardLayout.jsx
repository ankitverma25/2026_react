import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ArrowUpRight, Check, ChevronDown, CircleHelp, Command, LayoutDashboard, ListTodo, LogOut, Menu, X } from 'lucide-react'
import useAuth from '../hooks/useAuth.js'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  // Yahan useState isliye use kiya hai kyunki mobile nav drawer ka open/close state isi responsive layout ke andar hi relevant hai.
  const [menuOpen, setMenuOpen] = useState(false)
  const isInsights = location.pathname.endsWith('/insights')

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <NavLink className="brand-mark" to="/app"><span className="brand-symbol"><Check size={19} strokeWidth={3} /></span> daymark</NavLink>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>
        <div className="workspace-label">WORKSPACE <ChevronDown size={13} /></div>
        <div className="workspace-switcher"><span className="workspace-avatar">A</span><span><strong>Atelier North</strong><small>Personal space</small></span><ChevronDown size={15} /></div>
        <p className="nav-caption">YOUR SPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <NavLink end to="/app"><ListTodo size={18} /><span>My tasks</span><span className="nav-count">09</span></NavLink>
          <NavLink to="/app/insights"><LayoutDashboard size={18} /><span>Insights</span></NavLink>
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-note"><div className="note-icon"><CircleHelp size={18} /></div><strong>A note to self</strong><p>Small steps count. Keep the next one visible.</p><button onClick={() => window.alert('You are doing fine. Keep going.')}>A little reminder <ArrowUpRight size={14} /></button></div>
        <div className="sidebar-bottom"><span className="keyboard-hint"><Command size={12} /> K</span><span>Quick find</span><span className="sidebar-version">BETA</span></div>
      </aside>
      {menuOpen && <button aria-label="Close navigation overlay" className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      <main className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={19} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{isInsights ? 'Insights' : 'My tasks'}</strong></div>
          <div className="topbar-actions"><span className="today-date">TUESDAY, SEPTEMBER 29</span><button className="avatar-button" title={user?.name || 'Account'} onClick={logout}>{(user?.name || 'A').slice(0, 1).toUpperCase()}</button><button className="logout-button" onClick={logout}><LogOut size={15} /><span>Sign out</span></button></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}