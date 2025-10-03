# Classroom Q&A Management System

A full-stack web application designed for efficient class management, student Q&A, and role-based workflows. Built with **React**, **Express**, and **Supabase**.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Authentication & Authorization](#authentication--authorization)
  - [Role-Based Dashboards](#role-based-dashboards)
  - [Class Management](#class-management)
  - [Classroom Interaction](#classroom-interaction)
  - [TA Workflow](#ta-workflow)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [License](#license)

---

## Tech Stack
- **Frontend:** React, React Router, JSX, Tailwind/CSS
- **Backend:** Express.js, Node.js
- **Database:** Supabase (PostgreSQL)
- **Real-time Communication:** Socket.io
- **Authentication & Authorization:** Supabase Auth, Role-Based Access

---

## Features

### Authentication & Authorization
- Email/password authentication with **user verification**.
- **Role-based authentication**: Students, TAs, Professors.
- Secure access to dashboards and features based on role.

### Role-Based Dashboards
- **Professor Dashboard**
  - Create, view, and delete classes.
  - Assign TAs to handle important/unanswered questions.
  - View all questions from students with filters for unanswered or important questions.

- **TA Dashboard**
  - View **only Important + Unanswered questions** assigned by professor.
  - Mark questions as answered.
  - Automatically updated when professors assign new questions.

- **Student Dashboard**
  - Join or leave classes.
  - Post questions in class rooms.
  - View all joined classes.

### Class Management
- Professors can create classes with **unique class codes**.
- Custom hooks for **fetching current user details**.
- Assign TA for a class to handle important questions.
- Filters for unanswered or important questions.

### Classroom Interaction
- Students can **join classes** using class codes.
- Students can **post questions** inside a class room.
- Students can **leave a class** anytime.
- Real-time updates using **Socket.io**.

### TA Workflow
- TAs receive all **Important + Unanswered questions** after professors assign them.
- Mark questions as answered.
- TA dashboard updates dynamically when new questions are assigned.

---

## Project Structure

/src
/pages
/Dashboard
/StudentDashboard
/TADashboard
/ClassRoom
/hooks
CurrentUser.jsx
/db
db.js
App.jsx
index.jsx