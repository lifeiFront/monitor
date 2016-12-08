/**
 * @fileOverview 异常错误上报基础库
 * 兼容性说明：主流移动浏览器
 *
 * @author <a href="https://github.com/mopduan/monitor.git">mopduan</a>
 * @version 3.0.0
 */

/**
 * @return window.badjs.report
 */
(function () {
    function serialize(obj) {
        if (typeof obj != 'object') {
            return obj;
        }

        var r = [];

        for (var k in obj) {
            r.push(k + '=' + encodeURIComponent(obj[k]));
        }

        return r.join('&');
    }

    function report(error) {
        if (typeof error != 'object') {
            return false;
        }

        var url = error instanceof Error ? window.location.href : error.url;
        if (!(typeof url == 'string' && url.length)) {
            return false;
        }

        var top_url, page_url = window.location.href;
        try {
            top_url = window.top.location.href;
        } catch (e) {
            top_url = 'no_top';
        }

        var errorInfo = {
            "url": url
        };

        if (error instanceof Error) {
            var message = ['type: ' + error.name];
            errorInfo.v = Math.random();
            errorInfo.message = message.join(';');

            if (typeof error.stack != 'undefined') {
                errorInfo.stack = error.stack;
            }
        } else {
            errorInfo = error;
        }

        var detailInfo = [];
        detailInfo.push('top_url: ' + top_url);
        detailInfo.push(top_url == page_url ? '' : 'page_url:' + page_url);
        detailInfo.push('resolution: ' + window.screen.width + 'x' + window.screen.height);

        if (typeof errorInfo.stack == 'string') {
            detailInfo.push(errorInfo.stack);
        }

        errorInfo.stack = detailInfo.join('||');
        errorInfo.urlWithoutParams = location.protocol + '//' + location.host + location.pathname;

        var img = new Image();
        img.onload = img.onerror = function () {
            img = img.onload = img.onerror = null;
        };

        img.src = '上报地址?' + serialize(errorInfo);
    }

    //get former error handle
    var formerErrorHandle = window.onerror;

    window.onerror = function (message, url, line, column, stack) {
        try {
            if (typeof formerErrorHandle == 'function') {
                formerErrorHandle();
            }
        } catch (e) {

        } finally {
            var errorInfo = {
                "ua": navigator.userAgent
            };

            var msg = [
                message
            ];

            if (typeof line != 'undefined') {
                msg.push(
                    "line: " + line);
            }

            if (typeof column != 'undefined') {
                msg.push('column: ' + column);
            }

            errorInfo.message = msg.join(';');
            errorInfo.url = url;
            //no cache
            errorInfo.v = Math.random();

            if (stack && typeof stack.stack != 'undefined') {
                errorInfo.stack = toBR(stack.stack);
            }

            report(errorInfo);
        }

        return false;
    }

    function toBR(content) {
        if (typeof content !== 'string') {
            return content;
        }

        return content.replace(/[\r|\n]/ig, '||');
    }

    window.badjs = window.badjs || {};
    window.badjs.report = report;
})();