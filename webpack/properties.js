const environments = {
    development: {
        isDev: true,
        apiHost: "http://localhost:8080"
    },
    production: {
        isDev: false,
        apiHost: "https://tonkoslovie.ru"
    }
};

module.exports.load = function load(environment) {
    const properties = environments[environment || "development"];

    console.log(`Load properties for environment '${environment}'`);
    console.table(properties);
    return properties;
};