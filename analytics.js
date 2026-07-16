(function () {
  const CLICKABLE_SELECTOR = "button, a, [role='button']";
  const MAX_TEXT_LENGTH = 100;

  function cleanText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, MAX_TEXT_LENGTH);
  }

  function getElementLabel(element) {
    return cleanText(
      element.dataset.analyticsLabel ||
      element.getAttribute("aria-label") ||
      element.innerText ||
      element.textContent ||
      element.id ||
      element.className ||
      element.tagName
    );
  }

  function getElementRole(element) {
    if (element.matches("a")) return "link";
    if (element.matches("button")) return "button";
    return element.getAttribute("role") || "clickable";
  }

  function findSectionId(element) {
    return element.closest("section, header, footer, main, nav, article")?.id || "";
  }

  function getClickParams(element) {
    const href = element.matches("a") ? element.getAttribute("href") || "" : "";
    return {
      button_label: getElementLabel(element),
      button_role: getElementRole(element),
      button_id: element.id || "",
      button_classes: cleanText(element.className),
      link_url: href,
      page_path: window.location.pathname,
      page_title: document.title,
      section_id: findSectionId(element),
      survey_id: element.dataset.surveyId || "",
      survey_category: element.dataset.category || ""
    };
  }

  function sendClickEvent(element) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "button_click", getClickParams(element));
  }

  document.addEventListener("click", function (event) {
    const clickedElement = event.target.closest(CLICKABLE_SELECTOR);
    if (!clickedElement) return;
    sendClickEvent(clickedElement);
  }, true);
})();
