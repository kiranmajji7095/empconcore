import "./index.css";

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-avatar">JS</div>
          <h4 className="profile-name">John Smith</h4>
          <p className="profile-role">Dashboard User</p>
        </div>

        <ul className="sidebar-menu">
          <li className="menu-item active">🏠 Home</li>
          <li className="menu-item">📊 Graph</li>
          <li className="menu-item">💬 Chat</li>
          <li className="menu-item">📩 Messages</li>
          <li className="menu-item">🔔 Notifications</li>
          <li className="menu-item">⚙️ Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <h2 className="page-title">Dashboard User</h2>
          <span className="search-icon">🔍</span>
        </header>

        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card blue">
            <p className="stat-label">Total Earnings</p>
            <h3 className="stat-value">$12,827.39</h3>
            <span className="stat-sub">+448</span>
          </div>

          <div className="stat-card white">
            <p className="stat-label">Total Visit</p>
            <h3 className="stat-value">383930494</h3>
            <span className="stat-sub">+275</span>
          </div>

          <div className="stat-card white">
            <p className="stat-label">Total Share</p>
            <h3 className="stat-value">281910289</h3>
            <span className="stat-sub">+13930</span>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-grid">
          <div className="chart-card">
            <h4 className="chart-title">Daily Result</h4>
            <div className="circle-chart"></div>
          </div>

          <div className="chart-card">
            <h4 className="chart-title">Monthly Progress</h4>
            <div className="bar-chart">
              <span style={{ height: "70%" }}></span>
              <span style={{ height: "40%" }}></span>
              <span style={{ height: "85%" }}></span>
              <span style={{ height: "60%" }}></span>
              <span style={{ height: "90%" }}></span>
            </div>
          </div>
        </section>

        {/* Social Cards */}
        <section className="social-grid">
          <div className="social-card like">👍 128292 Like</div>
          <div className="social-card facebook">📘 172872 Share</div>
          <div className="social-card twitter">🐦 599285 Retweet</div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
