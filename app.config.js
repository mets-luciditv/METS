module.exports = {
    apps : [{
        name        : "METS",
        script      : "./bin/www",
    env: {
            "dbHost":'localhost',
            "dbUser":'root',
            "dbPassword":'A6=t+XQ3ec',
            'dbDatabase':'METS',
            "pageImageRoot": "/data/metseditor/pageImage"
        },
    env_production : {
        "WWW_ROOT": "public/build/production/METS",
        "PORT": "80",
        "LOG_LEVEL":"info"
    }
    }]
}

