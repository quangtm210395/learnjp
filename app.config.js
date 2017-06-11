'use strict';

var appBase = './client';

var paths = {

    nodeModules: './node_modules',

    base: appBase,
    asset: appBase + '/asset',
    vendor: {
        js: appBase + '/asset/vendor/js',
        css: appBase + '/asset/vendor/css',
        fonts: appBase + '/asset/vendor/fonts'
    }
};

var Config = {
    paths: paths
};

module.exports = Config;