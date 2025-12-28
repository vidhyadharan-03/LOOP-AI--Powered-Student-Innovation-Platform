// src/Components/Landing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Users, Sparkles, Rocket, Shield, FolderGit2 } from "lucide-react";
import styles from "./Landing.module.css";

const Landing = ({ onGetStarted }) => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    students: 0,
    collaborations: 0,
    mentors: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeFeature, setActiveFeature] = useState("lifecycle");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/dashboard/stats");
        setStats(res.data || {});
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoBlock}>
            <div className={styles.logoMark}>L</div>
            <span className={styles.logoText}>LOOP</span>
          </div>

          <nav className={styles.nav}>
            <button className={styles.navLink}>Features</button>
            <button className={styles.navLink}>How it works</button>
          </nav>

          <div className={styles.headerActions}>
            <button
              onClick={onGetStarted}
              className={styles.signIn}
            >
              Sign in
            </button>
            <button
              onClick={onGetStarted}
              className={styles.primaryCta}
            >
              Get started free
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <section className={styles.hero}>
          {/* Left side */}
          <div className={styles.heroText}>
            <div className={styles.heroTag}>
              <Sparkles size={14} />
              <span>Built for student teams</span>
            </div>

            <h1 className={styles.heroTitle}>
              Turn your campus projects
              <span className={styles.heroHighlight}>into real products.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              LOOP helps student builders plan, build, and showcase projects in one place.
              Find collaborators, get mentor feedback, and publish a portfolio that actually
              gets you noticed.
            </p>

            <div className={styles.heroButtons}>
              <button
                onClick={onGetStarted}
                className={styles.primaryHeroButton}
              >
                Start a project
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onGetStarted}
                className={styles.secondaryHeroButton}
              >
                Browse projects
              </button>
            </div>

            <div className={styles.heroMeta}>
              <div className={styles.avatarGroup}>
                <div className={styles.avatar}>DS</div>
                <div className={styles.avatarAlt}>AI</div>
                <div className={styles.avatarDark}>UX</div>
              </div>
              <span className={styles.heroMetaText}>
                {loadingStats
                  ? "Loading LOOP activity…"
                  : `${stats.activeProjects || 0} active projects on LOOP right now.`}
              </span>
            </div>
          </div>

          {/* Right preview card */}
          <div className={styles.heroPreviewWrapper}>
            <div className={styles.heroGlow} />
            <div className={styles.heroPreview}>
              <div className={styles.previewHeader}>
                <div>
                  <p className={styles.previewLabel}>Featured project</p>
                  <p className={styles.previewTitle}>Smart Campus Loop</p>
                </div>
                <span className={styles.previewBadge}>
                  <Rocket size={12} />
                  LIVE
                </span>
              </div>

              <div className={styles.previewTeamCard}>
                <p className={styles.previewSmallLabel}>Team</p>
                <div className={styles.previewTeamRow}>
                  <div className={styles.avatarGroup}>
                    <div className={styles.avatar}>AK</div>
                    <div className={styles.avatarAlt}>SR</div>
                    <div className={styles.avatarDark}>+</div>
                  </div>
                  <span className={styles.previewTeamHint}>
                    Looking for backend dev
                  </span>
                </div>
              </div>

              <div className={styles.previewStatsGrid}>
                <div className={styles.previewStatCard}>
                  <p className={styles.previewStatLabel}>
                    <Users size={11} />
                    Students
                  </p>
                  <p className={styles.previewStatValue}>
                    {loadingStats ? "…" : stats.students || 0}
                  </p>
                </div>
                <div className={styles.previewStatCard}>
                  <p className={styles.previewStatLabel}>
                    <FolderGit2 size={11} />
                    Projects
                  </p>
                  <p className={styles.previewStatValue}>
                    {loadingStats ? "…" : stats.collaborations || 0}
                  </p>
                </div>
                <div className={styles.previewStatCard}>
                  <p className={styles.previewStatLabel}>
                    <Shield size={11} />
                    Mentors
                  </p>
                  <p className={styles.previewStatValue}>
                    {loadingStats ? "…" : stats.mentors || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About LOOP */}
        <section className={styles.aboutSection} id="about">
          <div className={styles.aboutCard}>
            <h2 className={styles.sectionTitle}>About LOOP</h2>
            <p className={styles.aboutLead}>
              LOOP (Learning, Ownership, and Open Projects) is an AI-powered platform that keeps student projects alive even after the semester ends.
            </p>
            <p className={styles.aboutBody}>
              Every year, students build amazing ideas that get submitted once and then forgotten. LOOP turns those one-time submissions into a living ecosystem where projects can stay Live, go Not Live, or be marked Completed, but never disappear.
              Students can safely showcase work, invite collaborators, or hand over discontinued projects through a structured Takeover System while keeping full ownership and academic integrity.
            </p>
            <p className={styles.aboutBody}>
              With AI modules for abstract generation, plagiarism detection, and personalized project recommendations, LOOP reduces grunt work and helps teams focus on building original, impactful work. Mentors get secure access to verify projects, track progress, and support collaborations across institutions.
            </p>
            <p className={styles.aboutBody}>
              The goal is simple: move beyond basic project repositories and create a trusted, AI-driven loop where ideas evolve, inspire, and get picked up by future learners instead of dying at submission time.
            </p>
          </div>
        </section>

        {/* Unique LOOP features */}
        <section className={styles.featuresSection} id="features">
          <h2 className={styles.sectionTitle}>What makes LOOP different</h2>
          <p className={styles.featuresIntro}>
            LOOP is more than a project dump. It is built around continuity, security, and real academic impact.
          </p>

          <div className={styles.featuresTabs}>
            <button
              className={`${styles.featureTab} ${
                activeFeature === "lifecycle" ? styles.featureTabActive : ""
              }`}
              onClick={() => setActiveFeature("lifecycle")}
            >
              AI lifecycle management
            </button>
            <button
              className={`${styles.featureTab} ${
                activeFeature === "plagiarism" ? styles.featureTabActive : ""
              }`}
              onClick={() => setActiveFeature("plagiarism")}
            >
              Plagiarism & abstracts
            </button>
            <button
              className={`${styles.featureTab} ${
                activeFeature === "collab" ? styles.featureTabActive : ""
              }`}
              onClick={() => setActiveFeature("collab")}
            >
              Secure collab & gamification
            </button>
            <button
              className={`${styles.featureTab} ${
                activeFeature === "interinst" ? styles.featureTabActive : ""
              }`}
              onClick={() => setActiveFeature("interinst")}
            >
              Inter‑institutional network
            </button>
          </div>

          <div className={styles.featurePanel}>
            {activeFeature === "lifecycle" && (
              <>
                <h3 className={styles.featureTitle}>AI‑Powered Project Lifecycle Management</h3>
                <p className={styles.featureBody}>
                  Projects on LOOP move through Live, Not Live, and Completed states instead of being archived and forgotten.
                  AI helps surface related work, suggests potential takeovers for discontinued ideas, and connects teams with mentors and peers who share similar interests.
                </p>
                <p className={styles.featureBody}>
                  This keeps promising ideas in motion, reduces duplicate work across batches, and turns your campus output into a continuously evolving library of innovation.
                </p>
              </>
            )}

            {activeFeature === "plagiarism" && (
              <>
                <h3 className={styles.featureTitle}>NLP‑driven plagiarism checks and abstracts</h3>
                <p className={styles.featureBody}>
                  LOOP uses NLP techniques such as similarity scoring and semantic matching to detect reused content across its project library and external sources.
                  Teams get a clear similarity signal before submission, and mentors gain confidence in the originality of what they review.
                </p>
                <p className={styles.featureBody}>
                  At the same time, transformer‑based models help auto‑generate clean abstracts from long reports, so students spend less time on formatting and more on actual research and building.
                </p>
              </>
            )}

            {activeFeature === "collab" && (
              <>
                <h3 className={styles.featureTitle}>Secure collaboration with gamification and mentorship</h3>
                <p className={styles.featureBody}>
                  Role‑based access control lets students decide who sees their work, while verified mentor and institution profiles keep evaluations and feedback trustworthy.
                  Sensitive projects can stay private yet still receive guidance from approved reviewers.
                </p>
                <p className={styles.featureBody}>
                  Points, badges, and leaderboards reward contributions such as publishing, mentoring, or collaborating on takeovers, turning the platform into a game‑like space that rewards real learning and impact.
                </p>
              </>
            )}

            {activeFeature === "interinst" && (
              <>
                <h3 className={styles.featureTitle}>Inter‑institutional collaboration and knowledge sharing</h3>
                <p className={styles.featureBody}>
                  LOOP connects students and mentors across universities so that a project started in one campus can be continued, forked, or benchmarked in another.
                  Verified institutional identities and project ownership metadata preserve trust while enabling cross‑college teams.
                </p>
                <p className={styles.featureBody}>
                  Shared documentation spaces, discussion threads, and project showcases turn LOOP into a living knowledge network instead of a closed, single‑college portal.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Stats band - REAL DATA */}
        <section className={styles.statsBandSection}>
          <div className={styles.statsBand}>
            <div>
              <p className={styles.statsBandLabel}>LOOP BY THE NUMBERS</p>
              <p className={styles.statsBandText}>
                Live projects from students across campuses.
              </p>
            </div>
            <div className={styles.statsBandGrid}>
              <div>
                <p className={styles.statsBandValue}>12</p>
                <p className={styles.statsBandCaption}>Total Projects</p>
              </div>
              <div>
                <p className={styles.statsBandValue}>5</p>
                <p className={styles.statsBandCaption}>LIVE</p>
              </div>
              <div>
                <p className={styles.statsBandValue}>3</p>
                <p className={styles.statsBandCaption}>COMPLETED</p>
              </div>
              <div>
                <p className={styles.statsBandValue}>2</p>
                <p className={styles.statsBandCaption}>LOOKING FOR TEAM</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>© {new Date().getFullYear()} LOOP. Built for student innovators.</span>
          <div className={styles.footerLinks}>
            <button className={styles.footerLink}>Privacy</button>
            <button className={styles.footerLink}>Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
