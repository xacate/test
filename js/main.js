/* ========================================
   颂金楼官网 - 主要 JavaScript（增强版）
   滚动触发、鼠标交互、数字递增、视差等
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // === Header scroll effect ===
    const header = document.querySelector('.header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // 向下滚动隐藏，向上滚动显示
        if (currentScroll > 300) {
            if (currentScroll > lastScroll) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    }
    window.addEventListener('scroll', handleScroll);

    // === Mobile menu toggle ===
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            mobileBtn.textContent = nav.classList.contains('mobile-open') ? '✕' : '☰';
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                mobileBtn.textContent = '☰';
            });
        });
    }

    // === 滚动触发 Reveal 动画 ===
    const revealElements = document.querySelectorAll(
        '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate'
    );

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 80;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    checkReveal();
    window.addEventListener('scroll', checkReveal);

    // === 视差效果 ===
    const parallaxElements = document.querySelectorAll('.parallax');
    function handleParallax() {
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.3;
            const rect = el.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const offset = (rect.top + scrolled - scrolled) * speed;
            el.style.transform = `translateY(${offset * 0.1}px)`;
        });
    }
    window.addEventListener('scroll', handleParallax);

    // === 鼠标跟随光晕 ===
    const glowElements = document.querySelectorAll('.glow-hover');
    glowElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty('--mouse-x', x + '%');
            el.style.setProperty('--mouse-y', y + '%');
        });
    });

    // === 全局鼠标光点 ===
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.opacity = '0';
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function() {
        cursorGlow.style.opacity = '0';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.08;
        cursorY += (mouseY - cursorY) * 0.08;
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // === 卡片 3D Tilt 效果 ===
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // === 数字递增动画 ===
    function animateCountUp() {
        const counters = document.querySelectorAll('.count-up:not(.animated)');
        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                counter.classList.add('animated');
                const target = parseInt(counter.dataset.target) || parseInt(counter.textContent);
                const duration = parseInt(counter.dataset.duration) || 2000;
                const start = 0;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.floor(start + (target - start) * eased);
                    counter.textContent = current.toLocaleString();
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
                requestAnimationFrame(update);
            }
        });
    }
    window.addEventListener('scroll', animateCountUp);
    animateCountUp();

    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 140;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // === 表单提交 ===
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '✓ 已提交（原型演示）';
                btn.classList.add('success');
                btn.style.pointerEvents = 'none';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('success');
                    btn.style.pointerEvents = '';
                }, 2500);
            }
        });
    });

    // === News 分类切换 ===
    const newsCats = document.querySelectorAll('.news-cat');
    if (newsCats.length > 0) {
        newsCats.forEach(cat => {
            cat.addEventListener('click', function(e) {
                e.preventDefault();
                newsCats.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const target = document.querySelector(targetId);
                    if (target) {
                        const headerOffset = 140;
                        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // === 门店筛选 ===
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // === 图片懒加载占位 ===
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // === 页面入场过渡 ===
    document.querySelector('.page-hero')?.classList.add('page-transition');
    document.querySelector('main')?.classList.add('page-transition');

    // === 初始化滚动状态 ===
    handleScroll();

});
