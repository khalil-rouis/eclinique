import { KONNECT_API_KEY, KONNECT_RECEIVER_WALLET_ID } from "$env/static/private";

export const initKonnectPayment = async (email: string, phone: string, name: string, orderId: string, amount: number) => {
    if (Number(amount) < 100 || Number(amount) > 10000000) return;
    const requestBody = {
        "receiverWalletId": KONNECT_RECEIVER_WALLET_ID,
        "token": "TND",
        "amount": Number(amount),
        "type": "immediate",
        "description": "Payment pour service e-clinique.",
        "acceptedPaymentMethods": ["wallet", "bank_card", "e-DINAR"],
        "lifespan": 10,
        "checkoutForm": false,
        "addPaymentFeesToAmount": true,
        "firstName": name.split(" ")[0],
        "lastName": (name.split(" ").length > 1 ? name.split(" ")[1] : ""),
        "phoneNumber": phone,
        "email": email,
        "orderId": orderId,
        "webhook": "https://merchant.tech/api/notification_payment",
        "theme": "dark"
    };
    const req = await fetch("https://api.sandbox.konnect.network/api/v2/payments/init-payment", {
        method: "POST",
        headers: {
            "x-api-key": KONNECT_API_KEY,
            "content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(requestBody)
    });

    return req;
}