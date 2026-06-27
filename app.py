import os
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Portfolio Data
PORTFOLIO_DATA = {
    "profile": {
        "name": "VINUPRASAATH S",
        "title": "Python Developer | Flask & Django | AI Applications",
        "tagline": "Final-year B.Tech (AI & Data Science) student building intelligent, full-stack web solutions with Flask, Django & MySQL.",
        "bio": "Motivated Python Developer with hands-on experience building Flask and Django web applications integrated with MySQL. Developed AI-powered systems including a complaint management platform and a smart event management solution. Published researcher in AI-driven smart city grievance systems. Currently pursuing B.Tech in Artificial Intelligence & Data Science at M.I.E.T Engineering College, Trichy (Graduating 2026).",
        "location": "Trichy, Tamil Nadu",
        "email": "vinuprasaath53@gmail.com",
        "phone": "9047229042",
        "github": "https://github.com/vinu1325",
        "linkedin": "https://linkedin.com/in/vinuprasaath2513",
        "twitter": "https://twitter.com",
        "resume_link": "/static/resume.pdf",
        "summary": "Python Developer with hands-on experience building Flask and Django web applications integrated with MySQL. Developed AI-powered systems including a complaint management platform and smart event management solution. Published researcher in AI-driven smart city grievance systems.",
        "technical_skills": "Languages: Python (Primary), Java (Basics), JavaScript · Frameworks: Flask, Django · Frontend: HTML5, CSS3, JavaScript, Flutter · Databases: MySQL, SQLite · Tools & Platforms: VS Code, PyCharm, Jupyter Notebook, Git, GitHub · AI/ML: AI Application Development, NLP Basics, Intelligent Automation",
        "soft_skills": "Communication & Teamwork · Problem Solving · Quick Learning · Adaptability · Time Management",
        "education": [
            {
                "degree": "B.Tech",
                "field": "Artificial Intelligence & Data Science",
                "institution": "M.I.E.T Engineering College, Trichy",
                "period": "2022 – 2026",
                "score": "CGPA: 8.0"
            },
            {
                "degree": "12th",
                "field": "Higher Secondary",
                "institution": "Kapvisvanathan Higher Secondary School",
                "period": "2021 – 2022"
            },
            {
                "degree": "10th",
                "field": "SSLC",
                "institution": "Kapvisvanathan Higher Secondary School",
                "period": "2019 – 2020"
            }
        ],
        "awards": [
            "Published research paper: \"AI-Driven Smart City Grievance Management and Automated Complaint Escalation System\" — IJRASET, Volume 14, Issue 04, April 2026",
            "Developed and deployed AI-Based Complaint Management System using Flask & MySQL",
            "Built Smart Event Management System with AI-driven automation using Django",
            "Completed Web Development Internship at DLK Technologies, Trichy"
        ]
    },
    "skills": [
        {"name": "Python", "category": "Backend", "icon": "fa-brands fa-python", "level": 92},
        {"name": "Flask / Django", "category": "Backend", "icon": "fa-solid fa-server", "level": 85},
        {"name": "JavaScript", "category": "Frontend", "icon": "fa-brands fa-square-js", "level": 75},
        {"name": "HTML5 & CSS3", "category": "Frontend", "icon": "fa-brands fa-html5", "level": 88},
        {"name": "MySQL / SQL", "category": "Database", "icon": "fa-solid fa-database", "level": 82},
        {"name": "RESTful APIs", "category": "Backend", "icon": "fa-solid fa-gears", "level": 80},
        {"name": "Git & GitHub", "category": "Tools", "icon": "fa-brands fa-github", "level": 85},
        {"name": "Flutter", "category": "Frontend", "icon": "fa-solid fa-mobile-screen", "level": 65},
        {"name": "Jupyter Notebook", "category": "Tools", "icon": "fa-solid fa-book-open", "level": 80},
        {"name": "AI / NLP", "category": "AI/ML", "icon": "fa-solid fa-brain", "level": 72}
    ],
    "projects": [
        {
            "id": 1,
            "title": "AI-Based Complaint Management System",
            "subtitle": "Full-stack Flask app · Published Research",
            "category": "ai",
            "tech": ["Python", "Flask", "MySQL", "HTML/CSS", "JS"],
            "description": "Built a full-stack web application with secure role-based login, automated complaint routing, and a real-time tracking dashboard. Intelligent routing logic reduced manual processing time significantly. Designed MySQL schema for complaint lifecycle management. Research published in IJRASET, April 2026.",
            "image": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
            "github": "https://github.com/vinu1325/complaint-management",
            "demo": "#"
        },
        {
            "id": 2,
            "title": "AI-Driven Smart Event Management System",
            "subtitle": "Django backend · AI Automation",
            "category": "ai",
            "tech": ["Python", "Django", "MySQL", "HTML/CSS", "JS"],
            "description": "End-to-end event management platform with AI-driven automation. Features automated scheduling, registration handling, and event notifications. Integrated backend APIs with a dynamic frontend for real-time event tracking and management.",
            "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
            "github": "https://github.com/vinu1325/smart-event",
            "demo": "#"
        }
    ],
    "experience": [
        {
            "role": "Web Development Intern",
            "company": "DLK Technologies, Trichy",
            "period": "2024",
            "description": "Completed an intensive web development internship focused on building and deploying Python-based web applications. Gained practical experience with Flask, HTML/CSS, JavaScript, and MySQL database design. Worked on real-world projects involving form handling, session management, and responsive UI development."
        }
    ]
}

@app.route("/")
def home():
    return render_template("index.html", portfolio=PORTFOLIO_DATA)

@app.route("/contact", methods=["POST"])
def contact():
    try:
        # Get dynamic input from client JSON request
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        subject = data.get("subject", "").strip()
        message = data.get("message", "").strip()

        # Input validation
        if not name or not email or not message:
            return jsonify({"status": "error", "message": "Please fill in all required fields (Name, Email, Message)."}), 400

        # Construct message payload
        payload = {
            "timestamp": datetime.now().isoformat(),
            "name": name,
            "email": email,
            "subject": subject,
            "message": message
        }

        # Store in local messages.json database
        messages_file = os.path.join(app.root_path, "messages.json")
        messages_list = []
        if os.path.exists(messages_file):
            try:
                with open(messages_file, "r") as f:
                    messages_list = json.load(f)
            except Exception:
                messages_list = []

        messages_list.append(payload)

        with open(messages_file, "w") as f:
            json.dump(messages_list, f, indent=4)

        return jsonify({"status": "success", "message": f"Thank you, {name}! Your message has been received successfully."})

    except Exception as e:
        return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
