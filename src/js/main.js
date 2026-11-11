
// =====================================
// menu
// =====================================

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const submenu = document.getElementById("submenu");
const menuOverlay = document.getElementById("menuOverlay");

function openMenu() {
    submenu.classList.remove("translate-x-full");
    menuOverlay.classList.remove("hidden");
}

function closeMenuFunc() {
    submenu.classList.add("translate-x-full");
    menuOverlay.classList.add("hidden");
}

menuBtn.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeMenuFunc);
menuOverlay.addEventListener("click", closeMenuFunc);


// =====================================
// index page
// =====================================

const section = document.getElementById("counter-section");
const counters = document.querySelectorAll(".counter");

const duration = 2000;

if (section) {
    const observer = new IntersectionObserver((entries, observer) => {

        if (entries[0].isIntersecting) {

            counters.forEach(counter => {

                const target = Number(counter.dataset.target);
                const startTime = performance.now();

                const updateCounter = (currentTime) => {

                    const progress = Math.min(
                        (currentTime - startTime) / duration,
                        1
                    );

                    const current = Math.floor(progress * target);

                    counter.textContent = `+${current.toLocaleString()}`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                };

                requestAnimationFrame(updateCounter);
            });

            observer.unobserve(section);
        }

    });

    observer.observe(section);
}


// =====================================
// doctor profile page
// =====================================

const ratingSection = document.querySelector(".main-right-6");

if (ratingSection) {

    const ratingBars = ratingSection.querySelectorAll(".progress-bar");
    const ratingCircle = ratingSection.querySelector(".circle");
    const ratingNumber = ratingSection.querySelector("#circle-percent");

    const ratingDuration = 2000;

    const ratingObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                // انیمیشن نوارها
                ratingBars.forEach(bar => {

                    const target = Number(bar.dataset.target);

                    bar.style.width = "0%";

                    requestAnimationFrame(() => {

                        bar.style.transition = `width ${ratingDuration}ms ease`;
                        bar.style.width = target + "%";

                    });

                });


                // انیمیشن دایره
                const circleTarget = 70;
                const startTime = performance.now();

                function updateRating(currentTime) {

                    const progress = Math.min(
                        (currentTime - startTime) / ratingDuration,
                        1
                    );

                    const current = Math.floor(progress * circleTarget);
                    const degree = current * 3.6;

                    ratingCircle.style.background =
                        `conic-gradient(#1F7168 ${degree}deg, #D4D4D4 ${degree}deg)`;

                    ratingNumber.textContent =
                        current.toLocaleString("fa-IR");

                    if (progress < 1) {
                        requestAnimationFrame(updateRating);
                    } else {
                        ratingNumber.textContent = "۷۰";
                    }
                }

                requestAnimationFrame(updateRating);

                observer.unobserve(ratingSection);
            }

        });

    }, {
        threshold: 0.3
    });

    ratingObserver.observe(ratingSection);
}


// =====================================
// Persian Calendar
// =====================================

const calendarDays = document.getElementById("calendarDays");

if (calendarDays) {

    const monthNames = [
        "فروردین", "اردیبهشت", "خرداد",
        "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر",
        "دی", "بهمن", "اسفند"
    ];

    // فرمت تاریخ شمسی
    const jalaliFormatter = new Intl.DateTimeFormat(
        "en-US-u-ca-persian",
        {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        }
    );

    // تبدیل اعداد به فارسی
    const faNumber = new Intl.NumberFormat("fa-IR", {
        useGrouping: false
    });

    // تاریخ انتخاب‌شده اولیه: ۱۰ آذر ۱۴۰۲
    let selectedDate = new Date(2023, 11, 1);
    let viewDate = new Date(selectedDate);


    // استخراج سال، ماه و روز شمسی
    function getJalaliParts(date) {

        const parts = jalaliFormatter.formatToParts(date);

        const get = (type) =>
            Number(parts.find(p => p.type === type).value);

        return {
            year: get("year"),
            month: get("month"),
            day: get("day")
        };
    }


    // مقایسه ماه دو تاریخ
    function sameMonth(date1, date2) {

        const a = getJalaliParts(date1);
        const b = getJalaliParts(date2);

        return a.year === b.year && a.month === b.month;
    }


    // اضافه کردن روز به تاریخ
    function addDays(date, amount) {

        const result = new Date(date);
        result.setDate(result.getDate() + amount);

        return result;
    }


    // پیدا کردن روزهای ماه
    function getMonthDates(anchor) {

        let first = new Date(anchor);

        // پیدا کردن روز اول ماه شمسی
        while (getJalaliParts(first).day !== 1) {
            first = addDays(first, -1);
        }

        const dates = [];
        let cursor = new Date(first);

        while (sameMonth(cursor, anchor)) {

            dates.push(new Date(cursor));
            cursor = addDays(cursor, 1);

        }

        return { first, dates };
    }


    // نمایش تقویم
    function renderCalendar() {

        const { year, month } = getJalaliParts(viewDate);

        // عنوان ماه
        document.getElementById("monthTitle").textContent =
            `${monthNames[month - 1]} / ${faNumber.format(year)}`;

        const { first, dates } = getMonthDates(viewDate);

        // محاسبه فاصله روز اول ماه از شنبه
        const offset = (first.getDay() + 1) % 7;

        const cells = [];

        // خانه‌های خالی ابتدای ماه
        for (let i = 0; i < offset; i++) {
            cells.push(null);
        }

        dates.forEach(date => cells.push(date));

        // کامل کردن ردیف آخر
        while (cells.length % 7 !== 0) {
            cells.push(null);
        }

        const container = document.getElementById("calendarDays");

        container.innerHTML = "";

        const today = new Date();

        cells.forEach(date => {

            const cell = document.createElement("button");

            cell.type = "button";
            cell.className = "calendar-day";

            if (!date) {

                cell.classList.add("empty");
                cell.disabled = true;

            } else {

                const parts = getJalaliParts(date);

                const isToday =
                    date.toDateString() === today.toDateString();

                if (isToday) {
                    cell.classList.add("today");
                }

                cell.textContent = faNumber.format(parts.day);

            }

            container.appendChild(cell);

        });

    }


    // رفتن به ماه بعد یا قبل
    function moveMonth(direction) {

        viewDate = addDays(viewDate, direction * 40);

        renderCalendar();

    }

    // دکمه ماه بعد
    document.getElementById("nextMonth")?.addEventListener("click", () => {
        moveMonth(1);
    });


    // دکمه ماه قبل
    document.getElementById("prevMonth")?.addEventListener("click", () => {
        moveMonth(-1);
    });


    // اجرای اولیه تقویم
    renderCalendar();

}

