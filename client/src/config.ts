const config = {
    botLink: import.meta.env.PROD ? "https://t.me/galvpn_bot" : "https://t.me/testgalvpn_bot",
    BACKEND_ENDPOINT_ADDR: import.meta.env.PROD ? "http://5.129.217.100" : "http://127.0.0.1:4000", //TODO: Add Proper Production Address
    referralA: 30,
    referralB: 14,
};

export default config;
