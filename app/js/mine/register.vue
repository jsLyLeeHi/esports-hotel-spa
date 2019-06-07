<template>
  <div>
    <div class="register-logo" :style="logoBgImageStyle">
      <div class="register-logo-content">
        <img :src="logo">
        <div>魔王电竞</div>
        <div>欢迎注册</div>
      </div>
    </div>
    <div class="register-model">
      <div class="register-model-phone">
        <img :src="phoneImage">
        <input
          placeholder="请输入手机号"
          type="tel"
          maxlength="11"
          v-model="isPhone"
          placeholder-style="color:#9B9B9B"
        >
        <span v-if="codeType==0" class="register-model-getcode">获取验证码</span>
        <span
          v-else-if="codeType==1"
          @click="getSmsCode()"
          class="register-model-getcode-active"
        >获取验证码</span>
        <span v-else style="color:#333" class="register-model-getcode-time">重新获取{{overTime}}s</span>
      </div>
      <div class="register-model-code">
        <img :src="codeImage">
        <input
          placeholder="请输入验证码"
          v-model="isCode"
          maxlength="4"
          type="tel"
          placeholder-style="color:#9B9B9B"
        >
      </div>
      <div class="register-model-submit">
        <div @click="submitClickOk()">立即注册</div>
      </div>
    </div>
  </div>
</template>

<script>
import logoBgImage from '_images_/login@2x.png';
import Common from '_utils_/common.js';
export default {
    data() {
        return {
            isPhone: '',
            isCode: '',
            codeType: 0,
            overTime: 60,
            phoneImage: require('_images_/phone@2x.png'),
            codeImage: require('_images_/verification@2x.png'),
            logo: require('_images_/logo.png'),
            logoBgImageStyle: {
                backgroundImage: 'url(' + logoBgImage + ')'
            }
        };
    },
    watch: {
        isPhone: function() {
            if (this.isPhone.length == 11 && this.overTime == 60) {
                this.codeType = 1;
            } else if (this.codeType != 2) {
                this.codeType = 0;
            }
        }
    },
    methods: {
        async getSmsCode() {
            if (!this.$common.verifyPhone(this.isPhone).type) {
                return this.$toast({
                    position: 'bottom',
                    message: this.isPhone
                });
            }
            let url = '/index/index/verification',
                param = {
                    tel: this.isPhone
                },
                res = await this.$request.fetch(url, param, 'get');
            console.log(res);

            if (res.data.code == 0) {
                this.codeType = 2;
                this.interval = setInterval(() => {
                    this.overTime -= 1;
                    if (this.overTime == 0) {
                        this.interval && clearInterval(this.interval);
                        this.codeType = 1;
                        this.overTime = 60;
                    }
                }, 1000);
            } else {
                return this.$toast({
                    position: 'bottom',
                    message: res.data.msg
                });
            }
        },
        submitClickOk: Common.throttle(async function() {
            if (!this.$common.verifyPhone(this.isPhone).type) {
                return this.$toast({
                    position: 'bottom',
                    message: this.$common.verifyPhone(this.isPhone).text
                });
            }
            if (this.isCode.length != 4) {
                return this.$toast({
                    position: 'bottom',
                    message: '验证码不正确'
                });
            }

            let url = '/index/user/register',
                param = {
                    tel: this.isPhone,
                    code: this.isCode
                },
                res = await this.$request.fetch(url, param, 'post');

            console.log(res);

            switch (res.data.code) {
                case 0:
                    this.toasts('注册成功');
                    this.$store.dispatch('getUser');
                    setTimeout(() => {
                        this.$toast.clear();
                        this.$router.push({ path: 'mine' });
                    }, 1000);
                    break;
                case 10003:
                    this.toasts('手机号码不正确');
                    break;
                case 10004:
                    this.toasts('验证码过期或错误');
                    break;
                case 10005:
                    this.toasts('系统错误');
                    break;
            }
        }, 3000),
        toasts(params) {
            this.isPhone = '';
            this.isCode = '';
            this.$toast({
                position: 'bottom',
                message: params,
                mask: true
            });
        }
    }
};
</script>
