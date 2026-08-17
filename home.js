// NIT-MITRRA Hero Carousel Controller
document.addEventListener('DOMContentLoaded', () => {
    const nextDom = document.getElementById('next');
    const prevDom = document.getElementById('prev');
    const carouselDom = document.querySelector('.carousel');
    
    if (!carouselDom) return;

    const SliderDom = carouselDom.querySelector('.list');
    const thumbnailBorderDom = carouselDom.querySelector('.thumbnail');
    
    if (!SliderDom || !thumbnailBorderDom) return;

    const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
    if (thumbnailItemsDom.length > 0) {
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    }

    const timeRunning = 3000;
    const timeAutoNext = 7000;
    let runTimeOut;
    let runNextAuto;

    function resetAutoTimer() {
        clearTimeout(runNextAuto);
        runNextAuto = setTimeout(() => {
            if (nextDom) showSlider('next');
        }, timeAutoNext);
    }

    function showSlider(type) {
        const SliderItemsDom = SliderDom.querySelectorAll('.item');
        const currentThumbnails = thumbnailBorderDom.querySelectorAll('.item');
        
        if (SliderItemsDom.length === 0 || currentThumbnails.length === 0) return;

        if (type === 'next') {
            SliderDom.appendChild(SliderItemsDom[0]);
            thumbnailBorderDom.appendChild(currentThumbnails[0]);
            carouselDom.classList.add('next');
        } else {
            SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
            thumbnailBorderDom.prepend(currentThumbnails[currentThumbnails.length - 1]);
            carouselDom.classList.add('prev');
        }

        clearTimeout(runTimeOut);
        runTimeOut = setTimeout(() => {
            carouselDom.classList.remove('next');
            carouselDom.classList.remove('prev');
        }, timeRunning);

        resetAutoTimer();
    }

    if (nextDom) {
        nextDom.addEventListener('click', () => {
            showSlider('next');
        });
    }

    if (prevDom) {
        prevDom.addEventListener('click', () => {
            showSlider('prev');
        });
    }

    resetAutoTimer();
});
