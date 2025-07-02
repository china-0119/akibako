// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
            mobileMenuBtn.classList.toggle('menu-open');
        });
    }
    
    // Order form validation and submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        // Set minimum date to 2 days from today
        const pickupDateInput = document.getElementById('pickup-date');
        if (pickupDateInput) {
            const today = new Date();
            const minDate = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
            const maxDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
            
            pickupDateInput.min = minDate.toISOString().split('T')[0];
            pickupDateInput.max = maxDate.toISOString().split('T')[0];
        }
        
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const formData = new FormData(orderForm);
            const errors = validateOrderForm(formData);
            
            if (errors.length > 0) {
                alert('入力内容を確認してください：\n' + errors.join('\n'));
                return;
            }
            
            // Show success message
            if (confirm('予約を確定しますか？')) {
                // In a real application, this would send data to a server
                alert('予約を受け付けました。\n確認のお電話をさせていただきます。\nありがとうございます。');
                
                // Reset form
                orderForm.reset();
                
                // Log the order data (for demonstration)
                console.log('Order submitted:', Object.fromEntries(formData));
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav && nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    mobileMenuBtn.classList.remove('menu-open');
                }
            }
        });
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
});

// Form validation function
function validateOrderForm(formData) {
    const errors = [];
    
    const pickupDate = formData.get('pickup-date');
    const pickupTime = formData.get('pickup-time');
    const menuType = formData.get('menu-type');
    const quantity = formData.get('quantity');
    const customerName = formData.get('customer-name');
    const phone = formData.get('phone');
    
    // Validate pickup date
    if (!pickupDate) {
        errors.push('・受取希望日を選択してください');
    } else {
        const selectedDate = new Date(pickupDate);
        const today = new Date();
        const minDate = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
        
        if (selectedDate < minDate) {
            errors.push('・受取希望日は2日後以降を選択してください');
        }
    }
    
    // Validate pickup time
    if (!pickupTime) {
        errors.push('・受取希望時間を選択してください');
    }
    
    // Validate menu type
    if (!menuType) {
        errors.push('・弁当の種類を選択してください');
    }
    
    // Validate quantity
    const quantityNum = parseInt(quantity);
    if (!quantity || quantityNum < 1 || quantityNum > 20) {
        errors.push('・数量は1個以上20個以下で入力してください');
    }
    
    // Validate customer name
    if (!customerName || customerName.trim().length < 1) {
        errors.push('・お名前を入力してください');
    }
    
    // Validate phone number
    if (!phone) {
        errors.push('・電話番号を入力してください');
    } else {
        const phonePattern = /^[\d\-\+\(\)\s]+$/;
        if (!phonePattern.test(phone) || phone.replace(/[\D]/g, '').length < 10) {
            errors.push('・正しい電話番号を入力してください');
        }
    }
    
    return errors;
}

// Utility functions
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatPrice(price) {
    return `¥${price.toLocaleString()}`;
}

// Add fade-in animation for elements as they come into view
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe menu items and other cards
    const cards = document.querySelectorAll('.menu-item, .featured-item, .contact-item');
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize fade-in observer when page loads
document.addEventListener('DOMContentLoaded', observeElements);