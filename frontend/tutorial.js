(() => {
    "use strict";

    const copy = {
        en: {
            hintTitle: "New here?",
            hintText: "Take a 60-second guided tour.",
            hintStart: "Start tour",
            hintClose: "Dismiss",
            back: "Back",
            next: "Next",
            finish: "Done",
            close: "Close tutorial",
            steps: [
                {
                    selector: ".sidebar .io-card",
                    title: "Set the input and output",
                    text: "Choose the labels of the system input and output nodes. The defaults are R and Y."
                },
                {
                    selector: "#addNodeBtn",
                    title: "Add intermediate nodes",
                    text: "Use this button, or double-click an empty area of the canvas, to add a node."
                },
                {
                    selector: ".btn-example",
                    title: "Load a ready-made example",
                    text: "Use the example to see a complete feedback graph and understand the workflow immediately."
                },
                {
                    selector: "#propsCard",
                    title: "Edit nodes and branch gains",
                    text: "Select a node or branch to rename it, change its gain, or adjust the branch curve."
                },
                {
                    selector: "details.io-card",
                    title: "Fine-tune the drawing",
                    text: "Advanced settings control automatic curve strength, branch spacing, and crossing avoidance."
                },
                {
                    selector: "#solveBtn",
                    title: "Solve with Mason's Gain Formula",
                    text: "The solver validates the graph, finds paths and loops, calculates Δ and Δk, and displays the symbolic transfer function."
                }
            ]
        },
        ar: {
            hintTitle: "أول مرة تستخدم الموقع؟",
            hintText: "شاهد شرحًا تفاعليًا سريعًا في أقل من دقيقة.",
            hintStart: "ابدأ الشرح",
            hintClose: "إغلاق",
            back: "السابق",
            next: "التالي",
            finish: "تم",
            close: "إغلاق الشرح",
            steps: [
                {
                    selector: ".sidebar .io-card",
                    title: "حدد الإدخال والإخراج",
                    text: "اختر أسماء عقدة إدخال النظام وعقدة الإخراج. القيم الافتراضية هي R و Y."
                },
                {
                    selector: "#addNodeBtn",
                    title: "أضف العقد الوسيطة",
                    text: "استخدم هذا الزر، أو انقر مرتين على مساحة فارغة داخل الرسم، لإضافة عقدة."
                },
                {
                    selector: ".btn-example",
                    title: "حمّل مثالًا جاهزًا",
                    text: "المثال يعرض مخطط Feedback كاملًا لتفهم طريقة الاستخدام مباشرة."
                },
                {
                    selector: "#propsCard",
                    title: "عدّل العقد وقيم الكسب",
                    text: "حدد عقدة أو مسارًا لتغيير الاسم أو قيمة Gain أو شكل انحناء المسار."
                },
                {
                    selector: "details.io-card",
                    title: "اضبط شكل الرسم",
                    text: "الإعدادات المتقدمة تتحكم في شدة الانحناء والمسافات وتجنب تقاطع المسارات."
                },
                {
                    selector: "#solveBtn",
                    title: "حل المخطط بصيغة ماسون",
                    text: "يتحقق الموقع من المخطط ويحدد المسارات والحلقات ويحسب Δ و Δk ثم يعرض دالة التحويل رمزيًا."
                }
            ]
        }
    };

    let active = false;
    let stepIndex = 0;
    let currentTarget = null;

    const css = `
        .tour-first-hint {
            position: fixed;
            z-index: 19000;
            width: 260px;
            background: #ffffff;
            color: #0f172a;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px;
            box-shadow: 0 14px 42px rgba(15, 23, 42, .18);
        }
        .tour-first-hint::before {
            content: "";
            position: absolute;
            width: 10px;
            height: 10px;
            background: #fff;
            border-left: 1px solid #e2e8f0;
            border-top: 1px solid #e2e8f0;
            transform: rotate(45deg);
            top: -6px;
            left: 50%;
            margin-left: -5px;
        }
        .tour-first-hint strong { display: block; font-size: 14px; margin-bottom: 4px; }
        .tour-first-hint p { margin: 0; color: #64748b; font-size: 12px; line-height: 1.45; }
        .tour-hint-actions { display: flex; gap: 7px; margin-top: 11px; }
        .tour-hint-actions button {
            border: 0; border-radius: 7px; padding: 7px 10px;
            font-size: 11px; font-weight: 700; cursor: pointer;
        }
        .tour-hint-start { background: #2563eb; color: #fff; }
        .tour-hint-dismiss { background: #eef2f7; color: #475569; }

        .tour-layer {
            position: fixed;
            inset: 0;
            z-index: 20000;
            pointer-events: none;
        }
        .tour-spotlight {
            position: fixed;
            z-index: 20001;
            border: 2px solid #60a5fa;
            border-radius: 10px;
            box-shadow:
                0 0 0 9999px rgba(15, 23, 42, .48),
                0 0 0 5px rgba(96, 165, 250, .18);
            transition: left .18s ease, top .18s ease, width .18s ease, height .18s ease;
            pointer-events: none;
        }
        .tour-card {
            position: fixed;
            top: 22px;
            right: 22px;
            z-index: 20002;
            width: min(360px, calc(100vw - 44px));
            background: #fff;
            color: #0f172a;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            box-shadow: 0 18px 55px rgba(15, 23, 42, .24);
            padding: 17px 18px 16px;
            pointer-events: auto;
        }
        html[dir="rtl"] .tour-card { right: auto; left: 22px; }
        .tour-card-head {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .tour-count { color: #64748b; font-size: 11px; font-weight: 750; white-space: nowrap; }
        .tour-progress-track {
            flex: 1;
            height: 5px;
            border-radius: 999px;
            background: #e2e8f0;
            overflow: hidden;
        }
        .tour-progress-fill {
            height: 100%;
            width: 0;
            background: #2563eb;
            border-radius: inherit;
            transition: width .2s ease;
        }
        .tour-x {
            width: 28px; height: 28px; border: 0; border-radius: 7px;
            background: #f1f5f9; color: #475569; cursor: pointer;
            font-size: 17px; line-height: 1;
        }
        .tour-card h3 { margin: 14px 0 7px; font-size: 18px; letter-spacing: -.2px; }
        .tour-card p { margin: 0; color: #64748b; font-size: 13px; line-height: 1.55; }
        .tour-card-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
        .tour-btn {
            border: 0; border-radius: 8px; padding: 8px 13px;
            cursor: pointer; font-size: 12px; font-weight: 750;
        }
        .tour-btn.secondary { background: #eef2f7; color: #475569; }
        .tour-btn.primary { background: #2563eb; color: #fff; }

        @media (max-width: 720px) {
            .tour-card {
                top: auto !important;
                right: 12px !important;
                left: 12px !important;
                bottom: 12px;
                width: auto;
            }
            .tour-first-hint { width: 235px; }
        }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    function lang() {
        return document.documentElement.lang === "ar" ? "ar" : "en";
    }

    function t() { return copy[lang()]; }

    function seen() {
        try { return localStorage.getItem("sfgTutorialHintSeen") === "1"; }
        catch (_) { return false; }
    }

    function markHintSeen() {
        try { localStorage.setItem("sfgTutorialHintSeen", "1"); }
        catch (_) {}
    }

    function removeHint() {
        document.querySelector(".tour-first-hint")?.remove();
    }

    function showFirstHint() {
        if (seen() || document.querySelector(".tour-first-hint")) return;
        const btn = document.getElementById("tutorialBtn");
        if (!btn) return;

        const c = t();
        const hint = document.createElement("div");
        hint.className = "tour-first-hint";
        hint.dir = lang() === "ar" ? "rtl" : "ltr";
        hint.innerHTML = `
            <strong>${c.hintTitle}</strong>
            <p>${c.hintText}</p>
            <div class="tour-hint-actions">
                <button class="tour-hint-start">${c.hintStart}</button>
                <button class="tour-hint-dismiss">${c.hintClose}</button>
            </div>
        `;
        document.body.appendChild(hint);

        const r = btn.getBoundingClientRect();
        const w = 260;
        let left = r.left + r.width / 2 - w / 2;
        left = Math.max(12, Math.min(window.innerWidth - w - 12, left));
        hint.style.left = left + "px";
        hint.style.top = Math.min(window.innerHeight - 150, r.bottom + 10) + "px";

        hint.querySelector(".tour-hint-start").addEventListener("click", () => {
            markHintSeen();
            removeHint();
            startTour();
        });
        hint.querySelector(".tour-hint-dismiss").addEventListener("click", () => {
            markHintSeen();
            removeHint();
        });
    }

    function buildLayer() {
        document.querySelector(".tour-layer")?.remove();
        const layer = document.createElement("div");
        layer.className = "tour-layer";
        layer.innerHTML = `
            <div class="tour-spotlight"></div>
            <div class="tour-card" dir="${lang() === "ar" ? "rtl" : "ltr"}">
                <div class="tour-card-head">
                    <span class="tour-count"></span>
                    <div class="tour-progress-track"><div class="tour-progress-fill"></div></div>
                    <button class="tour-x" type="button" aria-label="${t().close}" title="${t().close}">×</button>
                </div>
                <h3></h3>
                <p></p>
                <div class="tour-card-actions">
                    <button class="tour-btn secondary" data-tour-back></button>
                    <button class="tour-btn primary" data-tour-next></button>
                </div>
            </div>
        `;
        document.body.appendChild(layer);
        layer.querySelector(".tour-x").addEventListener("click", endTour);
        layer.querySelector("[data-tour-back]").addEventListener("click", () => showStep(stepIndex - 1));
        layer.querySelector("[data-tour-next]").addEventListener("click", () => {
            if (stepIndex >= t().steps.length - 1) endTour();
            else showStep(stepIndex + 1);
        });
    }

    function positionSpotlight(target) {
        const spot = document.querySelector(".tour-spotlight");
        if (!spot || !target) return;
        const r = target.getBoundingClientRect();
        const pad = 6;
        spot.style.left = Math.max(3, r.left - pad) + "px";
        spot.style.top = Math.max(3, r.top - pad) + "px";
        spot.style.width = Math.max(24, r.width + pad * 2) + "px";
        spot.style.height = Math.max(24, r.height + pad * 2) + "px";
    }

    function showStep(index) {
        const c = t();
        stepIndex = Math.max(0, Math.min(index, c.steps.length - 1));
        const step = c.steps[stepIndex];
        const target = document.querySelector(step.selector);

        if (!target) {
            if (stepIndex < c.steps.length - 1) return showStep(stepIndex + 1);
            return endTour();
        }

        currentTarget = target;
        try { target.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (_) {}

        const layer = document.querySelector(".tour-layer");
        if (!layer) return;

        layer.querySelector(".tour-count").textContent = `${stepIndex + 1} / ${c.steps.length}`;
        layer.querySelector(".tour-progress-fill").style.width =
            `${((stepIndex + 1) / c.steps.length) * 100}%`;
        layer.querySelector("h3").textContent = step.title;
        layer.querySelector("p").textContent = step.text;
        layer.querySelector("[data-tour-back]").textContent = c.back;
        layer.querySelector("[data-tour-back]").style.visibility = stepIndex === 0 ? "hidden" : "visible";
        layer.querySelector("[data-tour-next]").textContent =
            stepIndex === c.steps.length - 1 ? c.finish : c.next;

        setTimeout(() => positionSpotlight(target), 140);
    }

    function startTour() {
        removeHint();
        document.querySelector(".tour-layer")?.remove();
        active = true;
        stepIndex = 0;
        buildLayer();
        showStep(0);
    }

    function endTour() {
        active = false;
        currentTarget = null;
        document.querySelector(".tour-layer")?.remove();
    }

    document.getElementById("tutorialBtn")?.addEventListener("click", startTour);

    window.addEventListener("resize", () => {
        if (active && currentTarget) positionSpotlight(currentTarget);
    });

    document.querySelector(".sidebar")?.addEventListener("scroll", () => {
        if (active && currentTarget) positionSpotlight(currentTarget);
    }, { passive: true });

    document.addEventListener("keydown", ev => {
        if (!active) return;
        if (ev.key === "Escape") endTour();
        if (ev.key === "ArrowRight" && lang() === "en" && stepIndex < t().steps.length - 1) showStep(stepIndex + 1);
        if (ev.key === "ArrowLeft" && lang() === "en" && stepIndex > 0) showStep(stepIndex - 1);
    });

    window.SFG_TUTORIAL = { start: startTour };

    // Subtle first-visit hint instead of an intrusive modal.
    if (!seen()) setTimeout(showFirstHint, 900);
})();
