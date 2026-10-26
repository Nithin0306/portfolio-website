import os
import math
from PIL import Image, ImageDraw, ImageFont

def make_shot_skillup(path):
    img = Image.new("RGB", (1280, 800), "#0f172a")
    d = ImageDraw.Draw(img)
    
    # Top navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#1e293b")
    d.rectangle([(0, 63), (1280, 64)], fill="#334155")
    d.rectangle([(32, 20), (52, 44)], fill="#6366f1")
    d.text((64, 22), "SkillUp // AI Skill Gap Analyzer", fill="#f8fafc")
    d.rectangle([(1100, 18), (1240, 46)], fill="#4f46e5")
    d.text((1115, 24), "Analyze Role", fill="#ffffff")
    d.text((950, 24), "Hack101 [2nd Place]", fill="#fbbf24")
    
    # Hero / Target Role Banner
    d.rectangle([(32, 88), (1248, 200)], fill="#1e293b", outline="#334155", width=2)
    d.text((60, 108), "TARGET ROLE: SENIOR AI & FULL-STACK ENGINEER", fill="#94a3b8")
    d.text((60, 136), "Readiness Score: 82% (4 Gaps Identified)", fill="#38bdf8")
    d.rectangle([(60, 172), (660, 184)], fill="#334155")
    d.rectangle([(60, 172), (552, 184)], fill="#10b981") # 82%
    
    # Left Column: Radar / Gap Breakdown
    d.rectangle([(32, 224), (620, 760)], fill="#1e293b", outline="#334155", width=2)
    d.text((60, 248), "Skill Gap Matrix & Benchmark", fill="#f1f5f9")
    skills = [
        ("Python & Asynchronous I/O", 92, 85, True),
        ("PyTorch / LLM Fine-Tuning", 78, 80, False),
        ("System Architecture & Vector DBs", 85, 75, True),
        ("Kubernetes & Cloud Infra", 55, 75, False),
        ("TypeScript & Modern Frontends", 88, 80, True),
        ("API Security & Auth protocols", 65, 80, False),
    ]
    y = 290
    for name, curr, target, passed in skills:
        d.text((60, y), name, fill="#cbd5e1")
        col = "#10b981" if passed else "#f59e0b"
        d.text((500, y), f"{curr}% / {target}%", fill=col)
        d.rectangle([(60, y+24), (580, y+34)], fill="#334155")
        d.rectangle([(60, y+24), (60 + int(5.2*curr), y+34)], fill=col)
        y += 68

    # Right Column: Actionable Learning Roadmap
    d.rectangle([(650, 224), (1248, 760)], fill="#1e293b", outline="#334155", width=2)
    d.text((680, 248), "Recommended AI Curriculum & Projects", fill="#f1f5f9")
    modules = [
        ("Module 1: Vector Search & RAG Pipelines", "In Progress · 3/4 tasks done", "#6366f1"),
        ("Module 2: Container Orchestration with K8s", "Next Up · Est. 6 hrs", "#0284c7"),
        ("Module 3: Production Auth with OAuth2 / JWT", "Queued · Est. 4 hrs", "#64748b"),
        ("Milestone Project: Full-stack LLM Agent Platform", "Deliverable for Hack101 Finals", "#10b981"),
    ]
    my = 300
    for title, desc, clr in modules:
        d.rectangle([(680, my), (1216, my+88)], fill="#0f172a", outline=clr, width=2)
        d.rectangle([(696, my+16), (704, my+72)], fill=clr)
        d.text((720, my+20), title, fill="#f8fafc")
        d.text((720, my+50), desc, fill="#94a3b8")
        my += 104
        
    img.save(path)

def make_shot_groupflix(path):
    img = Image.new("RGB", (1280, 800), "#18181b")
    d = ImageDraw.Draw(img)
    
    # Top navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#27272a")
    d.rectangle([(32, 20), (52, 44)], fill="#ef4444")
    d.text((64, 22), "GroupFlix // Collaborative Group Movie Matcher", fill="#fafafa")
    d.rectangle([(1050, 16), (1240, 48)], fill="#ef4444")
    d.text((1070, 24), "Sync Room [4 Active]", fill="#ffffff")
    
    # Room Banner
    d.rectangle([(32, 88), (1248, 170)], fill="#27272a", outline="#3f3f46", width=2)
    d.text((60, 106), "ROOM: 'FRIDAY MOVIE NIGHT' · HOST: NITHIN", fill="#a1a1aa")
    d.text((60, 134), "Matched 14 candidates · Consensus Agreement: 91% Sci-Fi / Thriller", fill="#4ade80")
    
    # Movie Posters Grid
    movies = [
        ("Interstellar", "98% Match", "Sci-Fi · Nolan", "#3b82f6"),
        ("Inception", "94% Match", "Thriller · Mind-bend", "#8b5cf6"),
        ("Arrival", "91% Match", "Sci-Fi · Linguistics", "#ec4899"),
        ("The Matrix", "88% Match", "Cyberpunk · Classic", "#10b981"),
    ]
    for i, (mtitle, match, genre, color) in enumerate(movies):
        x = 32 + i * 308
        d.rectangle([(x, 196), (x+288, 520)], fill="#27272a", outline="#3f3f46", width=2)
        d.rectangle([(x+16, 212), (x+272, 380)], fill=color)
        d.text((x+30, 280), mtitle, fill="#ffffff")
        d.text((x+20, 400), mtitle, fill="#fafafa")
        d.text((x+20, 430), genre, fill="#a1a1aa")
        d.rectangle([(x+20, 464), (x+160, 496)], fill="#ef4444")
        d.text((x+32, 474), match, fill="#ffffff")

    # Group Voting breakdown panel
    d.rectangle([(32, 544), (1248, 760)], fill="#27272a", outline="#3f3f46", width=2)
    d.text((60, 568), "Live Preference Overlap Across 4 Viewers", fill="#f4f4f5")
    d.text((60, 608), "Nithin: Sci-Fi (95%), Thriller (90%), Comedy (60%)", fill="#d4d4d8")
    d.text((60, 638), "Alex: Sci-Fi (90%), Action (85%), Thriller (80%)", fill="#d4d4d8")
    d.text((60, 668), "Priya: Drama (85%), Sci-Fi (88%), Thriller (75%)", fill="#d4d4d8")
    d.text((60, 698), "Kiran: Sci-Fi (92%), Mystery (85%), Horror (20%)", fill="#d4d4d8")
    d.rectangle([(850, 600), (1200, 710)], fill="#18181b", outline="#ef4444", width=2)
    d.text((880, 630), "VOTING RESULT:", fill="#ef4444")
    d.text((880, 660), "WATCH: INTERSTELLAR (4/4 Agree)", fill="#4ade80")
    
    img.save(path)

def make_shot_fishglob(path):
    img = Image.new("RGB", (1280, 800), "#082f49")
    d = ImageDraw.Draw(img)
    
    # Navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#0c4a6e")
    d.rectangle([(32, 20), (52, 44)], fill="#38bdf8")
    d.text((64, 22), "FishGlob // Ocean Current-Aware Fish Analysis", fill="#f0f9ff")
    d.rectangle([(1080, 16), (1240, 48)], fill="#0284c7")
    d.text((1100, 24), "Indian Ocean Data", fill="#ffffff")
    
    # Map & Vector Field simulation
    d.rectangle([(32, 88), (800, 760)], fill="#075985", outline="#0284c7", width=2)
    d.text((60, 112), "Ocean Current Velocities & Migration Pathways", fill="#e0f2fe")
    # Draw vector arrows
    for vy in range(160, 720, 60):
        for vx in range(80, 760, 80):
            d.line([(vx, vy), (vx+30, vy-10)], fill="#38bdf8", width=2)
            d.polygon([(vx+30, vy-10), (vx+22, vy-16), (vx+24, vy-4)], fill="#38bdf8")
    # Draw fish concentration zones
    d.ellipse([(200, 280), (380, 460)], outline="#facc15", width=3)
    d.text((220, 360), "High Density Zone (Tuna)", fill="#fef08a")
    d.ellipse([(480, 420), (680, 620)], outline="#4ade80", width=3)
    d.text((500, 510), "Upwelling Feeding Area", fill="#bbf7d0")
    
    # Right Metrics Panel
    d.rectangle([(832, 88), (1248, 760)], fill="#0c4a6e", outline="#0284c7", width=2)
    d.text((860, 112), "Hydrodynamic Parameters", fill="#f0f9ff")
    metrics = [
        ("Sea Surface Temp (SST)", "28.4 °C (Optimal)"),
        ("Current Velocity (Max)", "1.82 m/s Eastward"),
        ("Chlorophyll-a Index", "0.45 mg/m³ (Rich)"),
        ("Depth Stratification", "Thermocline at 65m"),
        ("Predicted Catch Density", "87.3% Accuracy"),
    ]
    my = 160
    for label, val in metrics:
        d.rectangle([(860, my), (1220, my+80)], fill="#075985")
        d.text((880, my+16), label, fill="#7dd3fc")
        d.text((880, my+46), val, fill="#ffffff")
        my += 100
        
    img.save(path)

def make_shot_neoflash(path):
    img = Image.new("RGB", (1280, 800), "#134e4a")
    d = ImageDraw.Draw(img)
    
    # Navbar
    d.rectangle([(0, 0), (1280, 64)], fill="#115e59")
    d.rectangle([(32, 20), (52, 44)], fill="#2dd4bf")
    d.text((64, 22), "NeoFlash // Spaced Repetition Learning System", fill="#f0fdfa")
    d.rectangle([(1080, 16), (1240, 48)], fill="#0d9488")
    d.text((1100, 24), "Deck: Web Arch", fill="#ffffff")
    
    # Deck Status Banner
    d.rectangle([(32, 88), (1248, 160)], fill="#115e59", outline="#14b8a6", width=2)
    d.text((60, 104), "DECK: DISTRIBUTED SYSTEMS & PERFORMANCE", fill="#ccfbf1")
    d.text((60, 130), "Card 18 of 64 · Retention Rate: 94.2% · Interval: 6 Days", fill="#5eead4")
    
    # Main Active Flashcard
    d.rectangle([(240, 190), (1040, 560)], fill="#fbf6e6", outline="#1a1208", width=4)
    d.text((280, 230), "FLASHCARD #18 [FRONT]", fill="#5c5546")
    d.text((280, 280), "What is Cache Stampede and how do you prevent it?", fill="#1a1208")
    d.text((280, 330), "(Click or press Space to reveal answer)", fill="#5c5546")
    
    # Answer reveal preview
    d.rectangle([(280, 380), (1000, 520)], fill="#f1e9cf", outline="#a8742f", width=2)
    d.text((300, 400), "Answer / Key Concepts:", fill="#1a1208")
    d.text((300, 430), "• High concurrent misses when a popular cache key expires.", fill="#1a1208")
    d.text((300, 460), "• Prevention: Mutex locks, Probabilistic early expiration (XFetch).", fill="#1a1208")
    d.text((300, 490), "• Background async re-warming before TTL.", fill="#1a1208")
    
    # Rating Buttons
    ratings = [
        ("1: Again (< 10m)", "#ef4444"),
        ("2: Hard (1 day)", "#f59e0b"),
        ("3: Good (3 days)", "#3b82f6"),
        ("4: Easy (6 days)", "#10b981")
    ]
    for i, (rtitle, color) in enumerate(ratings):
        rx = 240 + i * 205
        d.rectangle([(rx, 600), (rx+190, 660)], fill=color)
        d.text((rx+20, 624), rtitle, fill="#ffffff")
        
    img.save(path)

def make_og_image(path):
    img = Image.new("RGB", (1200, 630), "#4f87f0")
    d = ImageDraw.Draw(img)
    # Sky bands
    d.rectangle([(0, 0), (1200, 157)], fill="#4f87f0")
    d.rectangle([(0, 157), (1200, 315)], fill="#5c94fc")
    d.rectangle([(0, 315), (1200, 472)], fill="#6fa3ff")
    d.rectangle([(0, 472), (1200, 630)], fill="#86b4ff")
    # Sun
    d.rectangle([(1020, 40), (1100, 120)], fill="#ffe36b")
    # Wood Sign
    d.rectangle([(100, 60), (740, 420)], fill="#a8742f", outline="#3b2410", width=4)
    d.rectangle([(120, 80), (720, 400)], fill="#8f5f25")
    d.text((150, 110), "NITHIN", fill="#fbf6e6")
    d.text((150, 160), "Software engineer in the making", fill="#fff4d6")
    d.text((150, 210), "CSE @ Amrita · SDE Intern · Hack101 2nd place", fill="#fff4d6")
    d.text((150, 270), "Interactive Mario & Terminal Portfolio", fill="#f5c451")
    # Floor
    d.rectangle([(0, 520), (1200, 544)], fill="#c84c0c")
    d.rectangle([(0, 544), (1200, 630)], fill="#7a2a00")
    d.text((40, 570), "nithin@world-1:~$ type help, projects, open skillup...", fill="#f5c451")
    img.save(path)

def make_dummy_pdf(path):
    # Minimal standard conforming PDF with Nithin's resume
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
<< /Length 580 >>
stream
BT
/F1 24 Tf
50 720 Td
(NITHIN - SOFTWARE ENGINEER RESUME) Tj
/F1 12 Tf
0 -30 Td
(Email: nithin@example.com | GitHub: github.com/Nithin0306 | LinkedIn: linkedin.com/in/nithin) Tj
0 -40 Td
(EDUCATION: Amrita Vishwa Vidyapeetham - B.Tech Computer Science and Engineering) Tj
0 -30 Td
(EXPERIENCE: Software Development Engineer Intern) Tj
0 -20 Td
(- Architected full-stack web applications and AI integration pipelines) Tj
0 -20 Td
(- Optimized database query latencies and responsive user interface components) Tj
0 -30 Td
(PROJECTS:) Tj
0 -20 Td
(- SkillUp: AI Skill Gap Analyzer - Hack101 2nd Place Runner-Up) Tj
0 -20 Td
(- GroupFlix: Collaborative Movie Recommendation Engine with Consensus Algorithm) Tj
0 -20 Td
(- FishGlob: Ocean Current-Aware Marine Fisheries Analytics) Tj
0 -20 Td
(- NeoFlash: Web-Based Spaced Repetition Flashcard Learning System) Tj
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
0000000877 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
947
%%EOF
"""
    with open(path, "wb") as f:
        f.write(content)

os.makedirs("assets/shots", exist_ok=True)
make_shot_skillup("assets/shots/skillup.png")
make_shot_groupflix("assets/shots/groupflix.png")
make_shot_fishglob("assets/shots/fishglob.png")
make_shot_neoflash("assets/shots/neoflash.png")
make_og_image("assets/og.png")
make_dummy_pdf("assets/resume.pdf")
print("Assets generated successfully!")
