document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================================================
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // 2. HEADER SCROLL EFFECT
    // ==========================================================================
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    if (header) {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Run once on load
    }

    // ==========================================================================
    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Once animated, we don't need to observe it anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // 4. TESTIMONIALS SLIDER
    // ==========================================================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 6000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        // Initialize first slide and start auto scroll
        showSlide(currentSlide);
        startInterval();
    }

    // ==========================================================================
    // 5. ACCORDION (FAQ / SERVICES DETAILED)
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const parent = header.parentElement;
                const isActive = parent.classList.contains('active');

                // Close all other accordions
                document.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Toggle current accordion
                if (!isActive) {
                    parent.classList.add('active');
                }
            });
        });
    }

    // ==========================================================================
    // 6. FORM VALIDATION & SUBMISSION
    // ==========================================================================
    const bookingForm = document.getElementById('consultation-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const closeModalConfirmBtn = document.getElementById('modal-confirm-btn');

    // Phone validation regex (accepts digits, spaces, plus, brackets, dashes. Min 7 digits)
    const phoneRegex = /^[\d\s()+-]{7,20}$/;

    if (bookingForm) {
        const inputs = bookingForm.querySelectorAll('.form-input');

        // Inline validation on input/change
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateField(input);
            });
            input.addEventListener('blur', () => {
                validateField(input);
            });
        });

        const validateField = (input) => {
            let isValid = true;
            
            if (input.required && !input.value.trim()) {
                isValid = false;
            }

            if (input.type === 'tel' && input.value.trim()) {
                isValid = phoneRegex.test(input.value.trim());
            }

            if (input.type === 'checkbox' && input.required) {
                isValid = input.checked;
            }

            if (isValid) {
                input.classList.remove('invalid');
            } else {
                input.classList.add('invalid');
            }

            return isValid;
        };

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Form is valid - in a real site this would send data via fetch/ajax
                console.log('Form submitted successfully!');
                
                // Show success modal
                if (successModal) {
                    successModal.classList.add('active');
                }
                
                // Reset form
                bookingForm.reset();
                inputs.forEach(input => input.classList.remove('invalid'));
            }
        });
    }

    // Close Modal Controls
    if (successModal) {
        const closeModal = () => successModal.classList.remove('active');

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (closeModalConfirmBtn) closeModalConfirmBtn.addEventListener('click', closeModal);
        
        // Close modal clicking background
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    // ==========================================================================
    // 7. INTERACTIVE CANVAS BACKGROUND
    // ==========================================================================
    const canvas = document.getElementById('canvas-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        };

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        // Track mouse position relative to canvas
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1; // particle size 1px to 3px
                this.baseX = this.x;
                this.baseY = this.y;
                // very slow motion speed
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.25;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(197, 160, 89, 0.4)'; // subtle gold
                ctx.fill();
            }

            update() {
                // Constant slow drifting
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interaction - gentle attraction or repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        // Gentle pull towards mouse
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x += (dx / distance) * force * 0.5;
                        this.y += (dy / distance) * force * 0.5;
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            // determine particle count based on size
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 55);
            for (let i = 0; i < count; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        };

        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        // Drawing line with opacity based on distance
                        const opacity = (120 - distance) / 120 * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(197, 160, 89, ${opacity})`; // gold lines
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            connectParticles();
            requestAnimationFrame(animate);
        };

        // Initialize Canvas
        resizeCanvas();
        initParticles();
        animate();
    }

    // ==========================================================================
    // 8. SMOOTH SCROLL + SCROLLSPY
    // ==========================================================================

    // — Плавная прокрутка к секции при клике на ссылку навигации
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            // Пропускаем пустые якоря и якори обработчиков
            if (!hash || hash === '#' || link.hasAttribute('onclick')) return;

            const target = document.querySelector(hash);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });

            // Закрываем мобильное меню если открыто
            const nav  = document.querySelector('.nav');
            const burger = document.querySelector('.burger');
            if (nav  && nav.classList.contains('active'))    nav.classList.remove('active');
            if (burger && burger.classList.contains('active')) burger.classList.remove('active');
        });
    });

    // — ScrollSpy: подсвечиваем активную вкладку при прокрутке
    const spySections = ['#home', '#about', '#services', '#contacts']
        .map(id => document.querySelector(id))
        .filter(Boolean);

    const spyLinks = document.querySelectorAll('.nav-link');

    const onScroll = () => {
        const scrollY = window.scrollY;
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;

        let current = spySections[0];

        spySections.forEach(section => {
            if (scrollY >= section.offsetTop - headerHeight - 60) {
                current = section;
            }
        });

        spyLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${current.id}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // запустить сразу при загрузке
});
