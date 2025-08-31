const config = {
    botLink: import.meta.env.PROD ? "https://t.me/galvpn_bot" : "https://t.me/testgalvpn_bot",
    endpointAddr: import.meta.env.PROD ? "1.1.1.1" : "http://127.0.0.1:4000", //TODO: Add Proper Production Address
};

export default config;
