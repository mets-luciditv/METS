module.exports = {
    apps : [{
        name        : "METS",
        script      : "./bin/www",
    env: {
            "dbHost":'localhost',
            "dbUser":'root',
            "dbPassword":'',
            'dbDatabase':'METS',
            "pageImageRoot": "/data/metseditor/pageImage",
        },
    env_production : {
        "WWW_ROOT": "public/build/production/METS",
        "PORT": "8001",
        "LOG_LEVEL":"info"
    }
    }]
}

