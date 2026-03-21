
//  PORTFOLIO DATA 


export const personalInfo = {
  name: "Nithin Venkat Sharma P M",
  firstName: "Nithin",
  tagline: "CS Undergrad & Tech Enthusiast",
  shortBio:"I enjoy building practical software that solves real problems. I've worked on full-stack projects, explored AI systems like RAG, and used data structures to make applications faster and more efficient. I'm always learning and looking for ways to build better systems.",
  metaDescription:
    "Nithin Venkat Sharma's Portfolio - A CS undergrad  building practical full-stack and AI-based applications.",
  metaKeywords:
    "Nithin Venkat Sharma, portfolio, full-stack developer, web development, AI, RAG, FastAPI, React",
  copyright: "© 2026 Nithin Venkat Sharma's Portfolio. All rights reserved.",
};

export const socialLinks = {
  github: "https://github.com/nithin0306",
  linkedin: "https://www.linkedin.com/in/nithin-p-m-",
  cv: "/Nithin_CV.pdf",
};

export const about = {
  paragraphs: [
    `Hello! I'm <strong>Nithin Venkat Sharma P M</strong>, a Computer Science student at Amrita Vishwa Vidyapeetham. I enjoy building software that solves real problems and focuses on usability and performance.`,

    `I’ve worked on full-stack applications and can adapt to different stacks to build clean, responsive systems. I’ve used tools like React on the frontend and FastAPI or Node.js on the backend, along with Python and databases such as PostgreSQL and MongoDB. I’m comfortable with Git, Figma, VS Code, and Linux, and I enjoy working in smooth workflows and building things with others.`,
  
    `Some of my recent work involves exploring AI-based systems like RAG, where I’ve built applications that can understand documents and answer queries in a meaningful way. I also enjoy using data structures to improve performance when needed.`,

    `Outside of projects, I like exploring new technologies, participating in hackathons, and working with teams to build and improve ideas. I'm always looking for opportunities to learn, take on challenges, and grow as a developer.`,
  ],
};

export const education = [
  {
    degree: "B.Tech in Computer Science",
    institution: "Amrita Vishwa Vidyapeetham, Coimbatore",
    year: "Aug 2024 – Aug 2028",
  },
];

export const skills = [
  { name: "C", icon: "devicon-c-plain colored" },
  { name: "C++", icon: "devicon-cplusplus-plain colored" },
  { name: "Java", icon: "devicon-java-plain colored" },
  { name: "JavaScript", icon: "devicon-javascript-plain colored" },
  { name: "Python", icon: "devicon-python-plain colored" },
  { name: "React", icon: "devicon-react-original colored" },
  { name: "Node.js", icon: "devicon-nodejs-plain colored" },
  { name: "FastAPI", icon: "devicon-fastapi-plain colored" },
  { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
  { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
  { name: "Git", icon: "devicon-git-plain colored" },
  { name: "VS Code", icon: "devicon-vscode-plain colored" },
];

export interface Project {
  id: string;
  title: string;
  year: string;
  type: string;
  tech: string[];
  description: string;
  github: string;
  image: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "dayta",
    title: "Dayta",
    year: "2025",
    type: "Personal",
    tech: ["React", "Vite", "TypeScript", "FastAPI", "Pinecone", "Google Gemini API"],
    description:
      "A full-stack Progressive Web App that answers academic calendar queries using a Retrieval Augmented Generation (RAG) pipeline over official calendar documents. Features vector search with Pinecone for accurate, document-grounded responses, session-aware interactions, and guardrails to restrict responses to academic calendar content.",
    github: "https://github.com/nithin0306",
    image: "/images/dayta.png",
    featured: true,
  },
  {
    id: "stockquery",
    title: "Stock Query System",
    year: "2025",
    type: "Hackathon",
    tech: ["Python", "Flask", "React", "Vite", "Segment Trees", "Pinecone", "Gemini API"],
    description:
      "A stock query system using Segment Trees for efficient range queries (min, max, sum, average) in O(log n) time, combined with a RAG pipeline to interpret natural language stock queries and retrieve relevant documents. Blends classical DSA with modern AI for improved computational efficiency and query accuracy.",
    github: "https://github.com/Nithin0306/OptiRange",
    image: "/images/stock.png",
    featured: true,
  },
  {
    id: "skillup",
    title: "SkillUp",
    year: "2025",
    type: "Hackathon",
    tech: ["React.js", "FastAPI", "Gemini API", "YouTube Data API"],
    description:
      "An AI-driven platform to analyze resumes, detect skill gaps, and map them to target job roles. Implements backend services for resume parsing, skill extraction, and recommendation generation, integrating external APIs to curate personalized courses, tutorials, and project suggestions. Won 2nd place at Hack101.",
    github: "https://github.com/Nithin0306/skillUp",
    image: "/images/skillup.png",
    featured: true,
  },
  {
    id: "vitacare",
    title: "Vita-Care",
    year: "2025",
    type: "Hackathon",
    tech: ["React.js", "FastAPI", "Python"],
    description:
      "A healthcare-focused application developed at the Build2Break hackathon at Anokha 2026. Secured 3rd place for its innovative approach to health data management and user-friendly design.",
    github: "https://github.com/Nithin0306/4bits",
    image: "/images/vita-care.png",
    featured: false,
  },
];

export const contact = {
  heading: "Let's Connect!",
  subheading:
    "I'm currently open to new opportunities and collaborations. Whether you have a project in mind, a question, or just want to say hi, feel free to reach out!",
  formsubmitKey: process.env.NEXT_PUBLIC_FORMSUBMIT_KEY ?? "",
  formSubject: "New message from portfolio!",
  autoresponse:
    "Thank you for your message! I will get back to you shortly.",
  blacklist:
    "viagra, http, scam, free money, click here, casino, lottery, winner, cash bonus, payday loan, credit card, porn, adult, crypto, investment, bitcoin, cheap meds, weight loss, work from home, online pharmacy",
};

// ── Terminal ────────────────────────────────────────────────
export const terminalConfig = {
  username: "nithin",
  hostname: "portfolio",
  welcomeText: "Welcome to Nithin's Terminal v1.0",
  // Static command responses — dynamic ones are handled in the component
  commands: {
    whoami: "nithin",
    pwd: "/home/nithin",
    ls: "projects  skills  resume.pdf  contact.txt ",
    "cat contact.txt": `🔗 LinkedIn: linkedin.com/in/nithin-p-m-\nGitHub: github.com/nithin0306\n📧 nithin.p.m2006@gmail.com\nAlways open to collaborations!`,
    date: "__DATE__", // Replaced at runtime
    help: `Available commands:\nwhoami     - Display current user\npwd        - Print working directory\nls         - List directory contents\ncat <file> - Display file contents\ncd <dir>   - Change directory\ndate       - Show current date/time\nclear      - Clear terminal\nhistory    - Show command history\nabout      - About Nithin\nskills     - List technical skills\nprojects   - Show featured projects\nneofetch   - System information\necho <msg> - Print a message\nopen <id>  - Open a project on GitHub\nhelp       - Show this help message`,
about: `Hi! I'm Nithin 👋

🎓 B.Tech CS Student at Amrita Vishwa Vidyapeetham  
• I enjoy building full-stack applications and working on real-world problems  
• Have explored systems like RAG and worked on projects that combine data and usability  
• Hackathon achiever — 2nd @ Hack101, 3rd @ Build2Break Anokha 2026  
• Always building, learning, and improving 🚀`,    skills: `Technical Skills:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nLanguages:  C, C++, Java, JavaScript, Python, SQL\nFrontend:   React.js, TypeScript, Vite\nBackend:    FastAPI, Node.js, Express.js, Flask\nDatabase:   PostgreSQL, MongoDB, Supabase, Pinecone\nTools:      Git, GitHub, Figma, Linux`,
    projects: `Featured Projects:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📅 Dayta           (id: dayta)\n   Academic calendar RAG-powered PWA.\n\n📈 Stock Query     (id: stockquery)\n   DSA + RAG hybrid stock query system.\n\n🎯 SkillUp         (id: skillup)\n   AI resume analyser — 2nd place @ Hack101.\n\nType 'open <id>' to visit GitHub or 'cd projects' to explore!`,
    neofetch: `\n nithin@portfolio\n ────────────────\n 
       __
   _  |@@|
  / \\ \\--/ __
  ) O|----|  |   __
 / / \\ }{ /\\ )_ / _\\
 )/  /\\__/\\ \\__O (__
|/  (--/\\--)    \\__/
/   _)(  )(_
   "---" "---"

  \n OS: Portfolio v1.0\n Host: Next.js (App Router)\n Shell: TypeScript\n Uptime: Always building 🚀\n`,
  },
  projectLsOutput:
    "Dayta/  StockQuerySystem/  SkillUp/  VitaCare/  README.md",
};