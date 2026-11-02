/* Plain JavaScript: renders the editable data and enhances ordinary anchor links. */
(() => {
  "use strict";

  const data = window.exhibitionData;
  if (!data?.chapters?.length) return;
  const labels = data.labels;
  const main = document.getElementById("exhibition");
  const header = document.getElementById("site-header");
  const liveProgress = document.getElementById("reading-progress");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pad = number => String(number).padStart(2, "0");
  const chapterId = chapter => `chapter-${chapter.id}`;
  const photoId = (chapter, index) => `${chapterId(chapter)}-photo-${pad(index + 1)}`;

  // Text is inserted as text, never interpreted as HTML from the content file.
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function position(node, photo) {
    node.style.setProperty("--desktop-position", photo.desktopPosition || "center");
    node.style.setProperty("--mobile-position", photo.mobilePosition || "center");
    node.style.setProperty("--shade", photo.gradientStrength ?? 0.4);
    node.dataset.textPosition = photo.quotePosition || "right";
    if (photo.mobileTextPosition) node.dataset.mobileText = photo.mobileTextPosition;
    if (photo.mobileTextOffset) node.style.setProperty("--mobile-text-offset", photo.mobileTextOffset);
    if (photo.introWidth) node.style.setProperty("--intro-width", photo.introWidth);
    if (photo.introPosition) node.dataset.introPosition = photo.introPosition;
  }

  function photograph(photo, eager = false) {
    const img = element("img", "scene-image");
    img.alt = photo.alt;
    img.width = 1600;
    img.height = 1280;
    img.decoding = "async";
    img.loading = eager ? "eager" : "lazy";
    if (eager) img.setAttribute("fetchpriority", "high");
    if (photo.srcset) {
      img.srcset = photo.srcset;
      img.sizes = "100vw";
    }
    img.src = photo.src;
    return img;
  }

  function thumbnail(chapter) {
    const img = element("img", "navigation-image");
    img.src = chapter.thumbnail;
    img.alt = ""; // Adjacent chapter text gives this link its accessible name.
    img.width = 480;
    img.height = 384;
    img.loading = "lazy";
    img.decoding = "async";
    img.style.objectPosition = chapter.thumbnailPosition || "center";
    return img;
  }

  function testimony(photo) {
    const wrapper = element("div", "testimony");
    const quote = element("blockquote", "quotation");
    if (photo.quote.length > 180) wrapper.classList.add("testimony-long");
    const mark = element("span", "quotation-mark", "“");
    mark.setAttribute("aria-hidden", "true");
    quote.append(mark, element("p", "quotation-text", photo.quote));
    const attribution = element("footer", "attribution", photo.attribution);
    quote.append(attribution);
    wrapper.append(quote);
    if (photo.anonymous) wrapper.append(element("p", "testimony-context", labels.anonymousContext));
    return wrapper;
  }

  function headerLink(key) {
    const link = element("a", "header-link", labels[key]);
    if (data.links[key]) {
      link.href = data.links[key];
    } else {
      // No href, fake destination or click handler. Still discoverable by keyboard.
      link.setAttribute("role", "link");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "0");
      link.setAttribute("aria-label", `${labels[key]} — ${labels.linkPending}`);
      link.title = labels.linkPending;
    }
    return link;
  }

  const homeLink = element("a", "brand");
  homeLink.href = "#entrance";
  homeLink.setAttribute("aria-label", labels.returnHome);
  const logo = element("img", data.branding.whiteFilter ? "brand-image brand-white" : "brand-image");
  logo.src = data.branding.logo;
  logo.alt = data.branding.alt;
  logo.width = 2411;
  logo.height = 2062;
  homeLink.append(logo);
  const links = element("nav", "header-links");
  links.setAttribute("aria-label", data.branding.alt);
  links.append(headerLink("fullReport"), headerLink("support"));
  header.append(homeLink, links);
  document.title = `${data.title} — ${data.branding.alt}`;
  document.querySelector('meta[name="description"]').content = data.introduction;

  // Preload the responsive entrance image from the same editable data as the scene.
  const preload = element("link");
  preload.rel = "preload";
  preload.as = "image";
  preload.href = data.hero.src;
  preload.setAttribute("fetchpriority", "high");
  if (data.hero.srcset) {
    preload.setAttribute("imagesrcset", data.hero.srcset);
    preload.setAttribute("imagesizes", "100vw");
  }
  document.head.append(preload);

  const hero = element("section", "hero scene");
  hero.id = "entrance";
  hero.setAttribute("aria-labelledby", "exhibition-title");
  position(hero, data.hero);
  hero.append(photograph(data.hero, true));
  const heroMain = element("div", "hero-main scene-layer");
  const heroCopy = element("div", "hero-copy");
  heroCopy.append(element("p", "location", data.location));
  const title = element("h1", "exhibition-title");
  title.id = "exhibition-title";
  title.setAttribute("aria-label", data.title);
  data.titleLines.forEach(line => title.append(element("span", "title-line", line)));
  const subtitle = element("p", "subtitle");
  (data.subtitleLines || [data.subtitle]).forEach(line => subtitle.append(element("span", "subtitle-line", line)));
  heroCopy.append(title, subtitle, element("p", "hero-introduction", data.introduction));
  heroMain.append(heroCopy);
  hero.append(heroMain);
  const entranceNavigation = element("nav", "chapter-strip scene-layer");
  entranceNavigation.setAttribute("aria-label", labels.chapterNavigation);
  data.chapters.forEach(chapter => {
    const link = element("a", "chapter-tile");
    link.href = `#${chapterId(chapter)}`;
    link.append(thumbnail(chapter), element("span", "tile-number", chapter.id), element("span", "tile-title", chapter.title));
    entranceNavigation.append(link);
  });
  hero.append(entranceNavigation);
  main.append(hero);

  function progressNavigation(chapter, index) {
    const nav = element("nav", "photo-progress");
    nav.setAttribute("aria-label", `${labels.photographNavigation}: ${chapter.title}`);
    nav.dataset.chapter = chapter.id;
    const dots = element("div", "progress-dots");
    chapter.photos.forEach((_, dotIndex) => {
      const dot = element("a", "progress-dot");
      dot.href = `#${photoId(chapter, dotIndex)}`;
      dot.setAttribute("aria-label", `${labels.photograph} ${dotIndex + 1} ${labels.of} ${chapter.photos.length}`);
      dot.dataset.index = dotIndex;
      if (dotIndex === index) dot.setAttribute("aria-current", "true");
      dots.append(dot);
    });
    const count = element("span", "progress-count", `${pad(index + 1)} / ${pad(chapter.photos.length)}`);
    count.setAttribute("aria-hidden", "true");
    nav.append(dots, count);
    return nav;
  }

  function adjacentChapter(chapter, direction) {
    const link = element("a", `chapter-adjacent chapter-${direction}`);
    link.href = `#${chapterId(chapter)}`;
    const word = direction === "previous" ? labels.previous : labels.next;
    link.setAttribute("aria-label", `${word} ${labels.chapter.toLowerCase()}: ${chapter.id} ${chapter.title}`);
    const arrow = element("span", "chapter-arrow", direction === "previous" ? "←" : "→");
    arrow.setAttribute("aria-hidden", "true");
    const text = element("span", "chapter-adjacent-text");
    text.append(element("span", "chapter-direction", `${chapter.id} ${word}`), element("span", "chapter-adjacent-title", chapter.title));
    if (direction === "previous") link.append(arrow, thumbnail(chapter), text);
    else link.append(text, thumbnail(chapter), arrow);
    return link;
  }

  data.chapters.forEach((chapter, chapterIndex) => {
    const section = element("section", "chapter");
    section.id = chapterId(chapter);
    section.setAttribute("aria-labelledby", `${section.id}-title`);
    chapter.photos.forEach((photo, index) => {
      const scene = element("figure", `photo-scene scene${index === 0 ? " chapter-opening" : ""}`);
      scene.id = photoId(chapter, index);
      scene.dataset.chapter = chapter.id;
      scene.dataset.index = index;
      scene.tabIndex = -1; // Anchor navigation can transfer keyboard focus here.
      scene.setAttribute("aria-label", `${chapter.title} — ${labels.photograph} ${index + 1} ${labels.of} ${chapter.photos.length}`);
      position(scene, photo);
      scene.append(photograph(photo));
      const figcaption = element("figcaption", "scene-layer scene-caption");
      const copy = element("div", "scene-content reveal");
      if (index === 0) {
        const intro = element("div", "chapter-introduction");
        intro.append(element("p", "chapter-number", `${chapter.id} / ${pad(data.chapters.length)}`));
        const heading = element("h2", "chapter-title", chapter.title);
        heading.id = `${section.id}-title`;
        intro.append(heading, element("p", "chapter-description", chapter.description));
        copy.append(intro);
      }
      if (photo.perspective) {
        const perspective = element("div", "perspective");
        perspective.append(element("h3", "perspective-title", photo.perspective));
        if (photo.perspectiveDescription) perspective.append(element("p", "chapter-description", photo.perspectiveDescription));
        copy.append(perspective);
      }
      if (photo.quote) copy.append(testimony(photo));
      else {
        const caption = element("div", "caption-feature");
        caption.append(element("p", "caption-label", photo.captionLabel || labels.captionOnly), element("p", "caption-text", photo.caption));
        copy.append(caption);
      }
      figcaption.append(copy);

      const bottom = element("div", "scene-bottom");
      const meta = element("div", "photo-meta");
      if (photo.quote) meta.append(element("p", "photo-caption", photo.caption));
      else meta.classList.add("caption-already-shown");
      meta.append(element("p", "photo-credit", `${labels.photoCredit} ${photo.credit}`));
      bottom.append(meta, progressNavigation(chapter, index));
      const chapterNav = element("nav", "chapter-controls");
      chapterNav.setAttribute("aria-label", `${labels.chapter}: ${chapter.title}`);
      if (chapterIndex > 0) chapterNav.append(adjacentChapter(data.chapters[chapterIndex - 1], "previous"));
      if (chapterIndex < data.chapters.length - 1) chapterNav.append(adjacentChapter(data.chapters[chapterIndex + 1], "next"));
      bottom.append(chapterNav);
      if (photo.showExhibitionCredits) {
        const colophon = element("footer", "colophon");
        colophon.append(element("p", "", data.credits.text), element("p", "", data.credits.collaboration));
        bottom.append(colophon);
      }
      figcaption.append(bottom);
      scene.append(figcaption);
      section.append(scene);
    });
    main.append(section);
  });

  // Ordinary hash links still work without this enhancement. A destination's
  // image is requested immediately, even when native lazy loading is still waiting.
  function revealDestination(target, focus = true) {
    const scene = target.matches(".scene") ? target : target.querySelector(".scene");
    const img = scene?.querySelector(".scene-image");
    if (img) img.loading = "eager";
    if (focus) {
      const focusTarget = scene || target;
      if (!focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: true });
    }
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  }

  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    try {
      history.pushState(null, "", link.hash);
    } catch {
      // Some local-file browser configurations restrict the History API.
      // The ordinary fragment remains a working navigation fallback.
      location.hash = link.hash;
    }
    revealDestination(target);
  });

  // Restore both deep links and browser Back/Forward without assuming a server.
  function followHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target) revealDestination(target, false);
    else if (!location.hash) hero.scrollIntoView({ behavior: "auto" });
  }
  window.addEventListener("popstate", followHash);
  window.addEventListener("hashchange", followHash);
  if (location.hash) requestAnimationFrame(followHash);

  const scenes = [...document.querySelectorAll(".scene")];
  const photoScenes = [...document.querySelectorAll(".photo-scene")];
  let lastActive = "";
  function setActive(scene) {
    if (scene.id === lastActive) return;
    lastActive = scene.id;
    document.body.dataset.currentChapter = scene.dataset.chapter || "entrance";
    if (!scene.dataset.chapter) return;
    const chapter = data.chapters.find(item => item.id === scene.dataset.chapter);
    const index = Number(scene.dataset.index);
    document.querySelectorAll(`.photo-progress[data-chapter="${chapter.id}"]`).forEach(nav => {
      nav.querySelector(".progress-count").textContent = `${pad(index + 1)} / ${pad(chapter.photos.length)}`;
      nav.querySelectorAll(".progress-dot").forEach(dot => {
        if (Number(dot.dataset.index) === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    });
    liveProgress.textContent = `${labels.chapter} ${chapter.id}: ${chapter.title}. ${labels.photograph} ${index + 1} ${labels.of} ${chapter.photos.length}.`;
    // Request only the next photograph in the reading sequence, not the archive.
    const nextScene = photoScenes[photoScenes.indexOf(scene) + 1];
    if (nextScene) nextScene.querySelector(".scene-image").loading = "eager";
  }

  if ("IntersectionObserver" in window) {
    // Fade only content that has not yet entered the viewport. Images stay still.
    const visibilityObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        visibilityObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    scenes.forEach(scene => visibilityObserver.observe(scene));

    const visible = new Set();
    const progressObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      const midpoint = window.innerHeight / 2;
      const active = [...visible].find(scene => {
        const rect = scene.getBoundingClientRect();
        return rect.top <= midpoint && rect.bottom >= midpoint;
      });
      if (active) setActive(active);
    }, { rootMargin: "-49% 0px -49% 0px", threshold: 0 });
    scenes.forEach(scene => progressObserver.observe(scene));
    document.documentElement.classList.add("enhanced");
  } else {
    // Full content, static counters and ordinary links remain usable.
    scenes.forEach(scene => scene.classList.add("is-visible"));
  }
})();
