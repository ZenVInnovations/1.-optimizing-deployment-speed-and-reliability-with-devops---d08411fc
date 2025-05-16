const{createProxyMiddleware} = require('http-proxy-middleware');
module.exports=function(root){
    root.use(
        '/api',
        createProxyMiddleware({
            target:'http://localhost:5000',
            changeOrigin:true,
            secure:false,
            headers:{
                'Access-Control-Allow-Origin':'http://localhost:3000',
            }
        })
    );
};