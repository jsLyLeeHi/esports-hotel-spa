let bodyCls = 'modal-helper-open',
    scrollTop;
export default class common {
    //防止多次点击
    static throttle(fn, beginTime) {
        if (beginTime == null || beginTime == undefined) {
            beginTime = 1500;
        }
        let lastTime = null;
        return function() {
            let nowTime = new Date();
            if (nowTime - lastTime > beginTime || !lastTime) {
                fn.apply(this, arguments);
                lastTime = nowTime;
            }
        };
    }
    //校验手机号
    static verifyPhone(num) {
        let reg = /(^1(3[0-9]|4[5-8]|5[0-35-9]|66|8[0-9]|7[0-8]|9[89])\d{8}$)/,
            param;
        if (!reg.test(num)) {
            param = {
                type: false,
                text: '手机号格式错误'
            };
        } else {
            param = {
                type: true,
                text: '手机号格式正确'
            };
        }
        return param;
    }
    //手机号分隔
    static phoneSeparator(value) {
        return value.replace(/\B(?=(?:\d{4})+$)/g, '-');
    }
    //仅为正整数
    static numSeparator(value) {
        let reg = /^[0-9]*[1-9][0-9]*$/,
            param;
        if (!reg.test(value)) {
            param = {
                type: false,
                text: '填写数字不正确'
            };
        } else {
            param = {
                type: true,
                text: '填写正确'
            };
        }
        return param;
    }
    //最多两位小数
    static floatNumSeparator(value) {
        let reg = /^\d+(\.\d{0,2})?$/,
            param;
        if (!reg.test(value)) {
            param = {
                type: false,
                text: '填写数字不正确'
            };
        } else {
            param = {
                type: true,
                text: '填写正确'
            };
        }
        return param;
    }
    //防止弹出层穿透滚动
    static modalHelperOpen() {
        scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add(bodyCls);
        document.body.style.top = -scrollTop + 'px';
    }
    static modalHelperClose() {
        document.body.classList.remove(bodyCls);
        document.scrollingElement.scrollTop = scrollTop;
    }
    //IOS12 input键盘问题
    static isScroll() {
        let isScrollTop;
        isScrollTop = document.body.scrollTop;
        scrollTo(0, isScrollTop);
    }
    static isAndroid() {
        return navigator.userAgent.indexOf('Android') > -1;
    }
}
