const configs = require('../../configs');
const axios = require('axios');

module.exports = {
    search: function (req, res) {
        if (req.body.word) {
            axios.get('http://mazii.net/api/search/' + encodeURI(req.body.word) + '/20/1')
                .then(function (result) {
                    res.json(result.data);
                })
                .catch(function (err) {
                    console.log(err);
                    res.json({
                        status: false,
                        message: err.message
                    });
                });
        } else {
            res.json({
                status: false,
                message: 'Not found!'
            });
        }
    },

    kanji: function (req, res) {
        if (req.params.word) {
            axios.get('http://mazii.net/api/mazii/' + encodeURI(req.params.word) + '/10')
                .then(function (result) {
                    res.json(result.data);
                })
                .catch(function (err) {
                    console.log(err);
                    res.json({
                        status: false,
                        message: err.message
                    });
                });
        } else {
            res.json({
                status: false,
                message: 'Not found!'
            });
        }
    },

    sentence: function (req, res) {
        if (req.params.word) {
            axios.get('http://mazii.net/api/smile/' + encodeURI(req.params.word))
                .then(function (result) {
                    var results = result.data;
                    results.results.forEach(function (item) {
                        let transcript = item.transcription.split("；");
                        let mean = item.mean.split("；");
                        item.transcription = transcript[0];
                        item.mean = mean[0];
                        if (mean.length > 1) {
                            item.transcription_vn = transcript[1];
                            item.mean_vn = mean[1];
                        }
                        var isKanji= function (str) {
                            for (let i = 0; i < str.length; i++) {
                                var a = str.charCodeAt(0)
                                if ("々" == a || (a >= 19968 && 40895 >= a))
                                    return true;
                            }
                            return false;
                        }
                        if (isKanji(item.content)) item.status = 1;
                        else item.status = 2;
                    });
                    res.json(results);
                })
                .catch(function (err) {
                    console.log(err);
                    res.json({
                        status: false,
                        message: err.message
                    });
                });
        } else {
            res.json({
                status: false,
                message: 'Not found!'
            });
        }
    },

    grammars : function(req, res) {
        if (req.params.word) {
            axios.get('http://mazii.net/api/refer/' + encodeURI(req.params.word))
                .then(function (result) {
                    var data = result.data;
                    if (data.results){
                        data.results.forEach(function(item) {
                            var titles = item.title.split("=>");
                            item.title = titles[0];
                            item.desc = titles[1];
                        });
                        res.json(data);
                    } else res.json({
                        status: false,
                        message: 'Not found!'
                    });
                })
                .catch(function (err) {
                    console.log(err);
                    res.json({
                        status: false,
                        message: err.message
                    });
                });
        } else {
            res.json({
                status: false,
                message: 'Not found!'
            });
        }
    },

    grammar : function(req, res) {
        if (req.params.word) {
            axios.get('http://mazii.net/api/grammar/' + encodeURI(req.params.word))
                .then(function (result) {
                    var data = result.data;
                    data.grammar.usages.forEach(function(item) {
                        let mean = item.mean;
                        item.mean = mean.trim().slice(1);
                    });
                    res.json(data);
                })
                .catch(function (err) {
                    console.log(err);
                    res.json({
                        status: false,
                        message: err.message
                    });
                });
        } else {
            res.json({
                status: false,
                message: 'Not found!'
            });
        }
    }
}