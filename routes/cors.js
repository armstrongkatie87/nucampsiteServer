//set up cors module
const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();//sets cors header of Access Control Allow Origin on res obj w/* as val
exports.corsWithOptions = cors(corsOptionsDelegate);//cks req b/long to whitelist: Access Control Allow Origin on res obj w/whitelist origin as val

//now config routers to use cors