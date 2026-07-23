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

  const thirdReview = document.querySelector("[data-third-code-review]");
  if (thirdReview) {
    const implementationButtons = Array.from(thirdReview.querySelectorAll("[data-third-implementation]"));
    const tripButtons = Array.from(thirdReview.querySelectorAll("[data-third-trip]"));
    const codeButtons = Array.from(thirdReview.querySelectorAll("[data-third-code-case]"));
    const goalInput = document.getElementById("third-goal-x");
    const goalOutput = document.getElementById("third-goal-x-output");
    const runtimeTitle = document.getElementById("third-runtime-title");
    const runtimeBadge = document.getElementById("third-runtime-badge");
    const runtimeFlag = document.getElementById("third-runtime-flag");
    const runtimeCargo = document.getElementById("third-runtime-cargo");
    const runtimeFamily = document.getElementById("third-runtime-family");
    const runtimeVia = document.getElementById("third-runtime-via");
    const runtimeGoal = document.getElementById("third-runtime-goal");
    const runtimeRetry = document.getElementById("third-runtime-retry");
    const runtimeVerdict = document.getElementById("third-runtime-verdict");
    const inlineTitle = document.getElementById("third-inline-title");
    const inlineStatus = document.getElementById("third-inline-status");
    const inlineEntry = document.getElementById("third-inline-entry");
    const inlineEntryNote = document.getElementById("third-inline-entry-note");
    const inlineTrigger = document.getElementById("third-inline-trigger");
    const inlineNewHold = document.getElementById("third-inline-new-hold");
    const inlineGoalNote = document.getElementById("third-inline-goal-note");
    const inlineExplanation = document.getElementById("third-inline-explanation");
    const codeFile = document.getElementById("third-code-file");
    const codeSummary = document.getElementById("third-code-summary");
    const codeBefore = document.getElementById("third-code-before");
    const codeAfter = document.getElementById("third-code-after");
    const codeChange = document.getElementById("third-code-change");
    const codeKeep = document.getElementById("third-code-keep");
    const codeTest = document.getElementById("third-code-test");
    let implementation = "current";
    let trip = 1;

    const codeCases = {
      gate: {
        file: "nav/arena/reverse.py · lines 189–192, 1021–1027",
        summary: "기존 trip≥2 한 개 수거 조건을 third boolean으로 이름 붙이고, third goal x만 새 환경변수로 추가합니다.",
        before: `TRIP_RETURN_AFTER = int(
    os.environ.get("RG_REV_TRIP_RETURN_AFTER", "1") or 1
)

# ... run() loop ...
trip += 1
after = os.environ.get("RG_RETURN_AFTER", "0")
if TIME_TRIPS and matchclock.ENABLED and trip >= 2:
    after = TRIP_RETURN_AFTER
CARGO.arm(after if REARM else 0, f"reverse{trip}")`,
        after: `TRIP_RETURN_AFTER = int(
    os.environ.get("RG_REV_TRIP_RETURN_AFTER", "1") or 1
)
+ THIRD_GOAL_X = float(
+     os.environ.get("RG_REV_THIRD_GOAL_X", "25") or 25
+ )

# ... run() loop ...
trip += 1
+ third = TIME_TRIPS and matchclock.ENABLED and trip >= 2
after = os.environ.get("RG_RETURN_AFTER", "0")
- if TIME_TRIPS and matchclock.ENABLED and trip >= 2:
+ if third:
    after = TRIP_RETURN_AFTER
CARGO.arm(after if REARM else 0, f"reverse{trip}")`,
        change: "reverse.py 상수 1개와 loop-local third boolean 1개를 추가합니다.",
        keep: "기존 clock gate와 CARGO.arm(1)의 의미는 그대로입니다.",
        test: "trip 1에서 third=false, trip 2에서만 third=true인지 dry log로 확인합니다."
      },
      helper: {
        file: "nav/arena/reverse.py · lines 878–912",
        summary: "현재 south로 고정된 helper에 return family와 third goal x를 인자로 주고, RTG 전역값을 호출 범위 안에서만 바꿉니다.",
        before: `def _drive_refill_return(E, loc, car, speed_dirs,
                         rot_dirs, cel, full, p):
    # ... stationary + 25cm pose guard unchanged ...

    RTG.N_CARGO = full.n
    RTG.VIA_SOUTH = True
    RTG.COL_MAX = RETURN_COL_MAX
    RTG.run(loc, car, speed_dirs, rot_dirs, here)
    return True`,
        after: `def _drive_refill_return(E, loc, car, speed_dirs,
                         rot_dirs, cel, full, p, *,
                         via_south=True, west_goal_x=None):
    # ... stationary + 25cm pose guard unchanged ...

+   saved = (RTG.VIA_SOUTH, RTG.COL_MAX, RTG.GOAL_XY)
+   try:
        RTG.N_CARGO = full.n
-       RTG.VIA_SOUTH = True
-       RTG.COL_MAX = RETURN_COL_MAX
+       RTG.VIA_SOUTH = via_south
+       RTG.COL_MAX = RETURN_COL_MAX if via_south else None
+       if west_goal_x is not None:
+           RTG.GOAL_XY = (west_goal_x, RTG.GOAL_Y)
        RTG.run(loc, car, speed_dirs, rot_dirs, here)
+   finally:
+       RTG.VIA_SOUTH, RTG.COL_MAX, RTG.GOAL_XY = saved
    return True`,
        change: "helper 인자 2개와 RTG 설정의 try/finally scope를 추가합니다.",
        keep: "stationary pose, eaten-cell nominal 25cm guard, RTG.run()은 그대로 둡니다.",
        test: "예외가 발생해도 VIA_SOUTH·COL_MAX·GOAL_XY가 원래 값으로 복원되는지 검사합니다."
      },
      full: {
        file: "nav/arena/reverse.py · lines 1072–1091",
        summary: "현재 trip 2도 무조건 south helper를 호출합니다. 제안안은 trip 2에서만 west를 넘기고 복귀 직후 종료합니다.",
        before: `except CARGO.CargoFull as full:
    if TIME_TRIPS:
        if args.dry:
            p("(dry) would drive ... via south")
        elif not _drive_refill_return(
            E, loc, car, speed_dirs, rot_dirs, cel, full, p
        ):
            break

        resume, why = _resume_after_refill(
            trip, args.dry, route
        )
        if resume:
            continue
        break`,
        after: `except CARGO.CargoFull as full:
    if TIME_TRIPS:
        if args.dry:
+           family = "west" if third else "south"
+           p(f"(dry) would drive ... via {family}")
        elif not _drive_refill_return(
            E, loc, car, speed_dirs, rot_dirs, cel, full, p,
+           via_south=not third,
+           west_goal_x=THIRD_GOAL_X if third else None,
        ):
            break

+       if third:
+           p("third traverse banked one cube; stopping")
+           break
        resume, why = _resume_after_refill(
            trip, args.dry, route
        )
        if resume:
            continue
        break`,
        change: "CargoFull helper 호출에 trip별 family를 전달하고 third는 즉시 break합니다.",
        keep: "trip 1의 return→clock/frontier 판단→deposit/resume 순서는 유지됩니다.",
        test: "trip 2 log에 via west가 찍히고 _resume_after_refill 호출이 없는지 확인합니다."
      },
      natural: {
        file: "nav/arena/reverse.py · lines 1031–1070",
        summary: "target 없이 frontier가 끝나는 경로도 현재는 south 고정입니다. 동일한 third 판정을 적용해야 마지막 경로만 다르게 움직이는 불일치를 막습니다.",
        before: `# _one_pass() natural completion
import return_to_goal as RTG
RTG.N_CARGO = CARGO.N
RTG.VIA_SOUTH = True
RTG.COL_MAX = RETURN_COL_MAX

# dry: RTG.plan_route / RTG.print_plan
# live: stationary + 25cm receipt guard
end = RTG.run(loc, car, speed_dirs, rot_dirs, here)
break`,
        after: `# _one_pass() natural completion
import return_to_goal as RTG
+ saved = (RTG.VIA_SOUTH, RTG.COL_MAX, RTG.GOAL_XY)
+ try:
    RTG.N_CARGO = CARGO.N
-   RTG.VIA_SOUTH = True
-   RTG.COL_MAX = RETURN_COL_MAX
+   RTG.VIA_SOUTH = not third
+   RTG.COL_MAX = RETURN_COL_MAX if not third else None
+   if third:
+       RTG.GOAL_XY = (THIRD_GOAL_X, RTG.GOAL_Y)

    # existing dry plan OR live stationary/25cm guard
    end = RTG.run(loc, car, speed_dirs, rot_dirs, here)
+ finally:
+   RTG.VIA_SOUTH, RTG.COL_MAX, RTG.GOAL_XY = saved
break`,
        change: "자연 종료의 planner 설정에도 CargoFull과 동일한 third 분기를 적용합니다.",
        keep: "dry plan 출력, live stationary read와 final receipt 25cm guard를 유지합니다.",
        test: "target 0개로 끝난 trip 2도 west route를 만들고 goal에서 종료하는지 확인합니다."
      },
      capture: {
        file: "nav/arena/frame_engine.py · lines 852–871, 920–927 / cargo.py · lines 83–103",
        summary: "3차 복귀 패치에서 수거 primitive는 바꾸지 않습니다. 현재 코드에는 실제 탑재 확인이나 재수거 loop가 없습니다.",
        before: `target = fr.lunge_pt(side_label, swept_label)
target = _seat_deepen(
    target, fr.cardinal, fr, side_label, swept_label
)
pose = prepare_for_lunge(
    fr, target, fr.cardinal, pose, label
)
pose = eat_leg(fr, target, fr.cardinal, f"lunge {label}", pose)
log_eat_final(target, fr.cardinal, pose, label)

# station state machine, after bookkeeping
CARGO.note(fr.key(first, stop_label))
# LIMIT=1 -> raises CargoFull immediately`,
        after: `# UNCHANGED by the third-return patch
target = fr.lunge_pt(side_label, swept_label)
target = _seat_deepen(       # filling eat: +4cm once
    target, fr.cardinal, fr, side_label, swept_label
)
pose = prepare_for_lunge(    # alignment retry, NOT eat retry
    fr, target, fr.cardinal, pose, label
)
pose = eat_leg(fr, target, fr.cardinal, f"lunge {label}", pose)
log_eat_final(target, fr.cardinal, pose, label)  # pose log only

CARGO.note(fr.key(first, stop_label))  # sensor check 없음
# LIMIT=1 -> assumes aboard and raises CargoFull`,
        change: "변경하지 않습니다. return-family 수정에 capture retry를 섞지 않습니다.",
        keep: "세 수거 경로 모두 filling eat의 GEN_LUNGE_SEAT_EXTRA=4를 계속 사용합니다.",
        test: "로그에서 [seat] +4cm, eat_leg 1회, CARGO.note 1/1 순서를 확인합니다."
      }
    };

    function selectButton(buttons, activeButton) {
      buttons.forEach((button) => {
        const active = button === activeButton;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
        if (button.hasAttribute("role")) button.setAttribute("aria-selected", String(active));
      });
    }

    function updateThirdRuntime() {
      const proposed = implementation === "proposed";
      const third = trip >= 2;
      const west = proposed && third;
      const goalX = Number(goalInput.value);
      goalOutput.textContent = `${goalX} cm`;
      goalInput.disabled = !west;
      goalInput.closest(".third-goal-control").classList.toggle("is-disabled", !west);

      runtimeTitle.textContent = `${proposed ? "PROPOSED" : "CURRENT"} · trip ${trip}`;
      runtimeBadge.textContent = proposed ? "PATCH" : "LIVE";
      runtimeBadge.classList.toggle("is-proposed", proposed);
      runtimeFlag.textContent = String(third);
      runtimeCargo.textContent = third ? "1" : "RG_RETURN_AFTER (3)";
      runtimeFamily.textContent = west ? "west" : "south";
      runtimeVia.textContent = west ? "False" : "True";
      runtimeGoal.textContent = west ? `(${goalX}, 15)` : "(17, 17)";
      runtimeRetry.textContent = "0회 · seat +4cm 1회";
      runtimeVerdict.classList.toggle("is-proposed", west);

      if (west) {
        runtimeVerdict.textContent = `제안 코드의 trip 2는 한 개를 먹은 위치에서 west family를 선택하고 (${goalX}, 15)에서 종료합니다. 4차 trip은 시작하지 않습니다.`;
      } else if (third) {
        runtimeVerdict.textContent = "현재 trip 2는 CARGO.LIMIT=1까지는 적용되지만 _drive_refill_return()이 VIA_SOUTH=True로 고정되어 있어, 한 개 수거 뒤에도 south family로 복귀합니다.";
      } else {
        runtimeVerdict.textContent = proposed
          ? "제안 코드에서도 trip 1은 현재와 동일하게 south family로 복귀한 뒤 clock/frontier gate가 허용할 때만 trip 2를 시작합니다."
          : "현재 trip 1은 collector가 찬 뒤 south wall로 내려가 서쪽으로 goal에 진입합니다.";
      }

      inlineStatus.textContent = west ? "PROPOSED" : "EXISTING";
      inlineStatus.classList.toggle("is-proposed", west);
      if (west) {
        inlineTitle.textContent = "west family · descend-to-goal";
        inlineEntry.textContent = "x = 23";
        inlineEntryNote.textContent = "west lane";
        inlineTrigger.textContent = "y ≤ 160";
        inlineNewHold.textContent = `x = ${goalX}`;
        inlineGoalNote.textContent = "third GOAL_XY.x";
        inlineExplanation.textContent = `남하하는 단일 leg 안에서 y=160을 지날 때 held x가 23→${goalX}로 바뀝니다. ${goalX}는 벽 쪽 hug가 아니라 기존 goal pile에서 동쪽으로 간격을 두는 inline goal-lane shift입니다.`;
      } else {
        inlineTitle.textContent = "south family · run-west-to-goal";
        inlineEntry.textContent = "y = 23";
        inlineEntryNote.textContent = "south lane";
        inlineTrigger.textContent = "x ≤ 160";
        inlineNewHold.textContent = "y = 17";
        inlineGoalNote.textContent = "SOUTH_GOAL_XY";
        inlineExplanation.textContent = `south 복귀는 서쪽 주행 중 x=160을 지나면 held y를 23→17로 바꿉니다. 이것이 ${third ? "현재 trip 2" : "trip 1"}의 실제 동작입니다.`;
      }
    }

    function updateCodeCase(name) {
      const item = codeCases[name];
      codeFile.textContent = item.file;
      codeSummary.textContent = item.summary;
      codeBefore.textContent = item.before;
      codeAfter.textContent = item.after;
      codeChange.textContent = item.change;
      codeKeep.textContent = item.keep;
      codeTest.textContent = item.test;
    }

    const thirdParams = new URLSearchParams(window.location.search);
    const requestedImplementation = thirdParams.get("thirdCode");
    const requestedTrip = Number(thirdParams.get("trip"));
    const requestedGoalX = Number(thirdParams.get("goalX"));
    const requestedDiff = thirdParams.get("diff");
    if (requestedImplementation === "current" || requestedImplementation === "proposed") {
      implementation = requestedImplementation;
    }
    if (requestedTrip === 1 || requestedTrip === 2) trip = requestedTrip;
    if (Number.isFinite(requestedGoalX) && requestedGoalX >= 23 && requestedGoalX <= 30) {
      goalInput.value = String(requestedGoalX);
    }
    const implementationButton = implementationButtons.find(
      (button) => button.dataset.thirdImplementation === implementation
    );
    const tripButton = tripButtons.find((button) => Number(button.dataset.thirdTrip) === trip);
    const codeButton = codeButtons.find((button) => button.dataset.thirdCodeCase === requestedDiff)
      || codeButtons[0];
    selectButton(implementationButtons, implementationButton);
    selectButton(tripButtons, tripButton);
    selectButton(codeButtons, codeButton);

    implementationButtons.forEach((button) => {
      button.addEventListener("click", () => {
        implementation = button.dataset.thirdImplementation;
        selectButton(implementationButtons, button);
        updateThirdRuntime();
      });
    });
    tripButtons.forEach((button) => {
      button.addEventListener("click", () => {
        trip = Number(button.dataset.thirdTrip);
        selectButton(tripButtons, button);
        updateThirdRuntime();
      });
    });
    codeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectButton(codeButtons, button);
        updateCodeCase(button.dataset.thirdCodeCase);
      });
    });
    goalInput.addEventListener("input", updateThirdRuntime);
    updateThirdRuntime();
    updateCodeCase(codeButton.dataset.thirdCodeCase);
  }

  const returnMap = document.querySelector("[data-return-map]");
  if (returnMap) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const ARENA_CM = 404;
    const ORIGIN = 48;
    const SOUTH_LANE_Y = 23;
    const SOUTH_HUG_X = 160;
    const SOUTH_DOGLEG_Y = 60;
    const SOUTH_TURN_MIN_X = 75;
    const FRAME_LEAD = 74;
    const SECOND_GOAL = { x: 17, y: 15 };
    const SOUTH_GOAL = { x: 17, y: 17 };
    const COL_MAX = 325;
    const descentByRegularColumn = [75, 75, 125, 175, 225, 275, 325];
    const descentByFrontRow = [75, 100, 150, 200, 250, 300, 325];
    const PHASES = [
      { name: "Seq6r", heading: 90, chan: 125.6, axis: "x", pair: [1, 2], stations: ["C1", "C2", "C3", "C4", "C5", "C6"], entry: { x: 17, y: 125.6 }, exit: { x: 278.8, y: 125.6 } },
      { name: "Seq5r", heading: 0, chan: 278.8, axis: "y", pair: [5, 6], stations: ["R3", "R4"], entry: { x: 278.8, y: 125.6 }, exit: { x: 278.8, y: 227.4 } },
      { name: "Seq4r", heading: -90, chan: 227.4, axis: "x", pair: [3, 4], stations: ["C4", "C3", "C2", "C1"], entry: { x: 278.8, y: 227.4 }, exit: { x: 74.95, y: 227.4 } },
      { name: "Seq3r", heading: 0, chan: 74.95, axis: "y", pair: [1, 2], stations: ["R5", "R6"], entry: { x: 74.95, y: 227.4 }, exit: { x: 74.95, y: 329.8 } },
      { name: "Seq2r", heading: 90, chan: 329.8, axis: "x", pair: [5, 6], stations: ["C3", "C4", "C5", "C6", "C7"], entry: { x: 74.95, y: 329.8 }, exit: { x: 377, y: 329.8 } }
    ];
    const SECOND_SPINE = [SECOND_GOAL, PHASES[0].entry, ...PHASES.map((phase) => phase.exit)];
    const SEARCH_TURNS = [
      { point: PHASES[0].entry, delta: -90, label: "Seq6r entry" },
      { point: PHASES[0].exit, delta: -90, label: "Seq6r→Seq5r" },
      { point: PHASES[1].exit, delta: -90, label: "Seq5r→Seq4r" },
      { point: PHASES[2].exit, delta: 90, label: "Seq4r→Seq3r" },
      { point: PHASES[3].exit, delta: 90, label: "Seq3r→Seq2r" }
    ];
    const TERMINAL_EXIT_HEADINGS = {
      R2C6: 0,
      R4C5: -90,
      R4C1: 0,
      R6C2: 90
    };
    const STATION_ORDER = PHASES.flatMap((phase, phaseIndex) =>
      phase.stations.map((station) => ({
        phase: { ...phase, index: phaseIndex },
        phaseIndex,
        station,
        cells: stationCells(phase, station)
      }))
    );

    const grid = document.getElementById("return-cell-grid");
    const svg = document.getElementById("return-arena-svg");
    const selectedOutput = document.getElementById("return-selected-cell");
    const cellName = document.getElementById("return-map-cell-name");
    const startCoord = document.getElementById("return-start-coord");
    const phaseLabel = document.getElementById("return-phase-label");
    const phaseOutput = document.getElementById("return-phase-name");
    const laneLabel = document.getElementById("return-lane-label");
    const laneOutput = document.getElementById("return-descent-lane");
    const distanceLabel = document.getElementById("return-distance-label");
    const distanceOutput = document.getElementById("return-distance");
    const unresolvedOutput = document.getElementById("return-unresolved-count");
    const laneReason = document.getElementById("return-lane-reason");
    const returnSteps = document.getElementById("return-route-steps");
    const thirdSteps = document.getElementById("third-route-steps");
    const arenaDesc = document.getElementById("return-arena-desc");
    const modeInputs = Array.from(document.querySelectorAll("[data-exploration-mode]"));
    const statusLabel = document.getElementById("exploration-status-label");
    const statusText = document.getElementById("exploration-status-text");
    const mapHeading = document.getElementById("exploration-map-heading");
    const legendActiveLine = document.getElementById("legend-active-line");
    const legendActiveText = document.getElementById("legend-active-text");
    const legendSecondaryLine = document.getElementById("legend-secondary-line");
    const legendSecondaryText = document.getElementById("legend-secondary-text");
    const legendTertiary = document.getElementById("legend-tertiary");
    const primaryBadge = document.getElementById("route-primary-badge");
    const primaryKicker = document.getElementById("route-primary-kicker");
    const primaryTitle = document.getElementById("route-primary-title");
    const secondaryBadge = document.getElementById("route-secondary-badge");
    const secondaryKicker = document.getElementById("route-secondary-kicker");
    const secondaryTitle = document.getElementById("route-secondary-title");
    const noteTitle = document.getElementById("route-note-title");
    const modeNote = document.getElementById("route-mode-note");
    const cellToolButtons = Array.from(document.querySelectorAll("[data-cell-tool]"));
    const cellOverrides = new Map();
    let selected = { row: 6, col: 1 };
    let explorationMode = "second";
    let cellTool = "end";
    const routeParams = new URLSearchParams(window.location.search);
    const requestedMode = routeParams.get("exploration");
    if (requestedMode === "second" || requestedMode === "third") {
      explorationMode = requestedMode;
      modeInputs.forEach((input) => { input.checked = input.value === explorationMode; });
    }
    const requestedCell = /^R([1-6])C([1-7])$/i.exec(routeParams.get("cell") || "");
    if (requestedCell) {
      const row = Number(requestedCell[1]);
      const col = Number(requestedCell[2]);
      if (!(col === 7 && row <= 4)) selected = { row, col };
    }
    ["resolved", "missed", "unknown"].forEach((status) => {
      const requested = (routeParams.get(status) || "").split(",").filter(Boolean);
      requested.forEach((value) => {
        const match = /^R([1-6])C([1-7])$/i.exec(value);
        if (!match) return;
        const row = Number(match[1]);
        const col = Number(match[2]);
        if (col === 7 && row <= 4) return;
        cellOverrides.set(cellKey(row, col), status);
      });
    });

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
      let index = -1;
      if (row <= 2 && col <= 6) index = 0;
      else if ((row === 3 || row === 4) && col >= 5 && col <= 6) index = 1;
      else if ((row === 3 || row === 4) && col <= 4) index = 2;
      else if (row >= 5 && col <= 2) index = 3;
      else if (row >= 5 && col >= 3) index = 4;
      if (index >= 0) return { ...PHASES[index], index, status: "active" };
      return { name: "Seq1r", heading: 180, index: 5, status: "currently off" };
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

    function lanePoint(route) {
      return route.phase.axis === "x"
        ? { x: route.start.x, y: route.phase.chan }
        : { x: route.phase.chan, y: route.start.y };
    }

    function searchPrefixFor(route) {
      const points = [SECOND_GOAL, PHASES[0].entry];
      for (let index = 0; index < route.phase.index; index += 1) {
        points.push(PHASES[index].exit);
      }
      points.push(lanePoint(route), route.start);
      return compactPoints(points);
    }

    function isTerminalStation(route) {
      return (
        (route.phase.name === "Seq6r" && route.col === 6) ||
        (route.phase.name === "Seq5r" && route.row === 4) ||
        (route.phase.name === "Seq4r" && route.col === 1) ||
        (route.phase.name === "Seq3r" && route.row === 6) ||
        (route.phase.name === "Seq2r" && route.col === 7)
      );
    }

    function stationFor(route) {
      return route.phase.axis === "x" ? `C${route.col}` : `R${route.row}`;
    }

    function cellKey(row, col) {
      return `R${row}C${col}`;
    }

    function stationCells(phase, station) {
      const stationNumber = Number(station.slice(1));
      return phase.axis === "x"
        ? phase.pair.map((row) => ({ row, col: stationNumber }))
        : phase.pair.map((col) => ({ row: stationNumber, col }));
    }

    function endStationIndex(route) {
      const station = stationFor(route);
      return STATION_ORDER.findIndex((item) =>
        item.phase.name === route.phase.name && item.station === station
      );
    }

    function cellStatusesFor(route) {
      const statuses = new Map();
      const endIndex = endStationIndex(route);
      const selectedKey = cellKey(route.row, route.col);
      STATION_ORDER.forEach((item, stationIndex) => {
        item.cells.forEach((cell) => {
          const key = cellKey(cell.row, cell.col);
          let status = stationIndex < endIndex ? "resolved" : "unknown";
          if (stationIndex === endIndex && key === selectedKey) status = "resolved";
          if (cellOverrides.has(key)) status = cellOverrides.get(key);
          statuses.set(key, status);
        });
      });
      return statuses;
    }

    function firstUnresolvedFrontier(route, statuses) {
      const endIndex = endStationIndex(route);
      for (let stationIndex = 0; stationIndex < STATION_ORDER.length; stationIndex += 1) {
        const item = STATION_ORDER[stationIndex];
        const unresolvedCells = item.cells.filter((cell) =>
          statuses.get(cellKey(cell.row, cell.col)) !== "resolved"
        );
        if (unresolvedCells.length) {
          return {
            ...item,
            stationIndex,
            unresolvedCells,
            source: stationIndex < endIndex
              ? "earlier-miss"
              : stationIndex === endIndex ? "same-station" : "later-unresolved"
          };
        }
      }
      return null;
    }

    function leadEntryFor(frontier) {
      const stationNumber = Number(frontier.station.slice(1));
      const objectAlong = frontier.phase.axis === "x"
        ? stationNumber * 50
        : 50 + stationNumber * 50;
      const alongDirection = frontier.phase.heading === -90 ? -1 : 1;
      const rawAlong = objectAlong - alongDirection * FRAME_LEAD;
      if (frontier.phase.axis === "x") {
        return {
          x: Math.max(17, Math.min(377, rawAlong)),
          y: frontier.phase.chan
        };
      }
      return {
        x: frontier.phase.chan,
        y: Math.max(60, Math.min(377, rawAlong))
      };
    }

    function thirdTransitFor(frontier, entry) {
      const turnX = Math.min(COL_MAX, Math.max(SOUTH_TURN_MIN_X, entry.x));
      const reversePoints = compactPoints([
        SOUTH_GOAL,
        { x: turnX, y: SOUTH_LANE_Y }
      ]);
      const forwardPoints = [{ x: turnX, y: SOUTH_LANE_Y }];
      if (Math.abs(turnX - entry.x) > 0.1) {
        forwardPoints.push(
          { x: turnX, y: SOUTH_DOGLEG_Y },
          { x: entry.x, y: SOUTH_DOGLEG_Y }
        );
      }
      forwardPoints.push(entry);
      const framePoints = [entry, frontier.phase.exit];
      for (let index = frontier.phaseIndex + 1; index < PHASES.length; index += 1) {
        framePoints.push(PHASES[index].exit);
      }
      return {
        turnX,
        reversePoints,
        forwardPoints: compactPoints(forwardPoints),
        framePoints: compactPoints(framePoints)
      };
    }

    function pathDistance(points) {
      return points.slice(1).reduce((sum, point, index) => {
        const previous = points[index];
        return sum + Math.hypot(point.x - previous.x, point.y - previous.y);
      }, 0);
    }

    function routeFor(row, col) {
      const start = { x: col * 50, y: 50 + row * 50 };
      const descentX = descentColumn(row, col);
      const phase = phaseFor(row, col);
      const points = [start];
      if (Math.abs(start.x - descentX) > 6) points.push({ x: descentX, y: start.y });
      points.push({ x: descentX, y: SOUTH_LANE_Y });
      if (descentX > SOUTH_HUG_X) points.push({ x: SOUTH_HUG_X, y: SOUTH_LANE_Y });
      points.push(SOUTH_GOAL);
      const routePoints = compactPoints(points);
      const phaseContext = { row, col, start, phase };
      const terminalStation = isTerminalStation(phaseContext);
      const cellStatuses = cellStatusesFor(phaseContext);
      const unresolvedCells = STATION_ORDER.flatMap((item) =>
        item.cells
          .map((cell) => ({
            ...cell,
            key: cellKey(cell.row, cell.col),
            status: cellStatuses.get(cellKey(cell.row, cell.col)),
            phase: item.phase.name,
            station: item.station
          }))
          .filter((cell) => cell.status !== "resolved")
      );
      const frontier = firstUnresolvedFrontier(phaseContext, cellStatuses);
      const frontierEntry = frontier ? leadEntryFor(frontier) : null;
      const thirdTransit = frontier ? thirdTransitFor(frontier, frontierEntry) : null;
      return {
        row, col, start, descentX, phase, points: routePoints,
        searchPrefix: searchPrefixFor(phaseContext),
        terminalStation,
        nextPhase: PHASES[phase.index + 1] || null,
        initialTurn: initialTurn(phase.heading),
        distance: pathDistance(routePoints),
        cellStatuses,
        unresolvedCells,
        frontier,
        frontierEntry,
        thirdReversePoints: thirdTransit ? thirdTransit.reversePoints : [SOUTH_GOAL],
        thirdForwardPoints: thirdTransit ? thirdTransit.forwardPoints : [],
        frameResumePoints: thirdTransit ? thirdTransit.framePoints : [],
        thirdTurnX: thirdTransit ? thirdTransit.turnX : null,
        thirdDistance: thirdTransit
          ? pathDistance(thirdTransit.reversePoints) + pathDistance(thirdTransit.forwardPoints)
          : 0
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

    function shortTurn(delta) {
      if (!delta) return "0°";
      return `${delta > 0 ? "+" : "−"}${Math.abs(delta)}°`;
    }

    function drawTurn(group, point, lines, edge = "middle") {
      const x = mapX(point.x);
      const y = mapY(point.y);
      group.appendChild(svgNode("circle", { cx: x, cy: y, r: "8", class: "turn-point" }));
      group.appendChild(svgNode("path", {
        d: `M ${x - 4} ${y + 1} A 6 6 0 1 1 ${x + 3} ${y - 4}`,
        class: "turn-arc"
      }));
      const width = 132;
      const labelX = edge === "right" ? x - width - 12 : x + 12;
      const labelY = Math.max(55, y - 33);
      const height = 7 + lines.length * 12;
      group.appendChild(svgNode("rect", {
        x: labelX, y: labelY, width, height, rx: "6", class: "turn-label-bg"
      }));
      lines.forEach((line, index) => {
        group.appendChild(svgNode("text", {
          x: labelX + 7, y: labelY + 12 + index * 12, class: "turn-label"
        }, line));
      });
    }

    function drawCompactTurn(group, turn, inverse = false) {
      const delta = inverse ? -turn.delta : turn.delta;
      const x = mapX(turn.point.x);
      const y = mapY(turn.point.y);
      group.appendChild(svgNode("circle", { cx: x, cy: y, r: "5", class: "turn-point" }));
      group.appendChild(svgNode("text", {
        x: x + 8, y: y - 8, class: "compact-turn-label"
      }, shortTurn(delta)));
    }

    function drawPath(group, points, className, markerId, underClass = "") {
      for (let index = 1; index < points.length; index += 1) {
        if (underClass) drawSegment(group, points[index - 1], points[index], underClass);
        drawSegment(group, points[index - 1], points[index], className, markerId);
      }
    }

    function drawPhaseLabels(group) {
      const positions = [
        { x: 158, y: 125.6, name: "Seq6r" },
        { x: 278.8, y: 177, name: "Seq5r" },
        { x: 176, y: 227.4, name: "Seq4r" },
        { x: 74.95, y: 278, name: "Seq3r" },
        { x: 226, y: 329.8, name: "Seq2r" }
      ];
      positions.forEach((phase) => {
        const x = mapX(phase.x) - 22;
        const y = mapY(phase.y) - 19;
        group.appendChild(svgNode("rect", {
          x, y, width: "44", height: "16", rx: "5", class: "phase-label-bg"
        }));
        group.appendChild(svgNode("text", {
          x: x + 22, y: y + 11, "text-anchor": "middle", class: "phase-label"
        }, phase.name));
      });
    }

    function drawArena(route) {
      svg.replaceChildren();
      const defs = svgNode("defs");
      addMarker(defs, "arrow-second", "#164f5a");
      addMarker(defs, "arrow-return", "#08747a");
      addMarker(defs, "arrow-third", "#d65b45");
      addMarker(defs, "arrow-forward", "#244f70");
      addMarker(defs, "arrow-resume", "#7b5a9b");
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
          const unavailable = col === 7 && row <= 4;
          const status = route.cellStatuses.get(cellKey(row, col));
          svg.appendChild(svgNode("circle", {
            cx: mapX(col * 50), cy: mapY(y), r: "7",
            class: [
              "arena-object-dot",
              status ? `is-${status}` : "",
              row === route.row && col === route.col ? "is-selected" : "",
              unavailable ? "is-unavailable" : ""
            ].filter(Boolean).join(" ")
          }));
        }
      }

      const backbone = svgNode("g", { class: "route-backbone-layer" });
      drawPath(backbone, SECOND_SPINE, "route-backbone", "");
      SECOND_SPINE.slice(1, -1).forEach((point) => {
        backbone.appendChild(svgNode("circle", {
          cx: mapX(point.x), cy: mapY(point.y), r: "4", class: "phase-node"
        }));
      });
      drawPhaseLabels(backbone);
      svg.appendChild(backbone);

      svg.appendChild(svgNode("line", {
        x1: mapX(route.descentX), y1: mapY(route.start.y), x2: mapX(route.descentX),
        y2: mapY(SOUTH_LANE_Y), class: "arena-lane-guide"
      }));
      if (explorationMode === "second") {
        svg.appendChild(svgNode("line", {
          x1: mapX(SOUTH_HUG_X), y1: mapY(7), x2: mapX(SOUTH_HUG_X),
          y2: mapY(40), class: "hug-trigger"
        }));
        svg.appendChild(svgNode("text", {
          x: mapX(SOUTH_HUG_X) + 5, y: mapY(38), class: "hug-label"
        }, "inline hug x=160"));
      }

      const annotationGroup = svgNode("g", { class: "route-annotations" });
      const bottomTurn = { x: route.descentX, y: SOUTH_LANE_Y };
      const selectedCellKey = `R${route.row}C${route.col}`;
      const collapseHeading = TERMINAL_EXIT_HEADINGS[selectedCellKey];
      if (explorationMode === "second") {
        const searchGroup = svgNode("g", { class: "route-layer route-layer--second" });
        drawPath(searchGroup, route.searchPrefix, "route-second", "arrow-second", "route-second-under");
        svg.appendChild(searchGroup);

        const returnGroup = svgNode("g", { class: "route-layer route-layer--return" });
        drawPath(returnGroup, route.points, "route-return", "arrow-return", "route-return-under");
        svg.appendChild(returnGroup);

        SEARCH_TURNS.slice(0, route.phase.index + 1).forEach((turn) => {
          drawCompactTurn(annotationGroup, turn);
        });
        const returnLines = [`RETURN ${shortTurn(route.initialTurn)} → south`];
        if (collapseHeading !== undefined) {
          returnLines.push(`collapse ${shortTurn(initialTurn(collapseHeading))}`);
        }
        drawTurn(annotationGroup, route.start, returnLines,
          route.start.x > 285 ? "right" : "middle");
        drawTurn(annotationGroup, bottomTurn, ["RETURN +90° → west"],
          route.descentX > 285 ? "right" : "middle");
      } else if (route.frontier) {
        const departGroup = svgNode("g", { class: "route-layer route-layer--third" });
        drawPath(departGroup, route.thirdReversePoints, "route-third", "arrow-third");
        svg.appendChild(departGroup);

        const forwardGroup = svgNode("g", { class: "route-layer route-layer--forward" });
        drawPath(forwardGroup, route.thirdForwardPoints, "route-forward", "arrow-forward");
        svg.appendChild(forwardGroup);

        const resumeGroup = svgNode("g", { class: "route-layer route-layer--resume" });
        drawPath(resumeGroup, route.frameResumePoints, "route-resume", "arrow-resume");
        svg.appendChild(resumeGroup);

        const southTurn = { x: route.thirdTurnX, y: SOUTH_LANE_Y };
        drawTurn(annotationGroup, southTurn, ["+90° → north", "이후 전 구간 전진"],
          route.thirdTurnX > 285 ? "right" : "middle");
        if (Math.abs(route.thirdTurnX - route.frontierEntry.x) > 0.1) {
          const doglegTurn = route.frontierEntry.x > route.thirdTurnX ? 90 : -90;
          drawCompactTurn(annotationGroup, {
            point: { x: route.thirdTurnX, y: SOUTH_DOGLEG_Y },
            delta: doglegTurn
          });
          drawCompactTurn(annotationGroup, {
            point: { x: route.frontierEntry.x, y: SOUTH_DOGLEG_Y },
            delta: -doglegTurn
          });
        }
        const entryTurn = wrap180(route.frontier.phase.heading);
        drawTurn(annotationGroup, route.frontierEntry, [
          `${route.frontier.phase.name} ${route.frontier.station}`,
          `${shortTurn(entryTurn)} → frame_engine`
        ], route.frontierEntry.x > 285 ? "right" : "middle");
        SEARCH_TURNS.slice(route.frontier.phaseIndex + 1).forEach((turn) => {
          drawCompactTurn(annotationGroup, turn);
        });
        annotationGroup.appendChild(svgNode("circle", {
          cx: mapX(route.frontierEntry.x), cy: mapY(route.frontierEntry.y),
          r: "9", class: "frontier-marker"
        }));
      }

      if (explorationMode === "second") {
        annotationGroup.appendChild(svgNode("circle", {
          cx: mapX(route.start.x), cy: mapY(route.start.y), r: "9", class: "start-marker"
        }));
      }
      annotationGroup.appendChild(svgNode("rect", {
        x: mapX(SOUTH_GOAL.x) - 9, y: mapY(SOUTH_GOAL.y) - 9, width: "18", height: "18", rx: "3", class: "goal-marker"
      }));
      const goalLabelX = mapX(SOUTH_GOAL.x) + 14;
      const goalLabelY = mapY(SOUTH_GOAL.y) - 9;
      annotationGroup.appendChild(svgNode("rect", {
        x: goalLabelX, y: goalLabelY, width: "72", height: "20", rx: "5", class: "marker-label-bg"
      }));
      annotationGroup.appendChild(svgNode("text", {
        x: goalLabelX + 7, y: goalLabelY + 14, class: "marker-label"
      }, "GOAL 17,17"));
      svg.appendChild(annotationGroup);
    }

    function stepItem(title, detail) {
      return `<li><strong>${title}</strong><small>${detail}</small></li>`;
    }

    function terminalBranchText(route, inverse = false) {
      const heading = TERMINAL_EXIT_HEADINGS[`R${route.row}C${route.col}`];
      if (heading === undefined) return "";
      const delta = inverse ? -initialTurn(heading) : initialTurn(heading);
      return ` Terminal exit-collapse가 걸린 eat이면 ${turnLabel(delta)} 분기를 사용합니다.`;
    }

    function phaseStep(phase, selectedPhase, selectedText = "", stateText = "") {
      const direction = phase.heading === 90 ? "동쪽(+x)" : phase.heading === -90 ? "서쪽(−x)" : "북쪽(+y)";
      const ownership = {
        Seq6r: "R1/R2 · C1→C6",
        Seq5r: "C5/C6 · R3→R4",
        Seq4r: "R3/R4 · C4→C1",
        Seq3r: "C1/C2 · R5→R6",
        Seq2r: "R5/R6 · C3→C7"
      }[phase.name];
      return stepItem(
        `${phase.name} · ${direction}${selectedPhase && phase.name === selectedPhase.name ? ` · ${selectedText}` : ""}`,
        `${ownership} · channel ${phase.chan} · hold h${phase.heading >= 0 ? "+" : ""}${phase.heading}°${stateText ? ` · ${stateText}` : ""}`
      );
    }

    function updateSteps(route) {
      const toColumn = Math.abs(route.start.x - route.descentX) > 6;
      const initialTitle = route.initialTurn
        ? `${turnLabel(route.initialTurn)} → mouth south`
        : "mouth south 유지 · 초기 회전 없음";
      const hugText = route.descentX > SOUTH_HUG_X
        ? `x=${SOUTH_HUG_X}을 통과할 때 hold y를 ${SOUTH_LANE_Y}→${SOUTH_GOAL.y}로 전환하며 멈추지 않음`
        : `이미 x<${SOUTH_HUG_X}이므로 west leg 시작부터 hold y=${SOUTH_GOAL.y}`;

      if (explorationMode === "second") {
        returnSteps.innerHTML = [
          stepItem("goal에서 후진 북상 → Seq6r entry", `(${SECOND_GOAL.x},${SECOND_GOAL.y}) mouth south 유지 · y=${PHASES[0].chan}까지 deposit reverse`),
          stepItem("좌회전(CCW) −90° → mouth east", "Seq6r 진입 회전"),
          ...PHASES.map((phase, index) => {
            if (index < route.phase.index) {
              return phaseStep(phase, null, "", "선택 시나리오에서 실행 완료");
            }
            if (index === route.phase.index) {
              return phaseStep(phase, route.phase, "선택 셀에서 복귀", "여기서 collector trigger");
            }
            return phaseStep(phase, null, "", "회색 spine만 표시 · 이 시나리오에서는 미주행");
          }),
          stepItem(`R${route.row}C${route.col}에서 복귀 trigger`, `마지막 eat 직후 live pose를 읽어 VIA_SOUTH 경로를 다시 계획`)
        ].join("");
        thirdSteps.innerHTML = [
          stepItem(initialTitle, `${route.phase.name} 일반 heading 기준.${terminalBranchText(route)}`),
          ...(toColumn ? [stepItem(`Lateral strafe → x=${route.descentX}`, `y=${route.start.y}를 유지하며 안전 하강 통로로 정렬`)] : []),
          stepItem(`남쪽 전진 → (${route.descentX}, ${SOUTH_LANE_Y})`, `mouth south · descend-to-south · x=${route.descentX} hold`),
          stepItem("우회전(CW) +90° → mouth west", "south wall 도착 후 goal 방향으로 전환"),
          stepItem(`서쪽 전진 → goal (${SOUTH_GOAL.x}, ${SOUTH_GOAL.y})`, `run-west-to-goal · ${hugText}`)
        ].join("");
      } else {
        if (!route.frontier) {
          returnSteps.innerHTML = [
            stepItem("미처리 셀 없음", "target 미수거와 판정 미확정·미보존 셀이 모두 0개이므로 3차 출발 경로를 만들지 않음"),
            stepItem("goal에서 대기", "2차 ledger가 전체 resolved이면 south goal pose를 유지")
          ].join("");
          thirdSteps.innerHTML = [
            stepItem("frame_engine 재개 불필요", "남은 station이 없으므로 세 번째 탐색을 시작하지 않음")
          ].join("");
          return;
        }
        const frontierLabel = `${route.frontier.phase.name} ${route.frontier.station}`;
        const dogleg = Math.abs(route.thirdTurnX - route.frontierEntry.x) > 0.1;
        const doglegEast = route.frontierEntry.x > route.thirdTurnX;
        const entryTurn = wrap180(route.frontier.phase.heading);
        const frontierCells = route.frontier.unresolvedCells
          .map((cell) => cellKey(cell.row, cell.col))
          .join(", ");
        const frontierReason = {
          "earlier-miss": `종료 station보다 앞에서 남은 ${frontierCells} 때문에 이전 phase/station으로 돌아감`,
          "same-station": `종료 station의 companion 또는 종료 셀 자체가 미처리라 같은 station부터 다시 확인`,
          "later-unresolved": `종료 station까지 모두 resolved이고 다음 미처리 셀이 ${frontierCells}에서 시작`
        }[route.frontier.source];
        returnSteps.innerHTML = [
          stepItem(
            `goal에서 south wall을 후진 east → x=${route.thirdTurnX}`,
            `mouth west 유지 · (${SOUTH_GOAL.x},${SOUTH_GOAL.y}) → (${route.thirdTurnX},${SOUTH_LANE_Y}) 단일 eastbound leg · y=${SOUTH_GOAL.y}→${SOUTH_LANE_Y} inline 보정`
          ),
          stepItem("우회전(CW) +90° → mouth north", "남쪽 벽의 안전 회전점에서 방향 전환 · 이 지점부터 모든 이동은 전진"),
          ...(dogleg
            ? [
                stepItem(
                  `전진 dogleg → x=${route.frontierEntry.x}`,
                  `north to y=${SOUTH_DOGLEG_Y} → ${doglegEast ? "우회전 +90° east" : "좌회전 −90° west"} → x=${route.frontierEntry.x} → ${doglegEast ? "좌회전 −90°" : "우회전 +90°"} north`
                )
              ]
            : []),
          stepItem(
            `전진 북상 → ${frontierLabel} lead-entry`,
            `(${route.frontierEntry.x},${route.frontierEntry.y}) · object 기준 CH_LEAD=${FRAME_LEAD}cm · station 판정 window 중앙`
          ),
          stepItem(
            entryTurn ? `${turnLabel(entryTurn)} → ${route.frontier.phase.name} heading` : "mouth north 유지 · entry 회전 없음",
            `fresh live pose와 ledger를 넘기고 frame_engine을 ${route.frontier.station}부터 시작`
          )
        ].join("");
        thirdSteps.innerHTML = [
          stepItem(
            `전체 ledger에서 첫 미처리 station 선택`,
            `${route.unresolvedCells.length}개 미처리 중 ${frontierLabel}이 가장 먼저 등장 · ${frontierReason}`
          ),
          stepItem(
            `${frontierLabel}에서 공용 판정 재개`,
            `${frontierCells} 처리부터 시작 · target 미수거와 판정 미확정·미보존을 모두 unresolved로 취급`
          ),
          phaseStep(route.frontier.phase, route.frontier.phase, `${route.frontier.station}부터`, "이후 남은 station과 phase를 동일 상태기로 처리"),
          ...PHASES.slice(route.frontier.phaseIndex + 1).map((phase) => phaseStep(phase, null)),
          stepItem(
            "새 target 1개 획득 → west-first return",
            "제안 계약: live eat pose에서 서쪽 안전 통로로 먼저 빠진 뒤 south lane으로 내려가 goal 복귀 · 새 target 위치가 정해져야 실제 선분을 계산"
          )
        ].join("");
      }
    }

    function update(route) {
      const label = `R${route.row}C${route.col}`;
      selectedOutput.textContent = label;
      cellName.textContent = label;
      startCoord.textContent = `(${route.start.x}, ${route.start.y})`;
      const missedCount = route.unresolvedCells.filter((cell) => cell.status === "missed").length;
      const unknownCount = route.unresolvedCells.filter((cell) => cell.status === "unknown").length;
      unresolvedOutput.textContent = `${route.unresolvedCells.length} · target ${missedCount} / 미보존 ${unknownCount}`;
      if (explorationMode === "second") {
        phaseLabel.textContent = "현재 phase";
        phaseOutput.textContent = `${route.phase.name} · h${route.phase.heading >= 0 ? "+" : ""}${route.phase.heading}°`;
        laneLabel.textContent = "하강 통로";
        laneOutput.textContent = `x = ${route.descentX}`;
        distanceLabel.textContent = "복귀 거리";
        distanceOutput.textContent = `약 ${Math.round(route.distance)} cm`;
        laneReason.textContent = laneExplanation(route);
        mapHeading.replaceChildren(
          document.createTextNode("2차 탐색 · "),
          cellName,
          document.createTextNode("에서 south 복귀")
        );
        const actualPhases = PHASES.slice(0, route.phase.index + 1)
          .map((phase) => phase.name)
          .join(" → ");
        statusLabel.textContent = "CURRENT CODE";
        statusText.innerHTML = `<code>2차</code>: goal(${SECOND_GOAL.x},${SECOND_GOAL.y}) → ${actualPhases}의 ${label} → south goal(${SOUTH_GOAL.x},${SOUTH_GOAL.y}) · 회색선은 Seq6r→Seq2r 전체 계획`;
        returnMap.querySelector(".return-map-status").classList.remove("is-proposed");
        legendActiveLine.className = "legend-line legend-line--second";
        legendActiveText.textContent = "2차 진행";
        legendSecondaryLine.className = "legend-line legend-line--return";
        legendSecondaryText.textContent = "goal 복귀";
        legendTertiary.hidden = true;
        primaryBadge.className = "route-badge route-badge--second";
        primaryBadge.textContent = "2ND";
        primaryKicker.textContent = "GOAL → SELECTED CELL";
        primaryTitle.textContent = "2차 탐색 전체 진행";
        secondaryBadge.className = "route-badge route-badge--return";
        secondaryBadge.textContent = "RETURN";
        secondaryKicker.textContent = "SELECTED CELL → GOAL";
        secondaryTitle.textContent = "south 복귀와 회전";
        noteTitle.textContent = "2차 전체 경로";
        modeNote.innerHTML = `회색 phase spine은 <code>Seq6r→Seq2r</code> 전체 경로, 굵은 남색은 ${label}까지 실제 진행한 prefix입니다. 현재 상태표에는 target 확인·미수거 ${missedCount}개와 판정 미확정·미보존 ${unknownCount}개가 남아 있으며 둘 다 3차 미처리 영역으로 전달됩니다.`;
        arenaDesc.textContent = `goal에서 ${label}까지 이어지는 두 번째 탐색과 south 복귀 경로, 그리고 처리 완료·target 미수거·판정 미확정 또는 미보존 셀 상태입니다.`;
      } else {
        statusLabel.textContent = "PROPOSED · NOT IN JETSON YET";
        returnMap.querySelector(".return-map-status").classList.add("is-proposed");
        if (!route.frontier) {
          phaseLabel.textContent = "재개 frontier";
          phaseOutput.textContent = "없음 · 전체 resolved";
          laneLabel.textContent = "lead-entry";
          laneOutput.textContent = "출발 안 함";
          distanceLabel.textContent = "합류 이동";
          distanceOutput.textContent = "0 cm";
          laneReason.textContent = "target 미수거와 판정 미확정·미보존 셀이 없습니다. 3차 탐색을 시작하지 않고 goal에서 종료합니다.";
          mapHeading.replaceChildren(document.createTextNode("3차 탐색 · 미처리 영역 없음"));
          statusText.innerHTML = "<code>3차</code>: 전체 2차 ledger가 resolved이므로 출발 경로와 frame_engine 재개가 필요하지 않음";
          legendActiveLine.className = "legend-line legend-line--third";
          legendActiveText.textContent = "출발 없음";
          legendSecondaryLine.className = "legend-line legend-line--forward";
          legendSecondaryText.textContent = "frontier 없음";
          legendTertiary.hidden = true;
          primaryBadge.className = "route-badge route-badge--third";
          primaryBadge.textContent = "DONE";
          primaryKicker.textContent = "NO UNRESOLVED CELL";
          primaryTitle.textContent = "3차 탐색 불필요";
          secondaryBadge.className = "route-badge route-badge--resume";
          secondaryBadge.textContent = "STOP";
          secondaryKicker.textContent = "LEDGER COMPLETE";
          secondaryTitle.textContent = "goal에서 종료";
          noteTitle.textContent = "출발 조건";
          modeNote.innerHTML = "3차 탐색은 <code>target 확인·미수거</code> 또는 <code>판정 미확정·미보존</code> 셀이 하나 이상 있을 때만 시작합니다. 현재는 모든 셀이 처리 완료입니다. Jetson에는 반영하지 않았습니다.";
          arenaDesc.textContent = "모든 셀이 처리 완료되어 세 번째 탐색 출발 경로가 없는 상태입니다.";
        } else {
        const frontierLabel = `${route.frontier.phase.name} ${route.frontier.station}`;
        const frontierCells = route.frontier.unresolvedCells
          .map((cell) => cellKey(cell.row, cell.col))
          .join(", ");
        phaseLabel.textContent = "재개 frontier";
        phaseOutput.textContent = `${frontierLabel} · h${route.frontier.phase.heading >= 0 ? "+" : ""}${route.frontier.phase.heading}°`;
        laneLabel.textContent = "lead-entry";
        laneOutput.textContent = `(${route.frontierEntry.x}, ${route.frontierEntry.y})`;
        distanceLabel.textContent = "합류 이동";
        distanceOutput.textContent = `약 ${Math.round(route.thirdDistance)} cm`;
        const boundaryDogleg = Math.abs(route.thirdTurnX - route.frontierEntry.x) > 0.1;
        laneReason.textContent = boundaryDogleg
          ? `${frontierLabel}의 lead-entry x=${route.frontierEntry.x}가 west/east 회전 안전 범위 밖이라 x=${route.thirdTurnX}에서 회전한 뒤 boundary dogleg만 수행합니다.`
          : `${route.unresolvedCells.length}개 미처리 중 가장 이른 ${frontierLabel}을 선택하고, 회전 x=${route.thirdTurnX}를 lead-entry 열과 맞춰 ㄷ자 우회를 제거했습니다.`;
        mapHeading.replaceChildren(
          document.createTextNode(`3차 탐색 · ${frontierLabel} lead-entry로 전진 합류`)
        );
        statusText.innerHTML = `<code>3차</code>: south goal에서 벽을 따라 후진 east → x=${route.thirdTurnX}에서 north 회전 → 전진으로 ${frontierLabel} lead-entry → <code>frame_engine</code> 재개`;
        legendActiveLine.className = "legend-line legend-line--third";
        legendActiveText.textContent = "south 후진";
        legendSecondaryLine.className = "legend-line legend-line--forward";
        legendSecondaryText.textContent = "frontier 전진";
        legendTertiary.hidden = false;
        primaryBadge.className = "route-badge route-badge--third";
        primaryBadge.textContent = "3RD";
        primaryKicker.textContent = "GOAL → FRONTIER LEAD-ENTRY";
        primaryTitle.textContent = "south 후진 뒤 전진 합류";
        secondaryBadge.className = "route-badge route-badge--resume";
        secondaryBadge.textContent = "RESUME";
        secondaryKicker.textContent = "FRONTIER → REMAINING ROUTE";
        secondaryTitle.textContent = "frame_engine 재개와 1개 수거";
        noteTitle.textContent = "놓침 없는 3차 hand-off";
        modeNote.innerHTML = `<code>target 확인·미수거</code>와 <code>판정 미확정·미보존</code>을 모두 unresolved로 합친 뒤, 전체 traversal order에서 가장 이른 <code>${frontierLabel}</code>을 선택합니다. 제안 경로가 구현되면 south wall 후진 종료 x를 lead-entry 열에 직접 맞춰 불필요한 ㄷ자 dogleg 없이 합류하고, ${frontierCells}부터 기존 <code>frame_engine</code> 상태기로 계속 진행합니다. 현재 Jetson 소스는 direct frontier가 아니라 <code>goto_first_lane()</code>으로 Seq6r entry부터 다시 시작합니다.`;
        arenaDesc.textContent = `미처리 셀 중 가장 이른 ${frontierCells}의 ${frontierLabel} lead-entry까지 전진하고, frame_engine으로 남은 탐색을 이어가는 세 번째 탐색 설계입니다.`;
        }
      }
      grid.querySelectorAll(".return-cell").forEach((button) => {
        const active = Number(button.dataset.row) === route.row && Number(button.dataset.col) === route.col;
        const key = cellKey(Number(button.dataset.row), Number(button.dataset.col));
        const status = route.cellStatuses.get(key);
        button.classList.toggle("is-active", active);
        ["resolved", "missed", "unknown"].forEach((name) => {
          button.classList.toggle(`is-${name}`, status === name);
        });
        button.dataset.status = status || "unavailable";
        button.setAttribute("aria-selected", String(active));
        if (!button.disabled) {
          const statusTextValue = {
            resolved: "처리 완료",
            missed: "target 확인·미수거",
            unknown: "판정 미확정·미보존"
          }[status];
          button.setAttribute(
            "aria-label",
            `${key} · ${statusTextValue}${active ? " · 두 번째 탐색 종료 위치" : ""}`
          );
        }
        button.tabIndex = active && !button.disabled ? 0 : -1;
      });
      modeInputs.forEach((input) => {
        input.parentElement.classList.toggle("is-active", input.checked);
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
        const unavailable = col === 7 && row <= 4;
        button.disabled = unavailable;
        button.classList.toggle("is-unavailable", unavailable);
        button.setAttribute("aria-label", unavailable
          ? `R${row}C${col} · Seq1r 비활성 위치`
          : `R${row}C${col} 종료 위치`);
        button.textContent = `${row},${col}`;
        button.addEventListener("click", () => {
          if (cellTool === "end") {
            selected = { row, col };
            cellOverrides.clear();
          } else {
            cellOverrides.set(cellKey(row, col), cellTool);
          }
          update(routeFor(selected.row, selected.col));
        });
        grid.appendChild(button);
      }
    }

    cellToolButtons.forEach((button) => {
      button.addEventListener("click", () => {
        cellTool = button.dataset.cellTool;
        cellToolButtons.forEach((item) => {
          item.classList.toggle("is-active", item === button);
          item.setAttribute("aria-pressed", String(item === button));
        });
      });
      button.setAttribute("aria-pressed", String(button.dataset.cellTool === cellTool));
    });

    modeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        explorationMode = input.value;
        update(routeFor(selected.row, selected.col));
      });
    });

    update(routeFor(selected.row, selected.col));
  }
})();
