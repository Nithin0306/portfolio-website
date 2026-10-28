import os
from PIL import Image, ImageDraw

def make_shot_dayta(path):
    img = Image.new("RGB", (1280, 800), "#0f172a")
    d = ImageDraw.Draw(img)
    # Navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#1e293b")
    d.rectangle([(32, 20), (52, 44)], fill="#3b82f6")
    d.text((64, 22), "Dayta // Academic Document Ingestion & RAG Assistant", fill="#f8fafc")
    d.rectangle([(1080, 16), (1240, 48)], fill="#2563eb")
    d.text((1100, 24), "Vector DB Active", fill="#ffffff")
    d.text((920, 24), "Pinecone + Gemini", fill="#38bdf8")

    # Banner
    d.rectangle([(32, 88), (1248, 180)], fill="#1e293b", outline="#334155", width=2)
    d.text((60, 106), "DOCUMENT INGESTION PIPELINE: ACADEMIC SCHEDULES & SYLLABI", fill="#94a3b8")
    d.text((60, 134), "Status: 142 Documents Ingested · Windowed Memory: Enabled · Hallucination Guardrails: 100%", fill="#4ade80")

    # Left: Semantic Chat Query Interface
    d.rectangle([(32, 204), (680, 760)], fill="#1e293b", outline="#334155", width=2)
    d.text((60, 228), "Multi-Turn Scheduling Query Console", fill="#f1f5f9")
    
    # Query 1
    d.rectangle([(60, 270), (650, 340)], fill="#334155")
    d.text((80, 286), "Student: What is my schedule for Distributed Systems on Friday?", fill="#f8fafc")
    d.text((80, 310), "Context: Class Timetable 2024-28 (Indexed in Pinecone)", fill="#94a3b8")

    # Response 1
    d.rectangle([(60, 360), (650, 470)], fill="#0f172a", outline="#3b82f6", width=2)
    d.text((80, 376), "Dayta (Gemini RAG):", fill="#38bdf8")
    d.text((80, 404), "• 10:15 AM - 11:45 AM: Distributed Systems Lecture (Hall CS-204)", fill="#f1f5f9")
    d.text((80, 432), "• 02:00 PM - 04:00 PM: Systems Lab - Kafka CDC Pipeline Setup", fill="#f1f5f9")

    # Query 2
    d.rectangle([(60, 490), (650, 560)], fill="#334155")
    d.text((80, 506), "Student: Are there any assignment deadlines before the lab?", fill="#f8fafc")
    d.text((80, 530), "Windowed Memory applied (turn 2/10)", fill="#94a3b8")

    # Response 2
    d.rectangle([(60, 580), (650, 680)], fill="#0f172a", outline="#10b981", width=2)
    d.text((80, 596), "Dayta: Assignment 2 (Raft Consensus) is due Thursday at 11:59 PM.", fill="#4ade80")
    d.text((80, 624), "Confidence Score: 0.982 · Strict university dataset verified.", fill="#94a3b8")

    # Right: High-Density Vector Metrics
    d.rectangle([(710, 204), (1248, 760)], fill="#1e293b", outline="#334155", width=2)
    d.text((740, 228), "Vector Embeddings & Latency Telemetry", fill="#f1f5f9")
    metrics = [
        ("Vector Dimension", "768-d (Cosine Similarity)"),
        ("Index Throughput", "240 embeddings/sec"),
        ("Query Latency (p99)", "182ms (FastAPI Async)"),
        ("Guardrail Enforcement", "100% Strict Domain Filtering"),
        ("Target Schedule Accuracy", "99.4% Verified Match")
    ]
    my = 280
    for label, val in metrics:
        d.rectangle([(740, my), (1216, my+74)], fill="#0f172a", outline="#334155")
        d.text((760, my+16), label, fill="#38bdf8")
        d.text((760, my+42), val, fill="#ffffff")
        my += 92

    img.save(path)

def make_shot_archivist(path):
    img = Image.new("RGB", (1280, 800), "#18181b")
    d = ImageDraw.Draw(img)
    # Navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#27272a")
    d.rectangle([(32, 20), (52, 44)], fill="#a855f7")
    d.text((64, 22), "Archivist // Autonomous ADR Enforcement GitHub Action", fill="#fafafa")
    d.rectangle([(1050, 16), (1240, 48)], fill="#9333ea")
    d.text((1070, 24), "LangGraph + MCP", fill="#ffffff")

    # Banner
    d.rectangle([(32, 88), (1248, 170)], fill="#27272a", outline="#3f3f46", width=2)
    d.text((60, 106), "AUTONOMOUS CI/CD GOVERNANCE · PULL REQUEST #42 DIFF ANALYSIS", fill="#a1a1aa")
    d.text((60, 134), "Architectural Review Loop: Reduced from 3 hours to 48s · Enforcement: 100% Automated", fill="#4ade80")

    # Left: PR Diff & Violation Detection
    d.rectangle([(32, 196), (640, 760)], fill="#27272a", outline="#3f3f46", width=2)
    d.text((60, 220), "LangGraph Agent Inspection Pipeline", fill="#f4f4f5")
    
    stages = [
        ("Step 1: Parse PR Diff via GitHub API", "Fetched 14 modified files across 3 microservices", "#3b82f6"),
        ("Step 2: MCP Tool Query - Fetch Active ADRs", "Matched ADR-007 (Polyglot Persistence) & ADR-012 (Auth)", "#8b5cf6"),
        ("Step 3: Security & Secret Leak Scanner", "PASS: Zero client-side keys detected in commit payload", "#10b981"),
        ("Step 4: ADR Violation Engine", "ALERT: Direct DB call detected from UI Controller", "#ef4444"),
        ("Step 5: Automated Bot PR Review Comment", "Posted remediation patch with webhook override token", "#f59e0b")
    ]
    sy = 260
    for stitle, sdesc, col in stages:
        d.rectangle([(60, sy), (612, sy+78)], fill="#18181b", outline=col, width=2)
        d.text((80, sy+14), stitle, fill=col)
        d.text((80, sy+42), sdesc, fill="#d4d4d8")
        sy += 96

    # Right: Autonomous Agent Graph Visualization
    d.rectangle([(670, 196), (1248, 760)], fill="#27272a", outline="#3f3f46", width=2)
    d.text((700, 220), "LangGraph Decision Workflow & State Graph", fill="#f4f4f5")
    
    # Node boxes
    nodes = [
        (900, 280, "PR Event Hook (GitHub Action)", "#3b82f6"),
        (900, 380, "Diff Parser (AST + LangGraph)", "#8b5cf6"),
        (760, 490, "Security Auditor (MCP)", "#10b981"),
        (1040, 490, "ADR Pattern Checker", "#f59e0b"),
        (900, 610, "Verdict & Automated PR Review Post", "#4ade80")
    ]
    for nx, ny, ntext, ncol in nodes:
        d.rectangle([(nx-140, ny-24), (nx+140, ny+24)], fill="#18181b", outline=ncol, width=2)
        d.text((nx-120, ny-8), ntext, fill="#ffffff")

    # Connect lines
    d.line([(900, 304), (900, 356)], fill="#a1a1aa", width=2)
    d.line([(900, 404), (760, 466)], fill="#a1a1aa", width=2)
    d.line([(900, 404), (1040, 466)], fill="#a1a1aa", width=2)
    d.line([(760, 514), (900, 586)], fill="#a1a1aa", width=2)
    d.line([(1040, 514), (900, 586)], fill="#a1a1aa", width=2)

    img.save(path)

def make_shot_gocdc(path):
    img = Image.new("RGB", (1280, 800), "#082f49")
    d = ImageDraw.Draw(img)
    # Navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#0c4a6e")
    d.rectangle([(32, 20), (52, 44)], fill="#0284c7")
    d.text((64, 22), "GoCDC // High-Throughput Event-Driven CDC Pipeline", fill="#f0f9ff")
    d.rectangle([(1060, 16), (1240, 48)], fill="#0369a1")
    d.text((1080, 24), "1,400 events/sec", fill="#ffffff")

    # Banner
    d.rectangle([(32, 88), (1248, 170)], fill="#0c4a6e", outline="#0284c7", width=2)
    d.text((60, 106), "POSTGRESQL WAL LOGICAL DECODING · ZERO-POLLING EVENT STREAMING", fill="#bae6fd")
    d.text((60, 134), "Replication Lag: <140ms · 500-Concurrent-Transaction Benchmark: 0 Data Loss", fill="#4ade80")

    # Left: Pipeline Topology
    d.rectangle([(32, 196), (720, 760)], fill="#075985", outline="#0284c7", width=2)
    d.text((60, 220), "Polyglot Replication Architecture", fill="#f0f9ff")
    
    stages = [
        ("Source DB: PostgreSQL (WAL Logical Decoding)", "Zero polling overhead, streaming low-level DML mutations", "#38bdf8"),
        ("Go Ingestion Engine (pglogrepl)", "High-throughput consumer parsing binary replication stream", "#0284c7"),
        ("Message Broker: Apache Kafka / Redpanda", "Partitioned event log achieving 1,400 events/sec sustained", "#f59e0b"),
        ("Sink Consumer 1: Redis In-Memory Cache", "Sub-millisecond key invalidation and cache warming", "#ef4444"),
        ("Sink Consumer 2: MongoDB Document Store", "Denormalized polyglot persistence projection pipeline", "#10b981")
    ]
    py = 260
    for ptitle, pdesc, pcol in stages:
        d.rectangle([(60, py), (690, py+80)], fill="#0c4a6e", outline=pcol, width=2)
        d.text((80, py+16), ptitle, fill=pcol)
        d.text((80, py+44), pdesc, fill="#e0f2fe")
        py += 96

    # Right: Benchmark Metrics
    d.rectangle([(750, 196), (1248, 760)], fill="#0c4a6e", outline="#0284c7", width=2)
    d.text((780, 220), "500-Transaction Stress Benchmark", fill="#f0f9ff")
    metrics = [
        ("Throughput (Peak)", "1,420 DML events/sec"),
        ("End-to-End Lag", "<145 ms (p95)"),
        ("Docker Container Size", "19.8 MB (Multi-stage Go)"),
        ("Data Consistency Check", "100% Match (Zero loss)"),
        ("Ecosystem Nodes", "6 Microservices active")
    ]
    my = 280
    for label, val in metrics:
        d.rectangle([(780, my), (1216, my+74)], fill="#075985")
        d.text((800, my+14), label, fill="#7dd3fc")
        d.text((800, my+42), val, fill="#ffffff")
        my += 92

    img.save(path)

def make_shot_skillup(path):
    img = Image.new("RGB", (1280, 800), "#0f172a")
    d = ImageDraw.Draw(img)
    # Navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#1e293b")
    d.rectangle([(32, 20), (52, 44)], fill="#f59e0b")
    d.text((64, 22), "SkillUp // AI Skill Gap Analyzer", fill="#f8fafc")
    d.rectangle([(1040, 16), (1240, 48)], fill="#d97706")
    d.text((1060, 24), "Hack101 [2nd Place]", fill="#ffffff")

    # Banner
    d.rectangle([(32, 88), (1248, 170)], fill="#1e293b", outline="#334155", width=2)
    d.text((60, 106), "TARGET ROLE: BACKEND & DISTRIBUTED SYSTEMS ENGINEER", fill="#94a3b8")
    d.text((60, 134), "Resume Match Score: 88% · 3 Skill Gaps Identified · Personalized Roadmap Generated", fill="#4ade80")

    # Left: Skill Matrix
    d.rectangle([(32, 196), (640, 760)], fill="#1e293b", outline="#334155", width=2)
    d.text((60, 220), "Competency Gap Analysis", fill="#f1f5f9")
    skills = [
        ("Go & Concurrency Patterns", 94, 90, True),
        ("PostgreSQL & WAL Logical Decoding", 90, 85, True),
        ("Kafka / Event-Driven Architectures", 88, 80, True),
        ("Distributed Consensus (Raft/Paxos)", 68, 85, False),
        ("Kubernetes / Container Orchestration", 72, 80, False),
    ]
    sy = 270
    for sname, scurr, starget, spass in skills:
        d.text((60, sy), sname, fill="#cbd5e1")
        col = "#10b981" if spass else "#f59e0b"
        d.text((510, sy), f"{scurr}% / {starget}%", fill=col)
        d.rectangle([(60, sy+24), (600, sy+34)], fill="#334155")
        d.rectangle([(60, sy+24), (60 + int(5.4*scurr), sy+34)], fill=col)
        sy += 88

    # Right: Curated Roadmap
    d.rectangle([(670, 196), (1248, 760)], fill="#1e293b", outline="#334155", width=2)
    d.text((700, 220), "Personalized Course & Project Roadmap", fill="#f1f5f9")
    steps = [
        ("Milestone 1: Event-Driven Polyglot Streaming", "COMPLETED: GoCDC with Kafka & PostgreSQL", "#10b981"),
        ("Milestone 2: Autonomous Agent Governance", "COMPLETED: Archivist LangGraph MCP Action", "#10b981"),
        ("Milestone 3: Raft Consensus Implementation", "RECOMMENDED: Build a 3-node in-memory leader election", "#f59e0b"),
        ("Milestone 4: Cloud-Native K8s Deployment", "RECOMMENDED: Helm charts and GitOps CD pipeline", "#3b82f6")
    ]
    ry = 270
    for rtitle, rdesc, rcol in steps:
        d.rectangle([(700, ry), (1216, ry+88)], fill="#0f172a", outline=rcol, width=2)
        d.text((720, ry+18), rtitle, fill="#f8fafc")
        d.text((720, ry+48), rdesc, fill="#94a3b8")
        ry += 112

    img.save(path)

def make_real_resume_pdf(path):
    content = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 1200 >>
stream
BT
/F1 18 Tf
50 740 Td
(Nithin Venkat Sharma P M) Tj
/F1 10 Tf
0 -18 Td
(Coimbatore, Tamil Nadu | nithin.p.m2006@gmail.com | +91 73730 93900) Tj
0 -14 Td
(LinkedIn: linkedin.com/in/nithin-p-m- | GitHub: github.com/nithin0306) Tj
0 -24 Td
(EDUCATION: Amrita Vishwa Vidyapeetham, Coimbatore | Aug 2024 - May 2028) Tj
0 -14 Td
(B.Tech in Computer Science and Engineering | CGPA: 8.85 / 10) Tj
0 -22 Td
(EXPERIENCE:) Tj
0 -14 Td
(Web Developer, Tensor Club, Amrita Vishwa Vidyapeetham [Jul 2025 - Apr 2026]) Tj
0 -12 Td
(- Built Featured Projects & All Projects with React/Tailwind, 99 Lighthouse score, 0.3s FCP) Tj
0 -12 Td
(- Implemented terminal-style interactive card layouts contributing to 98 a11y & 100 SEO) Tj
0 -16 Td
(Automation Intern, The Pedagogy Community [Apr 2026 - Jun 2026]) Tj
0 -12 Td
(- Architected AI pipeline converting raw webinars into structured courses: 8hrs to <15 mins) Tj
0 -12 Td
(- Multi-threaded chunking engine for 20-min parallel audio slices with timestamp alignment) Tj
0 -22 Td
(PROJECTS:) Tj
0 -14 Td
(Dayta | React, Vite, TypeScript, FastAPI, Pinecone, Google Gemini API [Live]) Tj
0 -12 Td
(- Automated academic document ingestion storing high-density vector embeddings in Pinecone) Tj
0 -12 Td
(- Conversational guardrails with windowed session memory eliminating hallucinations) Tj
0 -16 Td
(Archivist | Python, LangGraph, GitHub Actions, LLMs, MCP [GitHub]) Tj
0 -12 Td
(- Autonomous GitHub Action dynamically enforcing Architecture Decision Records [ADRs]) Tj
0 -12 Td
(- Enforced CI/CD governance via GitHub API, cutting review loop from hours to <60 seconds) Tj
0 -16 Td
(GoCDC | Go, PostgreSQL, Apache Kafka, Redis, MongoDB, Docker [GitHub]) Tj
0 -12 Td
(- Go CDC engine with PostgreSQL WAL logical decoding streaming 1,400 events/sec to Kafka) Tj
0 -12 Td
(- Polyglot persistence pipeline with <150ms replication lag & 0 data loss under 500-tx load) Tj
0 -22 Td
(ACHIEVEMENTS:) Tj
0 -14 Td
(- 2nd Place at Hack101 [30+ teams] for SkillUp AI skill gap analyzer) Tj
0 -12 Td
(- 3rd Place at Build2Break [80+ teams] for VITA-CARE healthcare microservice) Tj
0 -12 Td
(- Merged 4 PRs across independent repositories in GirlScript Summer of Code [GSSoC]) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000001497 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1567
%%EOF
"""
    with open(path, "wb") as f:
        f.write(content)

os.makedirs("assets/shots", exist_ok=True)
make_shot_dayta("assets/shots/dayta.png")
make_shot_archivist("assets/shots/archivist.png")
make_shot_gocdc("assets/shots/gocdc.png")
make_shot_skillup("assets/shots/skillup.png")
make_real_resume_pdf("assets/resume.pdf")
print("Resume assets updated successfully!")
