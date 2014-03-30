/* TODO: Check env variable for CI setup to set browsers to run */

// Command line options ----------------- 

// Karma configuration -------------------
// Generated on Tue Feb 25 2014 17:32:33 GMT-0800 (PST)
module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['requirejs', 'mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      'test/test-main.js',
      {pattern: 'public/**/*.js', included: false},
      {pattern: 'test/client/*.js', included: false}
    ],

    // list of files to exclude
    exclude: [ ],

    browsers: ['PhantomJS'],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};

