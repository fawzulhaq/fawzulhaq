/**
 * ATS-Optimized CV Generator
 * Uses jsPDF (loaded from CDN) to create a clean, ATS-friendly PDF
 * from profile.json data. No images, tables-based layout for ATS parsing.
 * 
 * Usage:
 *   generateATSCV(profileData)     – called by update-profile.html
 *   generateATSCVFromURL()         – called by the portfolio page on Download click
 */

/* ---- Load jsPDF from CDN if not already loaded ---- */
function loadjsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload  = () => resolve(window.jspdf.jsPDF);
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(script);
  });
}

/* ---- Fetch profile.json from server ----
 * Works on:
 *   ✅ GitHub Pages (https://fawzulhaq.github.io/...) – same-origin fetch
 *   ✅ Local dev server (npm run serve / python -m http.server)
 *   ✅ Direct file:// open – falls back to embedded data below
 * Does NOT work on file:// due to browser CORS policy for fetch() —
 * in that case, the embedded fallback profile is used automatically.
 */
async function fetchProfile() {
  // If opened as a local file (file:// protocol), skip fetch entirely
  if (window.location.protocol === 'file:') {
    console.warn('[CV Generator] Running as file://, using embedded profile data');
    return getEmbeddedProfile();
  }
  try {
    const res = await fetch('profile.json?nocache=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('[CV Generator] Could not fetch profile.json, using embedded fallback:', e.message);
    return getEmbeddedProfile();
  }
}

/* ---- Embedded profile fallback (always in sync with profile.json) ----
 * This is auto-generated from profile.json. If you update profile.json,
 * run the portfolio locally and it will use the fetched version.
 * The embedded version is only used when fetch() is unavailable.
 */
function getEmbeddedProfile() {
  return {
    "meta": { "lastUpdated": "2026-07-15", "version": "1.0" },
    "basics": {
      "name": "M.N.M. Fawzul Haq",
      "label": "System Engineer | Cybersecurity Enthusiast",
      "email": "fawzulhaq.mnm@gmail.com",
      "phone": "+94765239680",
      "location": { "address": "81/2 Bandaranayake Mawatha", "city": "Kalubowila", "country": "Sri Lanka" },
      "profiles": {
        "linkedin": "https://www.linkedin.com/in/fawzul-haq-377092174",
        "github": "https://github.com/fawzulhaq",
        "tryhackme": "https://tryhackme.com/p/fawzulhaq"
      },
      "summary": "Motivated and detail-oriented System Engineer and Cybersecurity Enthusiast with over 4 years of experience in IT infrastructure management, server administration, and network security. Skilled in system troubleshooting, endpoint protection, and ISO compliance support. Strong team player with a proven ability to resolve technical issues efficiently and maintain smooth IT operations. Holds a BSc (Hons) in Computer Networks & Security (Second Class, Upper Division)."
    },
    "work": [
      {
        "company": "Mitra Innovation", "location": "Moratuwa, Sri Lanka",
        "position": "System Engineer", "startDate": "2024-06", "endDate": null, "current": true,
        "highlights": [
          "Troubleshooting and configuring Wazuh for continuous security monitoring and automated threat detection",
          "Conducting switch, access point firmware updates and Windows/Linux server patch management",
          "Delivering security awareness training to employees",
          "Supporting ISO audits and maintaining compliance readiness through rigorous system maintenance and documentation",
          "Providing network troubleshooting support and system maintenance",
          "Conducting Active Directory, firewall, and access control reviews"
        ]
      },
      {
        "company": "Mitra Innovation", "location": "Moratuwa, Sri Lanka",
        "position": "Associate System Engineer", "startDate": "2022-04", "endDate": "2024-06", "current": false,
        "highlights": [
          "Conducted internal inventory audits and maintained accurate IT asset records",
          "Handled door access control troubleshooting and configurations",
          "Managed fingerprint enrollment and generated attendance reports",
          "Performed patch management and updates for endpoints",
          "Conducted IT onboarding sessions for new employees",
          "Updated Windows and Ubuntu servers, deployed systems via MDT",
          "Managed Sophos Central, backup, restore, and verification operations"
        ]
      },
      {
        "company": "Mitra Innovation", "location": "Moratuwa, Sri Lanka",
        "position": "Intern – System Engineer", "startDate": "2021-09", "endDate": "2022-04", "current": false,
        "highlights": [
          "Prepared computers for new employees and provided IT support",
          "Troubleshot hardware issues and installed security applications on endpoints",
          "Managed asset inventory and supported the asset disposal process",
          "Assisted with system and network issues for internal users",
          "Performed minor hardware repairs and provided technical support during company events"
        ]
      },
      {
        "company": "Hashnative Software Engineering", "location": "Colombo 05, Sri Lanka",
        "position": "Trainee – Software Engineer", "startDate": "2019-12", "endDate": "2020-06", "current": false,
        "highlights": [
          "Collaborated on internal and client projects as a developer and designer",
          "Designed templates and contributed to mobile, desktop, and web application development",
          "Worked with PHP, Java, Laravel, Flutter, and WordPress frameworks"
        ]
      }
    ],
    "education": [
      { "institution": "Wrexham University", "area": "Computer Networks and Security", "studyType": "BSc (Hons)", "startDate": "2024", "endDate": "2025", "grade": "Second Class, Upper Division" },
      { "institution": "Winsys City Campus", "area": "Cyber Security", "studyType": "Qualifi Level 5 Diploma", "startDate": "2018", "endDate": "2019", "grade": "" },
      { "institution": "JMC Institute", "area": "Computer Hardware Technology", "studyType": "Certificate", "startDate": "2016", "endDate": "2016", "grade": "" },
      { "institution": "Zahira College, Colombo", "area": "Arts Stream", "studyType": "G.C.E. Advanced Level", "startDate": "2018", "endDate": "2018", "grade": "" }
    ],
    "certifications": [
      { "name": "Certified Red Team Operations Management", "acronym": "CRTOM", "issuer": "", "date": "", "status": "earned" },
      { "name": "Certified Phishing Prevention Specialist", "acronym": "CPPS", "issuer": "", "date": "", "status": "earned" },
      { "name": "Cybersecurity Career Starter Certification", "acronym": "CCSC", "issuer": "", "date": "", "status": "earned" },
      { "name": "Networking Academy Learn-A-Thon – Network Security", "acronym": "Cisco", "issuer": "Cisco", "date": "2020", "status": "earned" },
      { "name": "CompTIA Security+", "acronym": "SY0-701", "issuer": "CompTIA", "date": "", "status": "in-progress", "progress": 65 },
      { "name": "ISC2 Certified in Cybersecurity", "acronym": "CC", "issuer": "ISC2", "date": "", "status": "in-progress", "progress": 70 },
      { "name": "Certified Ethical Hacker", "acronym": "CEH", "issuer": "EC-Council", "date": "", "status": "in-progress", "progress": 50 }
    ],
    "skills": {
      "technical": ["System Administration","Network Troubleshooting","Wazuh SIEM Configuration","Security Monitoring","Server Maintenance","Patch Management","Backup & Recovery","ISO Compliance","Endpoint Security","IT Onboarding","SIEM","Security Operations","Active Directory","Firewall Management","Linux Administration","Windows Server","Sophos Central","Kibana","Elasticsearch","MDT Deployment"],
      "soft": ["Teamwork","Communication","Problem Solving","Time Management","Adaptability","Analytical Thinking","Continuous Learning"],
      "development": ["PHP","Laravel","HTML","CSS","JavaScript","WordPress","Flutter","C#","Java"]
    },
    "projects": [
      {
        "name": "AI-SIEM Integration", "featured": true,
        "description": "Implemented AI-Driven SIEM to Enhance Security Using Wazuh. Built a central security system using Wazuh and the Kibana Stack to monitor logs and detect threats in real-time.",
        "highlights": ["Built central security system using Wazuh and Kibana Stack for real-time log monitoring","Integrated AI/Machine Learning for intelligent threat classification","Set up automated vulnerability scanning tools","Created Kibana dashboards for live security data visualization"],
        "technologies": ["Wazuh","Elasticsearch","Kibana","ChatGPT","Linux","AI/ML"]
      },
      { "name": "Happy Toys – E-Commerce Website", "description": "Developed a full-featured e-commerce website for an online toy store using WordPress.", "highlights": [], "technologies": ["WordPress","HTML","CSS","Bootstrap","JavaScript"], "featured": false },
      { "name": "Budget App", "description": "Web-based application for calculating income and expenses.", "highlights": [], "technologies": ["Laravel","PHP","HTML","CSS","Bootstrap"], "featured": false },
      { "name": "Task Diary", "description": "Web-based application for task management.", "highlights": [], "technologies": ["Laravel","PHP","HTML","CSS","JavaScript"], "featured": false },
      { "name": "Maths Cal", "description": "Desktop application for solving simple mathematical problems.", "highlights": [], "technologies": ["C#","Windows Forms",".NET"], "featured": false }
    ],
    "volunteer": [{ "organization": "FITIS", "role": "Volunteer", "event": "Infotel ICT Expo 2019", "venue": "BMICH" }],
    "references": [
      { "name": "Kavinda Munasinghe", "title": "Director IT", "company": "Cinnamon Hotels & Resorts", "email": "kavinda@gmail.com" },
      { "name": "Ilham Safeek", "title": "Founder", "company": "Hashnate Software Engineering", "email": "ilhamsafeek@yahoo.com" }
    ]
  };
}

/* ---- Entry point: called from portfolio download button ---- */
async function generateATSCVFromURL() {
  const btn = document.getElementById('cv-hero-btn') || document.getElementById('cv-contact-btn') || document.getElementById('cv-download-btn');
  const originalText = btn ? btn.innerHTML : '';

  try {
    if (btn) {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Generating CV...`;
      btn.style.opacity = '0.8';
      btn.style.pointerEvents = 'none';
    }

    const profile = await fetchProfile();
    await generateATSCV(profile);

  } catch (e) {
    console.error('CV generation error:', e);
    // Fallback: try static PDF if it exists
    const a = document.createElement('a');
    a.href = 'fawzulhaq_cv.pdf';
    a.download = 'Fawzul_Haq_CV.pdf';
    a.click();
  } finally {
    if (btn) {
      btn.innerHTML = originalText;
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
    }
  }
}

/* ---- Main ATS CV Generator ---- */
async function generateATSCV(profile) {
  const jsPDF = await loadjsPDF();

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ============================================
  // CONFIGURATION
  // ============================================
  const PAGE_W    = 210;
  const PAGE_H    = 297;
  const MARGIN_L  = 20;
  const MARGIN_R  = 20;
  const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

  // ATS-safe colors (black/dark grey only – no fancy colors)
  const C_BLACK   = [0, 0, 0];
  const C_DARK    = [30, 30, 30];
  const C_MEDIUM  = [80, 80, 80];
  const C_LIGHT   = [130, 130, 130];
  const C_LINE    = [180, 180, 180];

  let y = 0; // current Y position

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function setFont(style, size, color) {
    doc.setFontSize(size);
    doc.setTextColor(...(color || C_DARK));
    if (style === 'bold') {
      doc.setFont('helvetica', 'bold');
    } else if (style === 'italic') {
      doc.setFont('helvetica', 'italic');
    } else {
      doc.setFont('helvetica', 'normal');
    }
  }

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > PAGE_H - 20) {
      doc.addPage();
      y = 20;
    }
  }

  function drawLine(color) {
    doc.setDrawColor(...(color || C_LINE));
    doc.setLineWidth(0.3);
    doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
    y += 3;
  }

  function sectionHeader(title) {
    checkPageBreak(12);
    y += 4;
    setFont('bold', 10, C_BLACK);
    doc.text(title.toUpperCase(), MARGIN_L, y);
    y += 2;
    doc.setDrawColor(...C_BLACK);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
    y += 4;
  }

  function wrappedText(text, x, maxWidth, lineHeight, fontStyle, size, color) {
    setFont(fontStyle || 'normal', size || 9, color);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach(line => {
      checkPageBreak(lineHeight || 5);
      doc.text(line, x, y);
      y += lineHeight || 5;
    });
    return lines.length;
  }

  function bulletPoint(text, indent) {
    const x = MARGIN_L + (indent || 4);
    const maxW = CONTENT_W - (indent || 4) - 4;
    setFont('normal', 9, C_DARK);
    doc.text('•', MARGIN_L + (indent || 2), y);
    const lines = doc.splitTextToSize(text, maxW);
    lines.forEach((line, i) => {
      checkPageBreak(4.5);
      doc.text(line, x, y + (i === 0 ? 0 : -1));
      if (i < lines.length - 1) y += 4.5;
    });
    y += 4.5;
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Present';
    const [year, month] = dateStr.split('-');
    const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return month ? `${months[parseInt(month)]} ${year}` : year;
  }

  // ============================================
  // PAGE 1 – HEADER
  // ============================================
  y = 20;

  // Name – large and centered
  setFont('bold', 22, C_BLACK);
  doc.text(profile.basics.name, PAGE_W / 2, y, { align: 'center' });
  y += 7;

  // Title
  setFont('normal', 11, C_MEDIUM);
  doc.text(profile.basics.label, PAGE_W / 2, y, { align: 'center' });
  y += 5;

  // Contact line
  const contactParts = [
    profile.basics.location.city + ', ' + profile.basics.location.country,
    profile.basics.phone,
    profile.basics.email,
    profile.basics.profiles.linkedin?.replace('https://www.linkedin.com/in/', 'linkedin.com/in/'),
    profile.basics.profiles.github?.replace('https://github.com/', 'github.com/')
  ].filter(Boolean);

  setFont('normal', 8.5, C_MEDIUM);
  const contactLine = contactParts.join('  |  ');
  const contactLines = doc.splitTextToSize(contactLine, CONTENT_W);
  contactLines.forEach(line => {
    doc.text(line, PAGE_W / 2, y, { align: 'center' });
    y += 4;
  });

  drawLine(C_BLACK);

  // ============================================
  // PROFESSIONAL SUMMARY
  // ============================================
  if (profile.basics.summary) {
    sectionHeader('Professional Summary');
    wrappedText(profile.basics.summary, MARGIN_L, CONTENT_W, 4.8, 'normal', 9.5, C_DARK);
    y += 2;
  }

  // ============================================
  // WORK EXPERIENCE
  // ============================================
  if (profile.work && profile.work.length > 0) {
    sectionHeader('Professional Experience');

    profile.work.forEach((job, idx) => {
      checkPageBreak(20);

      // Job title + dates on same line
      setFont('bold', 10, C_BLACK);
      doc.text(job.position, MARGIN_L, y);

      const dateRange = `${formatDate(job.startDate)} – ${job.endDate ? formatDate(job.endDate) : 'Present'}`;
      setFont('normal', 9, C_MEDIUM);
      doc.text(dateRange, PAGE_W - MARGIN_R, y, { align: 'right' });
      y += 4.5;

      // Company + location
      const companyLine = job.location ? `${job.company}  •  ${job.location}` : job.company;
      setFont('italic', 9, C_MEDIUM);
      doc.text(companyLine, MARGIN_L, y);
      y += 5;

      // Bullet points
      if (job.highlights && job.highlights.length > 0) {
        job.highlights.forEach(h => {
          if (h.trim()) bulletPoint(h, 4);
        });
      }

      if (idx < profile.work.length - 1) y += 2;
    });
  }

  // ============================================
  // EDUCATION
  // ============================================
  if (profile.education && profile.education.length > 0) {
    sectionHeader('Education');

    profile.education.forEach(edu => {
      checkPageBreak(14);

      const degree = `${edu.studyType}${edu.area ? ' – ' + edu.area : ''}`;
      setFont('bold', 10, C_BLACK);
      doc.text(degree, MARGIN_L, y);

      const yearRange = edu.endDate && edu.endDate !== edu.startDate
        ? `${edu.startDate} – ${edu.endDate}`
        : edu.startDate;
      setFont('normal', 9, C_MEDIUM);
      doc.text(yearRange, PAGE_W - MARGIN_R, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 9, C_MEDIUM);
      doc.text(edu.institution, MARGIN_L, y);

      if (edu.grade) {
        setFont('normal', 8.5, C_MEDIUM);
        doc.text(`Grade: ${edu.grade}`, PAGE_W - MARGIN_R, y, { align: 'right' });
      }
      y += 5;
    });
  }

  // ============================================
  // CERTIFICATIONS
  // ============================================
  if (profile.certifications && profile.certifications.length > 0) {
    sectionHeader('Certifications');

    const earned = profile.certifications.filter(c => c.status === 'earned');
    const inProgress = profile.certifications.filter(c => c.status === 'in-progress');

    if (earned.length > 0) {
      setFont('bold', 9, C_DARK);
      doc.text('Completed:', MARGIN_L, y);
      y += 4.5;

      earned.forEach(cert => {
        checkPageBreak(6);
        const line = [
          cert.name,
          cert.issuer && cert.issuer !== cert.acronym ? `(${cert.issuer})` : '',
          cert.date ? `– ${cert.date}` : ''
        ].filter(Boolean).join(' ');
        bulletPoint(line, 4);
      });
    }

    if (inProgress.length > 0) {
      y += 1;
      setFont('bold', 9, C_DARK);
      doc.text('Currently Pursuing:', MARGIN_L, y);
      y += 4.5;

      inProgress.forEach(cert => {
        const line = `${cert.name}${cert.issuer ? ` (${cert.issuer})` : ''} – In Progress`;
        bulletPoint(line, 4);
      });
    }
  }

  // ============================================
  // TECHNICAL SKILLS
  // ============================================
  if (profile.skills) {
    sectionHeader('Technical Skills');

    const skillCategories = [
      { label: 'Security & Operations', skills: profile.skills.technical.filter(s =>
          /siem|wazuh|security|monitor|threat|firewall|endpoint|sophos|kibana|elastic|soc|iso|compliance|audit|patch|backup|recovery|active.?directory|access.?control/i.test(s)) },
      { label: 'System Administration', skills: profile.skills.technical.filter(s =>
          /windows|linux|ubuntu|server|admin|mdt|deployment|network|vpn|switch/i.test(s)) },
      { label: 'Development', skills: profile.skills.development || [] },
      { label: 'Other Technical', skills: profile.skills.technical.filter(s =>
          !/(siem|wazuh|security|monitor|threat|firewall|endpoint|sophos|kibana|elastic|soc|iso|compliance|audit|patch|backup|recovery|active.?directory|access.?control|windows|linux|ubuntu|server|admin|mdt|deployment|network|vpn|switch)/i.test(s)) }
    ].filter(cat => cat.skills.length > 0);

    skillCategories.forEach(cat => {
      checkPageBreak(8);
      setFont('bold', 9, C_DARK);
      doc.text(cat.label + ':', MARGIN_L, y);
      setFont('normal', 9, C_DARK);
      const skillLine = cat.skills.join('  •  ');
      const skillLines = doc.splitTextToSize(skillLine, CONTENT_W - 2);
      skillLines.forEach((line, i) => {
        if (i === 0) {
          // Inline after label
          const labelW = doc.getTextWidth(cat.label + ': ');
          const remaining = CONTENT_W - labelW;
          const firstLine = doc.splitTextToSize(skillLine, remaining)[0];
          doc.text(firstLine, MARGIN_L + labelW, y);
          y += 4.5;
        } else {
          checkPageBreak(4.5);
          doc.text(line, MARGIN_L + 2, y);
          y += 4.5;
        }
      });
    });

    // Soft skills
    if (profile.skills.soft && profile.skills.soft.length > 0) {
      checkPageBreak(8);
      setFont('bold', 9, C_DARK);
      doc.text('Soft Skills:', MARGIN_L, y);
      setFont('normal', 9, C_DARK);
      const softLine = profile.skills.soft.join('  •  ');
      const sw = doc.getTextWidth('Soft Skills: ');
      doc.text(softLine, MARGIN_L + sw, y);
      y += 5;
    }
  }

  // ============================================
  // PROJECTS
  // ============================================
  if (profile.projects && profile.projects.length > 0) {
    sectionHeader('Personal Projects');

    profile.projects.forEach(project => {
      checkPageBreak(16);
      setFont('bold', 10, C_BLACK);
      doc.text(project.name, MARGIN_L, y);
      y += 4.5;

      if (project.description) {
        wrappedText(project.description, MARGIN_L, CONTENT_W, 4.5, 'normal', 9, C_DARK);
      }

      if (project.highlights && project.highlights.length > 0) {
        project.highlights.forEach(h => bulletPoint(h, 4));
      }

      if (project.technologies && project.technologies.length > 0) {
        checkPageBreak(5);
        setFont('italic', 8.5, C_MEDIUM);
        doc.text('Technologies: ' + project.technologies.join(', '), MARGIN_L + 2, y);
        y += 5;
      }

      y += 1;
    });
  }

  // ============================================
  // VOLUNTEER / EXTRA
  // ============================================
  if (profile.volunteer && profile.volunteer.length > 0) {
    sectionHeader('Volunteering');
    profile.volunteer.forEach(v => {
      checkPageBreak(10);
      const line = `${v.role} – ${v.event} at ${v.venue} (${v.organization})`;
      bulletPoint(line, 4);
    });
  }

  // ============================================
  // REFERENCES
  // ============================================
  if (profile.references && profile.references.length > 0) {
    sectionHeader('References');
    profile.references.forEach((ref, i) => {
      checkPageBreak(10);
      setFont('bold', 9, C_DARK);
      doc.text(`${i + 1}. ${ref.name}`, MARGIN_L, y);
      y += 4;
      setFont('normal', 8.5, C_MEDIUM);
      doc.text(`${ref.title}, ${ref.company}  |  ${ref.email}`, MARGIN_L + 3, y);
      y += 4.5;
    });
  }

  // ============================================
  // FOOTER on each page
  // ============================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    setFont('normal', 7.5, C_LIGHT);
    doc.text(
      `${profile.basics.name}  •  CV  •  Page ${p} of ${totalPages}  •  Last updated: ${profile.meta?.lastUpdated || new Date().toISOString().split('T')[0]}`,
      PAGE_W / 2,
      PAGE_H - 10,
      { align: 'center' }
    );
  }

  // ============================================
  // SAVE
  // ============================================
  const filename = `${profile.basics.name.replace(/[^a-zA-Z0-9]/g, '_')}_CV_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);

  console.log(`[CV Generator] Generated: ${filename} | ${totalPages} page(s)`);
  return true;
}
