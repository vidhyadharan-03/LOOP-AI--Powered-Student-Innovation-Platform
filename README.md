# LOOP: AI-Powered Student Innovation Platform 🌀

> **Turn your campus projects into real products.** > LOOP helps student builders plan, build, and showcase projects in one place. Find collaborators, get mentor feedback, and publish a portfolio that actually gets you noticed.

---

## 📖 Table of Contents
* [About the Project](#about)
* [Visual Overview](#visual-overview)
* [Key Features](#features)
* [System Architecture](#system-architecture)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

---

## 📝 About
**LOOP (Learning, Ownership, and Open Projects)** is a comprehensive ecosystem designed to transform academic projects into continuous cycles of innovation. Traditional academic work often gathers "digital dust" after grading; LOOP ensures these ideas live on. 

By using AI to bridge the gap between ideation and execution, LOOP allows students to find the right teammates (e.g., "Looking for backend dev"), track project status in real-time, and maintain a professional innovation portfolio.

---

## 🖼️ Visual Overview

### 1. Landing Page
The gateway to the platform, highlighting active projects and community stats.
<img width="1912" height="912" alt="landingpage" src="https://github.com/user-attachments/assets/f5f49874-d7af-486f-8420-a0f8fb6b3591" />


### 2. User Authentication
A seamless, secure login and registration flow with real-time feedback.
<img width="1333" height="792" alt="loginpage" src="https://github.com/user-attachments/assets/1df0fd3d-b358-4aff-903a-6152c0edd81a" />

<img width="710" height="697" alt="register user page" src="https://github.com/user-attachments/assets/fef20e49-5bdc-4fa6-bfc2-c42106b433da" />


### 3. Main Dashboard
The central hub where users can explore existing innovations or start building their own.
<img width="1917" height="889" alt="main dashboard" src="https://github.com/user-attachments/assets/1b9ba63a-41d2-4fbd-9d6d-9119a94072f0" />


### 4. Project Initiation
"Launch New Initiative" modal for capturing project abstracts, tech stacks, and collaboration needs.

<img width="1904" height="895" alt="create project page" src="https://github.com/user-attachments/assets/2739ef78-1982-4cf8-836b-c2f51cde3391" />

<img width="1917" height="697" alt="existing projects2" src="https://github.com/user-attachments/assets/22a1c90c-9997-4efb-9368-9a8ecce89150" />
<img width="1383" height="883" alt="projectdetailspage" src="https://github.com/user-attachments/assets/550492a0-261a-482a-81c4-c49f25d651ba" />

---

## ✨ Features
* **AI-Powered Insights:** Automatic abstract generation and project recommendations using T5/BART transformers.
* **Smart Collaboration:** Status-based project tracking (Looking for Team, In Progress, Completed).
* **Plagiarism Detection:** Ensures originality using TF-IDF and Cosine Similarity.
* **Role-Based Access:** Secure JWT-based authentication for Students, Mentors, and Admins.
* **Gamified Ecosystem:** Earn points and badges for contributing to open-source campus projects.

---

## 🏗️ System Architecture


The platform follows a decoupled microservices-inspired architecture:

1.  **Frontend:** React 18+ (Vite) styled with Tailwind CSS for a responsive, high-performance UI.
2.  **Backend API:** Spring Boot 3.x handling business logic, security (JWT), and data persistence.
3.  **AI Engine:** Python-based Flask services running NLP models for abstracting and matching.
4.  **Database:** MySQL 8.0 for structured relational data (Users, Projects, Teams).

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Axios |
| **Backend** | Java 17, Spring Boot, Spring Security, JPA |
| **AI/ML** | Python 3.9, TensorFlow, HuggingFace, Scikit-learn |
| **Database** | MySQL, Hibernate |
| **DevOps** | Git, Docker, GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
* Java 17+
* Node.js 18+
* Python 3.9+
* MySQL 8.0

### Installation
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/yourusername/loop-platform.git](https://github.com/yourusername/loop-platform.git)
