import { TUNISSMS_API_KEY, TUNISSMS_API_URL } from "$env/static/private";

export const sendRequest = async (message: string, phone_number: string): Promise<boolean> => {
    const date = new Date();
    const params: Record<string, string> = {
        fct: "sms",
        key: TUNISSMS_API_KEY,
        mobile: "216" + phone_number,
        sms: message,
        sender: "eClinique",
        date: new Intl.DateTimeFormat('en-GB').format(date),
        heure: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
    
    const paramsString = new URLSearchParams(params).toString();
    const req = await fetch(`${TUNISSMS_API_URL}?${paramsString}`);
    if (req.status == 200) {
        console.log(await req.text());
        return true;
    }
    else return false;
}