import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Plus, Menu, X, User, LogOut } from "lucide-react";
import styles from "./Navigation.module.css";

const Navigation = ({ user, notificationCount, onCreateProject }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const delaySearch = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/api/projects/search?query=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  // Handle view profile
  const handleViewProfile = () => {
    console.log("View profile clicked");
    // Add navigation to profile page here
    setShowProfileDropdown(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <h1 className={styles.logo}>LOOP</h1>
            
            {/* Search Box with Results */}
            <div className={styles.searchWrapper} ref={searchRef}>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {searchResults.map((project) => (
                    <div
                      key={project.id}
                      className={styles.searchResultItem}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery("");
                        console.log("Open project:", project.id);
                        // Add navigation logic here
                      }}
                    >
                      <div className={styles.searchResultContent}>
                        <div className={styles.searchResultTitle}>{project.title}</div>
                        <div className={styles.searchResultSubtitle}>
                          by {project.owner?.fullName || "Unknown"}
                        </div>
                      </div>
                      <div className={styles.searchResultBadge}>
                        {project.status?.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className={styles.searchResults}>
                  <div className={styles.noResults}>No projects found</div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            <button className={styles.notificationButton}>
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className={styles.notificationBadge}>
                  {notificationCount}
                </span>
              )}
            </button>

            <button onClick={onCreateProject} className={styles.createButton}>
              <Plus className="w-4 h-4 inline mr-2" />
              Create Project
            </button>

            {/* Profile Section with Dropdown */}
            <div className={styles.profileWrapper} ref={profileDropdownRef}>
              <div
                className={styles.userSection}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className={styles.avatar}>
                  {user?.fullName ? user.fullName.charAt(0) : "U"}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user?.fullName || "User"}</div>
                  <div className={styles.userEmail}>{user?.email || "user@email.com"}</div>
                </div>
              </div>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className={styles.profileDropdown}>
                  <button className={styles.dropdownItem} onClick={handleViewProfile}>
                    <User className="w-5 h-5" />
                    <span>View Profile</span>
                  </button>
                  <div className={styles.dropdownDivider}></div>
                  <button className={styles.dropdownItemDanger} onClick={handleLogout}>
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={styles.mobileMenuButton}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;