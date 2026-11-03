import Icon from './Icon.jsx';

export default function Sidebar({
  activeSection,
  onNavigate,
  onSettings,
  isOpen,
  onClose,
}) {
  const links = [
    { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'transactions' },
    { id: 'categories', label: 'Categories', icon: 'categories' },
  ];

  return (
    <>
      {isOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`sidebar ${isOpen ? 'is-open' : ''}`}
        aria-label="Main navigation"
      >
        <a
          className="brand"
          href="#overview"
          aria-label="SpendWise dashboard"
          onClick={() => onNavigate('overview')}
        >
          <span className="brand-mark">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path
                d="m10 12 5 16 5-11 5 11 5-16"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            SpendWise<span className="brand-dot">.</span>
          </span>
        </a>
        <p className="nav-caption">WORKSPACE</p>
        <nav>
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-label={link.label}
              className={`nav-item ${activeSection === link.id ? 'active' : ''}`}
              aria-current={activeSection === link.id ? 'location' : undefined}
              onClick={() => onNavigate(link.id)}
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
              {activeSection === link.id && <span className="nav-active-dot" />}
            </a>
          ))}
          <button
            className="nav-item"
            onClick={onSettings}
            aria-label="Settings"
          >
            <Icon name="settings" />
            <span>Settings</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-icon">
              <Icon name="leaf" size={22} />
            </span>
            <h3>
              A little clarity.
              <br />A lot of possibility.
            </h3>
            <p>Good money habits start with knowing where it goes.</p>
            <span className="note-line" />
            <span className="note-caption">MAKE ROOM FOR WHAT MATTERS</span>
          </div>
          <button
            className="profile"
            onClick={onSettings}
            aria-label="Open Jamie's workspace settings"
          >
            <span className="avatar">JD</span>
            <span className="profile-text">
              <strong>Jamie Davis</strong>
              <span>Personal account</span>
            </span>
            <Icon name="chevron" size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
