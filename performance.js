/**
 * @fileOverview 前端性能上报基础库
 * 兼容性说明：主流移动浏览器
 *
 * @author <a href="https://github.com/mopduan/monitor.git">mopduan</a>
 * @version 3.0.0
 */
(function () {
    function report(performanceInfo) {
        var img = new Image();

        img.onload = img.onerror = function () {
            img = img.onload = img.onerror = null;
        };

        img.src = '上报地址?' + serialize(performanceInfo);
    }

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

    function measure() {
        var keys = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd",
            "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "secureConnectionStart",
            "requestStart", "responseStart", "responseEnd", "domLoading",
            "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"
        ];

        var performanceInfo = {};
        performanceInfo.url = window.location.href;

        var timing = window.performance ? window.performance.timing : null;

        if (timing) {
            //获取每个阶段详细时间数据
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                performanceInfo[key] = timing[key];
            }

            performanceInfo.width = window.screen.width;
            performanceInfo.height = window.screen.height;
            performanceInfo.pathName = location.pathname;
            performanceInfo.refer = document.referrer;

            report(performanceInfo);
        }
    }

    window.onload = function () {
        setTimeout(function () {
            measure();
        }, 50);
    }
})();