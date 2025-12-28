import React from "react";
import { Heart, BookmarkPlus, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "./ProjectCard.module.css"; // Captured the styles object

const ProjectCard = ({ project, onViewDetails, onBookmark, onLike }) => {
  if (!project) return null;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={project.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop"}
          alt={project.title}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <button onClick={onViewDetails} className={styles.viewButton}>
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button 
          className={styles.bookmarkButton}
          onClick={() => onBookmark?.(project.id)}
        >
          <BookmarkPlus className="w-4 h-4" />
        </button>
        <div className={styles.badgeContainer}>
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.abstractText}</p>

        <div className={styles.tags}>
          {project.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.owner}>
            <div className={styles.ownerAvatar}>
              {project.owner?.initials || project.owner?.fullName?.charAt(0) || "U"}
            </div>
            <span className={styles.ownerName}>
              {project.owner?.fullName || "Unknown"}
            </span>
          </div>
          <div className={styles.likes}>
            <button 
              onClick={() => onLike?.(project.id)}
              className={styles.likeButton}
            >
              <Heart className="w-4 h-4" />
              <span>{project.likesCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;