// ==================== سیستم پرداخت کارت به کارت ====================

// اطلاعات حساب مامان (اینجا رو عوض کن)
var bankInfo = {
    cardNumber: '6037-9918-5000-1234',  // شماره کارت
    cardOwner: 'نام مامان',              // اسم صاحب کارت
    phoneNumber: '09123456789',          // شماره تماس
    bankName: 'ملی'                       // اسم بانک
};

// ==================== پرداخت ====================
function checkout() {
    if (cart.length === 0) {
        alert('😔 سبد خرید خالیه!');
        return;
    }
    
    var sum = cart.reduce(function(s, c) { return s + (c.price * c.qty); }, 0);
    
    // ساخت لیست سفارش
    var orderDetails = '';
    cart.forEach(function(c) {
        orderDetails += '• ' + c.name + ' (تعداد: ' + c.qty + ') = ' + (c.price * c.qty).toLocaleString('fa-IR') + ' تومان\n';
    });
    
    // نمایش رسید پرداخت
    showPaymentReceipt(sum, orderDetails);
}

function showPaymentReceipt(total, details) {
    var receipt = 
        '🧾 رسید سفارش\n' +
        '═'.repeat(30) + '\n\n' +
        details + '\n' +
        '═'.repeat(30) + '\n' +
        '💰 مبلغ: ' + total.toLocaleString('fa-IR') + ' تومان\n\n' +
        '💳 اطلاعات کارت:\n' +
        'شماره: ' + bankInfo.cardNumber + '\n' +
        'بانک: ' + bankInfo.bankName + '\n' +
        'به نام: ' + bankInfo.cardOwner + '\n\n' +
        '📞 بعد از پرداخت، رسید رو به شماره ' + bankInfo.phoneNumber + ' بفرستید.\n\n' +
        '📍 آدرس ارسال رو هم پیامک بدید.';
    
    alert(receipt);
    
    // دکمه ارسال به واتساپ
    if (confirm('📱 می‌خوای سفارش رو در واتساپ بفرستی؟')) {
        sendToWhatsapp(total, details);
    }
    
    // خالی کردن سبد
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
}

function sendToWhatsapp(total, details) {
    var msg = '🛒 *سفارش جدید*%0A%0A';
    msg += details.replace(/\n/g, '%0A');
    msg += '%0A💰 *مبلغ: ' + total.toLocaleString('fa-IR') + ' تومان*';
    msg += '%0A%0A📞 لطفاً راهنمایی بفرمایید.';
    
    var phone = bankInfo.phoneNumber.replace(/^0/, '98');
    window.open('https://wa.me/' + phone + '?text=' + msg, '_blank');
}

// ==================== نمایش اطلاعات بانکی در فوتر ====================
function showBankInfo() {
    return '💳 ' + bankInfo.bankName + ' | ' + bankInfo.cardNumber;
}