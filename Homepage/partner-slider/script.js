// Slider with modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.slider-container');
    const sliderTrack = document.querySelector('.slider-track');
    const partnerCards = document.querySelectorAll('.partner-card');
    const modal = document.getElementById('partnerModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalRole = document.getElementById('modalRole');
    const modalBio = document.getElementById('modalBio');
    
    // Pause animation on hover (desktop)
    sliderContainer.addEventListener('mouseenter', () => {
        sliderTrack.style.animationPlayState = 'paused';
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        sliderTrack.style.animationPlayState = 'running';
    });

    // Pause on individual card hover (desktop)
    partnerCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            sliderTrack.style.animationPlayState = 'paused';
        });
        
        card.addEventListener('mouseleave', () => {
            if (!sliderContainer.matches(':hover')) {
                sliderTrack.style.animationPlayState = 'running';
            }
        });

        // Open modal on click
        card.addEventListener('click', () => {
            const img = card.querySelector('.partner-image');
            const name = card.querySelector('.partner-name');
            const role = card.querySelector('.partner-role');
            const bio = card.querySelector('.partner-bio');

            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalName.innerHTML = name.innerHTML; // Use innerHTML to preserve styling
            modalRole.textContent = role.textContent;
            modalBio.textContent = bio ? bio.textContent : '';

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    });

    // Close modal on close button click
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    });

    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Intersection Observer for performance
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sliderTrack.style.animationPlayState = 'running';
            } else {
                sliderTrack.style.animationPlayState = 'paused';
            }
        });
    }, observerOptions);

    observer.observe(sliderContainer);
});
