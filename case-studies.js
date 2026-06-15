document.addEventListener('DOMContentLoaded', () => {
  const appState = {
    theme: 'light',
    activeCase: 'case-1'
  };

  const themeToggle = document.getElementById('theme-toggle');
  const caseNavButtons = document.querySelectorAll('.case-nav-btn');
  const casePanels = document.querySelectorAll('.case-study-panel');

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
      appState.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', appState.theme);
  }

  function setActiveCase(caseId) {
    appState.activeCase = caseId;

    caseNavButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.case === caseId);
    });

    casePanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === caseId);
    });
  }

  function setCaseView(panel, view) {
    panel.querySelectorAll('.case-view-btn').forEach((button) => {
      const isActive = button.dataset.view === view;
      button.classList.toggle('active', isActive);
      button.classList.toggle('btn-accent', isActive);
      button.classList.toggle('btn-outline', !isActive);
    });

    panel.querySelectorAll('.case-version').forEach((section) => {
      section.classList.toggle('active', section.classList.contains(view));
    });
  }

  function updateCaseMeter(panel) {
    const checks = panel.querySelectorAll('.case-check');
    const rating = panel.querySelector('.case-rating');
    const meter = panel.querySelector('.case-meter-bar');
    let score = 0;

    checks.forEach((check) => {
      if (check.checked) {
        score += parseInt(check.dataset.points, 10);
      }
    });

    if (rating) rating.textContent = `${score}%`;
    if (meter) {
      meter.style.width = `${score}%`;
      if (score < 50) {
        meter.style.backgroundColor = 'var(--danger-color)';
      } else if (score < 100) {
        meter.style.backgroundColor = 'var(--accent-color)';
      } else {
        meter.style.backgroundColor = 'var(--success-color)';
      }
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.warn('Clipboard API failed, falling back to textarea copy:', e);
      }
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  }

  async function copyPrompt(panel) {
    const targetId = panel.dataset.copyTarget;
    const code = document.getElementById(targetId);
    const toast = panel.querySelector('.toast');
    if (!code) return;

    const copied = await copyText(code.textContent);
    if (!toast) return;

    if (!copied) {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

    toast.textContent = copied ? 'Copied to clipboard.' : 'Prompt selected. Press Ctrl+C or Cmd+C to copy.';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 1800);
  }

  function setupAuditChips() {
    const feedback = document.querySelector('.case-audit-feedback');
    const chips = document.querySelectorAll('.audit-chip');
    const responses = {
      0: 'Correct. 192.168.x.x is normally a private IPv4 range, not a public internet address.',
      1: 'Correct. A subnet mask identifies the network and host portions of an address; it does not encrypt traffic.',
      2: 'Correct. DNS translates names to IP addresses. The default gateway forwards traffic outside the local network.'
    };
    const found = new Set();

    chips.forEach((chip, index) => {
      chip.addEventListener('click', () => {
        chip.classList.add('correct-pick');
        found.add(index);
        if (!feedback) return;

        if (found.size === chips.length) {
          feedback.textContent = 'All three errors found. The student would now rewrite the explanation and cite the course source that verifies each correction.';
          feedback.style.borderLeftColor = 'var(--success-color)';
        } else {
          feedback.textContent = responses[index];
          feedback.style.borderLeftColor = 'var(--success-color)';
        }
      });
    });
  }

  initTheme();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      appState.theme = appState.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', appState.theme);
      try {
        localStorage.setItem('theme', appState.theme);
      } catch (e) {
        console.warn('Unable to save theme preference:', e);
      }
    });
  }

  caseNavButtons.forEach((button) => {
    button.addEventListener('click', () => setActiveCase(button.dataset.case));
  });

  casePanels.forEach((panel) => {
    panel.querySelectorAll('.case-view-btn').forEach((button) => {
      button.addEventListener('click', () => setCaseView(panel, button.dataset.view));
    });

    panel.querySelectorAll('.case-check').forEach((check) => {
      check.addEventListener('change', () => updateCaseMeter(panel));
    });

    const copyButton = panel.querySelector('.copy-case-btn');
    if (copyButton) {
      copyButton.addEventListener('click', () => copyPrompt(panel));
    }

    updateCaseMeter(panel);
  });

  setupAuditChips();
  setActiveCase(appState.activeCase);
});
