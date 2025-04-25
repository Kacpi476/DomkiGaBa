// NAVBAR
const nav = document.getElementById("nav");
const links = nav.querySelectorAll("a");
const animation = nav.querySelector(".animation");
const navWrapper = document.querySelector(".nav-wrapper");

const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
});

links.forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove('open');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

let activeLink = nav.querySelector("a.active");
let scrollingByClick = false;

function moveIndicator(el) {
    animation.style.width = el.offsetWidth + "px";
    animation.style.left = el.offsetLeft + "px";
}

moveIndicator(activeLink);

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        scrollingByClick = true;

        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.querySelector(`.${targetId}`);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - nav.offsetHeight,
                behavior: "smooth"
            });
        }

        setTimeout(() => {
            scrollingByClick = false;
        }, 600);
    });

    link.addEventListener("mouseenter", () => {
        if (!scrollingByClick) {
            moveIndicator(link);
        }
    });

    link.addEventListener("mouseleave", () => {
        if (!scrollingByClick) {
            moveIndicator(activeLink);
        }
    });
});

const navOffset = nav.offsetTop;

window.addEventListener('scroll', () => {
    if (window.pageYOffset >= navOffset) {
        nav.classList.add('fixed');
        navWrapper.classList.add('fixed-space');
    } else {
        nav.classList.remove('fixed');
        navWrapper.classList.remove('fixed-space');
    }

    if (scrollingByClick) return;

    let currentSection = null;
    document.querySelectorAll("div[class$='_section']").forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom > 150) {
            currentSection = section;
        }
    });

    if (currentSection) {
        const id = currentSection.className.split(" ")[0];
        links.forEach(link => {
            if (link.getAttribute("href") === `#${id}`) {
                if (activeLink !== link) {
                    links.forEach(l => l.classList.remove("active"));
                    link.classList.add("active");
                    activeLink = link;
                    moveIndicator(link);
                }
            }
        });
    } else {
        moveIndicator(activeLink);
    }
});

// navbar ends

// atrakcje scroll 

const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const originalCards = [...carousel.children];
const firstCardWidth = originalCards[0].offsetWidth;

let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;


arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
        maybeAppendSlides();
    });
});

// Start dragging
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
};

// During drag
const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

// End drag
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
    maybeAppendSlides();
};


const maybeAppendSlides = () => {
    const scrollRightEdge = carousel.scrollLeft + carousel.offsetWidth;
    const nearEnd = scrollRightEdge + firstCardWidth * 2 >= carousel.scrollWidth;

    if (nearEnd) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            carousel.appendChild(clone);
        });
    }
};

// Auto scroll
const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return;
    timeoutId = setTimeout(() => {
        carousel.scrollLeft += firstCardWidth;
        maybeAppendSlides();
        autoPlay();
    }, 2500);
};

// Init
autoPlay();
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);


// CENNIK FETCH
fetch('cennik.json')
    .then(response => response.json())
    .then(data => {
    const tbody = document.querySelector('.cennik_tabelka tbody');
    const textDiv = document.querySelector('.cennik_text');
    const regulaminList = document.querySelector('#regulamin_list')

    data.cennik.forEach(pozycja => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${pozycja.termin}</td><td>${pozycja.cena}</td>`;
        tbody.appendChild(row);
    });

    data.opis.forEach(linia => {
        const p = document.createElement('p');
        p.innerHTML = linia;
        textDiv.appendChild(p);
    });

    data.regulamin.forEach(linia => {
        const li = document.createElement('li');
        li.innerHTML = linia;
        regulaminList.appendChild(li);
    });
})
.catch(error => {
    console.error('Błąd podczas wczytywania danych cennika:', error);
});