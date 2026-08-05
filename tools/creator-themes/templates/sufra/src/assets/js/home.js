import "lite-youtube-embed";
import BasePage from "./base-page";
import Lightbox from "fslightbox";
window.fslightbox = Lightbox;

class Home extends BasePage {
    onReady() {
        this.initFeaturedTabs();
        this.initHeroCarousel();
    }

    /**
     * used in views/components/home/featured-products-style*.twig
     */
    initFeaturedTabs() {
        app.all('.tab-trigger', el => {
            el.addEventListener('click', ({ currentTarget: btn }) => {
                let id = btn.dataset.componentId;
                // btn.setAttribute('fill', 'solid');
                app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'is-active opacity-0 translate-y-3', 'inactive', tab => tab.id == btn.dataset.target)
                    .toggleClassIf(`#${id} .tab-trigger`, 'is-active', 'inactive', tabBtn => tabBtn == btn);

                // fadeIn active tabe
                setTimeout(() => app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'opacity-100 translate-y-0', 'opacity-0 translate-y-3', tab => tab.id == btn.dataset.target), 100);
            })
        });
        document.querySelectorAll('.s-block-tabs').forEach(block => block.classList.add('tabs-initialized'));
    }

    /**
     * Taghmesa-style hero carousel: scroll-snap viewport with dots + prev/next.
     */
    initHeroCarousel() {
        const viewport = document.querySelector('[data-carousel-viewport]');
        if (!viewport) return;

        const dots = [...document.querySelectorAll('[data-carousel-dots] .hero-carousel__dot')];
        const prev = document.querySelector('[data-carousel-prev]');
        const next = document.querySelector('[data-carousel-next]');
        const slides = [...viewport.querySelectorAll('.hero-slide')];
        if (!slides.length) return;

        const setActive = (index) => {
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };

        const scrollToIndex = (index) => {
            const target = slides[index];
            if (target) {
                viewport.scrollTo({ left: target.offsetLeft - viewport.offsetLeft, behavior: 'smooth' });
            }
        };

        const updateFromScroll = () => {
            const middle = viewport.scrollLeft + viewport.clientWidth / 2;
            let active = 0;
            slides.forEach((slide, i) => {
                const slideMid = slide.offsetLeft + slide.offsetWidth / 2;
                if (Math.abs(slideMid - viewport.offsetLeft - middle) < Math.abs(slides[active].offsetLeft + slides[active].offsetWidth / 2 - viewport.offsetLeft - middle)) {
                    active = i;
                }
            });
            setActive(active);
        };

        dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToIndex(i)));
        if (prev) prev.addEventListener('click', () => {
            const active = dots.findIndex(d => d.classList.contains('active'));
            scrollToIndex(active > 0 ? active - 1 : slides.length - 1);
        });
        if (next) next.addEventListener('click', () => {
            const active = dots.findIndex(d => d.classList.contains('active'));
            scrollToIndex(active < slides.length - 1 ? active + 1 : 0);
        });

        viewport.addEventListener('scroll', () => requestAnimationFrame(updateFromScroll), { passive: true });
        updateFromScroll();
    }
}

Home.initiateWhenReady(['index']);
