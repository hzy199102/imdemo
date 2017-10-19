webim_config = {
    /**
     * 代理页面
     */
    responseUrl: (window.location.origin ? window.location.origin : window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '')) + "/static/response.html",
    crossDomain: true,

     //appId: 59691075,//内网
     appId: 59691075,//外网
     enterUrl: 'http://pre-dispatch.glodon.com',//外网
     apiPath: 'http://pre-gim.glodon.com/imdemo/', //外网接口地址
     //enterUrl: 'http://192.168.130.28:8081',//内网
     //apiPath: 'http://192.168.130.35:8081/', //内网接口地址
     publicPath: '/'

};




