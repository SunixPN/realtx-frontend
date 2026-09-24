export const maskPhone = (phone: string) => {
    if (phone.length < 8) return phone;
    const visibleTail = phone.slice(-2);
    const head = phone.slice(0, phone.length - 6);
    return `${head} ··· ·· ${visibleTail}`;
};
