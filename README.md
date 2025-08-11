# Grades

Grades is a web application designed for NTUA ECE students to easily manage their academic grades.  
It supports CRUD operations for semesters, courses, and examinations, while also providing usefull statistics such as average grade, grade distributions, and per-course grade analysis.


---

## 🚀 Features

- Add, edit, and delete semesters, courses, and examinations
- View overall average grade
- Visualize grade distributions per course and overall

---

## 🛠 Tech Stack

**Backend**  
- Node.js + Express  
- Prisma ORM  
- Jest (unit/integration tests)  

**Frontend**  
- React + Vite  
- TailwindCSS  

**Database**  
- MySQL 8  

**Dev Environment**  
- Docker + Docker Compose

---

## 📦 Getting Started

### 1️⃣ Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (20+ recommended)
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

---

### 2️⃣ Setup

```bash
# 1. Clone the repository
git clone https://github.com/NALEX-0/Grades.git
cd Grades

# 2. Configure environment variables
# Copy the example env file
cp .env.example .env
# Edit .env if you want to customize database credentials

# 3. Run the application
docker compose up --build

# 4. Access the app
# Frontend:
http://localhost:4000
# Backend API (inside Docker network):
http://localhost:3000
# You can customize the ports in docker-compose.yml and Dockerfiles
```

---

## 🗂 Project Structure

```text
grades/
│
├── grades-backend/       # Node.js + Express backend
│   ├── src/              # Backend source code
│   ├── prisma/           # Prisma schema and migrations
│   ├── tests/            # Jest tests
│   └── Dockerfile        # Docker settup for backend        
│
├── grades-frontend/      # React + Vite frontend
│   ├── src/              # Frontend components & pages
│   └── Dockerfile        # Docker settup for frontend
│
├── mysql-init/           # SQL scripts to init the database
│
├── .env.example          # Environment variable template
└── docker-compose.yml    # Docker setup
```

---

## 🛠 Development Notes

```bash
# Database is initialized on first run using scripts in ./mysql-init

# To reset database:
docker compose down -v
docker compose up --build
```


