(() => {
    "use strict";

    const copy = {
        en: {
            welcomeTitle: "Welcome to the Signal Flow Graph Solver",
            welcomeText: "Take a quick guided tour to learn how to build a graph, edit gains, and solve it with Mason's Gain Formula.",
            start: "Start tutorial",
            later: "Not now",
            back: "Back",
            next: "Next",
            finish: "Finish",
            skip: "Skip tour",
            step: "Step",
            of: "of",
            steps: [
                {
                    selector: ".brand",
                    title: "Signal Flow Graph Solver",
                    text: "This tool builds and solves signal-flow graphs symbolically using Mason's Gain Formula."
                },
                {
                    selector: ".sidebar .io-card",
                    title: "Choose input and output",
                    text: "Set the labels of the system input and output nodes. The default labels are R and Y."
                },
                {
                    selector: "#addNodeBtn",
                    title: "Add nodes",
                    text: "Add intermediate nodes from here. You can also double-click an empty area of the canvas."
                },
                {
                    selector: ".btn-example",
                    title: "Try the built-in example",
                    text: "Load a ready-made feedback graph if you want to understand the workflow immediately."
                },
                {
                    selector: "#propsCard",
                    title: "Edit nodes and gains",
                    text: "Select a node or branch to rename it, change its gain, or adjust its curve."
                },
                {
                    selector: "details.io-card",
                    title: "Advanced drawing settings",
                    text: "Fine-tune automatic curve strength, spacing, and crossing avoidance when the graph becomes complex."
                },
                {
                    selector: "#solveBtn",
                    title: "Solve the graph",
                    text: "The app validates the graph, detects paths and loops, applies Mason's formula, and displays the symbolic transfer function."
                },
                {
                    selector: ".contact-card",
                    title: "Save your work and get in touch",
                    text: "You can save or export your diagram, and use the contact links if you want to reach the developer."
                }
            ]
        },
        ar: {
            welcomeTitle: "مرحبًا بك في محلل مخططات تدفق الإشارة",
            welcomeText: "جولة سريعة توضح لك كيفية بناء المخطط، تعديل قيم الكسب، وحله باستخدام صيغة ماسون.",
            start: "ابدأ الشرح",
            later: "ليس الآن",
            back: "السابق",
            next: "التالي",
            finish: "إنهاء",
            skip: "تخطي الشرح",
            step: "خطوة",
            of: "من",
            steps: [
                {
                    selector: ".brand",
                    title: "Signal Flow Graph Solver",
                    text: "الأداة تبني وتحل مخططات تدفق الإشارة رمزيًا باستخدام صيغة ماسون للكسب."
                },
                {
                    selector: ".sidebar .io-card",
                    title: "حدد الإدخال والإخراج",
                    text: "اكتب أسماء عقدة إدخال النظام وعقدة الإخراج. القيم الافتراضية هي R و Y."
                },
                {
                    selector: "#addNodeBtn",
                    title: "أضف العقد",
                    text: "أضف العقد الوسيطة من هنا، أو انقر مرتين على مساحة فارغة داخل الرسم."
                },
                {
                    selector: ".btn-example",
                    title: "جرّب المثال الجاهز",
                    text: "حمّل مخطط Feedback جاهزًا لتفهم طريقة الاستخدام بسرعة."
                },
                {
                    selector: "#propsCard",
                    title: "عدّل العقد وقيم الكسب",
                    text: "حدد عقدة أو مسارًا لتغيير الاسم أو قيمة Gain أو شكل انحناء المسار."
                },
                {
                    selector: "details.io-card",
                    title: "إعدادات الرسم المتقدمة",
                    text: "تحكم في شدة الانحناء والمسافات وتجنب تقاطع المسارات عند زيادة تعقيد المخطط."
                },
                {
                    selector: "#solveBtn",
                    title: "حل المخطط",
                    text: "يتم التحقق من المخطط واكتشاف المسارات والحلقات ثم تطبيق صيغة ماسون وعرض دالة التحويل رمزيًا."
                },
                {
                    selector: ".contact-card",
                    title: "احفظ عملك وتواصل معي",
                    text: "يمكنك حفظ المخطط أو تصديره، واستخدام روابط التواصل للوصول إلى مطور المشروع."
                }
            ]
        }
    };

    let active = false;
    let stepIndex = 0;
    let currentTarget = null;

    const css = `
        .tour-welcome-backdrop, .tour-layer {
            position: fixed;
            inset: 0;
            z-index: 20000;
        }
        .tour-welcome-backdrop {
            background: rgba(15, 23, 42, .62);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .tour-welcome {
            width: min(440px, calc(100vw - 40px));
            background: #fff;
            border-radius: 16px;
            padding: 26px;
            box-shadow: 0 24px 70px rgba(15, 23, 42, .28);
            color: #0f172a;
        }
        .tour-welcome h2 { margin: 0 0 10px; font-size: 22px; }
        .tour-welcome p { margin: 0; color: #64748b; line-height: 1.6; font-size: 14px; }
        .tour-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 22px; }
        .tour-btn {
            border: 0;
            border-radius: 8px;
            padding: 9px 14px;
            cursor: pointer;
            font-weight: 700;
            font-size: 13px;
        }
        .tour-btn.primary { background: #2563eb; color: white; }
        .tour-btn.secondary { background: #e2e8f0; color: #334155; }
        .tour-layer { pointer-events: none; }
        .tour-spotlight {
            position: fixed;
            border: 3px solid #60a5fa;
            border-radius: 12px;
            box-shadow: 0 0 0 9999px rgba(15, 23, 42, .72);
            transition: left .2s ease, top .2s ease, width .2s ease, height .2s ease;
            z-index: 20001;
            pointer-events: none;
        }
        .tour-card {
            position: fixed;
            z-index: 20002;
            width: min(350px, calc(100vw - 28px));
            background: #fff;
            color: #0f172a;
            border-radius: 14px;
            box-shadow: 0 20px 60px rgba(15, 23, 42, .30);
            padding: 18px;
            pointer-events: auto;
        }
        .tour-progress { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; }
        .tour-card h3 { margin: 7px 0 8px; font-size: 18px; }
        .tour-card p { margin: 0; color: #64748b; font-size: 13px; line-height: 1.55; }
        .tour-card-actions { display: flex; align-items: center; gap: 8px; margin-top: 17px; }
        .tour-spacer { flex: 1; }
        .tour-skip { border: 0; background: transparent; color: #64748b; cursor: pointer; font-size: 12px; }
        @media (max-width: 650px) {
            .tour-card { left: 14px !important; right: 14px; bottom: 14px !important; top: auto !important; width: auto; }
        }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    function lang() {
        return document.documentElement.lang === "ar" ? "ar" : "en";
    }

    function t() {
        return copy[lang()];
    }

    function markSeen() {
        try { localStorage.setItem("sfgTutorialSeen", "1"); } catch (_) {}
    }

    function hasSeen() {
        try { return localStorage.getItem("sfgTutorialSeen") === "1"; } catch (_) { return false; }
    }

    function removeWelcome() {
        document.querySelector(".tour-welcome-backdrop")?.remove();
    }

    function showWelcome() {
        if (document.querySelector(".tour-welcome-backdrop")) return;
        const c = t();
        const wrap = document.createElement("div");
        wrap.className = "tour-welcome-backdrop";
        wrap.innerHTML = `
            <div class="tour-welcome" dir="${lang() === "ar" ? "rtl" : "ltr"}">
                <h2>${c.welcomeTitle}</h2>
                <p>${c.welcomeText}</p>
                <div class="tour-actions">
                    <button class="tour-btn secondary" data-tour-later>${c.later}</button>
                    <button class="tour-btn primary" data-tour-start>${c.start}</button>
                </div>
            </div>
        `;
        document.body.appendChild(wrap);
        wrap.querySelector("[data-tour-start]").addEventListener("click", () => {
            removeWelcome();
            startTour();
        });
        wrap.querySelector("[data-tour-later]").addEventListener("click", () => {
            markSeen();
            removeWelcome();
        });
    }

    function buildLayer() {
        document.querySelector(".tour-layer")?.remove();
        const layer = document.createElement("div");
        layer.className = "tour-layer";
        layer.innerHTML = `
            <div class="tour-spotlight"></div>
            <div class="tour-card">
                <div class="tour-progress"></div>
                <h3></h3>
                <p></p>
                <div class="tour-card-actions">
                    <button class="tour-skip" data-tour-skip></button>
                    <span class="tour-spacer"></span>
                    <button class="tour-btn secondary" data-tour-back></button>
                    <button class="tour-btn primary" data-tour-next></button>
                </div>
            </div>
        `;
        document.body.appendChild(layer);
        layer.querySelector("[data-tour-skip]").addEventListener("click", endTour);
        layer.querySelector("[data-tour-back]").addEventListener("click", () => showStep(stepIndex - 1));
        layer.querySelector("[data-tour-next]").addEventListener("click", () => {
            const steps = t().steps;
            if (stepIndex >= steps.length - 1) endTour();
            else showStep(stepIndex + 1);
        });
    }

    function positionElements(target) {
        const layer = document.querySelector(".tour-layer");
        if (!layer || !target) return;
        const spot = layer.querySelector(".tour-spotlight");
        const card = layer.querySelector(".tour-card");
        const r = target.getBoundingClientRect();
        const pad = 7;

        spot.style.left = Math.max(4, r.left - pad) + "px";
        spot.style.top = Math.max(4, r.top - pad) + "px";
        spot.style.width = Math.max(24, r.width + pad * 2) + "px";
        spot.style.height = Math.max(24, r.height + pad * 2) + "px";

        const cardW = Math.min(350, window.innerWidth - 28);
        let left = r.right + 20;
        let top = Math.max(14, r.top);

        if (left + cardW > window.innerWidth - 14) {
            left = Math.max(14, r.left - cardW - 20);
        }
        if (left < 14) {
            left = Math.max(14, (window.innerWidth - cardW) / 2);
            top = Math.min(window.innerHeight - 250, r.bottom + 18);
        }

        const estimatedH = 220;
        if (top + estimatedH > window.innerHeight - 14) {
            top = Math.max(14, window.innerHeight - estimatedH - 14);
        }

        card.style.left = left + "px";
        card.style.top = top + "px";
    }

    function showStep(index) {
        const c = t();
        const steps = c.steps;
        stepIndex = Math.max(0, Math.min(index, steps.length - 1));
        const s = steps[stepIndex];
        const target = document.querySelector(s.selector);
        if (!target) {
            if (stepIndex < steps.length - 1) return showStep(stepIndex + 1);
            return endTour();
        }

        currentTarget = target;
        try { target.scrollIntoView({behavior: "smooth", block: "center"}); } catch (_) {}
        const layer = document.querySelector(".tour-layer");
        if (!layer) return;

        layer.querySelector(".tour-progress").textContent = `${c.step} ${stepIndex + 1} ${c.of} ${steps.length}`;
        layer.querySelector("h3").textContent = s.title;
        layer.querySelector("p").textContent = s.text;
        layer.querySelector("[data-tour-skip]").textContent = c.skip;
        layer.querySelector("[data-tour-back]").textContent = c.back;
        layer.querySelector("[data-tour-back]").style.visibility = stepIndex === 0 ? "hidden" : "visible";
        layer.querySelector("[data-tour-next]").textContent = stepIndex === steps.length - 1 ? c.finish : c.next;

        setTimeout(() => positionElements(target), 120);
    }

    function startTour() {
        removeWelcome();
        active = true;
        stepIndex = 0;
        buildLayer();
        showStep(0);
    }

    function endTour() {
        active = false;
        markSeen();
        currentTarget = null;
        document.querySelector(".tour-layer")?.remove();
    }

    document.getElementById("tutorialBtn")?.addEventListener("click", startTour);

    window.addEventListener("resize", () => {
        if (active && currentTarget) positionElements(currentTarget);
    });
    document.querySelector(".sidebar")?.addEventListener("scroll", () => {
        if (active && currentTarget) positionElements(currentTarget);
    }, {passive: true});

    document.addEventListener("keydown", ev => {
        if (active && ev.key === "Escape") endTour();
    });

    window.SFG_TUTORIAL = { start: startTour, showWelcome };

    if (!hasSeen()) {
        setTimeout(showWelcome, 700);
    }
})();
