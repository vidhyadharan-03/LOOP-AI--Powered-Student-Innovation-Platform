import React, { useEffect, useState } from "react";
import { Search, Filter, Rocket } from "lucide-react";
import ProjectCard from "./ProjectCard";
import ProjectDetailsModal from "./ProjectDetails";
import styles from "./ExploreProjects.module.css";

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/projects");
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Real-time Search Logic
  useEffect(() => {
    const results = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(results);
  }, [searchTerm, projects]);

  return (
    <div className={styles.exploreContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Explore Innovation</h1>
        <p className={styles.subtitle}>
          Discover and collaborate on the next generation of student-led initiatives.
        </p>

        {/* Search Bar Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search by project name, tech stack, or tags..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className={styles.loader}>
          <Rocket className={styles.spin} size={40} />
          <p>Scanning the Network...</p>
        </div>
      ) : (
        <div className={styles.projectsGrid}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onViewDetails={() => setSelectedProject(project)}
              />
            ))
          ) : (
            <div className={styles.noProjects}>
              <h3>No matches found</h3>
              <p>Try adjusting your search terms or browse all projects.</p>
              <button onClick={() => setSearchTerm("")} className={styles.resetBtn}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};

export default ExploreProjects;