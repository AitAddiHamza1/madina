// وظيفة إضافة منتج إلى السلة
function addToCart(productName) {
    // إظهار إشعار بإضافة المنتج
    showNotification(`تمت إضافة ${productName} إلى سلة التسوق`);
    
    // يمكن إضافة المزيد من المنطق هنا مثل تخزين المنتجات في localStorage
    // أو تحديث عدد العناصر في السلة
    
    console.log(`تمت إضافة ${productName} إلى السلة `);
}

// وظيفة إظهار الإشعارات
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// معالجة نموذج الاتصال
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على قيم النموذج
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // يمكن إضافة التحقق من صحة البيانات هنا
            
            // إظهار إشعار بنجاح الإرسال
            showNotification('تم إرسال رسالتك بنجاح، سنتواصل معك قريباً');
            
            // إعادة تعيين النموذج
            contactForm.reset();
            
            console.log('بيانات النموذج:', { name, email, message });
        });
    }
});