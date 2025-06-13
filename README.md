# CodeServ: Online Judge (MERN Stack)

## 🎥 Demo Walkthrough

<div align="center">
  <a href="https://loom.com/share/folder/23c72fe38b844f98ba0b28ff09a2bfbe">
    <img src="https://img.shields.io/badge/Watch_Demo-FF0000?style=for-the-badge&logo=videocam&logoColor=white" alt="Watch Demo" height="40">
  </a>
  <a href=" https://code-serv.xyz/" target="_blank">
    <img src="https://img.shields.io/badge/Visit_Website-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Visit Website" height="40">
  </a>
</div>

![CodeJudge Banner](https://github.com/hariome62014/OJ_Project/blob/main/frontend/src/assets/Screenshot%202025-05-28%20133933.png)  


A **full-featured Online Judge** for C++ submissions with role-based authentication (Admin/Participant), real-time code execution, and problem management—inspired by Leetcode.

## 🚀 Key Features

### Role-Based Access
- **Admins**: 
  - Create/manage problems with rich text descriptions
  - Upload testcases via ZIP or manual entry
  - Monitor submissions and user activity
- **Participants**: 
  - Solve problems with an integrated code editor
  - View submission history and verdicts
  - Compete on leaderboards

### Efficient Judging Engine
- Dockerized sandbox environment for secure code execution
- Real-time verdicts with detailed feedback:
  - Accepted (AC)
  - Wrong Answer (WA)
  - Time Limit Exceeded (TLE)
  - Runtime Error (RE)
  - Compilation Error (CE)

### Advanced Testcase Management
- Bulk upload via ZIP (compressed input/output files)
- Manual testcase creation interface
- Server-side validation for integrity checks

### Sleek User Interface
- Responsive design with dark/light mode
- Monaco Editor with syntax highlighting
- Interactive problem statements with sample cases
- Real-time submission tracking

## 🛠 Tech Stack

| Component       | Technology                          |
|-----------------|------------------------------------|
| Frontend        | React.js, Tailwind CSS, Monaco Editor |
| Backend         | Node.js, Express.js                |
| Authentication  | JWT, Bcrypt                       |
| Database        | MongoDB (Mongoose ODM)            |
| Execution       | Docker API, Node.js worker threads|
| Deployment      | AWS EC2 (or Render)               |

## 📸 Screenshots

| ![Admin Dashboard](https://github.com/hariome62014/OJ_Project/blob/main/frontend/src/assets/Screenshot%202025-05-28%20134036.png) | ![Learner's Dashboard](https://github.com/hariome62014/OJ_Project/blob/main/frontend/src/assets/Screenshot%202025-05-28%20134530.png) |
|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| **Admin Dashboard**                                                          | **Learner's Dashboard**                                                     |

| ![Problem Solving Interface](https://github.com/hariome62014/OJ_Project/blob/main/frontend/src/assets/Screenshot%202025-05-28%20135622.png) | ![Submission Result](https://github.com/hariome62014/OJ_Project/blob/main/frontend/src/assets/Screenshot%202025-05-28%20134448.png) |
|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| **Problem Solving Interface**                                                          | **Submission Result**                                                     |                                                     |

