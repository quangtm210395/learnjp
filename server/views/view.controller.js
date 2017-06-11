/**
 * Created by phanmduong on 5/17/17.
 */
const uuidV4 = require('uuid/v4');

module.exports = {

    videocall: function (req, res) {
        res.render('videocall.ejs', {peer_id: req.query.peer_id});
    },
    randomCall: function (req, res) {
        res.render('randomcall.ejs', {peer_id: uuidV4()});
    }
}