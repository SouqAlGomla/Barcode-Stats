// ===================================
// سوبر ماركت - JavaScript
// ===================================

// متغيرات عامة
let cart = [];
let cartTotal = 0;
let cartCount = 0;

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadCartFromStorage();
    setupEventListeners();
    animateElements();
});

// تهيئة التطبيق
function initializeApp() {
    console.log('🛒 تطبيق سوبر ماركت جاهز!');
    updateCartDisplay();
    
    // إضافة تأثير التحميل للمنتجات
    const products = document.querySelectorAll('.product-card');
    products.forEach((product, index) => {
        setTimeout(() => {
            product.classList.add('fade-in');
        }, index * 50);
    });
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // التنقل في القائمة السفلية
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // إضافة تأثير الاهتزاز
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    });
}

// ===================================
// وظائف السلة
// ===================================

// إضافة منتج للسلة
function addToCart(productName, price) {
    // البحث عن المنتج في السلة
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // تحديث العداد والمجموع
    cartCount++;
    cartTotal += price;
    
    // حفظ السلة
    saveCartToStorage();
    
    // تحديث العرض
    updateCartDisplay();
    
    // إظهار رسالة نجاح
    showNotification(`✅ تمت إضافة ${productName} إلى السلة`);
    
    // تأثير صوتي (اختياري)
    playAddToCartAnimation();
}

// تحديث عرض السلة
function updateCartDisplay() {
    // تحديث شارة السلة في الهيدر
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        if (cartCount > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
    
    // تحديث السلة العائمة
    const floatingCart = document.getElementById('floatingCart');
    const floatingCartCount = document.getElementById('floatingCartCount');
    const floatingCartTotal = document.getElementById('floatingCartTotal');
    
    if (floatingCart && floatingCartCount && floatingCartTotal) {
        if (cartCount > 0) {
            floatingCart.style.display = 'flex';
            floatingCartCount.textContent = cartCount;
            floatingCartTotal.textContent = `${cartTotal} ريال`;
        } else {
            floatingCart.style.display = 'none';
        }
    }
}

// حفظ السلة في التخزين المحلي
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount);
    localStorage.setItem('cartTotal', cartTotal);
}

// تحميل السلة من التخزين المحلي
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedCount = localStorage.getItem('cartCount');
    const savedTotal = localStorage.getItem('cartTotal');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = parseInt(savedCount) || 0;
        cartTotal = parseFloat(savedTotal) || 0;
        updateCartDisplay();
    }
}

// عرض السلة
function viewCart() {
    if (cart.length === 0) {
        showNotification('🛒 السلة فارغة! ابدأ بإضافة المنتجات');
        return;
    }
    
    let cartHTML = '<div style="background: white; padding: 20px; border-radius: 16px; max-width: 500px; margin: 20px auto;">';
    cartHTML += '<h2 style="color: #E53935; margin-bottom: 20px; text-align: center;">🛒 سلة التسوق</h2>';
    
    cart.forEach((item, index) => {
        cartHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #f0f0f0;">
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px;">${item.name}</div>
                    <div style="color: #757575; font-size: 14px;">الكمية: ${item.quantity}</div>
                </div>
                <div style="text-align: left;">
                    <div style="color: #E53935; font-weight: bold; font-size: 18px;">${item.price * item.quantity} ريال</div>
                    <button onclick="removeFromCart(${index})" style="background: #ff5252; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px;">حذف</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #E53935;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-bottom: 20px;">
                <span>المجموع الكلي:</span>
                <span style="color: #E53935;">${cartTotal} ريال</span>
            </div>
            <button onclick="checkout()" style="width: 100%; background: linear-gradient(135deg, #E53935 0%, #C62828 100%); color: white; border: none; padding: 15px; border-radius: 24px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);">
                إتمام الطلب 🚀
            </button>
            <button onclick="closeModal()" style="width: 100%; background: #f5f5f5; color: #757575; border: none; padding: 12px; border-radius: 24px; font-size: 16px; cursor: pointer; margin-top: 10px;">
                متابعة التسوق
            </button>
        </div>
    `;
    
    cartHTML += '</div>';
    
    showModal(cartHTML);
}

// حذف منتج من السلة
function removeFromCart(index) {
    const item = cart[index];
    cartCount -= item.quantity;
    cartTotal -= item.price * item.quantity;
    cart.splice(index, 1);
    
    saveCartToStorage();
    updateCartDisplay();
    
    // إعادة عرض السلة
    if (cart.length > 0) {
        viewCart();
    } else {
        closeModal();
        showNotification('🛒 تم إفراغ السلة');
    }
}

// إتمام الطلب
function checkout() {
    showNotification('🎉 شكراً لك! جاري معالجة طلبك...');
    
    // محاكاة معالجة الطلب
    setTimeout(() => {
        showNotification('✅ تم تأكيد طلبك بنجاح! سيتم التوصيل خلال 30 دقيقة');
        
        // إفراغ السلة
        cart = [];
        cartCount = 0;
        cartTotal = 0;
        saveCartToStorage();
        updateCartDisplay();
        closeModal();
    }, 2000);
}

// ===================================
// وظائف البحث والتصفية
// ===================================

// البحث عن المنتجات
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
            product.classList.add('fade-in');
        } else {
            product.style.display = 'none';
        }
    });
    
    // إظهار رسالة إذا لم يتم العثور على نتائج
    const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');
    if (visibleProducts.length === 0 && searchTerm !== '') {
        showNotification('😔 لم يتم العثور على منتجات مطابقة');
    }
}

// تصفية حسب الفئة
function filterByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (productCategory === category) {
            product.style.display = 'block';
            product.classList.add('fade-in');
        } else {
            product.style.display = 'none';
        }
    });
    
    // التمرير إلى قسم المنتجات
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    showNotification(`📦 عرض منتجات: ${getCategoryName(category)}`);
}

// الحصول على اسم الفئة بالعربية
function getCategoryName(category) {
    const categories = {
        'fruits': 'الفواكه',
        'vegetables': 'الخضروات',
        'dairy': 'الألبان',
        'meat': 'اللحوم',
        'bakery': 'المخبوزات',
        'beverages': 'المشروبات',
        'snacks': 'الوجبات الخفيفة',
        'frozen': 'المجمدات'
    };
    return categories[category] || category;
}

// ===================================
// وظائف العروض
// ===================================

// عرض العروض الخاصة
function showDeals() {
    const dealsSection = document.querySelector('.deals-section');
    if (dealsSection) {
        dealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showNotification('⚡ تصفح العروض الخاصة المحدودة!');
}

// عرض منتجات العرض
function showDealProducts(dealType) {
    if (dealType === 'dairy') {
        filterByCategory('dairy');
    } else if (dealType === 'fresh') {
        // عرض الفواكه والخضروات
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const category = product.getAttribute('data-category');
            if (category === 'fruits' || category === 'vegetables') {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================================
// وظائف القائمة والإشعارات
// ===================================

// تبديل القائمة الجانبية
function toggleMenu() {
    showNotification('📱 القائمة الجانبية قيد التطوير');
}

// تبديل الإشعارات
function toggleNotifications() {
    const notifications = [
        '🎉 عرض خاص: خصم 30% على جميع الفواكه!',
        '🚚 طلبك في الطريق - سيصل خلال 15 دقيقة',
        '⭐ منتجات جديدة متوفرة الآن!'
    ];
    
    let notifHTML = '<div style="background: white; padding: 20px; border-radius: 16px; max-width: 400px; margin: 20px auto;">';
    notifHTML += '<h2 style="color: #E53935; margin-bottom: 20px;">🔔 الإشعارات</h2>';
    
    notifications.forEach(notif => {
        notifHTML += `
            <div style="padding: 15px; background: #f5f5f5; border-radius: 8px; margin-bottom: 10px;">
                ${notif}
            </div>
        `;
    });
    
    notifHTML += '<button onclick="closeModal()" style="width: 100%; background: #E53935; color: white; border: none; padding: 12px; border-radius: 24px; font-size: 16px; cursor: pointer; margin-top: 10px;">إغلاق</button>';
    notifHTML += '</div>';
    
    showModal(notifHTML);
}

// ===================================
// وظائف النوافذ المنبثقة
// ===================================

// عرض نافذة منبثقة
function showModal(content) {
    // إنشاء الخلفية
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    // إنشاء المحتوى
    const modal = document.createElement('div');
    modal.style.cssText = `
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    `;
    modal.innerHTML = content;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // إغلاق عند النقر على الخلفية
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
}

// إغلاق النافذة المنبثقة
function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// عرض إشعار
function showNotification(message) {
    // إزالة الإشعارات السابقة
    const existingNotif = document.getElementById('toast-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // إنشاء إشعار جديد
    const notification = document.createElement('div');
    notification.id = 'toast-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 24px;
        box-shadow: 0 8px 24px rgba(229, 57, 53, 0.4);
        z-index: 10001;
        font-weight: 500;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إزالة بعد 3 ثواني
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===================================
// التأثيرات والأنيميشن
// ===================================

// تأثير إضافة للسلة
function playAddToCartAnimation() {
    // يمكن إضافة تأثيرات صوتية أو بصرية هنا
    console.log('🎯 تم إضافة المنتج!');
}

// تحريك العناصر عند التمرير
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    const elements = document.querySelectorAll('.product-card, .category-card, .deal-card');
    elements.forEach(el => observer.observe(el));
}

// ===================================
// أنماط CSS إضافية للأنيميشن
// ===================================

// إضافة أنماط الأنيميشن ديناميكياً
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// ===================================
// وظائف إضافية
// ===================================

// تحديث الوقت للعروض المحدودة
function updateDealTimers() {
    const timers = document.querySelectorAll('.deal-timer');
    timers.forEach(timer => {
        // محاكاة العد التنازلي
        const text = timer.textContent;
        // يمكن إضافة منطق العد التنازلي الحقيقي هنا
    });
}

// تشغيل تحديث المؤقتات كل دقيقة
setInterval(updateDealTimers, 60000);

// معالجة الأخطاء العامة
window.addEventListener('error', function(e) {
    console.error('حدث خطأ:', e.message);
});

// تسجيل تحميل الصفحة
console.log('✅ تم تحميل جميع السكريبتات بنجاح');
</script>