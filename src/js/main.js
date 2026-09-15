const section = document.getElementById("counter-section");
const counters = document.querySelectorAll(".counter");

const duration = 2000;

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
                } else {
                    counter.textContent = `+${target.toLocaleString()}`;
                }
            };

            requestAnimationFrame(updateCounter);
        });

        observer.unobserve(section);
    }
});

observer.observe(section);

function openMenu(menu) {
    const submenu = menu.querySelector(".submenu");
    submenu.classList.toggle("hidden");
}