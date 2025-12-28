import React from "react";
import styles from "./StatsCard.module.css"; 

const StatsSection = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={styles.statCard}>
              <Icon className={styles.icon} />
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Add this line back to the bottom:
export default StatsSection;