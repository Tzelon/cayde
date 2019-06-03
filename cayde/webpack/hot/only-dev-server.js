/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __webpack_hash__ */

if (module.hot) {
    var hotPollInterval = 300; //+__resourceQuery.substr(1) || 10 * 60 * 1000;

    var log = require('webpack/hot/log');
    var check = function check(fromUpdate) {
        module.hot
            .check()
            .then(function(updatedModules) {
                if (!updatedModules) {
                    if (fromUpdate) log('info', '[HMR] Update applied.');
                    return;
                }

                return module.hot
                    .apply({
                        ignoreUnaccepted: true,
                        ignoreDeclined: true,
                        ignoreErrored: true,
                        onUnaccepted: function(data) {
                            log(
                                'warning',
                                'Ignored an update to unaccepted module ' +
                  data.chain.join(' -> ')
                            );
                        },
                        onDeclined: function(data) {
                            log(
                                'warning',
                                'Ignored an update to declined module ' +
                  data.chain.join(' -> ')
                            );
                        },
                        onErrored: function(data) {
                            log('error', data.error);
                            log(
                                'warning',
                                'Ignored an error while updating module ' +
                  data.moduleId +
                  ' (' +
                  data.type +
                  ')'
                            );
                        }
                    })
                    .then(function(renewedModules) {
                        check(true);
                        require('webpack/hot/log-apply-result')(
                            updatedModules,
                            renewedModules
                        );
                    });
            })
            .catch(function(err) {
                var status = module.hot.status();
                if (['abort', 'fail'].indexOf(status) >= 0) {
                    log(
                        'warning',
                        '[HMR] Cannot check for update. Need to do a full reload!'
                    );
                    log('warning', '[HMR] ' + (err.stack || err.message));
                } else {
                    log(
                        'warning',
                        '[HMR] Update check failed: ' + (err.stack || err.message)
                    );
                }
            });
    };

    setInterval(function() {
        var status = module.hot.status();
        if (status === 'idle') {
           
            check();
        } else if (['abort', 'fail'].indexOf(status) >= 0) {
            log(
                'warning',
                '[HMR] Cannot apply update as a previous update ' +
          status +
          'ed. Need to do a full reload!'
            );
        }
    }, hotPollInterval);
    log('info', '[HMR] Waiting for update signal from WDS...');
} else {
    throw new Error('[HMR] Hot Module Replacement is disabled.');
}
