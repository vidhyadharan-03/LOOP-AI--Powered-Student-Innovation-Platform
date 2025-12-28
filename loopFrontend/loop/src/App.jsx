import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Award,
} from "lucide-react";

import AuthForm from "./Components/Auth";
import Navigation from "./Components/Navigation";
import Hero from "./Components/Hero";
import StatsSection from "./Components/Stats";
import ProjectCard from "./Components/ProjectCard";
import ProjectDetailsModal from "./Components/ProjectDetails";
import CreateProjectModal from "./Components/CreateProjectModal";
import ActivityFeed from "./Components/ActivityFeed";
import Landing from "./Components/Landing";

// ============ Main App Component ============
export default function App() {
  // ===== State Management =====
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount] = useState(3);

  // ===== Static Data =====
  const stats = [
    { label: "Active Projects", value: projects.length.toString(), icon: TrendingUp },
    { label: "Students", value: "0", icon: Users },
    { label: "Collaborations", value: "0", icon: MessageSquare },
    { label: "Mentors", value: "0", icon: Award },
  ];

  const activities = [
    {
      type: "collab",
      text: "Sarah Chen invited you to collaborate on AI Study Assistant",
      time: "2 hours ago",
    },
    {
      type: "review",
      text: "Dr. Martinez reviewed your Campus Sustainability Tracker",
      time: "5 hours ago",
    },
    {
      type: "milestone",
      text: "Your project reached 50 likes!",
      time: "1 day ago",
    },
  ];

  // ===== Auto-login check on app start =====
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const res = await axios.get("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({
            id: res.data.id,
            fullName: res.data.fullName,
            email: res.data.email,
          });
        } catch (err) {
          localStorage.removeItem("jwtToken");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // ===== Load projects when user logs in =====
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // ===== Fetch Projects =====
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(
        res.data.map((project) => ({
          id: project.id,
          title: project.title,
          abstractText: project.abstractText,
          imageUrl: project.imageUrl,
          owner: {
            fullName: project.owner?.fullName || "Unknown",
            initials: project.owner?.fullName?.charAt(0) || "U",
          },
          tags: project.tags || [],
          techStack: project.techStack || [],
          status: project.status,
          likesCount: project.likesCount ?? 0,
          bookmarked: false,
        }))
      );
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  // ===== Authentication Handlers =====
  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("jwtToken", res.data.token);
      setUser({
        id: res.data.userId,
        fullName: res.data.fullName,
        email: res.data.email,
      });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Login failed. Check credentials."
      );
    }
  };

  const handleRegister = async (fullName, email, password) => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        fullName,
        email,
        password,
      });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  // ===== View Details Handlers =====
  const openDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const closeDetails = () => {
    setShowDetailsModal(false);
    setSelectedProject(null);
  };

  // ===== Filter Projects by Tab =====
  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ===== Not logged in: Landing → Auth =====
  if (!user) {
    if (!showAuth) {
      return <Landing onGetStarted={() => setShowAuth(true)} />;
    }

    return (
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  // ===== Main App Render =====
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        user={user}
        notificationCount={notificationCount}
        onCreateProject={() => setShowCreateModal(true)}
      />

      <Hero />
      <StatsSection stats={stats} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Projects */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex overflow-x-auto border-b border-gray-200 px-4">
                {["all", "LIVE", "LOOKING_FOR_TEAM", "COMPLETED"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-4 font-medium text-sm whitespace-nowrap transition relative ${
                      activeTab === tab
                        ? "text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "all"
                      ? "All"
                      : tab
                          .split("_")
                          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                          .join(" ")}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={() => openDetails(project)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by creating your first project!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition"
                >
                  Create Project
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-16 mt-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Innovation?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join hundreds of students building the future.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold shadow-lg hover:shadow-xl transition text-lg"
          >
            Start Your Project
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchProjects}
        />
      )}

      {showDetailsModal && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={closeDetails}
        />
      )}
    </div>
  );
}