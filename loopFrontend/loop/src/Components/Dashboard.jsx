import React, { useEffect, useState } from "react";
import { Users, Folder, Sparkles, Shield, TrendingUp, Activity } from "lucide-react";
import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    activeProjects: 0,
    students: 0,
    collaborations: 0,
    mentors: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, statsRes] = await Promise.all([
        fetch("http://localhost:8080/api/projects"),
        fetch("http://localhost:8080/api/dashboard/stats")
      ]);
      setProjects(await projectsRes.json());
      setStats(await statsRes.json());
    } catch (err) {
      console.error("Dashboard Sync Failed:", err);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Innovation Hub</h1>
          <p className={styles.subtitle}>Track your impact and manage collaborative efforts.</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.newProjectBtn} onClick={() => setIsModalOpen(true)}>
            <Sparkles size={18} /> New Project
          </button>
        </div>
      </header>

      {/* Stats Section matched to your DashboardController */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><TrendingUp size={24} /></div>
          <div>
            <p className={styles.statValue}>{stats.activeProjects}</p>
            <p className={styles.statLabel}>Active Projects</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div>
            <p className={styles.statValue}>{stats.students}</p>
            <p className={styles.statLabel}>Students</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Folder size={24} /></div>
          <div>
            <p className={styles.statValue}>{stats.collaborations}</p>
            <p className={styles.statLabel}>Collaborations</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Shield size={24} /></div>
          <div>
            <p className={styles.statValue}>{stats.mentors}</p>
            <p className={styles.statLabel}>Mentors</p>
          </div>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>Recent Initiatives</h2>
          <div className={styles.projectsGrid}>
            {projects.slice(0, 6).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>

        <section className={styles.quickActions}>
          <h3 className={styles.quickTitle}>Quick Actions</h3>
          <div className={styles.actionsGrid}>
            <button className={styles.actionBtn}><Activity size={20} /> <span>Analytics</span></button>
            <button className={styles.actionBtn}><Users size={20} /> <span>Find Team</span></button>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            fetchDashboardData(); // Refresh UI after project is added to DB
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;