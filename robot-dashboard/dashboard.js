(function () {
  const storageKey = "team7-robot-preflight-v1";
  const checkboxes = Array.from(document.querySelectorAll("[data-check]"));
  const count = document.getElementById("check-count");
  const gate = document.getElementById("run-gate");
  const toast = document.getElementById("toast");
  let timer;

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch (_) { saved = {}; }

  function updateChecklist() {
    const complete = checkboxes.filter((box) => box.checked).length;
    count.textContent = `${complete} / ${checkboxes.length} complete`;
    const ready = complete === checkboxes.length;
    gate.textContent = ready
      ? "Pre-flight complete. 명령을 복사해 Jetson에서 실행하세요 — 물리 차단 담당자는 계속 필요합니다."
      : `아직 ${checkboxes.length - complete}개의 현장 확인이 필요합니다.`;
    gate.classList.toggle("is-ready", ready);
  }

  checkboxes.forEach((box) => {
    box.checked = Boolean(saved[box.dataset.check]);
    box.addEventListener("change", () => {
      saved[box.dataset.check] = box.checked;
      localStorage.setItem(storageKey, JSON.stringify(saved));
      updateChecklist();
    });
  });
  updateChecklist();

  function message(text) {
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copy);
      const text = target ? target.textContent.trim() : "";
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        message("명령을 클립보드에 복사했습니다.");
      } catch (_) {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
        message("명령을 클립보드에 복사했습니다.");
      }
    });
  });

  const filters = Array.from(document.querySelectorAll("[data-filter]"));
  const knobs = Array.from(document.querySelectorAll(".knob"));
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      filters.forEach((item) => item.classList.toggle("is-active", item === button));
      knobs.forEach((knob) => { knob.hidden = selected !== "all" && knob.dataset.kind !== selected; });
    });
  });

  const scenarioTabs = Array.from(document.querySelectorAll("[data-seq-scenario]"));
  const scenarioPanels = Array.from(document.querySelectorAll("[data-seq-panel]"));
  scenarioTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.seqScenario;
      scenarioTabs.forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      scenarioPanels.forEach((panel) => {
        panel.hidden = panel.dataset.seqPanel !== selected;
      });
    });
  });
})();
