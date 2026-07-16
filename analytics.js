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

  function getContainerName(element) {
    const container = element.closest("section, header, footer, main, nav, article");
    if (!container) return "";
    return cleanText(
      container.id ||
      container.getAttribute("aria-label") ||
      container.className ||
      container.tagName.toLowerCase()
    );
  }

  function getElementIndex(element) {
    return Array.from(document.querySelectorAll(CLICKABLE_SELECTOR)).indexOf(element) + 1;
  }

  function getButtonName(element) {
    const label = getElementLabel(element);
    const location = getContainerName(element);
    const href = element.matches("a") ? element.getAttribute("href") || "" : "";
    return cleanText([location, label, href].filter(Boolean).join(" | "));
  }

  function getClickParams(element) {
    const href = element.matches("a") ? element.getAttribute("href") || "" : "";
    const label = getElementLabel(element);
    const location = getContainerName(element);
    const buttonName = getButtonName(element);

    return {
      event_category: "button",
      event_label: buttonName || label,
      button_name: buttonName || label,
      button_label: label,
      button_role: getElementRole(element),
      button_id: element.id || "",
      button_classes: cleanText(element.className),
      button_location: location,
      button_index: getElementIndex(element),
      link_url: href,
      page_path: window.location.pathname,
      page_title: document.title,
      survey_id: element.dataset.surveyId || "",
      survey_category: element.dataset.category || "",
      prize_name: element.dataset.prizeName || "",
      prize_provider: element.dataset.prizeProvider || "",
      transport_type: "beacon"
    };
  }

  function sendClickEvent(element) {
    if (typeof window.gtag !== "function") return;
    const eventName = element.dataset.analyticsEvent || "button_click";
    window.gtag("event", eventName, getClickParams(element));
  }

  document.addEventListener("click", function (event) {
    const clickedElement = event.target.closest(CLICKABLE_SELECTOR);
    if (!clickedElement) return;
    sendClickEvent(clickedElement);
  }, true);
})();
