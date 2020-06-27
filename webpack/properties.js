const environments = {
    development: {
        isDev: true,
        apiHost: "http://localhost:8080",
        mediaHost: "http://localhost"
    },
    production: {
        isDev: false,
        apiHost: "https://tonkoslovie.ru",
        mediaHost: "https://tonkoslovie.ru"
    }
};

module.exports.load = function load(environment) {
    const properties = environments[environment || "development"];

    console.log(`Load properties for environment '${environment}'. \n\nValues: `);
    console.log(properties);
    return properties;
};