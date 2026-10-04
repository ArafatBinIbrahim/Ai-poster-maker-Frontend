# AI Political Poster Maker - Frontend

A modern Next.js (App Router, TypeScript & Tailwind CSS) frontend for the **AI Political Poster Maker** platform. It provides an intuitive, responsive interface for political workers and campaign managers to browse curated poster templates, fill out custom details, upload photos, and generate print-ready political posters seamlessly.

---

## 🛠️ Tech Stack

| Area | Technology |
| :--- | :--- |
| **Framework** | Next.js 14+ (App Router, TypeScript) |
| **Styling** | Tailwind CSS |
| **State & API Handling** | Axios / Fetch API, React Hooks |
| **Icons & UI** | Lucide React / Responsive Tailwind Components |

---

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication routes (login, register)
│   │   ├── create-poster/      # Poster creation & form submission
│   │   ├── history/            # User poster generation history
│   │   ├── preview/[id]/       # Generated poster preview & download
│   │   ├── templates/          # Template browsing gallery
│   │   ├── globals.css         # Global Tailwind styles
│   │   ├── layout.tsx          # Root layout with navbar/footer
│   │   └── page.tsx            # Landing / Home page
│   ├── components/             # Reusable UI components (Navbar, Footer, Cards, Inputs)
│   ├── services/               # API service modules (auth, poster, base client)
│   └── types/                  # TypeScript interfaces & type definitions
├── public/                     # Static assets
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started & Setup Instructions

Follow these steps to set up and run the frontend locally on your machine:

### 1. Clone the Repository

```bash
git clone https://github.com/ArafatBinIbrahim/Ai-poster-maker-Frontend.git
cd Ai-poster-maker-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and configure your backend API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will run at `http://localhost:3000`.

---

## ✨ Key Features

- **Authentication System:** Secure registration and login supporting token-based (JWT) access to protected user flows.
- **Template Gallery:** Browse curated Bangladeshi political poster templates (Victory Day, Memorial, Elections, Campaigns, Greetings).
- **Dynamic Poster Form:** Input custom names, political designations, party titles, slogans, and upload user photos.
- **Generation & Preview Hub:** Track generation status, preview final rendered posters, and access personal generation history.

---

## 👨‍💻 Author

**Kazi Arafat Bin Ibrahim**

BRAC University | Software Engineer & Full-Stack Developer
