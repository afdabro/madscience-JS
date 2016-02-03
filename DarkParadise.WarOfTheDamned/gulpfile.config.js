'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        this.publicDir = './public';
        this.source = './src/';
        this.sourceApp = this.source + 'app/';

        // TypeScript and JavaScript settings
        this.tsOutputPath = this.sourceApp + '/js';
        this.allJavaScript = this.sourceApp + '/js/**/*.js';
        this.mainJavaScript = 'main.js';
        this.allTypeScript = this.sourceApp + '/ts/**/*.ts';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = this.typings + '**/*.ts';
        this.vendorPath = './src/app/vendor';

        // CSS settings
        this.allCSS = this.sourceApp + '/css/*.css';
        this.mainCSS = 'main.css';
        this.uncssHtml = ['src/app/index.html'];

        // HTML settings
        this.allHtml = this.sourceApp + '*.html';

        // Express Server and Browser Sync settings
        this.BROWSER_SYNC_RELOAD_DELAY = 500;
        this.expressServer = 'expressServer.js';
        this.expressServerCoreFiles = [this.expressServer];
        this.browserSyncProxy = 'http://localhost:3000';
        this.browserSyncPort = 4000;
        this.browserSyncBrowsers = ['google-chrome'];

        // Bower settings
        this.bower = require("./bower.json");
        this.bowerPath = './bower_components';

        // Copy files settings
        this.copyFiles = require("./configs/copy.config.json");
    }
    return gulpConfig;
})();
module.exports = GulpConfig;