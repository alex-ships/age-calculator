const themes = [
    {
        name: "Midnight Amber",
        cardBg: "rgba(15, 23, 42, 0.80)",
        pageBg: "radial-gradient(circle at top, #131c31 0%, #070b14 70%)",
        accent: "#f59e0b",
        accent2: "#a855f7",
        glow: "rgba(245, 158, 11, 0.30)"
    },
    {
        name: "Emerald Aurora",
        cardBg: "rgba(8, 28, 26, 0.82)",
        pageBg: "radial-gradient(circle at top, #0f332d 0%, #040d0c 70%)",
        accent: "#34d399",
        accent2: "#06b6d4",
        glow: "rgba(52, 211, 153, 0.28)"
    },
    {
        name: "Rose Nebula",
        cardBg: "rgba(33, 14, 30, 0.82)",
        pageBg: "radial-gradient(circle at top, #3c1434 0%, #0d060d 70%)",
        accent: "#fb7185",
        accent2: "#f97316",
        glow: "rgba(251, 113, 133, 0.28)"
    },
    {
        name: "Cobalt Neon",
        cardBg: "rgba(12, 20, 44, 0.82)",
        pageBg: "radial-gradient(circle at top, #182a59 0%, #050914 70%)",
        accent: "#38bdf8",
        accent2: "#6366f1",
        glow: "rgba(56, 189, 248, 0.30)"
    },
    {
        name: "Violet Dusk",
        cardBg: "rgba(24, 15, 42, 0.82)",
        pageBg: "radial-gradient(circle at top, #2c1952 0%, #080512 70%)",
        accent: "#c084fc",
        accent2: "#ec4899",
        glow: "rgba(192, 132, 252, 0.30)"
    }
];

let currentThemeIndex = 0;

const dateInput = document.getElementById("date");
const dateWrapper = document.getElementById("date-wrapper");
const errorMsg = document.getElementById("error-msg");
const resultEl = document.getElementById("result");
const ageForm = document.getElementById("age-form");

// Restrict date picker to today or earlier
const todayISO = toLocalISODate(new Date());
dateInput.max = todayISO;

ageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateAge();
});

dateInput.addEventListener("input", () => {
    clearError();
});

function toLocalISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function parseLocalDate(isoString) {
    const [year, month, day] = isoString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add("visible");
    dateWrapper.classList.remove("shake");
    // Force reflow so the shake animation replays on repeated invalid clicks
    void dateWrapper.offsetWidth;
    dateWrapper.classList.add("shake");
}

function clearError() {
    errorMsg.textContent = "";
    errorMsg.classList.remove("visible");
    dateWrapper.classList.remove("shake");
}

function computeAgeDetails(birthDate, now) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months -= 1;
        const daysInPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += daysInPrevMonth;
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    const isBirthdayToday =
        birthDate.getMonth() === today.getMonth() &&
        birthDate.getDate() === today.getDate();

    // Next birthday calculation (handle Feb 29 gracefully)
    let nextBirthday = getBirthdayInYear(birthDate, today.getFullYear());
    if (nextBirthday <= today) {
        nextBirthday = getBirthdayInYear(birthDate, today.getFullYear() + 1);
    }
    const prevBirthday = getBirthdayInYear(birthDate, nextBirthday.getFullYear() - 1);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilBirthday = isBirthdayToday
        ? 0
        : Math.round((nextBirthday - today) / msPerDay);

    const yearSpanDays = Math.max(1, Math.round((nextBirthday - prevBirthday) / msPerDay));
    const daysIntoYear = Math.round((today - prevBirthday) / msPerDay);
    const yearProgress = isBirthdayToday
        ? 100
        : Math.min(100, Math.max(0, Math.round((daysIntoYear / yearSpanDays) * 100)));

    const totalDays = Math.max(0, Math.round((today - birthDate) / msPerDay));
    const totalWeeks = Math.floor(totalDays / 7);
    const birthWeekday = birthDate.toLocaleDateString("en-US", { weekday: "long" });

    return {
        years,
        months,
        days,
        isBirthdayToday,
        daysUntilBirthday,
        yearProgress,
        totalDays,
        totalWeeks,
        birthWeekday
    };
}

function getBirthdayInYear(birthDate, year) {
    const month = birthDate.getMonth();
    const day = birthDate.getDate();
    const candidate = new Date(year, month, day);
    // If born on Feb 29 in a non-leap year, JS rolls to Mar 1; use Feb 28 instead
    if (month === 1 && day === 29 && candidate.getMonth() !== 1) {
        return new Date(year, 1, 28);
    }
    return candidate;
}

function animateCounter(element, target, duration = 700, formatCommas = false) {
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        element.textContent = formatCommas ? value.toLocaleString() : String(value);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function triggerConfetti() {
    const layer = document.getElementById("confetti-layer");
    const btn = document.getElementById("btn");
    const rect = btn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const styles = getComputedStyle(document.documentElement);
    const colors = [
        styles.getPropertyValue("--accent").trim() || "#f59e0b",
        styles.getPropertyValue("--accent-2").trim() || "#a855f7",
        "#38bdf8",
        "#34d399",
        "#ffffff"
    ];

    for (let i = 0; i < 22; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.4;
        const distance = 65 + Math.random() * 110;
        const tx = `${Math.cos(angle) * distance}px`;
        const ty = `${Math.sin(angle) * distance - 30}px`;
        const rot = `${Math.round(Math.random() * 540 - 270)}deg`;

        piece.style.left = `${originX}px`;
        piece.style.top = `${originY}px`;
        piece.style.backgroundColor = colors[i % colors.length];
        piece.style.setProperty("--tx", tx);
        piece.style.setProperty("--ty", ty);
        piece.style.setProperty("--rot", rot);
        piece.style.animationDelay = `${Math.random() * 90}ms`;

        layer.appendChild(piece);
        piece.addEventListener("animationend", () => piece.remove(), { once: true });
    }
}

function calculateAge() {
    const userInput = dateInput.value;

    if (!userInput) {
        showError("Please pick your date of birth first.");
        return;
    }

    const birthDate = parseLocalDate(userInput);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
        showError("Birth date cannot be in the future.");
        return;
    }

    clearError();
    const details = computeAgeDetails(birthDate, now);

    const birthdayBanner = details.isBirthdayToday
        ? `<div class="birthday-banner">Happy Birthday! Enjoy your special day!</div>`
        : "";

    const countdownText = details.isBirthdayToday
        ? "Today!"
        : `${details.daysUntilBirthday} ${details.daysUntilBirthday === 1 ? "day" : "days"}`;

    const yearWord = details.years === 1 ? "Year" : "Years";
    const monthWord = details.months === 1 ? "Month" : "Months";
    const dayWord = details.days === 1 ? "Day" : "Days";

    resultEl.hidden = false;
    resultEl.classList.remove("reveal");
    void resultEl.offsetWidth;
    resultEl.classList.add("reveal");

    resultEl.innerHTML = `
        ${birthdayBanner}
        <p class="result-headline">
            You are <span class="highlight">${details.years} ${yearWord.toLowerCase()}</span> old!
        </p>

        <div class="age-grid">
            <div class="age-box primary">
                <span class="age-value" data-count="${details.years}">0</span>
                <span class="age-label">${yearWord}</span>
            </div>
            <div class="age-box">
                <span class="age-value" data-count="${details.months}">0</span>
                <span class="age-label">${monthWord}</span>
            </div>
            <div class="age-box">
                <span class="age-value" data-count="${details.days}">0</span>
                <span class="age-label">${dayWord}</span>
            </div>
        </div>

        <div class="countdown-card">
            <div class="countdown-top">
                <span class="countdown-title">Next birthday countdown</span>
                <span class="countdown-days">${countdownText}</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" id="year-progress"></div>
            </div>
        </div>

        <div class="meta-grid">
            <div class="meta-item">
                <span class="meta-label">Born on</span>
                <span class="meta-value">${details.birthWeekday}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Total days lived</span>
                <span class="meta-value" data-count="${details.totalDays}" data-commas="true">0</span>
            </div>
        </div>
    `;

    // Animate all numeric counters
    resultEl.querySelectorAll("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const useCommas = el.dataset.commas === "true";
        animateCounter(el, target, useCommas ? 850 : 650, useCommas);
    });

    // Trigger progress bar fill smoothly on next frame
    const progressEl = document.getElementById("year-progress");
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            progressEl.style.width = `${details.yearProgress}%`;
        });
    });

    triggerConfetti();
}

function changeColor() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const theme = themes[currentThemeIndex];
    const root = document.documentElement;

    root.style.setProperty("--card-bg", theme.cardBg);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-2", theme.accent2);
    root.style.setProperty("--accent-glow", theme.glow);
    document.body.style.background = theme.pageBg;
}
