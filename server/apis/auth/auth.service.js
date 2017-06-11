/**
 * Created by phanmduong on 22/03/2017.
 */
var jwt = require('jsonwebtoken');
var config = require('../../configs/index');
var compose = require('composable-middleware');

module.exports = {
    authentication: function () {
        return compose()
            .use(function (req, res, next) {
                jwt.verify(req.headers.token, config.secret, function (err, decoded) {
                    if (err) res.json({status: false, message: err.message}); else {
                        req.user = decoded.data;
                        next();
                    }
                });
            });
    }
}
