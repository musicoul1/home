document.addEventListener('DOMContentLoaded', () => {
    const itemNameElement = document.getElementById('item-name');
    const itemPriceElement = document.getElementById('item-price');
    const totalAmountElement = document.getElementById('total-amount');
    const payNowButton = document.getElementById('pay-now-button');

    // In a real application, this data would likely come from
    // the previous page or be fetched dynamically.
    const itemName = "Example Music Course";
    const itemPrice = 499;
    const totalAmount = itemPrice;

    itemNameElement.textContent = itemName;
    itemPriceElement.textContent = itemPrice;
    totalAmountElement.textContent = totalAmount;

    payNowButton.addEventListener('click', openRazorpayCheckout);

    function openRazorpayCheckout() {
        const options = {
            "key": "rzp_live_ogpa2pelBwJPA3", // Your Razorpay Key ID (LIVE)
            "amount": totalAmount * 100, // Amount in paise (e.g., 499 INR = 49900 paise)
            "currency": "INR",
            "name": "Musicoul",
            "description": "Payment for " + itemName,
            "image": "Resources/Favicon/1.png", // Replace with your logo URL
            "order_id": "", // In a real scenario, you'd fetch/create an order ID from your backend
            "handler": function (response) {
                alert("Payment successful, payment ID: " + response.razorpay_payment_id);
                // Here you would typically send the payment ID and order ID
                // to your backend for verification.
            },
            "prefill": {
                "name": "",
                "email": "",
                "contact": ""
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    }
});