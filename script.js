const WHATSAPP_URL = "https://wa.me/5581992944641?text=Ol%C3%A1.%20Voc%C3%AA%20est%C3%A1%20falando%20com%20a%20DL%20Assessoria%20Regulat%C3%B3ria.%20Como%20podemos%20apoiar%20a%20conformidade%20da%20sua%20opera%C3%A7%C3%A3o%3F";
const INSTAGRAM_URL = "https://www.instagram.com/assessoriaregulatoria/";
const LINKEDIN_URL = "https://www.linkedin.com/company/assessoriaregulat%C3%B3ria/?viewAsMember=true";
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbyP8vUJnfkgSswr5EifKX5RCAQJERH4RIUdLAzoRmfXgMQyH6TndF4lG-DeGaUW0UoQIw/exec";

const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const contactCopy = document.querySelector(".contact-copy");
const contactSocials = document.querySelector(".contact-socials");
const contactAddress = document.querySelector(".contact-address");
const privacyCheckbox = document.querySelector("[data-privacy-checkbox]");
const consentError = document.querySelector("[data-consent-error]");
const hero = document.querySelector("[data-hero]");
const servicesSection = document.querySelector("#servicos");
const method = document.querySelector("[data-method]");
const stories = document.querySelector("[data-stories]");
const currentYear = document.querySelector("[data-current-year]");
const mobilePerformanceMode = window.matchMedia("(max-width: 820px)");

const loadDeferredImage = (image) => {
  if (!image) return Promise.resolve();

  if (!image.getAttribute("src") && image.dataset.src) {
    image.src = image.dataset.src;
  }

  if (image.complete) return Promise.resolve();

  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
};

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (contactForm && contactCopy && contactSocials && contactAddress && formStatus) {
  const mobileContactLayout = window.matchMedia("(max-width: 820px)");

  const syncContactChannels = () => {
    if (mobileContactLayout.matches) {
      contactForm.insertAdjacentElement("afterend", contactSocials);
      contactSocials.insertAdjacentElement("afterend", contactAddress);
    } else {
      contactCopy.append(contactSocials, contactAddress);
    }
  };

  syncContactChannels();
  mobileContactLayout.addEventListener("change", syncContactChannels);
}

if (header) {
  const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];
  const navTargets = navLinks
    .map((link) => ({
      link,
      section: link.getAttribute("href") === "#inicio" && hero
        ? hero
        : document.querySelector(link.getAttribute("href")),
    }))
    .filter(({ section }) => section);

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const setActiveNavLink = (activeLink) => {
    navLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  let sectionObserver = null;
  let activeSection = null;

  const visibleHeight = (section) => {
    const rect = section.getBoundingClientRect();
    const viewportTop = header.getBoundingClientRect().bottom;
    const viewportBottom = window.innerHeight;
    return Math.max(0, Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop));
  };

  const updateActiveSection = () => {
    if (!navTargets.length) return;

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      activeSection = navTargets[navTargets.length - 1].section;
    } else {
      const rankedTargets = navTargets
        .map((target) => ({ ...target, visible: visibleHeight(target.section) }))
        .sort((a, b) => b.visible - a.visible);
      const candidate = rankedTargets[0];
      const currentVisible = activeSection ? visibleHeight(activeSection) : 0;
      const stabilityMargin = window.innerHeight * 0.06;

      if (
        candidate.visible > 0
        && (candidate.section === activeSection || currentVisible === 0 || candidate.visible > currentVisible + stabilityMargin)
      ) {
        activeSection = candidate.section;
      }
    }

    const activeTarget = navTargets.find(({ section }) => section === activeSection);
    setActiveNavLink(activeTarget ? activeTarget.link : null);
  };

  const observeNavigationSections = () => {
    if (!("IntersectionObserver" in window) || !navTargets.length) return;
    if (sectionObserver) sectionObserver.disconnect();

    sectionObserver = new IntersectionObserver(updateActiveSection, {
      rootMargin: `-${Math.ceil(header.getBoundingClientRect().height)}px 0px 0px 0px`,
      threshold: Array.from({ length: 21 }, (_, index) => index / 20),
    });

    navTargets.forEach(({ section }) => sectionObserver.observe(section));
    updateActiveSection();
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = navTargets.find(({ link: navLink }) => navLink === link);
      if (target) activeSection = target.section;
      setActiveNavLink(link);
    });
  });

  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(observeNavigationSections);
  });

  updateHeader();
  observeNavigationSections();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (servicesSection) {
  const reducedLineMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealServiceLines = () => servicesSection.classList.add("is-visible");

  if (mobilePerformanceMode.matches || reducedLineMotion.matches || !("IntersectionObserver" in window)) {
    revealServiceLines();
  } else {
    const serviceLineObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        revealServiceLines();
        observer.disconnect();
      },
      { threshold: 0.32 }
    );

    serviceLineObserver.observe(servicesSection);
  }
}

if (hero) {
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const indicators = Array.from(hero.querySelectorAll("[data-hero-indicator]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let heroInterval = null;

  const showSlide = (index) => {
    activeIndex = index;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    indicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle("is-active", indicatorIndex === activeIndex);
    });
  };

  const stopHero = () => {
    if (heroInterval !== null) {
      window.clearInterval(heroInterval);
      heroInterval = null;
    }
  };

  const startHero = () => {
    stopHero();
    showSlide(reducedMotion.matches ? 0 : activeIndex);

    if (!reducedMotion.matches && slides.length > 1) {
      const activeSlide = slides[activeIndex];
      const activeIndicator = indicators[activeIndex];
      activeSlide.classList.remove("is-active");
      activeIndicator.classList.remove("is-active");
      void hero.offsetWidth;
      activeSlide.classList.add("is-active");
      activeIndicator.classList.add("is-active");

      heroInterval = window.setInterval(async () => {
        const nextIndex = (activeIndex + 1) % slides.length;
        await loadDeferredImage(slides[nextIndex]);
        showSlide(nextIndex);
      }, 4000);
    }
  };

  const prepareHeroSlides = () => {
    const initialSlides = mobilePerformanceMode.matches ? slides.slice(0, 1) : slides;
    return Promise.all(initialSlides.map(loadDeferredImage));
  };

  prepareHeroSlides().then(startHero);
  reducedMotion.addEventListener("change", startHero);
  mobilePerformanceMode.addEventListener("change", () => {
    prepareHeroSlides().then(startHero);
  });
  window.addEventListener("pagehide", stopHero, { once: true });
}

if (method) {
  const stages = Array.from(method.querySelectorAll("[data-method-stage]"));
  const images = Array.from(method.querySelectorAll("[data-method-image]"));
  const panel = method.querySelector("[role=\"tabpanel\"]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let methodInterval = null;
  let imagesReady = false;

  const showMethodStage = (index) => {
    activeIndex = index;

    stages.forEach((stage, stageIndex) => {
      const isActive = stageIndex === activeIndex;
      stage.classList.toggle("is-active", isActive);
      stage.setAttribute("aria-selected", String(isActive));
      stage.tabIndex = isActive ? 0 : -1;
    });

    images.forEach((image, imageIndex) => {
      const isActive = imageIndex === activeIndex;
      image.classList.toggle("is-active", isActive);
      image.setAttribute("aria-hidden", String(!isActive));
    });

    if (panel && stages[activeIndex]) {
      panel.setAttribute("aria-labelledby", stages[activeIndex].id);
    }
  };

  const stopMethod = () => {
    if (methodInterval !== null) {
      window.clearInterval(methodInterval);
      methodInterval = null;
    }
  };

  const startMethod = () => {
    stopMethod();
    if (imagesReady && !mobilePerformanceMode.matches && !reducedMotion.matches && stages.length > 1) {
      methodInterval = window.setInterval(() => {
        showMethodStage((activeIndex + 1) % stages.length);
      }, 4000);
    }
  };

  const selectMethodStage = (index) => {
    stopMethod();
    loadDeferredImage(images[index]).then(() => {
      showMethodStage(index);
      startMethod();
    });
  };

  stages.forEach((stage, index) => {
    stage.addEventListener("pointerenter", () => selectMethodStage(index));
    stage.addEventListener("click", () => selectMethodStage(index));
    stage.addEventListener("focus", () => selectMethodStage(index));
    stage.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % stages.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + stages.length) % stages.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = stages.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      stages[nextIndex].focus({ preventScroll: true });
    });
  });

  const prepareMethodImages = () => {
    stopMethod();
    imagesReady = false;
    const initialImages = mobilePerformanceMode.matches ? images.slice(0, 1) : images;

    Promise.all(initialImages.map(loadDeferredImage)).then(() => {
      imagesReady = true;
      startMethod();
    });
  };

  showMethodStage(0);
  prepareMethodImages();
  reducedMotion.addEventListener("change", startMethod);
  mobilePerformanceMode.addEventListener("change", prepareMethodImages);
  window.addEventListener("pagehide", stopMethod, { once: true });
}

function activateLinks(selector, url) {
  if (!url) return;

  document.querySelectorAll(selector).forEach((link) => {
    link.href = url;
    link.hidden = false;
    link.rel = "noopener noreferrer";
    link.target = "_blank";

    const socialGroup = link.closest("[data-social-group]");
    if (socialGroup) socialGroup.hidden = false;

    const channelGroup = link.closest("[data-channel-group]");
    if (channelGroup) channelGroup.hidden = false;
  });
}

activateLinks("[data-whatsapp-link]", WHATSAPP_URL);

activateLinks("[data-instagram-link]", INSTAGRAM_URL);
activateLinks("[data-linkedin-link]", LINKEDIN_URL);

if (privacyCheckbox) {
  privacyCheckbox.addEventListener("change", () => {
    privacyCheckbox.setCustomValidity("");
    if (consentError) consentError.textContent = "";
  });
}

if (menuToggle && nav) {
  const setMenuOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !nav.classList.contains("is-open")) return;
    setMenuOpen(false);
    menuToggle.focus();
  });
}

if (stories) {
  const storyTriggers = Array.from(stories.querySelectorAll("[data-story-trigger]"));
  const storyPanels = Array.from(stories.querySelectorAll("[data-story-panel]"));
  const mobileStories = window.matchMedia("(max-width: 820px)");
  let activeStory = 0;

  const syncStoryTabStops = () => {
    storyTriggers.forEach((trigger, index) => {
      trigger.tabIndex = mobileStories.matches || index === activeStory ? 0 : -1;
    });
  };

  const showStory = (index, moveFocus = false) => {
    activeStory = index;
    storyTriggers.forEach((trigger, triggerIndex) => {
      const isActive = triggerIndex === activeStory;
      trigger.classList.toggle("is-active", isActive);
      trigger.setAttribute("aria-selected", String(isActive));
      trigger.setAttribute("aria-expanded", String(isActive));
    });
    storyPanels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === activeStory;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });
    syncStoryTabStops();
    if (moveFocus) storyTriggers[activeStory].focus();
  };

  storyTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => showStory(index));
    trigger.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % storyTriggers.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + storyTriggers.length) % storyTriggers.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = storyTriggers.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      showStory(nextIndex, true);
    });
  });

  syncStoryTabStops();
  mobileStories.addEventListener("change", syncStoryTabStops);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    const headerHeight = header ? header.offsetHeight : 0;
    const anchoredHeading = targetId === "#servicos"
      ? target.querySelector("h2")
      : null;
    const anchorTarget = anchoredHeading || target;
    const anchorGap = anchoredHeading ? 18 : -1;
    const configuredScrollMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop);
    const anchorOffset = configuredScrollMargin > 0
      ? configuredScrollMargin
      : headerHeight + anchorGap;
    const top = anchorTarget.getBoundingClientRect().top + window.scrollY - anchorOffset;

    window.scrollTo({ top, behavior: "smooth" });
  });
});

if (mobilePerformanceMode.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.08 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm && formStatus) {
  const fields = {
    nome: contactForm.elements.nome,
    empresa: contactForm.elements.empresa,
    email: contactForm.elements.email,
    whatsapp: contactForm.elements.whatsapp,
    segmento: contactForm.elements.segmento,
    mensagem: contactForm.elements.mensagem,
    privacidade: privacyCheckbox,
  };
  const validationOrder = ["nome", "empresa", "email", "whatsapp", "segmento", "mensagem", "privacidade"];
  const errorElements = {
    nome: contactForm.querySelector('[data-error-for="nome"]'),
    empresa: contactForm.querySelector('[data-error-for="empresa"]'),
    email: contactForm.querySelector('[data-error-for="email"]'),
    whatsapp: contactForm.querySelector('[data-error-for="whatsapp"]'),
    segmento: contactForm.querySelector('[data-error-for="segmento"]'),
    mensagem: contactForm.querySelector('[data-error-for="mensagem"]'),
    privacidade: consentError,
  };
  const submitButton = contactForm.querySelector('[type="submit"]');
  const submitLabel = submitButton && submitButton.querySelector("[data-submit-label]");
  const defaultSubmitLabel = submitLabel ? submitLabel.textContent : "Solicitar avaliação regulatória";
  let validationStarted = false;
  let isSubmitting = false;
  let submissionSucceeded = false;

  const trimField = (field) => {
    if (field && typeof field.value === "string") field.value = field.value.trim();
  };

  const sanitizeWhatsapp = (value) => {
    let sanitized = value.replace(/[^\d+\s()-]/g, "");
    sanitized = sanitized.startsWith("+")
      ? `+${sanitized.slice(1).replace(/\+/g, "")}`
      : sanitized.replace(/\+/g, "");
    return sanitized;
  };

  const normalizeWhatsapp = (value) => value.trim().replace(/[\s()-]/g, "");

  const getValidationMessage = (name) => {
    const field = fields[name];
    if (!field) return "";

    if (name === "privacidade") {
      return field.checked ? "" : "É necessário concordar com a Política de Privacidade.";
    }

    const value = field.value.trim();

    if (name === "nome") return value ? "" : "Informe seu nome.";
    if (name === "empresa") return value ? "" : "Informe o nome da empresa.";
    if (name === "segmento") return value ? "" : "Informe o segmento de atuação.";
    if (name === "mensagem") return value ? "" : "Descreva brevemente a demanda regulatória.";

    if (name === "email") {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      return validEmail ? "" : "Informe um e-mail válido.";
    }

    if (name === "whatsapp") {
      if (!value) return "";
      const validCharacters = /^\+?[\d\s()-]+$/.test(value);
      const digitCount = value.replace(/\D/g, "").length;
      return validCharacters && digitCount >= 8 && digitCount <= 15
        ? ""
        : "Informe um WhatsApp válido com código de país e DDD, quando aplicável.";
    }

    return "";
  };

  const updateFieldValidity = (name) => {
    const field = fields[name];
    const errorElement = errorElements[name];
    if (!field) return true;

    field.setCustomValidity("");
    const message = getValidationMessage(name);
    field.setCustomValidity(message);

    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");

    if (errorElement) errorElement.textContent = message;
    return !message;
  };

  const clearValidationState = () => {
    validationOrder.forEach((name) => {
      const field = fields[name];
      if (field) {
        field.setCustomValidity("");
        field.removeAttribute("aria-invalid");
      }
      if (errorElements[name]) errorElements[name].textContent = "";
    });
  };

  Object.entries(fields).forEach(([name, field]) => {
    if (!field) return;

    const eventName = name === "privacidade" ? "change" : "input";
    field.addEventListener(eventName, () => {
      if (name === "whatsapp") field.value = sanitizeWhatsapp(field.value);
      if (validationStarted) updateFieldValidity(name);
    });

    if (name !== "privacidade") {
      field.addEventListener("blur", () => {
        trimField(field);
        if (validationStarted) updateFieldValidity(name);
      });
    }
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting || submissionSucceeded) return;

    validationStarted = true;
    formStatus.className = "form-status";
    formStatus.textContent = "";

    [fields.nome, fields.empresa, fields.email, fields.whatsapp, fields.segmento, fields.mensagem]
      .forEach(trimField);

    const firstInvalidName = validationOrder.find((name) => !updateFieldValidity(name));
    if (firstInvalidName) {
      fields[firstInvalidName].focus();
      return;
    }

    const websiteField = contactForm.elements.website;
    if (websiteField && websiteField.value) return;

    const payload = {
      nome: fields.nome.value,
      empresa: fields.empresa.value,
      email: fields.email.value,
      whatsapp: normalizeWhatsapp(fields.whatsapp.value),
      segmento: fields.segmento.value,
      mensagem: fields.mensagem.value,
      consentimento: fields.privacidade.checked ? "aceito" : "",
      website: "",
    };

    isSubmitting = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("is-processing");
    }
    if (submitLabel) submitLabel.textContent = "Enviando solicitação...";
    formStatus.className = "form-status";
    formStatus.textContent = "";

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
        redirect: "follow",
        signal: controller.signal,
      });
      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Resposta inválida do servidor.");
      }

      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || "Falha no envio do formulário.");
      }

      contactForm.reset();
      clearValidationState();
      validationStarted = false;
      submissionSucceeded = true;
      if (submitButton) {
        submitButton.classList.remove("is-processing");
        submitButton.classList.add("is-success");
      }
      if (submitLabel) submitLabel.textContent = "Solicitação recebida";
      formStatus.className = "form-status is-success";
      formStatus.textContent = "Nossa equipe retornará em breve.";
    } catch (error) {
      console.error(error);
      if (submitButton) submitButton.classList.remove("is-processing");
      if (submitLabel) submitLabel.textContent = defaultSubmitLabel;
      formStatus.className = "form-status is-error";
      formStatus.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
    } finally {
      window.clearTimeout(timeout);
      isSubmitting = false;
      if (submitButton && !submissionSucceeded) submitButton.disabled = false;
    }
  });
}
