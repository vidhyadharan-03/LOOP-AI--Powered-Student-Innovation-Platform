// ============================================
// FILE: ProjectDetails.jsx (COMPLETE WITH LIKE CHECK)
// ============================================
import React, { useState, useEffect } from "react";
import { X, Heart, Code, Tag as TagIcon, User } from "lucide-react";
import StatusBadge from "./StatusBadge";
import styles from "./ProjectDetails.module.css";

const ProjectDetailsModal = ({ project, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(project?.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!project) return null;

  // Check if user already liked this project when modal opens
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/projects/${project.id}/liked`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLikeStatus();
  }, [project.id]);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        alert("Please login to like projects");
        setIsLiking(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/projects/${project.id}/like`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      } else {
        alert("Failed to like project");
      }
    } catch (error) {
      console.error("Error liking project:", error);
      alert("Connection error. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContainer}>
          <img
            src={project.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=300&fit=crop"}
            alt={project.title}
            className={styles.image}
          />
          <button className={styles.closeButton} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h2 className={styles.title}>{project.title}</h2>
              <StatusBadge status={project.status} />
            </div>
            <button 
              className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
              onClick={handleLike}
              disabled={isLiking || isLoading}
              title={isLiked ? "Unlike" : "Like"}
            >
              <Heart 
                className={styles.heartIcon}
                fill={isLiked ? "currentColor" : "none"}
              />
              <span className={styles.likesCount}>{likesCount}</span>
            </button>
          </div>

          <p className={styles.description}>{project.abstractText}</p>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <TagIcon size={18} />
              Tags
            </h3>
            <div className={styles.tags}>
              {project.tags && project.tags.length > 0 ? (
                project.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))
              ) : (
                <span className={styles.emptyState}>No tags provided</span>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Code size={18} />
              Tech Stack
            </h3>
            <div className={styles.tags}>
              {project.techStack && project.techStack.length > 0 ? (
                project.techStack.map((tech, idx) => (
                  <span key={idx} className={styles.tech}>
                    {tech}
                  </span>
                ))
              ) : (
                <span className={styles.emptyState}>No tech stack provided</span>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.owner}>
              <div className={styles.ownerAvatar}>
                {project.owner?.initials || "U"}
              </div>
              <div className={styles.ownerInfo}>
                <div className={styles.ownerName}>
                  {project.owner?.fullName || "Unknown"}
                </div>
                <div className={styles.ownerLabel}>Project owner</div>
              </div>
            </div>
            <button className={styles.closeFooterButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;