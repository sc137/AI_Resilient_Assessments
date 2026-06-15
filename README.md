# AI-Resilient Assessment Strategies: A Faculty Interactive Guide

An interactive, self-guided web application designed to introduce university faculty to the concept of **AI-Resilient Assessments**. This project walks instructors through concrete, validated strategies to redesign course assignments for the artificial intelligence era (ChatGPT, Claude, Gemini), allowing AI tools to be used as productivity aids while requiring students to demonstrate verifiable personal mastery of the material.

---

> [!NOTE]
> ### 🚀 Live Website
> This project is live on GitHub Pages! You can view and interact with the study site here:
> **[sc137.github.io/AI_Resilient_Assessments](https://sc137.github.io/AI_Resilient_Assessments/)**

---

## 🎨 Key Features
- **Interactive AI Timeline**: A slider showcasing the transition of AI tools in higher education from 2017 assistants (e.g. Georgia Tech's "Jill Watson") to today's generative writing co-pilots.
- **Vulnerability Analyzer**: Allows faculty to select traditional assignments (take-home essays, online recall tests, coding projects, lit reviews) and see how adding process logs, oral defenses, or local context shields them from AI cheating.
- **Pillar Sandbox Demos**:
  1. *Process-Based Sandbox*: An interactive prompt-refinement log.
  2. *Viva Voce Calculator*: A class-size grader time-calculator for oral and video defenses.
  3. *Human-in-the-Loop Audit*: A click-to-solve fact-checking game highlighting AI hallucinations, contradictions, and fake citations.
  4. *Hyper-Local Checklist*: A checkbox meter showing how classroom debates and on-campus data increase AI resilience.
- **Shift Matrix Toggle**: A side-by-side comparison of traditional assessments against resilient alternatives, offering both brief summaries and detailed implementation step-by-steps.
- **Syllabus Redesigner**: A sandbox generator form that renders a copy-pasteable markdown redesign proposal based on course parameters.
- **Interactive Case Studies Companion**: A linked page with four applied examples that contrast older assessment styles with AI-resilient redesigns across process logs, verbal defense, AI audit, and hyper-local evidence.
- **Self-Check Diagnostic Quiz**: A 5-question review to certify understanding and issue a completion badge.

---

## 🧪 Case Studies Practicum

The **Case Studies Practicum** is a companion page linked from the main education guide. It helps faculty apply the four AI-resilient redesign methods to concrete assignment examples:

- **Process-Based**: Module concepts and local IP address evidence.
- **Verbal Defense**: A small Python project with a 3-minute explanation.
- **Human-in-the-Loop**: An AI-generated network explanation audit.
- **Hyper-Local**: Wi-Fi troubleshooting with local device evidence.

Each practicum case contrasts a traditional assessment with an AI-resilient update, includes interactive resilience checks, and provides a copy-ready assignment prompt with reflection questions.

---

## 🏅 Completion Badge

The guide includes a five-question diagnostic quiz. Faculty who answer all questions correctly receive an on-screen completion badge for **Building AI Resilient Assessments**, with an optional name field and print-friendly certificate view.

---

## 📐 Project Structure
- `index.html` — Layout grid, sidebar navigation, widgets, and form structures.
- `case-studies.html` — Companion case-study application for applying the four redesign methods.
- `style.css` — Responsive design stylesheet with HSL colors, glassmorphism, and user-preferred typography:
  - **Lora** for headings
  - **Inter** for body text and interface
  - **Fira Code** for preformatted code blocks
- `app.js` — Client-side state routing, interactive slider behaviors, audit triggers, and state managers.
- `case-studies.js` — Case-study page interactions, toggles, checklist meters, audit chips, theme handling, and copy-prompt fallback.
- `AI_Resilient_Assessment_Strategies.pptx` — The original presentation deck.
- `AI_Resilient Assessment Strategies_ Faculty Handout.docx` — The companion faculty guide document.
- `AI in Teaching and Learning.pdf` — The original EDUCAUSE 7 Things You Should Know background article.

---

## 📜 Credits
This guide was authored by **Sable Cantus, CISSP** (Computer Information Systems Department). Built as an open self-guided tutorial resource.
