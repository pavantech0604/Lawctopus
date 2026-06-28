document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Sticky Header
  // ==========================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-active');
    } else {
      header.classList.remove('header-active');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled down

  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav');
  
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('active');
      
      // Update SVG hamburger to 'X' states
      const lines = mobileToggle.querySelectorAll('line');
      if (nav.classList.contains('active')) {
        lines[0].setAttribute('x1', '18'); lines[0].setAttribute('y1', '6'); lines[0].setAttribute('x2', '6'); lines[0].setAttribute('y2', '18');
        lines[1].style.opacity = '0';
        lines[2].setAttribute('x1', '6'); lines[2].setAttribute('y1', '6'); lines[2].setAttribute('x2', '18'); lines[2].setAttribute('y2', '18');
        mobileToggle.setAttribute('aria-expanded', 'true');
      } else {
        lines[0].setAttribute('x1', '3'); lines[0].setAttribute('y1', '12'); lines[0].setAttribute('x2', '21'); lines[0].setAttribute('y2', '12');
        lines[1].style.opacity = '1';
        lines[2].setAttribute('x1', '3'); lines[2].setAttribute('y1', '18'); lines[2].setAttribute('x2', '21'); lines[2].setAttribute('y2', '18');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
        nav.classList.remove('active');
        const lines = mobileToggle.querySelectorAll('line');
        lines[0].setAttribute('x1', '3'); lines[0].setAttribute('y1', '12'); lines[0].setAttribute('x2', '21'); lines[0].setAttribute('y2', '12');
        lines[1].style.opacity = '1';
        lines[2].setAttribute('x1', '3'); lines[2].setAttribute('y1', '18'); lines[2].setAttribute('x2', '21'); lines[2].setAttribute('y2', '18');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking a nav link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        const lines = mobileToggle.querySelectorAll('line');
        lines[0].setAttribute('x1', '3'); lines[0].setAttribute('y1', '12'); lines[0].setAttribute('x2', '21'); lines[0].setAttribute('y2', '12');
        lines[1].style.opacity = '1';
        lines[2].setAttribute('x1', '3'); lines[2].setAttribute('y1', '18'); lines[2].setAttribute('x2', '21'); lines[2].setAttribute('y2', '18');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 3. Scroll Reveal Animations (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 4. Viewport-Triggered Statistics Counter
  // ==========================================
  const statsSection = document.getElementById('stats-counter-trigger');
  if (statsSection) {
    const runCounter = () => {
      const statsValElements = statsSection.querySelectorAll('.hero-stat-val');
      statsValElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500; // 1.5 seconds animation run
        const startTime = performance.now();
        
        const updateCount = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.floor(progress * target);
          
          if (el.getAttribute('data-target') === '24') {
            el.textContent = value + "+";
          } else if (el.getAttribute('data-target') === '100') {
            el.textContent = value + "%";
          } else {
            el.textContent = value;
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        };
        requestAnimationFrame(updateCount);
      });
    };
    
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    countObserver.observe(statsSection);
  }

  // ==========================================
  // 5. Toast Notification System
  // ==========================================
  const toastContainer = document.getElementById('toast-container');
  const showToast = (title, message, type = 'success') => {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    const icon = type === 'success' 
      ? `<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      ${icon}
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove toast
    setTimeout(() => {
      toast.classList.add('removing');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, 4000);
  };

  // ==========================================
  // 6. Curriculum Tab Switching with Shimmer Loader Delay
  // ==========================================
  const tabBtns = document.querySelectorAll('.curriculum-tab-btn');
  const panels = document.querySelectorAll('.curriculum-content-panel');

  // Programmatically set Accessibility attributes on Curriculum elements
  tabBtns.forEach((btn, index) => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', `month-${index + 1}`);
    btn.setAttribute('id', `curriculum-tab-${index + 1}`);
    if (index > 0) btn.setAttribute('tabindex', '-1');
  });

  panels.forEach((panel, index) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `curriculum-tab-${index + 1}`);
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const month = btn.getAttribute('data-month');
      const targetPanel = document.getElementById(`month-${month}`);
      if (!targetPanel) return;

      // Toggle tab buttons active states
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        b.setAttribute('tabindex', '-1');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.removeAttribute('tabindex');

      // Hide all panels
      panels.forEach(p => p.classList.remove('active'));

      // Generate skeleton shimmering states to simulate premium network perceived performance
      const originalHTML = targetPanel.innerHTML;
      targetPanel.innerHTML = `
        <div class="skeleton-container">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
          </div>
        </div>
      `;
      targetPanel.classList.add('active');

      // Swap in the actual content after 450ms shimmer animation runs
      setTimeout(() => {
        targetPanel.innerHTML = originalHTML;
        // Bind interactions on the dynamic items (like list slide transitions)
        showToast('Roadmap Updated', `Syllabus schedule loaded for Month ${month}.`, 'success');
      }, 450);
    });
  });

  // ==========================================
  // 7. Pricing Switcher with Accessibility
  // ==========================================
  const pricingBtns = document.querySelectorAll('.pricing-toggle-btn');
  const pricingPanels = document.querySelectorAll('.pricing-panel');

  pricingBtns.forEach((btn, index) => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', `pricing-${btn.getAttribute('data-target')}`);
    btn.setAttribute('id', `pricing-tab-${index + 1}`);
    if (index > 0) btn.setAttribute('tabindex', '-1');
  });

  pricingPanels.forEach((panel, index) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `pricing-tab-${index + 1}`);
  });

  pricingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      
      pricingBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        b.setAttribute('tabindex', '-1');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.removeAttribute('tabindex');

      pricingPanels.forEach(panel => {
        if (panel.getAttribute('id') === `pricing-${target}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      showToast('Offer Plan Changed', `Displaying details for the ${target === 'master' ? '6-Month Masterclass' : '2-Month Certificate'} path.`, 'success');
    });
  });

  // ==========================================
  // 8. FAQ Accordions (A11y Expanded Syncing)
  // ==========================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');
      
      // If currently active, close it
      if (faqItem.classList.contains('active')) {
        faqItem.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        faqBody.style.maxHeight = '0px';
      } else {
        // Close other open accordions
        document.querySelectorAll('.faq-item.active').forEach(item => {
          item.classList.remove('active');
          item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
          item.querySelector('.faq-body').style.maxHeight = '0px';
        });

        // Open selected accordion
        faqItem.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 9. Active Navigation Link Syncing on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const scrollActiveLinkSync = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120; // Offset for header height
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollActiveLinkSync);
  scrollActiveLinkSync();

  // ==========================================
  // 10. Brochure Lead Capture Modal Logic
  // ==========================================
  const brochureModal = document.getElementById('brochure-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const brochureForm = document.getElementById('brochure-form');
  const successCard = document.getElementById('modal-success-card');
  const errorCard = document.getElementById('modal-error-card');
  const openModalBtns = [
    document.getElementById('btn-hero-brochure'),
    document.querySelector('.btn-outline-gold') // AI Register btn
  ];

  // Helper to open modal
  const openModal = () => {
    if (!brochureModal) return;
    brochureModal.classList.add('active');
    brochureModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Focus management: focus on the name input
    setTimeout(() => {
      const nameInput = document.getElementById('form-name');
      if (nameInput) nameInput.focus();
    }, 100);
  };

  // Helper to close modal
  const closeModal = () => {
    if (!brochureModal) return;
    brochureModal.classList.remove('active');
    brochureModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Release scroll
    
    // Reset forms and statuses after modal closes
    setTimeout(() => {
      brochureForm.classList.remove('hidden');
      successCard.classList.add('hidden');
      errorCard.classList.add('hidden');
      brochureForm.reset();
      
      // Remove all form validation indicators
      const inputs = brochureForm.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
        const errorMsg = document.getElementById(`${input.id.replace('form-', '')}-error`);
        if (errorMsg) errorMsg.textContent = '';
      });
    }, 400);
  };

  // Bind Openers
  openModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });

  // Bind Closers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  
  const modalOverlay = brochureModal ? brochureModal.querySelector('.modal-overlay') : null;
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // Close with Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && brochureModal && brochureModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Validation & Mock API Call
  if (brochureForm) {
    const validateField = (input, rules) => {
      const errorMsg = document.getElementById(`${input.id.replace('form-', '')}-error`);
      let isValid = true;
      let msg = '';

      if (rules.required && !input.value.trim()) {
        isValid = false;
        msg = 'This field is required.';
      } else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        isValid = false;
        msg = 'Please enter a valid email address.';
      } else if (rules.phone && !/^\d{10}$/.test(input.value.replace(/[^0-9]/g, ''))) {
        isValid = false;
        msg = 'Please enter a valid 10-digit phone number.';
      }

      if (!isValid) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        input.setAttribute('aria-invalid', 'true');
        if (errorMsg) errorMsg.textContent = msg;
      } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
        if (errorMsg) errorMsg.textContent = '';
      }
      return isValid;
    };

    // Input event listeners for real-time visual feedback
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');

    if (nameInput) nameInput.addEventListener('input', () => validateField(nameInput, { required: true }));
    if (emailInput) emailInput.addEventListener('input', () => validateField(emailInput, { required: true, email: true }));
    if (phoneInput) phoneInput.addEventListener('input', () => validateField(phoneInput, { required: true, phone: true }));

    brochureForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Final validation pass
      const isNameValid = validateField(nameInput, { required: true });
      const isEmailValid = validateField(emailInput, { required: true, email: true });
      const isPhoneValid = validateField(phoneInput, { required: true, phone: true });

      if (!isNameValid || !isEmailValid || !isPhoneValid) {
        showToast('Validation Error', 'Please check highlighted fields.', 'error');
        return;
      }

      // Show Loading State
      const submitBtn = document.getElementById('form-submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const spinner = submitBtn.querySelector('.btn-spinner');

      submitBtn.setAttribute('disabled', 'true');
      btnText.textContent = 'Submitting Request...';
      spinner.classList.remove('hidden');

      // Simulate API call Promise
      const simulateError = document.getElementById('form-simulate-error').checked;
      
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateError) reject(new Error('Gateway Timeout'));
          else resolve({ status: 'success' });
        }, 1500);
      })
      .then(() => {
        // Success
        brochureForm.classList.add('hidden');
        successCard.classList.remove('hidden');
        showToast('Submission Success', 'Syllabus sent to your email.', 'success');
      })
      .catch((err) => {
        // Error handling
        brochureForm.classList.add('hidden');
        errorCard.classList.remove('hidden');
        showToast('Submission Failed', 'Failed to connect to gateway.', 'error');
      })
      .finally(() => {
        // Restore buttons
        submitBtn.removeAttribute('disabled');
        btnText.textContent = 'Download Course Syllabus';
        spinner.classList.add('hidden');
      });
    });

    // Success and Error card close triggers
    const successCloseBtn = document.getElementById('modal-success-close-btn');
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

    const errorCloseBtn = document.getElementById('modal-error-close-btn');
    if (errorCloseBtn) errorCloseBtn.addEventListener('click', closeModal);

    const retryBtn = document.getElementById('modal-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        errorCard.classList.add('hidden');
        brochureForm.classList.remove('hidden');
        // Automatically submit form with mock failure box unchecked to simulate retry success
        document.getElementById('form-simulate-error').checked = false;
        brochureForm.dispatchEvent(new Event('submit'));
      });
    }
  }

  // ==========================================
  // 11. floating advisor Chat Drawer Logic
  // ==========================================
  const advisorWidgetBtn = document.getElementById('advisor-widget-btn');
  const advisorDrawer = document.getElementById('advisor-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const chatBody = document.getElementById('drawer-chat-body');
  const chatOptionBtns = document.querySelectorAll('.chat-option-btn');

  const openDrawer = () => {
    if (!advisorDrawer) return;
    advisorDrawer.classList.add('active');
    advisorDrawer.setAttribute('aria-hidden', 'false');
    advisorWidgetBtn.classList.add('active'); // Rotates icons smoothly via CSS transition
    
    // Toggle widget SVG icon states
    const pulse = advisorWidgetBtn.querySelector('.widget-pulse');
    if (pulse) pulse.classList.add('hidden'); // Disable notification dot once opened
  };

  const closeDrawer = () => {
    if (!advisorDrawer) return;
    advisorDrawer.classList.remove('active');
    advisorDrawer.setAttribute('aria-hidden', 'true');
    advisorWidgetBtn.classList.remove('active'); // Restores icons smoothly
  };

  if (advisorWidgetBtn) {
    advisorWidgetBtn.addEventListener('click', () => {
      if (advisorDrawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  
  const drawerOverlay = advisorDrawer ? advisorDrawer.querySelector('.drawer-overlay') : null;
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Chat Query Prompts & Automated Counselor Replies
  const responses = {
    syllabus: "Our commercial contract drafting syllabus spans 6 months, mapping 24+ structures including Master Service Agreements (MSAs), IP Licensing, Indemnification, and SaaS clauses. I've logged a priority note to mail the details directly to you!",
    eligibility: "The LLS program is curated for practicing lawyers, corporate legal teams, independent legal freelancers, and final-year law students looking to acquire high-income skills. No prior corporate experience is required.",
    placement: "Our Career Placement Support comprises direct recruitment drives with partner corporate desks, CV optimization audits, mock contract review interviews, and a dedicated freelance advisory module.",
    counselor: "Sure! Let's arrange a call. An admissions officer will coordinate with you via WhatsApp on the number registered in your LLS profile within 4 business hours."
  };

  chatOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const queryType = btn.getAttribute('data-query');
      const queryLabel = btn.textContent;
      
      // 1. Append user prompt bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = queryLabel;
      chatBody.appendChild(userBubble);
      
      // Scroll to bottom
      chatBody.scrollTop = chatBody.scrollHeight;
      
      // Disable buttons temporarily during counseling thinking sequence
      chatOptionBtns.forEach(b => b.setAttribute('disabled', 'true'));

      // 2. Append simulated Typing loader
      const typingBubble = document.createElement('div');
      typingBubble.className = 'chat-bubble advisor';
      typingBubble.innerHTML = `
        <div class="typing-indicator" aria-label="Advisor is typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      setTimeout(() => {
        chatBody.appendChild(typingBubble);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 350);

      // 3. Append advisor answer
      setTimeout(() => {
        typingBubble.remove(); // Remove typing block
        
        const replyBubble = document.createElement('div');
        replyBubble.className = 'chat-bubble advisor';
        replyBubble.textContent = responses[queryType] || "How else can I assist you today?";
        chatBody.appendChild(replyBubble);

        const timestamp = document.createElement('div');
        timestamp.className = 'chat-timestamp';
        timestamp.textContent = 'Admissions Desk • Just Now';
        chatBody.appendChild(timestamp);

        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Re-enable options
        chatOptionBtns.forEach(b => b.removeAttribute('disabled'));
        showToast('Advisor Response', 'New message from admissions helpdesk.', 'success');
      }, 1050);
    });
  });

  // ==========================================
  // 12. Online / Offline status notification
  // ==========================================
  const offlineBanner = document.getElementById('offline-banner');

  const updateNetworkStatus = () => {
    if (navigator.onLine) {
      if (offlineBanner) {
        offlineBanner.classList.remove('active');
        offlineBanner.setAttribute('aria-hidden', 'true');
      }
      showToast('Back Online', 'Your internet connection has been restored.', 'success');
    } else {
      if (offlineBanner) {
        offlineBanner.classList.add('active');
        offlineBanner.setAttribute('aria-hidden', 'false');
      }
      showToast('Connection Offline', 'You are currently offline. submissions are disabled.', 'error');
    }
  };

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  
  // Initial check on load
  if (!navigator.onLine) {
    if (offlineBanner) {
      offlineBanner.classList.add('active');
      offlineBanner.setAttribute('aria-hidden', 'false');
    }
  }
});
