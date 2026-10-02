(() => {
    "use strict";

    /*
     * The application was originally Arabic/mixed-language.
     * These pairs provide a lightweight bilingual layer without
     * changing graph data, gains, equations, or node names.
     */
    const pairs = [
        // Main interface
        ["عقدة الإدخال:", "Input Node:"],
        ["عقدة الإخراج:", "Output Node:"],
        ["تنبيه:", "Notice:"],
        ["إضافة عقدة جديدة ➕", "Add New Node ➕"],
        ["العودة إلى الرسم 🎯", "Focus Diagram 🎯"],
        ["مسح المخطط 🗑️", "Clear Diagram 🗑️"],
        ["إعدادات الرسم المتقدمة ⚙️", "Advanced Drawing Settings ⚙️"],
        ["قوة الانحناء التلقائي:", "Auto Curve Strength:"],
        ["تباعد المسارات المتعددة:", "Multiple Edge Spacing:"],
        ["تجنّب تقاطع المسارات تلقائيًا", "Automatically avoid edge crossings"],
        ["خصائص العنصر المحدد", "Selected Element Properties"],
        ["لا يوجد عنصر محدد", "Nothing selected"],
        ["حفظ المخطط (JSON) 💾", "Save Diagram (JSON) 💾"],
        ["تحميل مخطط 📂", "Load Diagram 📂"],
        ["تصدير كصورة PNG 🖼️", "Export as PNG 🖼️"],
        ["حل المخطط 🚀", "Solve Diagram 🚀"],
        ["تم التطوير بواسطة", "Developed by"],
        ["تواصل معي عبر واتساب 💬", "Contact me on WhatsApp 💬"],
        ["اسحب لتغيير حجم نافذة النتائج", "Drag to resize the results panel"],
        ["إغلاق X", "Close X"],
        [
            "تلميح: مرّر الماوس فوق عناصر الحل لتحديدها على الرسم. التعديل مقفول أثناء عرض النتائج.",
            "Tip: Hover over solution elements to highlight them on the graph. Editing is locked while results are displayed."
        ],

        // Existing Arabic runtime messages
        ["Cytoscape.js غير محمّل. تأكد إن ملفات ./vendor موجودة جنب index.html.",
         "Cytoscape.js could not be loaded. Make sure the required files are available next to index.html."],

        ["المخطط مقفول أثناء عرض الحل. اقفل نافذة الحل للتعديل.",
         "The diagram is locked while the solution is displayed. Close the results panel to edit it."],

        ["ملحوظة: Edge Editing extension مش محمّلة (التقويس الحر ممكن ميشتغلش).",
         "Note: The Edge Editing extension is not loaded. Manual edge bending may be unavailable."],

        ["ملحوظة: حصل خطأ في Edge Editing (التقويس الحر ممكن ميشتغلش).",
         "Note: An Edge Editing error occurred. Manual edge bending may be unavailable."],

        ["اسم العقدة الجديدة:", "New node name:"],
        ["اسم العقدة:", "Node name:"],
        ["الاسم الجديد:", "New name:"],
        ["كسب المسار (Gain):", "Edge gain:"],

        ["سلك جديد: حرّك الماوس ثم اضغط على العقدة الهدف للتوصيل. (Esc للإلغاء)",
         "New edge: Move the pointer, then click the target node to connect it. Press Esc to cancel."],

        ["تم حذف زر الترتيب الذكي.",
         "The automatic layout button has been disabled."],

        ["Dagre layout مش متاح. تأكد إن ./vendor/cytoscape-dagre.min.js و ./vendor/dagre.min.js موجودين.",
         "Dagre layout is unavailable. Make sure cytoscape-dagre.min.js and dagre.min.js are available."],

        ["⌛ جاري استخراج المسارات والحلقات...",
         "⌛ Finding forward paths and loops..."],

        ["تنبيه: تم استخدام حل المعادلات الخطية لضمان الدقة.",
         "Notice: The linear-equation solution was used to ensure accuracy."],

        ["✅ تم تحميل المخطط بجميع تفاصيله وتقويساته بنجاح!",
         "✅ Diagram loaded successfully with all saved details and curves!"],

        ["❌ خطأ: الملف غير صالح أو تالف!",
         "❌ Error: The selected file is invalid or corrupted!"],

        ["هل أنت متأكد من مسح المخطط بالكامل؟ لا يمكن التراجع عن هذه الخطوة.",
         "Are you sure you want to clear the entire diagram? This action cannot be undone."],

        ["تم مسح المخطط وبدء رسم جديد.",
         "The diagram was cleared and a new graph was started."],

        ["❌ خطأ:", "❌ Error:"],
        ["تعديل Gain ✅", "Edit Gain ✅"],
        ["إعادة تسمية ✏️", "Rename ✏️"],
        ["تطبيق", "Apply"],

        // Existing English interface sections -> Arabic mode
        ["Drag the handle to bend the edge.", "اسحب المقبض لتغيير انحناء المسار."],
        ["Remove Handle 🗑️", "حذف المقبض 🗑️"],
        ["Reset Curve ↩️", "إعادة ضبط الانحناء ↩️"],
        ["Start Wire From Here ➜", "ابدأ مسارًا من هنا ➜"],
        ["Delete 🗑️", "حذف 🗑️"],
        ["Type:", "النوع:"],
        ["Bend Handle", "مقبض الانحناء"],
        ["Examples:", "أمثلة:"],
        ["Transfer Function:", "دالة التحويل:"],
        ["1. Forward Paths (P) & Cofactors (Δk):",
         "1. المسارات الأمامية (P) والمعاملات المساعدة (Δk):"],
        ["2. Individual Loops (L):",
         "2. الحلقات المنفردة (L):"],
        ["3. Non-touching Loops:",
         "3. الحلقات غير المتلامسة:"],
        ["4. Determinant (Δ):",
         "4. المحدد (Δ):"],
        ["Nothing selected", "لا يوجد عنصر محدد"],
        ["Selected Element Properties", "خصائص العنصر المحدد"],
        ["Advanced Drawing Settings ⚙️", "إعدادات الرسم المتقدمة ⚙️"],
        ["Auto Curve Strength:", "قوة الانحناء التلقائي:"],
        ["Multiple Edge Spacing:", "تباعد المسارات المتعددة:"],
        ["Automatically avoid edge crossings", "تجنّب تقاطع المسارات تلقائيًا"],
        ["Save Diagram (JSON) 💾", "حفظ المخطط (JSON) 💾"],
        ["Load Diagram 📂", "تحميل مخطط 📂"],
        ["Export as PNG 🖼️", "تصدير كصورة PNG 🖼️"],
        ["Solve Diagram 🚀", "حل المخطط 🚀"],
        ["Add New Node ➕", "إضافة عقدة جديدة ➕"],
        ["Focus Diagram 🎯", "العودة إلى الرسم 🎯"],
        ["Clear Diagram 🗑️", "مسح المخطط 🗑️"],
        ["Contact me on WhatsApp 💬", "تواصل معي عبر واتساب 💬"],
        ["Developed by", "تم التطوير بواسطة"],
        ["Notice:", "تنبيه:"],
        ["Input Node:", "عقدة الإدخال:"],
        ["Output Node:", "عقدة الإخراج:"],
        ["Close X", "إغلاق X"],
        ["Drag to resize the results panel", "اسحب لتغيير حجم نافذة النتائج"],

        // Validation/backend messages
        ["Input node name is empty.", "اسم عقدة الإدخال فارغ."],
        ["Output node name is empty.", "اسم عقدة الإخراج فارغ."],
        ["Connection is missing from/to node.", "أحد المسارات لا يحتوي على عقدة بداية أو نهاية."],
        ["Some nodes are not on any path from input to output.",
         "بعض العقد لا تقع على أي مسار من الإدخال إلى الإخراج."],
        ["Some nodes are isolated.", "بعض العقد معزولة."],
        ["Failed to validate:", "تعذر التحقق:"],

        // Generic labels — kept after the longer translations
        ["Node", "عقدة"],
        ["Edge", "مسار"],
        ["Gain", "الكسب"],
        ["Name", "الاسم"],
        ["Apply", "تطبيق"]
    ];

    let currentLang = "en";
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();

    const skippedTags = new Set([
        "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"
    ]);

    function normalizePair(pair) {
        const [first, second] = pair;

        const hasArabic = (text) =>
            /[\u0600-\u06FF]/.test(String(text));

        const firstArabic = hasArabic(first);
        const secondArabic = hasArabic(second);

        // Support both [Arabic, English] and [English, Arabic]
        if (firstArabic && !secondArabic) {
            return { ar: first, en: second };
        }

        if (!firstArabic && secondArabic) {
            return { ar: second, en: first };
        }

        // Fallback for mixed strings
        return { ar: first, en: second };
    }

    function normalizePair(pair) {
        const [first, second] = pair;

        const hasArabic = (text) =>
            /[\u0600-\u06FF]/.test(String(text));

        if (hasArabic(first) && !hasArabic(second)) {
            return { ar: first, en: second };
        }

        if (!hasArabic(first) && hasArabic(second)) {
            return { ar: second, en: first };
        }

        return { ar: first, en: second };
    }

    function orderedPairs(lang) {
        return pairs
            .map(normalizePair)
            .sort((a, b) => {
                const aSource = lang === "en" ? a.ar : a.en;
                const bSource = lang === "en" ? b.ar : b.en;
                return bSource.length - aSource.length;
            });
    }

    function translatePatterns(value, lang) {
        let text = String(value);

        if (lang === "ar") {
            text = text.replace(
                /Input node '([^']+)' not found\./g,
                "عقدة الإدخال '$1' غير موجودة."
            );
            text = text.replace(
                /Output node '([^']+)' not found\./g,
                "عقدة الإخراج '$1' غير موجودة."
            );
            text = text.replace(
                /No forward path from '([^']+)' to '([^']+)'\./g,
                "لا يوجد مسار أمامي من '$1' إلى '$2'."
            );
            text = text.replace(
                /Gain is missing on edge (.+?) -> (.+?)\./g,
                "قيمة الكسب مفقودة على المسار $1 → $2."
            );
            text = text.replace(
                /Invalid gain on edge (.+?) -> (.+?): (.+)/g,
                "قيمة الكسب غير صالحة على المسار $1 → $2: $3"
            );
            text = text.replace(
                /(\d+)-Non-Touching/g,
                "$1-حلقات غير متلامسة"
            );
        }

        return text;
    }

    function translateString(value, lang = currentLang) {
        if (value == null) return value;

        let output = String(value);

        for (const pair of orderedPairs(lang)) {
            const from = lang === "en" ? pair.ar : pair.en;
            const to = lang === "en" ? pair.en : pair.ar;

            if (from && output.includes(from)) {
                output = output.split(from).join(to);
            }
        }

        return translatePatterns(output, lang);
    }

    function skipNode(node) {
        const parent = node && node.parentElement;
        return !parent || skippedTags.has(parent.tagName);
    }

    function translateTextNode(node, force = false) {
        if (!node || skipNode(node)) return;

        let original = originalText.get(node);

        if (original === undefined) {
            original = node.nodeValue;
            originalText.set(node, original);
        } else if (!force) {
            const expected = translateString(original);
            if (node.nodeValue !== expected) {
                original = node.nodeValue;
                originalText.set(node, original);
            }
        }

        const translated = translateString(original);

        if (node.nodeValue !== translated) {
            node.nodeValue = translated;
        }
    }

    function translateAttributes(el, force = false) {
        if (!(el instanceof Element)) return;

        const attributes = ["title", "placeholder", "aria-label"];

        let store = originalAttributes.get(el);
        if (!store) {
            store = {};
            originalAttributes.set(el, store);
        }

        for (const attr of attributes) {
            if (!el.hasAttribute(attr)) continue;

            const current = el.getAttribute(attr);

            if (!(attr in store)) {
                store[attr] = current;
            } else if (!force) {
                const expected = translateString(store[attr]);
                if (current !== expected) {
                    store[attr] = current;
                }
            }

            const translated = translateString(store[attr]);
            if (current !== translated) {
                el.setAttribute(attr, translated);
            }
        }
    }

    function translateTree(root, force = false) {
        if (!root) return;

        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root, force);
            return;
        }

        if (root.nodeType !== Node.ELEMENT_NODE &&
            root.nodeType !== Node.DOCUMENT_NODE) return;

        if (root instanceof Element) {
            translateAttributes(root, force);
        }

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT
        );

        let node;
        while ((node = walker.nextNode())) {
            translateTextNode(node, force);
        }

        if (root.querySelectorAll) {
            root.querySelectorAll("[title], [placeholder], [aria-label]")
                .forEach(el => translateAttributes(el, force));
        }
    }

    function updateLanguageButton() {
        const btn = document.getElementById("languageToggle");
        if (!btn) return;

        btn.textContent = currentLang === "en" ? "العربية" : "English";
        btn.title = currentLang === "en"
            ? "Switch to Arabic"
            : "Switch to English";
    }

    function setLanguage(lang, persist = true) {
        currentLang = lang === "ar" ? "ar" : "en";

        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

        if (document.body) {
            document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
        }

        const resultText = document.querySelector(".res-text");
        if (resultText) {
            resultText.style.direction =
                currentLang === "ar" ? "rtl" : "ltr";
        }

        document.title = currentLang === "ar"
            ? "حل مخططات تدفق الإشارة | SFG Master"
            : "Signal Flow Graph Solver | SFG Master";

        translateTree(document.body, true);
        updateLanguageButton();

        if (persist) {
            try {
                localStorage.setItem("sfgLanguage", currentLang);
            } catch (_) {}
        }

        try {
            if (window.cy) {
                window.cy.resize();
            }
        } catch (_) {}
    }

    // Translate browser dialogs created by the existing application.
    const nativePrompt = window.prompt.bind(window);
    const nativeConfirm = window.confirm.bind(window);
    const nativeAlert = window.alert.bind(window);

    window.prompt = function(message, defaultValue) {
        return nativePrompt(
            translateString(message),
            defaultValue
        );
    };

    window.confirm = function(message) {
        return nativeConfirm(translateString(message));
    };

    window.alert = function(message) {
        return nativeAlert(translateString(message));
    };

    const button = document.getElementById("languageToggle");
    if (button) {
        button.addEventListener("click", () => {
            setLanguage(currentLang === "en" ? "ar" : "en");
        });
    }

    let saved = null;
    try {
        saved = localStorage.getItem("sfgLanguage");
    } catch (_) {}

    // A new visitor always starts in English.
    setLanguage(saved === "ar" ? "ar" : "en", false);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "characterData") {
                translateTextNode(mutation.target, false);
            }

            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    translateTree(node, false);
                });
            }

            if (mutation.type === "attributes") {
                translateAttributes(mutation.target, false);
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["title", "placeholder", "aria-label"]
        });
    }

    window.SFG_I18N = {
        setLanguage,
        getLanguage: () => currentLang,
        translate: translateString
    };
})();
