// ==========================================================================
// STATE MANAGEMENT & DATA
// ==========================================================================

const appState = {
  theme: 'light',
  activeSection: 'welcome-section',
  visitedSections: new Set(['welcome-section']),
  
  // Timeline Widget State
  timelineYear: 1,

  // Audit Challenge State
  auditAnswers: {
    hallucination: false,
    contradiction: false,
    citation: false
  },

  // Quiz State
  currentQuizIndex: 0,
  quizScore: 0,
  quizAnswers: []
};

// Timeline Data
const timelineData = {
  1: {
    year: "2017: AI as a Basic Assistant",
    desc: "AI is used primarily for back-end scheduling, adaptive tutoring paths, and virtual teaching assistants (e.g., Jill Watson) that answer simple online forum questions. Students still write essays and solve coding projects manually.",
    vulnerability: "Low (10%)",
    vulnClass: "vuln-low"
  },
  2: {
    year: "2020: AI as a Paraphrasing & Writing Aid",
    desc: "Early large language models (like GPT-2/3) power smart autocomplete, basic translation, and automated essay-spinning. AI can write paragraphs but lacks coherence over long essays. Instructors start noticing suspicious grammar improvement.",
    vulnerability: "Medium (45%)",
    vulnClass: "vuln-med"
  },
  3: {
    year: "Present: Generative AI Co-Pilot",
    desc: "Models like ChatGPT, Claude, and Gemini generate high-scoring, structurally flawless research papers, source-code files, and mathematical derivations in seconds based on simple prompts. Traditional take-home assessments no longer reflect student writing.",
    vulnerability: "Critical (95%)",
    vulnClass: "vuln-high"
  }
};

// Quiz Data
const quizQuestions = [
  {
    question: "Which of the following is the most statistically reliable method for verifying student mastery in the AI era?",
    options: [
      "Running all student submissions through enterprise-grade AI detection software.",
      "Redesigning assessment architecture to evaluate the student's workflow, defense, and local context.",
      "Reverting all homework assignments to multiple-choice exams administered on the web.",
      "Requiring students to write essays using Google Docs and grading them based on keystroke counts."
    ],
    answer: 1,
    explanation: "AI detection software yields high false-positive rates, disproportionately flagging ESL writers, and is easily bypassed. Redesigning assessments to test high-order thinking and personal articulation is the only reliable path."
  },
  {
    question: "An instructor wants to adapt a standard 'Literature Review' assignment to be AI-resilient. Which approach aligns with 'Human-in-the-Loop' critiques?",
    options: [
      "Have students write the literature review entirely in class without internet access.",
      "Have students record an unedited 10-minute speech summarizing the papers.",
      "Provide students with a flawed, AI-generated literature review and grade them on their ability to audit, correct, and cite valid academic refutations.",
      "Ban the use of AI tools entirely and add a syllabus clause warning of academic dishonesty."
    ],
    answer: 2,
    explanation: "The AI Audit (Strategy 3) transforms the student from a writer into an evaluator. They must verify mass-generated content, find factual hallucinations, and replace them with peer-reviewed proof."
  },
  {
    question: "Why does adding 'Hyper-Local' constraints (Strategy 4) make an assessment highly resilient to AI bypass?",
    options: [
      "AI models do not understand grammar conventions in local dialects.",
      "AI lacks access to real-time, physical classroom experiences, guest speakers, or primary research data gathered on-campus.",
      "Local contexts force students to work in teams, which prevents cheating.",
      "Hyper-local prompts automatically disable a browser's copy-paste capability."
    ],
    answer: 1,
    explanation: "Generative AI models are trained on static, global web scrapings. They cannot synthesize or accurately reference Tuesday's specific classroom debate, guest speaker remarks, or local campus survey results unless manually fed."
  },
  {
    question: "For a class of 80 students, what verbal defense strategy (Strategy 2) is most scalable in terms of grading time for a single instructor?",
    options: [
      "Conducting a 15-minute synchronous oral interview with every student.",
      "Requiring an unedited 3-minute video explanation submitted alongside written work, which the instructor can grade in 2 minutes.",
      "Eliminating the written portion and holding class-wide debates.",
      "Requiring peer reviews where students grade each other's verbal explanations."
    ],
    answer: 1,
    explanation: "Asynchronous video explanations (3-min limit) let students demonstrate mastery on their own time, and instructors can review them in 2 minutes. For 80 students, this takes ~6.6 hours total, compared to 20 hours for live exams."
  },
  {
    question: "In the Assessment Shift Matrix, what is the recommended resilient alternative to a standard 'Coding Project'?",
    options: [
      "An in-class pen-and-paper coding test.",
      "A software project that must be completed using a local library workspace.",
      "A live code walkthrough where the student must explain the logic of 3 specific lines of code in their submission.",
      "A requirement that the code contains no comments."
    ],
    answer: 2,
    explanation: "If a student uses Copilot to generate their code, they must still prove comprehension. A live code walkthrough forces the student to explain the architecture and variable logic, proving they can read and debug it."
  }
];

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Layout Elements
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const mainContent = document.getElementById('main-content');
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');
  const progressBar = document.getElementById('progress-bar');
  
  // Section Navigation Buttons
  const nextBtns = document.querySelectorAll('.next-section-btn');
  const prevBtns = document.querySelectorAll('.prev-section-btn');

  // Timeline Widget Elements
  const timelineSlider = document.getElementById('ai-timeline-slider');
  const timelineYear = document.getElementById('timeline-year');
  const timelineDesc = document.getElementById('timeline-desc');
  const timelineVuln = document.getElementById('timeline-vuln');

  // Vulnerability Analyzer Elements
  const vulnAssignmentSelect = document.getElementById('vuln-assignment-select');
  const paramLogs = document.getElementById('param-logs');
  const paramOral = document.getElementById('param-oral');
  const paramLocal = document.getElementById('param-local');
  const vulnMeterBar = document.getElementById('vuln-meter-bar');
  const vulnMeterText = document.getElementById('vuln-meter-text');
  const vulnAnalysisFeedback = document.getElementById('vuln-analysis-feedback');

  // Strategy 1 (Prompt Sandbox) Elements
  const btnRefineRole = document.getElementById('btn-refine-role');
  const btnRefineContext = document.getElementById('btn-refine-context');
  const btnRefineCritique = document.getElementById('btn-refine-critique');
  const btnResetPrompt = document.getElementById('btn-reset-prompt');
  const promptDisplay = document.getElementById('prompt-display');
  const promptAiDisplay = document.getElementById('prompt-ai-display');
  
  let promptRefinementState = { role: false, context: false, critique: false };

  // Strategy 2 (Calculator) Elements
  const calcClassSize = document.getElementById('calc-class-size');
  const calcClassSizeVal = document.getElementById('calc-class-size-val');
  const calcDefenseType = document.getElementById('calc-defense-type');
  const calcTotalHours = document.getElementById('calc-total-hours');
  const calcFeasibility = document.getElementById('calc-feasibility');
  const calcNotes = document.getElementById('calc-notes');

  // Strategy 3 (AI Audit Challenge) Elements
  const auditPassage = document.getElementById('audit-passage');
  const auditScore = document.getElementById('audit-score');
  const btnResetAudit = document.getElementById('btn-reset-audit');
  const auditFeedback = document.getElementById('audit-feedback');

  // Strategy 4 (Resilience Builder) Elements
  const resilienceChecks = document.querySelectorAll('.resilience-check');
  const resilienceRatingLabel = document.getElementById('resilience-rating-label');
  const resilienceMeterBar = document.getElementById('resilience-meter-bar');
  const resilienceFeedbackText = document.getElementById('resilience-feedback-text');

  // Shift Matrix Elements
  const btnViewBrief = document.getElementById('btn-view-brief');
  const btnViewDetailed = document.getElementById('btn-view-detailed');
  const briefTexts = document.querySelectorAll('.brief-text');
  const detailedTexts = document.querySelectorAll('.detailed-text');

  // Syllabus Redesigner Elements
  const redesignerForm = document.getElementById('redesigner-form');
  const blueprintCode = document.getElementById('blueprint-code');
  const btnCopyBlueprint = document.getElementById('btn-copy-blueprint');
  const copyToast = document.getElementById('copy-toast');

  // Diagnostic Quiz Elements
  const quizQNum = document.getElementById('quiz-q-num');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const quizInteractiveCard = document.getElementById('quiz-interactive-card');
  const quizSuccessCard = document.getElementById('quiz-success-card');
  const btnRestartQuiz = document.getElementById('btn-restart-quiz');
  const btnRestartTutorial = document.getElementById('btn-restart-tutorial');
  const certUserNameInput = document.getElementById('cert-user-name');
  const quizBadgeName = document.getElementById('quiz-badge-name');
  const btnPrintCert = document.getElementById('btn-print-cert');
  const quizFailCard = document.getElementById('quiz-fail-card');
  const quizFailScore = document.getElementById('quiz-fail-score');
  const btnRestartQuizFail = document.getElementById('btn-restart-quiz-fail');
  const btnRestartTutorialFail = document.getElementById('btn-restart-tutorial-fail');

  // ==========================================================================
  // INITIALIZATION & THEME FUNCTIONALITY
  // ==========================================================================
  
  function initTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch (e) {
      console.warn('localStorage is not accessible in this context:', e);
    }
    
    if (savedTheme) {
      appState.theme = savedTheme;
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      appState.theme = systemPrefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', appState.theme);
  }

  themeToggle.addEventListener('click', () => {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', appState.theme);
    try {
      localStorage.setItem('theme', appState.theme);
    } catch (e) {
      console.warn('Unable to write to localStorage:', e);
    }
  });

  initTheme();

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    }
  });

  // ==========================================================================
  // VIEW NAVIGATION & PROGRESS TRACKING
  // ==========================================================================
  
  function navigateTo(targetSectionId) {
    // Hide all sections
    contentSections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      appState.activeSection = targetSectionId;
      appState.visitedSections.add(targetSectionId);
      
      // Save progress to localStorage
      try {
        localStorage.setItem('visitedSections', JSON.stringify(Array.from(appState.visitedSections)));
        localStorage.setItem('activeSection', appState.activeSection);
      } catch (e) {
        console.warn('Unable to save progress to localStorage:', e);
      }
      
      // Scroll to top of main content
      mainContent.scrollTop = 0;
      window.scrollTo(0, 0);
      
      // Update active sidebar nav item
      navItems.forEach(item => {
        const itemTarget = item.getAttribute('data-target');
        if (itemTarget === targetSectionId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      updateNavIcons();
      updateProgressBar();
    }
  }

  // Update nav checkmark icons in sidebar
  function updateNavIcons() {
    navItems.forEach(item => {
      const target = item.getAttribute('data-target');
      const statusIcon = item.querySelector('.status-icon');
      
      if (appState.visitedSections.has(target)) {
        statusIcon.textContent = '✓';
        statusIcon.style.color = 'var(--success-color)';
      } else {
        statusIcon.textContent = '○';
        statusIcon.style.color = 'var(--text-secondary)';
      }
    });
  }

  // Calculate percentage of tutorial completed
  function updateProgressBar() {
    const totalSteps = navItems.length;
    const visitedSteps = appState.visitedSections.size;
    const percentage = Math.round((visitedSteps / totalSteps) * 100);
    progressBar.style.width = `${percentage}%`;
  }

  // Add click events to nav items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      navigateTo(target);
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
      }
    });
  });

  // Section Action Buttons (Next/Back)
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextId = btn.getAttribute('data-next');
      navigateTo(nextId);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prevId = btn.getAttribute('data-prev');
      navigateTo(prevId);
    });
  });

  // ==========================================================================
  // WIDGET 1: TIMELINE SLIDER
  // ==========================================================================
  
  timelineSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    appState.timelineYear = val;
    
    const data = timelineData[val];
    timelineYear.textContent = data.year;
    timelineDesc.textContent = data.desc;
    
    timelineVuln.textContent = data.vulnerability;
    timelineVuln.className = data.vulnClass;
  });

  // ==========================================================================
  // WIDGET 2: VULNERABILITY ANALYZER
  // ==========================================================================
  
  function updateVulnerabilityAnalyzer() {
    const type = vulnAssignmentSelect.value;
    const hasLogs = paramLogs.checked;
    const hasOral = paramOral.checked;
    const hasLocal = paramLocal.checked;

    let baseVuln = 95;
    let description = "";

    // Base values
    if (type === 'essay') {
      baseVuln = 95;
      description = "Traditional take-home essays can be written instantly by ChatGPT. The AI has broad general knowledge of historical and literary themes.";
    } else if (type === 'exam') {
      baseVuln = 98;
      description = "Online recall tests are incredibly vulnerable. Questions can be copied/pasted into search windows or browser extensions in real time.";
    } else if (type === 'lit') {
      baseVuln = 90;
      description = "Literature reviews are easy for AI. It summarizes complex theories quickly, though it frequently hallucinates references that look authentic.";
    } else if (type === 'code') {
      baseVuln = 95;
      description = "AI coding tools (Github Copilot, Claude) solve standard algorithmic coding challenges with near 100% success rates.";
    }

    // Apply reductions
    let reduction = 0;
    if (hasLogs) reduction += 20;
    if (hasOral) reduction += 40;
    if (hasLocal) reduction += 25;

    let finalVuln = Math.max(5, baseVuln - reduction);

    // Update UI elements
    vulnMeterBar.style.width = `${finalVuln}%`;
    vulnMeterText.textContent = `${finalVuln}%`;

    // Colors
    if (finalVuln > 70) {
      vulnMeterBar.style.backgroundColor = 'var(--danger-color)';
      vulnMeterText.style.color = 'var(--danger-color)';
    } else if (finalVuln > 35) {
      vulnMeterBar.style.backgroundColor = 'var(--accent-color)';
      vulnMeterText.style.color = 'var(--accent-color)';
    } else {
      vulnMeterBar.style.backgroundColor = 'var(--success-color)';
      vulnMeterText.style.color = 'var(--success-color)';
    }

    // Generate feedback string based on selections
    let mitigationInfo = "";
    if (hasLogs || hasOral || hasLocal) {
      mitigationInfo = " Redesign elements added: " + 
        (hasLogs ? "[Prompt Logs (-20%)] " : "") +
        (hasOral ? "[Oral Defense (-40%)] " : "") +
        (hasLocal ? "[Local Data (-25%)]" : "") + 
        ". By adding these constraints, you force the student to document their thinking and articulate their work, bypassing generic AI synthesis.";
    } else {
      mitigationInfo = " High vulnerability. There are currently no constraints preventing a student from copy-pasting AI output.";
    }

    vulnAnalysisFeedback.textContent = `${description}${mitigationInfo}`;
  }

  vulnAssignmentSelect.addEventListener('change', updateVulnerabilityAnalyzer);
  paramLogs.addEventListener('change', updateVulnerabilityAnalyzer);
  paramOral.addEventListener('change', updateVulnerabilityAnalyzer);
  paramLocal.addEventListener('change', updateVulnerabilityAnalyzer);
  updateVulnerabilityAnalyzer(); // Trigger initial check

  // ==========================================================================
  // WIDGET 3: STRATEGY TABS & SUB-SANDBOXES
  // ==========================================================================
  
  // Strategy Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tabTarget).classList.add('active');
    });
  });

  // Strategy 1: Prompt Refinement Simulator
  function updatePromptSandbox() {
    let prompt = "Write a 1000-word essay about photosynthesis.";
    let response = "<strong>AI Response:</strong> [Generates a generic, standard essay that the student can copy and paste with zero effort. <strong>Resilience: Low</strong>]";
    
    if (promptRefinementState.role && !promptRefinementState.context && !promptRefinementState.critique) {
      prompt = "Act as an expert plant physiologist. Write a 1000-word essay explaining the dual-pathway mechanism of photosynthesis.";
      response = "<strong>AI Response:</strong> [Generates a highly technical, beautifully written article. Still easily copy-pasteable. <strong>Resilience: Low</strong>]";
    } 
    else if (promptRefinementState.role && promptRefinementState.context && !promptRefinementState.critique) {
      prompt = "Act as an expert plant physiologist. Explain photosynthesis, but you MUST structure your answer around the specific diagrams in Chapter 4 of Campbell Biology (9th ed) and analyze the controversial nature of the oxygen-evolving complex discussed in class.";
      response = "<strong>AI Response:</strong> [Struggles slightly or generates fake diagram references if it lacks access to the exact textbook version. Forces student to cross-reference and correct textbook facts. <strong>Resilience: Medium</strong>]";
    }
    else if (promptRefinementState.role && promptRefinementState.context && promptRefinementState.critique) {
      prompt = "Act as an expert plant physiologist. Explain photosynthesis (structured around Campbell Bio Ch.4 diagrams), AND append a 300-word reflection explaining: 1) where you refined this prompt, 2) which parts of the AI output you deleted/edited because they were generic, and 3) how this compares to our Tuesday lecture notes.";
      response = "<strong>AI Response:</strong> [Generates text, but the student is graded primarily on their manual edits and critical reflection log. Copied text fails the prompt requirement. <strong>Resilience: High</strong>]";
    }
    else if (!promptRefinementState.role && promptRefinementState.context && !promptRefinementState.critique) {
      prompt = "Write a 1000-word essay about photosynthesis, but structure it around Chapter 4 diagrams of Campbell Biology.";
      response = "<strong>AI Response:</strong> [Tries to fulfill diagram references, but often hallucinates specific textbook page layouts. <strong>Resilience: Medium</strong>]";
    }
    else if (!promptRefinementState.role && !promptRefinementState.context && promptRefinementState.critique) {
      prompt = "Write a 1000-word essay about photosynthesis, and write a critique explaining where the AI essay is weak.";
      response = "<strong>AI Response:</strong> [AI critiques itself, which the student can still copy. <strong>Resilience: Low-Medium</strong>]";
    }
    else if (promptRefinementState.role && !promptRefinementState.context && promptRefinementState.critique) {
      prompt = "Act as a plant physiologist. Write a photosynthesis essay and write a critique of its limitations.";
      response = "<strong>AI Response:</strong> [AI writes essay + critique. <strong>Resilience: Low-Medium</strong>]";
    }
    else if (!promptRefinementState.role && promptRefinementState.context && promptRefinementState.critique) {
      prompt = "Write a photosynthesis essay referencing Campbell Bio Ch.4, and append a critique comparing it to classroom notes.";
      response = "<strong>AI Response:</strong> [Student must manually bridge AI text with classroom notes. <strong>Resilience: Medium-High</strong>]";
    }

    promptDisplay.innerHTML = `"${prompt}"`;
    promptAiDisplay.innerHTML = response;
  }

  btnRefineRole.addEventListener('click', () => {
    promptRefinementState.role = !promptRefinementState.role;
    btnRefineRole.classList.toggle('active', promptRefinementState.role);
    updatePromptSandbox();
  });

  btnRefineContext.addEventListener('click', () => {
    promptRefinementState.context = !promptRefinementState.context;
    btnRefineContext.classList.toggle('active', promptRefinementState.context);
    updatePromptSandbox();
  });

  btnRefineCritique.addEventListener('click', () => {
    promptRefinementState.critique = !promptRefinementState.critique;
    btnRefineCritique.classList.toggle('active', promptRefinementState.critique);
    updatePromptSandbox();
  });

  btnResetPrompt.addEventListener('click', () => {
    promptRefinementState = { role: false, context: false, critique: false };
    btnRefineRole.classList.remove('active');
    btnRefineContext.classList.remove('active');
    btnRefineCritique.classList.remove('active');
    updatePromptSandbox();
  });

  // Strategy 2: Oral Grading Time Calculator
  function updateCalculator() {
    const classSize = parseInt(calcClassSize.value);
    const method = calcDefenseType.value;
    calcClassSizeVal.textContent = `${classSize} students`;

    let timePerStudentMinutes = 15; // default traditional
    let desc = "";

    if (method === 'micro-oral') {
      timePerStudentMinutes = 10; // 8 mins viva + 2 mins transition/grading
      desc = `For a class of ${classSize}, scheduling a 5-to-10 minute live oral Q&A right after submission ensures 100% authentication. Total effort is comparable to reading long plagiarized papers.`;
    } else if (method === 'async-video') {
      timePerStudentMinutes = 5; // 3 mins video + 2 mins grading
      desc = `For a class of ${classSize}, requiring students to submit an unedited 3-minute video explanation of their code/arguments is highly scalable. You can screen videos on 1.5x speed.`;
    } else {
      timePerStudentMinutes = 15; // traditional grading
      desc = `Traditional grading takes about 15 minutes per paper. While it requires no scheduling, it provides zero authentication in the AI era.`;
    }

    const totalHours = (classSize * timePerStudentMinutes) / 60;
    calcTotalHours.textContent = `${totalHours.toFixed(1)} hours`;

    // Feasibility threshold
    if (totalHours <= 6) {
      calcFeasibility.textContent = "Highly Feasible";
      calcFeasibility.className = "feasibility-high";
    } else if (totalHours <= 15) {
      calcFeasibility.textContent = "Moderately Feasible";
      calcFeasibility.className = "feasibility-med";
    } else {
      calcFeasibility.textContent = "Heavy Workload";
      calcFeasibility.className = "feasibility-low";
    }

    calcNotes.textContent = desc;
  }

  calcClassSize.addEventListener('input', updateCalculator);
  calcDefenseType.addEventListener('change', updateCalculator);
  updateCalculator();

  // Strategy 3: AI Audit Challenge (Clickable errors)
  const auditFeedbackText = {
    hallucination: "<strong>Correct! (Hallucination Error)</strong> Stephen Hawking was born in 1942 and did not measure the 1912 eclipse. The 1919 eclipse expedition led by Arthur Eddington confirmed general relativity. Catching this requires simple fact-checking.",
    contradiction: "<strong>Correct! (Logical Contradiction)</strong> General relativity relies on E=mc² (which shows that energy and mass are equivalent and related). Claiming they are unrelated is a core logical contradiction.",
    citation: "<strong>Correct! (Fake Citation)</strong> 'Cantus & Sable (2024)' published in 'Journal of Astrological Alchemy' is a completely fabricated academic reference. AI models routinely make up realistic-looking papers. Verifying citations protects integrity.",
    incorrect: "That phrase is scientifically and historically accurate. Keep looking! There are three specific errors in this passage."
  };

  const auditWords = document.querySelectorAll('.audit-word');
  auditWords.forEach(word => {
    word.addEventListener('click', () => {
      const errorType = word.getAttribute('data-error');
      
      if (errorType && (errorType === 'hallucination' || errorType === 'contradiction' || errorType === 'citation')) {
        if (!appState.auditAnswers[errorType]) {
          appState.auditAnswers[errorType] = true;
          word.classList.add('correct-pick');
          
          // Count found
          const score = Object.values(appState.auditState || appState.auditAnswers).filter(Boolean).length;
          auditScore.textContent = `${score} / 3`;
          auditFeedback.innerHTML = auditFeedbackText[errorType];
          auditFeedback.style.borderLeftColor = 'var(--success-color)';
          
          if (score === 3) {
            auditFeedback.innerHTML = "<strong>Congratulations!</strong> You found all three AI errors (Hallucination, Logical Contradiction, and Fake Citation). This is exactly how students audit AI: they read critically, cross-reference data, and correct errors.";
          }
        }
      } else {
        auditFeedback.innerHTML = auditFeedbackText.incorrect;
        auditFeedback.style.borderLeftColor = 'var(--danger-color)';
      }
    });
  });

  btnResetAudit.addEventListener('click', () => {
    appState.auditAnswers = { hallucination: false, contradiction: false, citation: false };
    auditWords.forEach(word => {
      word.classList.remove('correct-pick', 'wrong-pick');
    });
    auditScore.textContent = "0 / 3";
    auditFeedback.innerHTML = "Click on the words you believe are incorrect to analyze them.";
    auditFeedback.style.borderLeftColor = 'var(--brand-color)';
  });

  // Strategy 4: Resilience Builder Checklist
  function updateResilienceBuilder() {
    let score = 10; // base score
    resilienceChecks.forEach(check => {
      if (check.checked) {
        score += parseInt(check.getAttribute('data-val'));
      }
    });

    resilienceMeterBar.style.width = `${score}%`;

    if (score < 40) {
      resilienceRatingLabel.textContent = "Low (Generic)";
      resilienceRatingLabel.style.color = 'var(--danger-color)';
      resilienceMeterBar.style.backgroundColor = 'var(--danger-color)';
      resilienceFeedbackText.textContent = "Without local constraints, generic AI tools can write this entire assignment instantly. Students can easily outsource their writing.";
    } else if (score < 75) {
      resilienceRatingLabel.textContent = "Medium (Some Hurdles)";
      resilienceRatingLabel.style.color = 'var(--accent-color)';
      resilienceMeterBar.style.backgroundColor = 'var(--accent-color)';
      resilienceFeedbackText.textContent = "Fusing generic theory with class debates or surveys makes simple copying difficult. Students must edit the AI outputs to fit the prompt.";
    } else {
      resilienceRatingLabel.textContent = "High (AI-Resilient)";
      resilienceRatingLabel.style.color = 'var(--success-color)';
      resilienceMeterBar.style.backgroundColor = 'var(--success-color)';
      resilienceFeedbackText.textContent = "Strong contextual constraints! It is impossible for an AI to answer this out-of-the-box. The student must do primary research or combine specific lecture events.";
    }
  }

  resilienceChecks.forEach(check => {
    check.addEventListener('change', updateResilienceBuilder);
  });
  updateResilienceBuilder();

  // ==========================================================================
  // MODULE 4: SHIFT MATRIX TOGGLE (BRIEF VS DETAILED)
  // ==========================================================================
  
  btnViewBrief.addEventListener('click', () => {
    btnViewBrief.classList.add('active');
    btnViewBrief.classList.replace('btn-outline', 'btn-primary');
    btnViewDetailed.classList.remove('active');
    btnViewDetailed.classList.replace('btn-primary', 'btn-outline');
    
    briefTexts.forEach(el => el.classList.remove('hidden'));
    detailedTexts.forEach(el => el.classList.add('hidden'));
  });

  btnViewDetailed.addEventListener('click', () => {
    btnViewDetailed.classList.add('active');
    btnViewDetailed.classList.replace('btn-outline', 'btn-primary');
    btnViewBrief.classList.remove('active');
    btnViewBrief.classList.replace('btn-primary', 'btn-outline');
    
    briefTexts.forEach(el => el.classList.add('hidden'));
    detailedTexts.forEach(el => el.classList.remove('hidden'));
  });

  // ==========================================================================
  // MODULE 5: SYLLABUS REDESIGNER SANDBOX FORM
  // ==========================================================================
  
  function generateBlueprint() {
    const name = document.getElementById('redesign-name').value || "Syllabus Project";
    const type = document.getElementById('redesign-type').value;
    const strategy = document.getElementById('redesign-strategy').value;
    const size = document.getElementById('redesign-size').value;

    let blueprintMarkdown = "";

    if (strategy === 'process') {
      blueprintMarkdown = `# AI-Resilient Redesign: ${name}
**Pillar**: Strategy 1 (Process-Based / Paper Trail)
**Class Size Fit**: ${size === 'large' ? 'Medium-Large (adapted with sample logs)' : 'Highly Scalable'}

## 1. Assignment Description (Add to Syllabus)
This assignment evaluates your methodological workflow in addition to the final submission. You are encouraged to use generative AI (ChatGPT/Claude/Gemini) as a draft assistant, provided you document your drafting cycle.
- **Part A (30% of Grade)**: Prompt Log Submission. Submit a raw text transcript of your prompts, the AI's responses, and your iterative query corrections.
- **Part B (40% of Grade)**: Hand-edited drafts with track-changes or annotations explaining why you altered AI statements to reflect factual realities.
- **Part C (30% of Grade)**: Metacognitive reflection. Write 3 paragraphs explaining how you audited the AI output and why you accepted or rejected certain AI assertions.

## 2. Grading Rubric Modifications
- **Prompt Logic & Refinement (30 pts)**: Student demonstrates sophisticated prompt editing, adding specific academic frameworks and constraints.
- **Audit Rigor & Verification (40 pts)**: Evidence of correcting AI errors, verifying claims with library books, and tailoring content.
- **Cognitive reflection (30 pts)**: Clarity of logic in explanation.`;
    } 
    else if (strategy === 'verbal') {
      let verbalRec = "Micro-Oral Defense";
      let details = "In a scheduled 5-10 minute live slot during lab or office hours, the student defends their thesis and responds to spontaneous analytical queries.";
      if (size === 'large' || size === 'medium') {
        verbalRec = "Asynchronous Video Defense";
        details = "Alongside your written file, upload a 3-minute, unedited video explaining your core architecture or code. Stand in front of the camera and do not read a script. Explain: 'What is the most fragile part of your code/analysis, and how would you fix it?'";
      }

      blueprintMarkdown = `# AI-Resilient Redesign: ${name}
**Pillar**: Strategy 2 (Verbal Defense / Viva Voce)
**Format Chosen**: ${verbalRec}

## 1. Assignment Description (Add to Syllabus)
The written component of this assignment is a threshold for grading, but your final grade is determined by your verbal defense. 
- **Methodology**: ${details}
- **Mastery Criteria**: If you cannot verbally explain a concept or variable in your paper, you will receive a zero on that section, regardless of the quality of the written work.

## 2. Oral Grading Guideline
- **Explanation Coherence (50 pts)**: Student speaks clearly about the mechanics without relies on notes.
- **Concept Stress-Testing (50 pts)**: Student successfully modifies the theoretical framework live in response to 'what-if' queries.`;
    } 
    else if (strategy === 'audit') {
      blueprintMarkdown = `# AI-Resilient Redesign: ${name}
**Pillar**: Strategy 3 (AI Audit - Flawed Subordinate)
**Scalability**: Highly scalable for any class size

## 1. Assignment Description (Add to Syllabus)
You will not write a paper from scratch. Instead, you are the Senior Supervisor auditing a junior staff writer (AI).
- **Task**: Download the AI-generated paper from the course page. It contains subtle factual inaccuracies, logical fallacies, and fabricated citations.
- **Deliverables**: 
  1. Systematic log detailing at least 3 errors found in the text.
  2. Proof from the course reading list explaining why those claims are false.
  3. Re-written, verified final paper with correct, hyperlinked academic sources.

## 2. Rubric
- **Error Spotting Accuracy (40 pts)**: Successfully locating the seeded flaws.
- **Academic Verification (40 pts)**: Depth of analysis in refuting AI statements.
- **Rewritten Integrity (20 pts)**: Grammatical and structural excellence of the correction.`;
    } 
    else if (strategy === 'local') {
      blueprintMarkdown = `# AI-Resilient Redesign: ${name}
**Pillar**: Strategy 4 (Hyper-Local Integration)
**Un-cheatable Level**: Maximum (AI training limits)

## 1. Assignment Description (Add to Syllabus)
To complete this analysis, your project must integrate specific real-time variables from our physical environment. Generic reviews will receive an automatic F.
- **Requirement A**: Reference the guest speaker presentation on Oct 12th, specifically their contrast of regional policies.
- **Requirement B**: Integrate primary data gathered from your group's survey of 15 campus students.
- **Requirement C**: Cross-reference our class-wide debate during Tuesday's lecture, detailing which student arguments you agree with.

## 2. Rubric
- **Primary Data Integration (50 pts)**: Correct compilation and formatting of gathered local facts.
- **Classroom Synthesis (50 pts)**: Depth of connection to lecture events that are not in public internet domains.`;
    }

    blueprintCode.textContent = blueprintMarkdown;
  }

  redesignerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateBlueprint();
  });

  generateBlueprint();

  // Copy Blueprint to Clipboard
  btnCopyBlueprint.addEventListener('click', () => {
    const text = blueprintCode.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyToast.classList.remove('hidden');
      setTimeout(() => {
        copyToast.classList.add('hidden');
      }, 2000);
    });
  });

  // ==========================================================================
  // MODULE 6: INTERACTIVE DIAGNOSTIC QUIZ
  // ==========================================================================
  
  function renderQuizQuestion() {
    // Check if quiz finished
    if (appState.currentQuizIndex >= quizQuestions.length) {
      showQuizCompletion();
      return;
    }

    const q = quizQuestions[appState.currentQuizIndex];
    quizQNum.textContent = appState.currentQuizIndex + 1;
    
    // Progress Bar
    const progressPercent = ((appState.currentQuizIndex + 1) / quizQuestions.length) * 100;
    quizProgressBar.style.width = `${progressPercent}%`;

    // Question text
    quizQuestionText.textContent = q.question;
    
    // Reset buttons and feedback
    quizOptionsContainer.innerHTML = '';
    quizFeedbackBox.classList.add('hidden');
    quizFeedbackBox.className = 'quiz-feedback hidden';
    quizNextBtn.classList.add('hidden');

    // Render options
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleQuizSelection(idx, btn));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleQuizSelection(selectedIndex, selectedBtn) {
    const q = quizQuestions[appState.currentQuizIndex];
    const optionButtons = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');
    
    // Disable all options after selection
    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.answer) {
      appState.quizScore++;
      selectedBtn.classList.add('correct');
      
      quizFeedbackBox.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
      quizFeedbackBox.className = 'quiz-feedback success';
    } else {
      selectedBtn.classList.add('incorrect');
      // Highlight correct answer
      optionButtons[q.answer].classList.add('correct');
      
      quizFeedbackBox.innerHTML = `<strong>Incorrect.</strong> ${q.explanation}`;
      quizFeedbackBox.className = 'quiz-feedback error';
    }
    
    quizFeedbackBox.classList.remove('hidden');
    quizNextBtn.classList.remove('hidden');
  }

  quizNextBtn.addEventListener('click', () => {
    appState.currentQuizIndex++;
    renderQuizQuestion();
  });

  function showQuizCompletion() {
    quizInteractiveCard.classList.add('hidden');
    if (appState.quizScore === 5) {
      quizSuccessCard.classList.remove('hidden');
      quizFailCard.classList.add('hidden');
      
      const quizCertDate = document.getElementById('quiz-cert-date');
      if (quizCertDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        quizCertDate.textContent = new Date().toLocaleDateString('en-US', options);
      }
    } else {
      quizFailCard.classList.remove('hidden');
      quizSuccessCard.classList.add('hidden');
      quizFailScore.textContent = `${appState.quizScore} / ${quizQuestions.length}`;
    }
  }

  btnRestartQuiz.addEventListener('click', () => {
    appState.currentQuizIndex = 0;
    appState.quizScore = 0;
    if (certUserNameInput) certUserNameInput.value = '';
    if (quizBadgeName) quizBadgeName.textContent = 'Enter Your Name';
    quizSuccessCard.classList.add('hidden');
    quizInteractiveCard.classList.remove('hidden');
    renderQuizQuestion();
  });

  btnRestartTutorial.addEventListener('click', () => {
    appState.currentQuizIndex = 0;
    appState.quizScore = 0;
    if (certUserNameInput) certUserNameInput.value = '';
    if (quizBadgeName) quizBadgeName.textContent = 'Enter Your Name';
    // Keep progress checkmarks but go back to welcome
    quizSuccessCard.classList.add('hidden');
    quizInteractiveCard.classList.remove('hidden');
    navigateTo('welcome-section');
  });

  if (btnRestartQuizFail) {
    btnRestartQuizFail.addEventListener('click', () => {
      appState.currentQuizIndex = 0;
      appState.quizScore = 0;
      quizFailCard.classList.add('hidden');
      quizInteractiveCard.classList.remove('hidden');
      renderQuizQuestion();
    });
  }

  if (btnRestartTutorialFail) {
    btnRestartTutorialFail.addEventListener('click', () => {
      appState.currentQuizIndex = 0;
      appState.quizScore = 0;
      quizFailCard.classList.add('hidden');
      quizInteractiveCard.classList.remove('hidden');
      navigateTo('welcome-section');
    });
  }

  // Certificate Name Input Listener
  if (certUserNameInput && quizBadgeName) {
    certUserNameInput.addEventListener('input', (e) => {
      quizBadgeName.textContent = e.target.value || 'Enter Your Name';
    });
  }

  // Print Certificate Button Listener
  if (btnPrintCert) {
    btnPrintCert.addEventListener('click', () => {
      window.print();
    });
  }

  // Reset Progress Button listener
  const resetProgressBtn = document.getElementById('reset-progress');
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all your progress checkmarks?')) {
        appState.visitedSections = new Set(['welcome-section']);
        appState.activeSection = 'welcome-section';
        
        // Reset quiz state parameters
        appState.currentQuizIndex = 0;
        appState.quizScore = 0;
        if (certUserNameInput) certUserNameInput.value = '';
        if (quizBadgeName) quizBadgeName.textContent = 'Enter Your Name';
        
        // Restore quiz cards default states
        if (quizSuccessCard) quizSuccessCard.classList.add('hidden');
        if (quizFailCard) quizFailCard.classList.add('hidden');
        if (quizInteractiveCard) quizInteractiveCard.classList.remove('hidden');
        renderQuizQuestion();

        try {
          localStorage.setItem('visitedSections', JSON.stringify(['welcome-section']));
          localStorage.setItem('activeSection', 'welcome-section');
        } catch (e) {
          console.warn('Unable to clear progress in localStorage:', e);
        }
        navigateTo('welcome-section');
      }
    });
  }

  // Load progress on initial load
  function initProgress() {
    let savedProgress = null;
    let savedActive = null;
    try {
      savedProgress = localStorage.getItem('visitedSections');
      savedActive = localStorage.getItem('activeSection');
    } catch (e) {
      console.warn('localStorage progress load failed:', e);
    }
    
    if (savedProgress) {
      try {
        const list = JSON.parse(savedProgress);
        appState.visitedSections = new Set(list);
      } catch (e) {
        console.warn('Parsing visitedSections failed:', e);
      }
    }
    
    if (savedActive) {
      appState.activeSection = savedActive;
    }
    
    // Sync UI elements
    updateNavIcons();
    updateProgressBar();
    
    // Navigate to active section
    navigateTo(appState.activeSection);
  }

  // Initialize progress and quiz
  initProgress();
  renderQuizQuestion();
});
