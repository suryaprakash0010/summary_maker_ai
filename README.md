
# 📝 Meeting Notes Summarizer

🚀 A minimal, AI-powered meeting notes summarizer built with React, Node.js, and Express. Upload transcripts, generate smart summaries with **Groq AI**, edit them, and share seamlessly via email.

---

## ✨ Features

### 🎯 Core Features

📂 **Transcript Upload** – Upload `.txt` files or paste raw text
🤖 **AI Summarization** – Powered by **Groq LLM API**
🎯 **Custom Prompts** – Tailor summaries with your own instructions
📝 **Editable Summaries** – Edit AI output before sharing
📧 **Email Sharing** – Send summaries to multiple recipients
🎨 **Minimal UI/UX** – Luxury white space, deep navy palette, responsive design
📱 **Mobile-First** – Works smoothly on all devices

### 🔐 User Management (Optional)

📊 **Summary History** – Save and revisit previous transcripts/summaries

---

## 🛠️ Tech Stack

### Frontend

⚛️ **React** (Vite) – Modern UI
🎨 **Tailwind CSS** – Utility-first styling
🚦 **React Router** – Navigation
🎭 **Framer Motion** – Smooth animations
🔥 **React Hot Toast** – Notifications
⏰ **Moment.js** – Date/time formatting

### Backend

🟢 **Node.js** – Runtime
🚀 **Express.js** – Backend framework
🌐 **CORS** – Cross-origin access
📁 **Multer** – File uploads

### AI & Services

🤖 **Groq AI** – Summarization engine
📧 **Resend API** – Email delivery
☁️ **Vercel** – Deployment platform

---

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js (v16 or higher)
* Groq API key
* Resend API key

---

## 🎯 API Endpoints

### 📂 Transcript & Summary

* `POST /api/upload` – Upload transcript (`.txt` or raw text)
* `POST /api/summarize` – Generate summary with Groq AI `{ transcript, instruction }`

### 📧 Email Sharing

* `POST /api/email/send` – Send edited summary via Resend

---

## 🎨 Features Showcase

🤖 **AI-Powered Summarization**

* Converts transcripts into structured, actionable summaries
* Custom prompts for different audiences (executives, technical teams, etc.)

📧 **Email Sharing**

* Send summaries to individuals or groups
* Powered by **Resend API**

🎨 **Minimal, Elegant UI**

* Deep navy background `#0F172A`
* Accent blue `#3B82F6`
* Clean typography (Inter / Poppins)
* Mobile-first layout

---

## 🚀 Deployment

### Frontend (Vercel)

* Connect GitHub repo → Deploy `client/`
* Add env vars in Vercel dashboard

### Backend (Vercel / Render / Railway)

* Deploy `server/`
* Add env vars in deployment platform
* Ensure frontend API calls point to backend URL

---

## 📧 Contact

👨‍💻 **Surya Prakash Kahar**
- 📧 Email: [sp2002rk@gmail.com](mailto:sp2002rk@gmail.com)
- 💼 LinkedIn: [www.linkedin.com/in/surya--prakash--kahar](https://www.linkedin.com/in/surya--prakash--kahar)


---
## 🙏 Acknowledgments

- 🎨 Design inspiration from modern summary platforms
- 🤖 Groq ai  for content generation capabilities
- 📚 Open source community for amazing libraries and tools

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Surya Prakash Kahar](https://www.linkedin.com/in/surya--prakash--kahar)

</div>