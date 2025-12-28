import React from "react";
import styles from "./Hero.module.css";  // ← Change this line (remove quotes)

const Hero = () => {
  return (
    <div className={styles.hero}>        {/* ← Add styles. prefix */}
      <div className={styles.pattern}></div>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Where Student Innovation Comes to Life
          </h1>
          <p className={styles.subtitle}>
            Showcase your projects, collaborate with peers, and get mentored by
            industry experts.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryButton}>
              Explore Projects
            </button>
            <button className={styles.secondaryButton}>
              Start Building
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
