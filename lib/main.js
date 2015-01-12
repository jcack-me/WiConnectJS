(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define(['superagent'], function(request) {
      root.WiConnectDevice = factory(request);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.WiConnectDevice = factory(superagent);
  }
}(this, function (request) {

  return function(args) {
    args = args || {};

    var device = {
      host:     args.host     || '',
      auth:     args.auth     || null
    };

    var getCommands = [ {adc_take_sample  : 'adc'},
                        {get              : 'get'},
                        {gpio_get         : 'gge'},
                        {help             : 'help'},
                        {ls               : 'ls'},
                        {stream_list      : 'list'},
                        {version          : 'ver'},
                        {wlan_scan        : 'scan'}
                      ];

    var postCommands = [{dac_set_level    : 'dac'},
                        {factory_reset    : 'fac'},
                        {file_create      : 'fcr'},
                        {file_delete      : 'fde'},
                        {file_open        : 'fop'},
                        {ghm_activate     : 'gac'},
                        {ghm_capabilities : 'gca'},
                        {ghm_deactivate   : 'gde'},
                        {ghm_message      : 'gme'},
                        {ghm_read         : 'gre'},
                        {ghm_signup       : 'gsi'},
                        {ghm_sync         : 'gsy'},
                        {ghm_write        : 'gwr'},
                        {gpio_dir         : 'gdi'},
                        {gpio_set         : 'gse'},
                        {http_add_header  : 'had'},
                        {http_download    : 'hdo'},
                        {http_get         : 'hge'},
                        {http_head        : 'hhe'},
                        {http_post        : 'hpo'},
                        {http_read_status : 'hre'},
                        {http_upload      : 'hup'},
                        {load             : 'load'},
                        {mdns_discover    : 'mdns'},
                        {network_down     : 'ndo'},
                        {network_lookup   : 'nlo'},
                        {network_up       : 'nup'},
                        {ota              : 'ota'},
                        {ping             : 'ping'},
                        {pwm_update       : 'pwm'},
                        {reboot           : 'reboot'},
                        {reformat_sflash  : 'reformat'},
                        {save             : 'save'},
                        {set              : 'set'},
                        {setup            : 'setup'},
                        {sleep            : 'sleep'},
                        {stream_close     : 'close'},
                        {stream_poll      : 'poll'},
                        {stream_read      : 'read'},
                        {stream_write     : 'write'},
                        {tcp_client       : 'tcpc'},
                        {tcp_server       : 'tcps'},
                        {tls_client       : 'tlsc'},
                        {tls_server       : 'tlss'},
                        {udp_client       : 'udpc'},
                        {udp_server       : 'udps'},
                        {wlan_get_rssi    : 'rssi'},
                        {wps              : 'wps'}
                      ];

    getCommands.forEach(function(cmd){
      var getFn = function() {

        var args, callback;

        switch(arguments.length){
          case 1:
            if(typeof arguments[0] === 'string') {
              args = arguments[0];
            }
            if(typeof arguments[0] === 'function') {
              callback = arguments[0];
            }
            break;

          case 2:
            if(typeof arguments[0] !== 'string' || typeof arguments[1] !== 'function') {
              return new Error('Invalid arguments');
              break;
            }

            args = arguments[0];
            callback = arguments[1];

            break;
        }

        var uri = device.host + '/command/' + Object.keys(cmd)[0] + ((typeof args !== 'undefined') ? ' ' + args : '');

        var xhr = request.get(uri)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json');

        xhr.onSuccess = function(resp) {
          if(typeof callback === 'function') {
            return callback(null, resp);
          }
        };

        xhr.onFail = function(err, resp) {
          if(typeof callback === 'function') {
            return callback(err, resp);
          }
        };

        xhr.done = function(fn) {
          if(typeof fn !== 'function') {
            throw new Error('Object is not a Function.');
          }

          xhr.onSuccess = fn;
        };

        xhr.fail = function(fn) {
          if(typeof fn !== 'function') {
            throw new Error('Object is not a Function.');
          }

          xhr.onFail = fn;
        };

        xhr.end(function(err, resp) {
          if(err) {
            return xhr.onFail(err, resp);
          }

          xhr.onSuccess(JSON.parse(resp.text));
        });

        return xhr;
      };

      device[Object.keys(cmd)[0]] = getFn;

      if(Object.keys(cmd)[0] !== cmd[Object.keys(cmd)[0]]) {
        device[cmd[Object.keys(cmd)[0]]] = getFn;
      }
    });

    postCommands.forEach(function(cmd){
      var postFn = function(args, callback) {

        var args, callback;

        switch(arguments.length){
          case 1:
            if(typeof arguments[0] === 'string') {
              args = arguments[0];
            }
            if(typeof arguments[0] === 'function') {
              callback = arguments[0];
            }
            break;

          case 2:
            if(typeof arguments[0] !== 'string' || typeof arguments[1] !== 'function') {
              return new Error('Invalid arguments');
              break;
            }

            args = arguments[0];
            callback = arguments[1];

            break;
        }

        var uri = device.host + '/command';

        var xhr = request.post(uri)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(JSON.stringify({flags:0, command: cmd[Object.keys(cmd)[0]] + ' ' + (args ? args : '')}));

        xhr.onSuccess = function(resp) {
          if(typeof callback === 'function') {
            return callback(null, resp);
          }
        };

        xhr.onFail = function(err, resp) {
          if(typeof callback === 'function') {
            return callback(err, resp);
          }
        };

        xhr.done = function(fn) {
          if(typeof fn !== 'function') {
            throw new Error('Object is not a Function.');
          }

          xhr.onSuccess = fn;

          return xhr;
        };

        xhr.fail = function(fn) {
          if(typeof fn !== 'function') {
            throw new Error('Object is not a Function.');
          }

          xhr.onFail = fn;

          return xhr;
        };

        xhr.end(function(err, resp) {
          if(err) {
            return xhr.onFail(err, resp);
          }

          xhr.onSuccess(JSON.parse(resp.text));
        });

        return xhr;
      };

      device[Object.keys(cmd)[0]] = postFn;

      if(Object.keys(cmd)[0] !== cmd[Object.keys(cmd)[0]]) {
        device[cmd[Object.keys(cmd)[0]]] = postFn;
      }
    });

    return device;
  };
}));