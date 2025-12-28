import React from 'react';
import { Users, Star, Award } from 'lucide-react';
import styles from './ActivityFeed.module.css'; // <— import here

const ActivityFeed = ({ activities }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Activity</h3>
      <div className={styles.activityList}>
        {activities.map((activity, idx) => (
          <div key={idx} className={styles.activityItem}>
            <div className={styles.iconWrapper}>
              {activity.type === 'collab' && <Users className={styles.icon} />}
              {activity.type === 'review' && <Star className={styles.icon} />}
              {activity.type === 'milestone' && <Award className={styles.icon} />}
            </div>
            <div className={styles.content}>
              <p className={styles.activityText}>{activity.text}</p>
              <p className={styles.activityTime}>{activity.time}</p>
            </div>
            <button className={styles.viewButton}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
