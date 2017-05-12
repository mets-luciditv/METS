module.exports = {
    apps : [{
        name        : "METS",
        script      : "./bin/www",
    env: {
            "dbHost":'localhost',
            "dbPort":33060,
            "dbUser":'root',
            "dbPassword":'A6=t+XQ3ec'
        },
    env_production : {
        "WWW_ROOT": "public/build/production/METS",
        "PORT": "80"
    }
    }]
}

