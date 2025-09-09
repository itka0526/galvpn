const config = {
    botLink: import.meta.env.PROD ? "https://t.me/galvpn_bot" : "https://t.me/testgalvpn_bot",
    BACKEND_ENDPOINT_ADDR: import.meta.env.PROD ? "https://galvpn.xyz" : "http://127.0.0.1:4000",
    referralA: 30,
    referralB: 14,
};

export default config;
