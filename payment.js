// ==================== اطلاعات حساب بانکی ====================
var bankInfo = {
    cardNumber: '______',  // شماره کارت ۱۶ رقمی (بدون خط تیره)
    cardOwner: '______',   // اسم صاحب حساب
    phoneNumber: '______', // شماره تماس برای ارسال رسید
    bankName: '______'     // اسم بانک (مثلاً: ملی، ملت، صادرات)
};

// ==================== نمایش اطلاعات بانکی در فوتر ====================
function showBankInfo() {
    return '💳 ' + bankInfo.bankName + ' | ' + bankInfo.cardNumber;
}

// ==================== ثبت سفارش و پرداخت ====================
function checkout() {
    if (cart.length === 0) {
        alert('😔 سبد خرید خالیه!');
        return;
    }
    
    var sum = cart.reduce(function(s, c) { return s + (c.price * c.qty); }, 0);
    
    // ساخت لیست سفارش
    var orderDetails = '';
    cart.forEach(function(c, i) {
        orderDetails += (i + 1) + '. ' + c.name + ' (×' + c.qty + ') = ' + 
                       (c.price * c.qty).toLocaleString('fa-IR') + ' تومان\n';
    });
    
    // نمایش رسید پرداخت
    var receipt = 
        '🧾 *رسید سفارش*\n' +
        '═'.repeat(35) + '\n\n' +
        '📋 *اقلام سفارش:*\n' + orderDetails + '\n' +
        '═'.repeat(35) + '\n' +
        '💰 *مبلغ قابل پرداخت: ' + sum.toLocaleString('fa-IR') + ' تومان*\n\n' +
        '💳 *اطلاعات کارت:*\n' +
        '   شماره: ' + bankInfo.cardNumber + '\n' +
        '   بانک: ' + bankInfo.bankName + '\n' +
        '   به نام: ' + bankInfo.cardOwner + '\n\n' +
        '📞 *بعد از پرداخت:*\n' +
        '   ۱. از رسید پرداخت عکس بگیرید\n' +
        '   ۲. به شماره ' + bankInfo.phoneNumber + ' بفرستید\n' +
        '   ۳. آدرس ارسال رو هم بنویسید\n\n' +
        '🙏 ممنون از خرید شما! ❤️';
    
    alert(receipt);
    
    // دکمه ارسال به واتساپ
    if (confirm('📱 می‌خوای سفارش رو در واتساپ بفرستی؟')) {
        sendToWhatsapp(sum, orderDetails);
    }
    
    // خالی کردن سبد
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
}

function sendToWhatsapp(total, details) {
    var msg = '🛒 *سفارش جدید*%0A%0A';
    msg += '📋 *اقلام:*%0A' + details.replace(/\n/g, '%0A');
    msg += '%0A💰 *مبلغ: ' + total.toLocaleString('fa-IR') + ' تومان*';
    msg += '%0A%0A📞 لطفاً راهنمایی بفرمایید.';
    
    var phone = bankInfo.phoneNumber.replace(/^0/, '98');
    window.open('https://wa.me/' + phone + '?text=' + msg, '_blank');
}