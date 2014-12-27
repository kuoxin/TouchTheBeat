/**
 * using parts from https://github.com/makesites/backbone-session © Makesites.org Initiated by Makis Tracend (@tracend) Distributed through [Makesites.org](http://makesites.org) Released under the [MIT license](http://makesites.org/licenses/MIT)
 */

define([], function () {
    var Storage = {
        sessionStorage: {
            get: function (name) {
                return sessionStorage.getItem(name);
            },
            set: function (name, val) {
                // validation first?
                return sessionStorage.setItem(name, val);
            },
            check: function (name) {
                return ( sessionStorage.getItem(name) !== null );
            },
            clear: function (name) {
                // actually just removing the session...
                return sessionStorage.removeItem(name);
            }
        },

        localStorage: {
            get: function (name) {
                return localStorage.getItem(name);
            },
            set: function (name, val) {
                // validation first?
                return localStorage.setItem(name, val);
            },
            check: function (name) {
                return ( localStorage.getItem(name) !== null );
            },
            clear: function (name) {
                // actually just removing the session...
                return localStorage.removeItem(name);
            }
        },

        cookie: {
            get: function (name) {
                var i, key, value, cookies = document.cookie.split(";");
                for (i = 0; i < cookies.length; i++) {
                    key = cookies[i].substr(0, cookies[i].indexOf("="));
                    value = cookies[i].substr(cookies[i].indexOf("=") + 1);
                    key = key.replace(/^\s+|\s+$/g, "");
                    if (key == name) {
                        return decodeURI(value);
                    }
                }
            },

            set: function (name, val) {
                // automatically expire session in a day
                var expiry = 86400000;
                var date = new Date(( new Date() ).getTime() + parseInt(expiry));
                var value = encodeURI(val) + ((expiry === null) ? "" : "; expires=" + date.toUTCString());
                document.cookie = name + "=" + value;
            },

            check: function (name) {
                var cookie = this.get(name);
                return cookie !== null && cookie !== "";
            },

            clear: function (name) {
                document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
        }
    };
    return Storage;
});