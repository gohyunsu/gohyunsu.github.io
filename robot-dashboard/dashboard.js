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

  const returnMap = document.querySelector("[data-return-map]");
  if (returnMap) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const ARENA_CM = 404;
    const ORIGIN = 48;
    const SOUTH_LANE_Y = 23;
    const SOUTH_HUG_X = 160;
    const GOAL = { x: 17, y: 17 };
    const COL_MAX = 325;
    const descentByRegularColumn = [75, 75, 175, 175, 225, 275, 325];
    const descentByFrontRow = [75, 100, 175, 200, 250, 300, 325];

    const grid = document.getElementById("return-cell-grid");
    const svg = document.getElementById("return-arena-svg");
    const selectedOutput = document.getElementById("return-selected-cell");
    const cellName = document.getElementById("return-map-cell-name");
    const startCoord = document.getElementById("return-start-coord");
    const laneOutput = document.getElementById("return-descent-lane");
    const distanceOutput = document.getElementById("return-distance");
    const laneReason = document.getElementById("return-lane-reason");
    const returnSteps = document.getElementById("return-route-steps");
    const thirdSteps = document.getElementById("third-route-steps");
    const arenaDesc = document.getElementById("return-arena-desc");
    const layerInputs = Array.from(document.querySelectorAll("[data-route-layer]"));
    let selected = { row: 6, col: 1 };

    function svgNode(tag, attributes = {}, textValue = "") {
      const node = document.createElementNS(SVG_NS, tag);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      if (textValue) node.textContent = textValue;
      return node;
    }

    function mapX(x) { return ORIGIN + x; }
    function mapY(y) { return ORIGIN + ARENA_CM - y; }
    function wrap180(value) { return ((value + 180) % 360 + 360) % 360 - 180; }

    function phaseFor(row, col) {
      if (row <= 2 && col <= 6) return { name: "Seq6r", heading: 90, status: "active" };
      if ((row === 3 || row === 4) && col >= 5 && col <= 6) return { name: "Seq5r", heading: 0, status: "active" };
      if ((row === 3 || row === 4) && col <= 4) return { name: "Seq4r", heading: -90, status: "active" };
      if (row >= 5 && col <= 2) return { name: "Seq3r", heading: 0, status: "active" };
      if (row >= 5 && col >= 3) return { name: "Seq2r", heading: 90, status: "active" };
      return { name: "Seq1r", heading: 180, status: "currently off" };
    }

    function descentColumn(row, col) {
      return row === 1 ? descentByFrontRow[col - 1] : descentByRegularColumn[col - 1];
    }

    function initialTurn(heading) {
      let delta = wrap180(180 - heading);
      if (Math.abs(Math.abs(delta) - 180) < 8) delta = 180;
      return delta;
    }

    function turnLabel(delta) {
      if (Math.abs(delta) < 1) return "회전 없음";
      return `${delta > 0 ? "우회전(CW)" : "좌회전(CCW)"} ${delta > 0 ? "+" : "−"}${Math.abs(delta)}°`;
    }

    function compactPoints(points) {
      return points.filter((point, index) => {
        if (!index) return true;
        const previous = points[index - 1];
        return Math.abs(point.x - previous.x) > 0.1 || Math.abs(point.y - previous.y) > 0.1;
      });
    }

    function routeFor(row, col) {
      const start = { x: col * 50, y: 50 + row * 50 };
      const descentX = descentColumn(row, col);
      const phase = phaseFor(row, col);
      const points = [start];
      if (Math.abs(start.x - descentX) > 6) points.push({ x: descentX, y: start.y });
      points.push({ x: descentX, y: SOUTH_LANE_Y });
      if (descentX > SOUTH_HUG_X) points.push({ x: SOUTH_HUG_X, y: SOUTH_LANE_Y });
      points.push(GOAL);
      const routePoints = compactPoints(points);
      const distance = routePoints.slice(1).reduce((sum, point, index) => {
        const previous = routePoints[index];
        return sum + Math.hypot(point.x - previous.x, point.y - previous.y);
      }, 0);
      return {
        row, col, start, descentX, phase, points: routePoints,
        reversePoints: [...routePoints].reverse(),
        initialTurn: initialTurn(phase.heading),
        restoreTurn: wrap180(phase.heading - 180),
        distance
      };
    }

    function laneExplanation(route) {
      if (route.col === 1) {
        return "C1 종료 전용 규칙: west wall(x=23)로 바로 붙지 않고 C1/C2 사이 x=75를 고정합니다.";
      }
      if (route.col === 7) {
        return `동쪽 벽 장거리 하강을 피하도록 COL_MAX=${COL_MAX}가 x=325(C6/C7 사이)로 제한합니다.`;
      }
      if (route.row === 1 && route.descentX === route.start.x) {
        return "R1 아래에는 다음 object row가 없어 현재 x를 그대로 유지하며 south lane으로 내려갑니다.";
      }
      return `현재 clearance·거리 점수 결과로 x=${route.descentX} 세로 통로를 선택합니다.`;
    }

    function addMarker(defs, id, color) {
      const marker = svgNode("marker", {
        id, viewBox: "0 0 10 10", refX: "8.5", refY: "5",
        markerUnits: "userSpaceOnUse", markerWidth: "11", markerHeight: "11",
        orient: "auto-start-reverse"
      });
      marker.appendChild(svgNode("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }));
      defs.appendChild(marker);
    }

    function drawSegment(group, from, to, className, markerId) {
      const attributes = {
        x1: mapX(from.x), y1: mapY(from.y), x2: mapX(to.x), y2: mapY(to.y),
        class: className
      };
      if (markerId) attributes["marker-end"] = `url(#${markerId})`;
      group.appendChild(svgNode("line", attributes));
    }

    function drawTurn(group, point, returnDelta, thirdDelta, edge = "middle") {
      const x = mapX(point.x);
      const y = mapY(point.y);
      group.appendChild(svgNode("circle", { cx: x, cy: y, r: "8", class: "turn-point" }));
      group.appendChild(svgNode("path", {
        d: `M ${x - 4} ${y + 1} A 6 6 0 1 1 ${x + 3} ${y - 4}`,
        class: "turn-arc"
      }));
      const width = 116;
      const labelX = edge === "right" ? x - width - 12 : x + 12;
      const labelY = Math.max(55, y - 33);
      group.appendChild(svgNode("rect", {
        x: labelX, y: labelY, width, height: "29", rx: "6", class: "turn-label-bg"
      }));
      group.appendChild(svgNode("text", {
        x: labelX + 7, y: labelY + 11, class: "turn-label"
      }, `RETURN ${returnDelta >= 0 ? "+" : "−"}${Math.abs(returnDelta)}°`));
      group.appendChild(svgNode("text", {
        x: labelX + 7, y: labelY + 23, class: "turn-label"
      }, `TRIP 3 ${thirdDelta >= 0 ? "+" : "−"}${Math.abs(thirdDelta)}°`));
    }

    function drawArena(route) {
      svg.replaceChildren();
      const defs = svgNode("defs");
      addMarker(defs, "arrow-return", "#08747a");
      addMarker(defs, "arrow-third", "#d65b45");
      svg.appendChild(defs);

      svg.appendChild(svgNode("rect", {
        x: ORIGIN, y: mapY(40), width: ARENA_CM, height: "40", class: "arena-south-band"
      }));
      svg.appendChild(svgNode("rect", {
        x: ORIGIN, y: ORIGIN, width: ARENA_CM, height: ARENA_CM, rx: "4", class: "arena-wall"
      }));

      for (let col = 1; col <= 7; col += 1) {
        const x = col * 50;
        svg.appendChild(svgNode("line", {
          x1: mapX(x), y1: ORIGIN, x2: mapX(x), y2: ORIGIN + ARENA_CM, class: "arena-grid-line"
        }));
        svg.appendChild(svgNode("text", {
          x: mapX(x), y: 478, "text-anchor": "middle", class: "arena-axis-label"
        }, `C${col}`));
      }
      for (let row = 1; row <= 6; row += 1) {
        const y = 50 + row * 50;
        svg.appendChild(svgNode("line", {
          x1: ORIGIN, y1: mapY(y), x2: ORIGIN + ARENA_CM, y2: mapY(y), class: "arena-grid-line"
        }));
        svg.appendChild(svgNode("text", {
          x: 27, y: mapY(y) + 4, "text-anchor": "middle", class: "arena-axis-label"
        }, `R${row}`));
        for (let col = 1; col <= 7; col += 1) {
          svg.appendChild(svgNode("circle", {
            cx: mapX(col * 50), cy: mapY(y), r: "7",
            class: `arena-object-dot${row === route.row && col === route.col ? " is-selected" : ""}`
          }));
        }
      }

      svg.appendChild(svgNode("line", {
        x1: mapX(route.descentX), y1: mapY(route.start.y), x2: mapX(route.descentX),
        y2: mapY(SOUTH_LANE_Y), class: "arena-lane-guide"
      }));
      svg.appendChild(svgNode("line", {
        x1: mapX(SOUTH_HUG_X), y1: mapY(7), x2: mapX(SOUTH_HUG_X),
        y2: mapY(40), class: "hug-trigger"
      }));
      svg.appendChild(svgNode("text", {
        x: mapX(SOUTH_HUG_X) + 5, y: mapY(38), class: "hug-label"
      }, "inline hug x=160"));

      const returnGroup = svgNode("g", { class: "route-layer route-layer--return", "data-svg-layer": "return" });
      for (let index = 1; index < route.points.length; index += 1) {
        drawSegment(returnGroup, route.points[index - 1], route.points[index], "route-return-under");
        drawSegment(returnGroup, route.points[index - 1], route.points[index], "route-return", "arrow-return");
      }
      route.points.slice(1, -1).forEach((point) => {
        returnGroup.appendChild(svgNode("circle", {
          cx: mapX(point.x), cy: mapY(point.y), r: "5", class: "route-point"
        }));
      });
      svg.appendChild(returnGroup);

      const thirdGroup = svgNode("g", { class: "route-layer route-layer--third", "data-svg-layer": "third" });
      for (let index = 1; index < route.reversePoints.length; index += 1) {
        drawSegment(thirdGroup, route.reversePoints[index - 1], route.reversePoints[index], "route-third", "arrow-third");
      }
      svg.appendChild(thirdGroup);

      const annotationGroup = svgNode("g", { class: "route-annotations" });
      const bottomTurn = { x: route.descentX, y: SOUTH_LANE_Y };
      drawTurn(annotationGroup, route.start, route.initialTurn, route.restoreTurn,
        route.start.x > 285 ? "right" : "middle");
      drawTurn(annotationGroup, bottomTurn, 90, -90, route.descentX > 285 ? "right" : "middle");

      annotationGroup.appendChild(svgNode("circle", {
        cx: mapX(route.start.x), cy: mapY(route.start.y), r: "9", class: "start-marker"
      }));
      annotationGroup.appendChild(svgNode("rect", {
        x: mapX(GOAL.x) - 9, y: mapY(GOAL.y) - 9, width: "18", height: "18", rx: "3", class: "goal-marker"
      }));
      const goalLabelX = mapX(GOAL.x) + 14;
      const goalLabelY = mapY(GOAL.y) - 9;
      annotationGroup.appendChild(svgNode("rect", {
        x: goalLabelX, y: goalLabelY, width: "72", height: "20", rx: "5", class: "marker-label-bg"
      }));
      annotationGroup.appendChild(svgNode("text", {
        x: goalLabelX + 7, y: goalLabelY + 14, class: "marker-label"
      }, "GOAL 17,17"));
      svg.appendChild(annotationGroup);

      layerInputs.forEach((input) => {
        const layer = svg.querySelector(`[data-svg-layer="${input.dataset.routeLayer}"]`);
        if (layer) layer.classList.toggle("is-hidden", !input.checked);
      });
    }

    function stepItem(title, detail) {
      return `<li><strong>${title}</strong><small>${detail}</small></li>`;
    }

    function updateSteps(route) {
      const toColumn = Math.abs(route.start.x - route.descentX) > 6;
      const phaseState = route.phase.status === "active"
        ? `${route.phase.name} 예상 heading ${route.phase.heading > 0 ? "+" : ""}${route.phase.heading}°`
        : `${route.phase.name}는 현재 OFF인 what-if 위치`;
      const initialTitle = route.initialTurn
        ? `${turnLabel(route.initialTurn)} → mouth south`
        : "mouth south 유지 · 초기 회전 없음";
      const restoreTitle = route.restoreTurn
        ? `${turnLabel(route.restoreTurn)} → ${route.phase.name} heading 복원`
        : `${route.phase.name} heading 유지`;
      const hugText = route.descentX > SOUTH_HUG_X
        ? `x=${SOUTH_HUG_X}을 지나며 hold y를 ${SOUTH_LANE_Y}→${GOAL.y}로 전환`
        : `이미 x<${SOUTH_HUG_X}이므로 west leg 시작부터 hold y=${GOAL.y}`;

      returnSteps.innerHTML = [
        stepItem(initialTitle, `${phaseState}. 실제 live heading read가 최종 회전량을 결정합니다.`),
        ...(toColumn ? [stepItem(`Lateral strafe → x=${route.descentX}`, `y=${route.start.y}를 유지하며 안전 하강 통로로 정렬`)] : []),
        stepItem(`남쪽 전진 → (${route.descentX}, ${SOUTH_LANE_Y})`, `mouth south · descend-to-south · x=${route.descentX} hold`),
        stepItem("우회전(CW) +90° → mouth west", "south wall에 도착한 뒤 서쪽 goal 방향으로 전환"),
        stepItem(`서쪽 전진 → goal (${GOAL.x}, ${GOAL.y})`, `run-west-to-goal · ${hugText}`)
      ].join("");

      thirdSteps.innerHTML = [
        stepItem(`goal에서 후진 → x=${route.descentX}`, `mouth west를 유지하므로 로봇은 동쪽으로 이동 · return west leg 역순`),
        stepItem("좌회전(CCW) −90° → mouth south", `(${route.descentX}, ${SOUTH_LANE_Y})에서 northbound reverse 준비`),
        stepItem(`후진 북상 → (${route.descentX}, ${route.start.y})`, `mouth south를 유지하므로 로봇은 북쪽으로 이동 · descend leg 역순`),
        ...(toColumn ? [stepItem(`Lateral strafe → x=${route.start.x}`, `복귀의 to-column을 반대로 따라 선택 셀의 x 좌표로 복원`)] : []),
        stepItem(restoreTitle, `선택 위치에 도착한 뒤 두 번째 탐색 종료 당시의 ${route.phase.name} 방향으로 복원하는 설계`)
      ].join("");
    }

    function update(route) {
      const label = `R${route.row}C${route.col}`;
      selectedOutput.textContent = label;
      cellName.textContent = label;
      startCoord.textContent = `(${route.start.x}, ${route.start.y})`;
      laneOutput.textContent = `x = ${route.descentX}`;
      distanceOutput.textContent = `약 ${Math.round(route.distance)} cm`;
      laneReason.textContent = laneExplanation(route);
      arenaDesc.textContent = `${label}에서 x=${route.descentX} 하강 통로로 정렬하고 south lane y=${SOUTH_LANE_Y}로 내려온 뒤, 우회전 90도로 서쪽을 보고 goal ${GOAL.x},${GOAL.y}로 진입하는 경로입니다.`;
      grid.querySelectorAll(".return-cell").forEach((button) => {
        const active = Number(button.dataset.row) === route.row && Number(button.dataset.col) === route.col;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      drawArena(route);
      updateSteps(route);
    }

    const cornerHeading = document.createElement("span");
    cornerHeading.className = "return-cell-grid__head";
    cornerHeading.setAttribute("aria-hidden", "true");
    grid.appendChild(cornerHeading);
    for (let col = 1; col <= 7; col += 1) {
      const heading = document.createElement("span");
      heading.className = "return-cell-grid__head";
      heading.textContent = `C${col}`;
      grid.appendChild(heading);
    }
    for (let row = 6; row >= 1; row -= 1) {
      const rowLabel = document.createElement("span");
      rowLabel.className = "return-cell-grid__row";
      rowLabel.textContent = `R${row}`;
      grid.appendChild(rowLabel);
      for (let col = 1; col <= 7; col += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "return-cell";
        button.dataset.row = row;
        button.dataset.col = col;
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", `R${row}C${col} 종료 위치`);
        button.textContent = `${row},${col}`;
        button.addEventListener("click", () => {
          selected = { row, col };
          update(routeFor(row, col));
        });
        grid.appendChild(button);
      }
    }

    layerInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const layer = svg.querySelector(`[data-svg-layer="${input.dataset.routeLayer}"]`);
        if (layer) layer.classList.toggle("is-hidden", !input.checked);
      });
    });

    update(routeFor(selected.row, selected.col));
  }
})();
