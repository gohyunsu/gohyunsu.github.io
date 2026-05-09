(function () {
  const data = window.SITE_DATA;

  if (!data) {
    return;
  }

  const renderers = {
    header: renderHeader,
    hero: renderHero,
    research: renderResearch,
    publications: renderPublications,
    news: renderNews,
    experience: renderExperience,
    education: renderEducation,
    awards: renderAwards,
    contact: renderContact,
    footer: renderFooter
  };

  document.querySelectorAll("[data-render]").forEach((node) => {
    const key = node.dataset.render;
    const renderer = renderers[key];

    if (renderer) {
      renderer(node);
    }
  });

  function renderHeader(node) {
    const navItems = data.navigation
      .map(
        (item) =>
          `<li><a href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a></li>`
      )
      .join("");

    node.innerHTML = `
      <div class="site-header__inner">
        <a class="site-brand" href="#about" aria-label="Go to About section">
          <span class="site-brand__name">${escapeHtml(data.meta.title)}</span>
          <span class="site-brand__role">${escapeHtml(data.meta.role)}</span>
        </a>
        <nav class="site-nav" aria-label="Primary">
          <ul>${navItems}</ul>
        </nav>
      </div>
    `;
  }

  function createEyebrow(icon, label) {
    return `
      <p class="section__eyebrow">
        <span class="section__eyebrow-icon" aria-hidden="true">${escapeHtml(icon)}</span>
        <span>${escapeHtml(label)}</span>
      </p>
    `;
  }

  function renderHero(node) {
    const focusAreas = Array.isArray(data.meta.focusAreas) && data.meta.focusAreas.length
      ? data.meta.focusAreas
      : [
          {
            mark: "🧠",
            text: data.meta.currentDirection
          }
        ];

    const facts = [
      ...focusAreas,
      {
        mark: "📍",
        text: data.meta.location
      }
    ]
      .map(
        (item) => `
          <li class="hero__fact">
            <span class="hero__fact-mark" aria-hidden="true">${escapeHtml(item.mark)}</span>
            <span>${escapeHtml(item.text)}</span>
          </li>
        `
      )
      .join("");

    node.innerHTML = `
      <div class="section__inner hero">
        <div class="hero__content">
          ${createEyebrow("👤", "About")}
          <h1 class="hero__title">${escapeHtml(data.meta.title)}</h1>
          ${data.meta.subtitle ? `<p class="hero__names">${escapeHtml(data.meta.subtitle)}</p>` : ""}
          <p class="hero__tagline">${escapeHtml(data.meta.tagline)}</p>
          <p class="hero__bio">${escapeHtml(data.meta.bio)}</p>
          <ul class="hero__facts" aria-label="Current focus and location">${facts}</ul>
          <div class="hero__links" aria-label="Primary action">
            <a class="pill-link" href="#contact">Contact</a>
          </div>
        </div>
        <figure class="hero__figure">
          <img
            src="${escapeAttribute(data.meta.profileImage)}"
            alt="Abstract placeholder portrait for Hyunsu Go"
            data-fallback-label="Profile"
          />
        </figure>
      </div>
    `;

    applyImageFallbacks(node);
  }

  function renderExperience(node) {
    node.innerHTML = `
      <div class="section__inner">
        ${createEyebrow("🧭", "Experience")}
        <h2 class="section__heading">Research and academic activities.</h2>
        <div class="path-groups">
          ${createPathGroup("Research Experience", data.researchExperience)}
          ${createPathGroup("Projects", data.projects)}
          ${createPathGroup("Teaching", data.teaching)}
        </div>
      </div>
    `;

    applyImageFallbacks(node);
  }

  function renderEducation(node) {
    renderPathSection(node, {
      eyebrowIcon: "🎓",
      eyebrowLabel: "Education",
      heading: "Academic path.",
      lead: "Education in engineering, computing, and economics.",
      items: data.education
    });
  }

  function renderPathSection(node, config) {
    node.innerHTML = `
      <div class="section__inner">
        ${createEyebrow(config.eyebrowIcon, config.eyebrowLabel)}
        <h2 class="section__heading">${escapeHtml(config.heading)}</h2>
        ${config.lead ? `<p class="section__lead">${escapeHtml(config.lead)}</p>` : ""}
        <ol class="path-diagram">${renderPathItems(config.items)}</ol>
      </div>
    `;

    applyImageFallbacks(node);
  }

  function createPathGroup(title, items) {
    return `
      <section class="path-group">
        <h3 class="path-group__heading">${escapeHtml(title)}</h3>
        <ol class="path-diagram">${renderPathItems(items)}</ol>
      </section>
    `;
  }

  function renderPathItems(items) {
    return items
      .map(
        (item, index) => `
          <li ${item.id ? `id="${escapeAttribute(item.id)}"` : ""} class="path-node ${item.placeholder ? "path-node--placeholder" : ""}">
            <div class="path-node__rail" aria-hidden="true">
              <span class="path-node__dot"></span>
              ${index < items.length - 1 ? '<span class="path-node__line"></span>' : ""}
            </div>
            <div class="path-node__stage">
              <span class="path-node__period"><span aria-hidden="true">🗓️</span>${escapeHtml(item.period)}</span>
              <span class="path-node__institution"><span aria-hidden="true">🏫</span>${escapeHtml(item.institution)}</span>
            </div>
            <div class="path-node__card">
              <h3>
                <span class="item-icon" aria-hidden="true">${escapeHtml(item.icon || "•")}</span>
                ${item.url ? createTextLink(item.title, item.url, "path-node__title-link") : escapeHtml(item.title)}
              </h3>
              ${
                item.advisor
                  ? `
                    <p class="path-node__advisor">
                      <span class="meta-inline"><span aria-hidden="true">👨‍🏫</span>${
                        item.advisor.email
                          ? createTextLink(item.advisor.name, `mailto:${item.advisor.email}`, "path-node__advisor-link")
                          : escapeHtml(item.advisor.name)
                      }</span>
                    </p>
                  `
                  : ""
              }
              ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
              ${
                item.details && item.details.length
                  ? `
                    <ul class="path-node__details">
                      ${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
                    </ul>
                  `
                  : ""
              }
              ${
                item.figure
                  ? `
                    <figure class="path-node__figure">
                      <img
                        src="${escapeAttribute(item.figure)}"
                        alt="Representative figure for ${escapeAttribute(item.title)}"
                        data-fallback-label="${escapeAttribute(item.title)}"
                      />
                    </figure>
                  `
                  : ""
              }
              ${item.note ? `<p class="path-node__note">${escapeHtml(item.note)}</p>` : ""}
            </div>
          </li>
        `
      )
      .join("");
  }

  function renderResearch(node) {
    const cards = data.research
      .map(
        (item) => `
          <article class="research-card">
            <div class="research-card__head">
              <span class="research-card__icon" aria-hidden="true">${escapeHtml(item.icon || "•")}</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `
      )
      .join("");

    node.innerHTML = `
      <div class="section__inner">
        ${createEyebrow("🧪", "Research")}
        <h2 class="section__heading">Research directions.</h2>
        <p class="section__lead">
          My recent research centers on biomedical signals and medical imaging, with growing interest in 3D vision and embodied AI.
        </p>
        <div class="research-grid">${cards}</div>
      </div>
    `;
  }

  function renderPublications(node) {
    const filterOrder = ["All", "Accepted", "Under Review"];
    const buttons = filterOrder
      .map(
        (category) => `
          <button
            class="filter-button"
            type="button"
            data-filter="${escapeAttribute(category)}"
            aria-pressed="${category === "All" ? "true" : "false"}"
          >
            <span aria-hidden="true">${escapeHtml(getCategoryIcon(category))}</span>
            ${escapeHtml(getCategoryLabel(category))}
          </button>
        `
      )
      .join("");

    const cards = data.publications
      .map((paper, index) => {
        const tags = paper.tags
          .map((tag) => `<span class="badge badge--tag">${escapeHtml(tag)}</span>`)
          .join("");
        const links = paper.links
          .map((link) => createTextLink(link.label, link.url))
          .join("");

        return `
          <article
            class="pub-card"
            id="${escapeAttribute(getPublicationAnchorId(paper))}"
            data-category="${escapeAttribute(paper.category)}"
          >
            <div class="pub-card__content">
              <h3 class="pub-card__title">
                ${createPublicationTitle(paper)}
              </h3>
              <p class="pub-card__authors">
                <span class="meta-inline meta-inline--authors">
                  <span aria-hidden="true">👥</span>
                  <span class="pub-card__authors-text" title="${escapeAttribute(paper.authors)}">${formatAuthors(getDisplayedAuthors(paper))}</span>
                </span>
              </p>
              <p class="pub-card__meta">
                <span class="meta-inline"><span aria-hidden="true">🏛️</span>${escapeHtml(paper.venue)}</span>
                <span class="meta-inline"><span aria-hidden="true">${escapeHtml(getStatusIcon(paper.status))}</span>${escapeHtml(paper.status)}</span>
              </p>
              <div class="badge-row">
                <span class="badge badge--status"><span aria-hidden="true">${escapeHtml(getCategoryIcon(paper.category))}</span>${escapeHtml(getCategoryLabel(paper.category))}</span>
                ${tags}
              </div>
              <p class="pub-card__summary">${escapeHtml(paper.summary)}</p>
              <div class="pub-card__links" aria-label="Publication links">${links}</div>
              ${paper.note ? `<p class="pub-card__note"><span class="meta-inline"><span aria-hidden="true">🗓️</span>${escapeHtml(paper.note)}</span></p>` : ""}
            </div>
            ${
              paper.figure
                ? `
                  <div class="pub-card__figure">
                    ${createPublicationFigure(paper, index)}
                  </div>
                `
                : ""
            }
          </article>
        `;
      })
      .join("");

    node.innerHTML = `
      <div class="section__inner">
        ${createEyebrow("📚", "Publications")}
        <h2 class="section__heading">Selected publications.</h2>
        <p class="section__lead">
          Selected papers in medical imaging, representation learning, and efficient models.
        </p>
        <div class="pub-controls">
          <div class="filter-group" role="toolbar" aria-label="Publication filters">
            ${buttons}
          </div>
          <div class="pub-results" aria-live="polite"></div>
        </div>
        <div class="pub-list">${cards}</div>
      </div>
    `;

    applyImageFallbacks(node);
    setupPublicationFilters(node);
  }

  function renderNews(node) {
    const items = data.news
      .map(
        (item) => `
          <li>
            <span class="news-item__mark" aria-hidden="true">${escapeHtml(item.icon || "•")}</span>
            <span class="news-item__date">${escapeHtml(item.date)}</span>
            <span class="news-item__text">${formatNewsText(item)}</span>
          </li>
        `
      )
      .join("");

    node.innerHTML = `
      <div class="section__inner">
        ${createEyebrow("🗞️", "News")}
        <h2 class="section__heading">Recent updates.</h2>
        <ul class="news-list">${items}</ul>
      </div>
    `;
  }

  function renderAwards(node) {
    if (!data.awards.length) {
      node.innerHTML = `
        <div class="section__inner">
          ${createEyebrow("🏅", "Honors")}
          <h2 class="section__heading">Awards &amp; Scholarships</h2>
          <div class="award-placeholder">
            <p>🏅 Selected awards and honors will be updated.</p>
          </div>
        </div>
      `;
      return;
    }

    const items = data.awards
      .map(
        (item) => `
          <li class="timeline-card">
            <h3><span class="item-icon" aria-hidden="true">🏅</span>${escapeHtml(item.title)}</h3>
            <p class="timeline-card__meta">${createAwardMeta(item)}</p>
            ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}
            ${
              item.details && item.details.length
                ? `
                  <ul class="award-details">
                    ${item.details.map((detail) => `<li>${renderAwardDetail(detail)}</li>`).join("")}
                  </ul>
                `
                : ""
            }
          </li>
        `
      )
      .join("");

    node.innerHTML = `
      <div class="section__inner">
        ${createEyebrow("🏅", "Honors")}
        <h2 class="section__heading">Awards &amp; Scholarships</h2>
        <ul class="timeline-list">${items}</ul>
      </div>
    `;
  }

  function renderContact(node) {
    const cards = data.contact
      .map((item) => createContactCard(item))
      .join("");

    node.innerHTML = `
      <div class="section__inner">
        ${createEyebrow("✉️", "Contact")}
        <h2 class="section__heading">Get in touch.</h2>
        <div class="contact-grid">${cards}</div>
      </div>
    `;
  }

  function createContactCard(item) {
    const classes = `contact-card ${item.placeholder ? "contact-card--placeholder" : ""}`;
    const body = `
      <div class="contact-card__head">
        <span class="contact-card__mark" aria-hidden="true">${escapeHtml(item.mark || item.label)}</span>
        <h3>${escapeHtml(item.label)}</h3>
      </div>
      ${item.value ? `<p class="contact-card__value">${escapeHtml(item.value)}</p>` : ""}
    `;

    if (!item.url) {
      return `<article class="${classes}">${body}</article>`;
    }

    return `
      <a
        class="${classes} contact-card--link"
        href="${escapeAttribute(item.url)}"
        aria-label="${escapeAttribute(item.label)}"
        title="${escapeAttribute(item.label)}"
        ${getLinkAttributes(item.url)}
      >
        ${body}
      </a>
    `;
  }

  function renderFooter(node) {
    node.innerHTML = `<div class="site-footer__inner">${escapeHtml(data.footer)}</div>`;
  }

  function setupPublicationFilters(node) {
    const buttons = Array.from(node.querySelectorAll("[data-filter]"));
    const cards = Array.from(node.querySelectorAll(".pub-card"));
    const results = node.querySelector(".pub-results");

    const applyFilter = (category) => {
      let visibleCount = 0;

      cards.forEach((card) => {
        const visible = category === "All" || card.dataset.category === category;
        card.hidden = !visible;

        if (visible) {
          visibleCount += 1;
        }
      });

      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === category));
      });

      const categoryLabel = getCategoryLabel(category).toLowerCase();
      results.textContent =
        category === "All"
          ? `${visibleCount} publications shown`
          : `${visibleCount} ${categoryLabel} item${visibleCount === 1 ? "" : "s"} shown`;
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.filter));
    });

    applyFilter("All");
  }

  function applyImageFallbacks(scope) {
    scope.querySelectorAll("img[data-fallback-label]").forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          img.src = createFallbackDataUri(img.dataset.fallbackLabel || "Placeholder");
        },
        { once: true }
      );
    });
  }

  function createPill(item) {
    const mark = item.mark
      ? `<span class="pill-mark" aria-hidden="true">${escapeHtml(item.mark)}</span>`
      : "";
    const text = item.display || item.label;

    if (!item.url) {
      return `
        <span class="pill-static" aria-label="${escapeAttribute(`${item.label}: ${item.value}`)}">
          ${mark}
          <span class="pill-label">${escapeHtml(item.value)}</span>
        </span>
      `;
    }

    return `
      <a
        class="pill-link"
        href="${escapeAttribute(item.url)}"
        aria-label="${escapeAttribute(item.label)}"
        title="${escapeAttribute(item.label)}"
        ${getLinkAttributes(item.url)}
      >
        ${mark}
        <span class="pill-label">${escapeHtml(text)}</span>
      </a>
    `;
  }

  function createTextLink(label, url, className = "") {
    const classAttribute = className ? `class="${className}"` : "";
    return `
      <a ${classAttribute} href="${escapeAttribute(url)}" ${getLinkAttributes(url)}>
        ${escapeHtml(label)}
      </a>
    `;
  }

  function createPublicationTitle(paper) {
    const primaryLink = getPrimaryPublicationLink(paper);

    if (!primaryLink) {
      return escapeHtml(paper.title);
    }

    return createTextLink(paper.title, primaryLink.url, "pub-card__title-link");
  }

  function formatAuthors(authors) {
    return escapeHtml(authors).replaceAll("Hyunsu Go", "<strong>Hyunsu Go</strong>");
  }

  function getDisplayedAuthors(paper) {
    return paper.authorsShort || paper.authors;
  }

  function getPublicationAnchorId(paper) {
    return `pub-${paper.slug || slugifyTitle(paper.title)}`;
  }

  function formatNewsText(item) {
    const mentions = (item.mentions || []).map((mention) => ({
      label: mention.label,
      href: `#pub-${mention.slug}`
    }));

    return formatLinkedText(item.text || "", mentions, "news-item__link");
  }

  function renderAwardDetail(detail) {
    if (typeof detail === "string") {
      return escapeHtml(detail);
    }

    return formatLinkedText(detail.text || "", detail.mentions || [], "award-details__link");
  }

  function formatLinkedText(text, mentions, className) {
    let html = escapeHtml(text);

    if (!mentions || !mentions.length) {
      return html;
    }

    mentions.forEach((mention) => {
      const label = escapeHtml(mention.label);
      const link = createTextLink(mention.label, mention.href, className);
      html = html.split(label).join(link);
    });

    return html;
  }

  function createPublicationFigure(paper, index) {
    if (!paper.figure) {
      return "";
    }

    if (isPdfPath(paper.figure)) {
      const fallback = getPdfFallbackImagePath(paper.figure);
      return `
        <object
          class="pub-card__figure-media pub-card__figure-media--pdf"
          data="${escapeAttribute(paper.figure)}"
          type="application/pdf"
          aria-label="Representative figure for ${escapeAttribute(paper.title)}"
        >
          <img
            class="pub-card__figure-media"
            src="${escapeAttribute(fallback)}"
            alt="Representative abstract figure for ${escapeAttribute(paper.title)}"
            data-fallback-label="Paper ${index + 1}"
          />
        </object>
      `;
    }

    return `
      <img
        class="pub-card__figure-media"
        src="${escapeAttribute(paper.figure)}"
        alt="Representative abstract figure for ${escapeAttribute(paper.title)}"
        data-fallback-label="Paper ${index + 1}"
      />
    `;
  }

  function getLinkAttributes(url) {
    return isExternalUrl(url) ? 'target="_blank" rel="noopener noreferrer"' : "";
  }

  function createAwardMeta(item) {
    const parts = [];

    if (item.issuer) {
      parts.push(
        `<span class="meta-inline"><span aria-hidden="true">🏛️</span>${escapeHtml(item.issuer)}</span>`
      );
    }

    if (item.year) {
      parts.push(
        `<span class="meta-inline"><span aria-hidden="true">🗓️</span>${escapeHtml(item.year)}</span>`
      );
    }

    return parts.join("");
  }

  function getPrimaryPublicationLink(paper) {
    if (!paper.links || !paper.links.length) {
      return null;
    }

    const priority = ["arxiv", "paper", "pdf", "program", "conference"];

    const ranked = [...paper.links].sort((a, b) => {
      const aIndex = getLinkPriorityIndex(a.label, priority);
      const bIndex = getLinkPriorityIndex(b.label, priority);
      return aIndex - bIndex;
    });

    return ranked[0];
  }

  function isPdfPath(path) {
    return /\.pdf$/i.test(path);
  }

  function getPdfFallbackImagePath(path) {
    return String(path).replace(/\.pdf$/i, ".svg");
  }

  function getLinkPriorityIndex(label, priority) {
    const lower = String(label).toLowerCase();
    const index = priority.findIndex((token) => lower.includes(token));
    return index === -1 ? priority.length : index;
  }

  function getCategoryIcon(category) {
    const icons = {
      All: "🗂️",
      Accepted: "✅",
      "Under Review": "⏳"
    };

    return icons[category] || "•";
  }

  function getCategoryLabel(category) {
    const labels = {
      All: "All",
      Accepted: "Accepted",
      "Under Review": "Under Review"
    };

    return labels[category] || category;
  }

  function getStatusIcon(status) {
    if (/oral/i.test(status)) {
      return "🎤";
    }

    if (/under review/i.test(status)) {
      return "⏳";
    }

    if (/accepted/i.test(status)) {
      return "✅";
    }

    return "•";
  }

  function isExternalUrl(url) {
    return /^https?:\/\//.test(url);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function createFallbackDataUri(label) {
    const safeLabel = String(label).slice(0, 28);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${safeLabel}">
        <rect width="640" height="400" fill="#f6f4ed"/>
        <rect x="42" y="42" width="556" height="316" rx="28" fill="#ffffff" stroke="#d8e0de"/>
        <circle cx="130" cy="124" r="28" fill="#d7e7e4"/>
        <rect x="186" y="98" width="260" height="18" rx="9" fill="#355c62" opacity="0.78"/>
        <rect x="186" y="132" width="188" height="14" rx="7" fill="#9eb6b2"/>
        <rect x="76" y="204" width="488" height="96" rx="18" fill="#eef4f3"/>
        <text x="88" y="258" fill="#355c62" font-size="30" font-family="Georgia, serif">${safeLabel}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function slugifyTitle(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
})();
