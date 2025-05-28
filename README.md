# CodeJudge - Leetcode-style Online Judge (MERN Stack)

![CodeJudge Banner](https://via.placeholder.com/1200x400?text=CodeJudge+Banner+Preview)  


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

| ![Admin Dashboard](https://via.placeholder.com/400x225?text=Admin+Dashboard) | ![Problem Solving](https://via.placeholder.com/400x225?text=Problem+Solving+View) |
|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| **Admin Dashboard**                                                          | **Problem Solving Interface**                                                     |

| ![Submission Results](https://via.placeholder.com/800x225?text=Submission+Results+Page) |
|---------------------------------------------------------------------------------------|
| **Detailed Submission Results**                                                      |

