import React, { useState } from 'react';
import styles from './CreateProjectModal.module.css';

const CreateProjectModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    abstractText: '',
    imageUrl: '',
    tags: '',
    techStack: '',
    status: 'LOOKING_FOR_TEAM',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Convert comma-separated strings to Arrays for the Backend
    const formattedData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
      techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech !== ""),
    };

    try {
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        setErrorMessage("You must be logged in to create a project");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        alert("Project Created Successfully!");
        onSuccess(); // This triggers the dashboard refresh
        onClose(); // Close the modal
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Submission failed", error);
      setErrorMessage("Connection error. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2 className={styles.modalTitle}>Launch New Initiative</h2>
          <p className={styles.modalSubtitle}>Fill in the details to share your project with the community.</p>

          {errorMessage && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className={styles.input}
                placeholder="e.g. Eco-Track Dashboard"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Abstract / Description *</label>
              <textarea
                value={formData.abstractText}
                onChange={(e) => updateField('abstractText', e.target.value)}
                required
                rows={3}
                className={styles.textarea}
                placeholder="What problem are you solving?"
              />
            </div>

            <div className={styles.gridRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Tags (AI, Web, etc.)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => updateField('tags', e.target.value)}
                  className={styles.input}
                  placeholder="Comma separated"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Current Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className={styles.select}
                >
                  <option value="LOOKING_FOR_TEAM">Looking for Team</option>
                  <option value="LIVE">Live</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tech Stack</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => updateField('techStack', e.target.value)}
                className={styles.input}
                placeholder="React, Java, Python..."
              />
            </div>

            <div className={styles.buttonGroup}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;