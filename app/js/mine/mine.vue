<template>
  <div>
    <div class="mine-top" :style="bgImageStyle">
      <div class="mine-top-load">
        <div class="mine-top-load-head">
          <img v-if="loads" :src="userMsg.image">
          <img v-else :src="loginnoImage">
        </div>
        <div v-if="loads" class="mine-top-load-error">
          <div>{{userMsg.username}}</div>
          <span>会员号 : {{memberMsg.mid}}</span>
        </div>
        <div v-else class="mine-top-load-success" @click="jump('register')">
          <div>点击登录</div>
        </div>
      </div>
    </div>
    <div class="mine-top-user-success">
      <div class="mine-top-user-integral" @click="jump('memberRight')">
        <img :src="integralImage">
        <span>会员中心</span>
      </div>
      <div class="mine-top-user-balance" @click="jump('balance')">
        <img :src="balanceImage">
        <span>我的余额</span>
      </div>
    </div>
    <!-- <div v-else class="mine-top-user-error">
      <div class="mine-top-user-integral">
        <img :src="integralImage">
        <span>积分</span>
      </div>
      <div class="mine-top-user-balance">
        <img :src="balanceImage">
        <span>余额</span>
      </div>
    </div>-->
    <div class="mine-mid">
      <ul>
        <li v-for="(i,index) in list" @click="jump(index)" :key="index" class="mine-mid-record">
          <img :src="i.img">
          <span>{{i.name}}</span>
        </li>
      </ul>
    </div>
    <div class="mine-bot">
      <img :src="phoneImage">
      <span>
        客服电话：
        <a :href="'tel:'+tel">{{phone}}</a>
      </span>
    </div>

    <tab-bar active="2"></tab-bar>
  </div>
</template>

<script>
import BgImage from '_images_/login_me@2x.png';
// import modal from '_components_/modal';
import tabBar from '_components_/tabBar';
import integralPopupsImage from '_images_/integral.png';
export default {
    components: { tabBar: tabBar },
    data() {
        return {
            tel: '15135900378',
            list: [
                { img: require('_images_/record@2x.png'), name: '订单记录' },
                { img: require('_images_/aboutus@2x.png'), name: '关于我们' },
                { img: require('_images_/centre@2x.png'), name: '活动中心' },
                { img: require('_images_/invoice2@2x.png'), name: '发票管理' }
            ],

            userMsg: [],
            bgImageStyle: {
                backgroundImage: 'url(' + BgImage + ')'
            },
            integralImage: require('_images_/memberpoints@2x.png'),
            balanceImage: require('_images_/balance@2x.png'),
            phoneImage: require('_images_/hotline@2x.png'),
            circleImage: require('_images_/circle@2x.png'),
            loginnoImage: require('_images_/loginno@2x.png'),
            integralPopupsImageStyle: {
                backgroundImage: 'url(' + integralPopupsImage + ')'
            },
            integralPopupsCloseBtn: require('_images_/close@2x.png')
        };
    },
    computed: {
        phone() {
            return this.$common.phoneSeparator(this.tel);
        },
        loads() {
            let mid = JSON.parse(sessionStorage.userInfo).mid;
            if (mid == '') {
                return false;
            } else {
                return true;
            }
        },
        memberMsg() {
            return JSON.parse(sessionStorage.userInfo);
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.path == '/register' && JSON.parse(sessionStorage.userInfo).mid != '') {
            console.log('/register');
            this.$router.replace({
                path: 'homePage'
            });
        }
        next();
    },
    methods: {
        //列表跳转
        jump(index) {
            switch (index) {
                case 0:
                    this.$router.push({
                        path: 'orderRecord'
                    });
                    break;
                case 1:
                    this.$router.push({
                        path: 'aboutUs'
                    });
                    break;
                case 2:
                    this.$router.push({
                        path: 'activityCenter'
                    });
                    break;
                case 3:
                    this.$router.push({
                        path: 'invoice'
                    });
                    break;
                case 'register':
                    this.$router.push({
                        path: 'register'
                    });
                    break;
                case 'balance':
                    this.$router.push({
                        path: 'balance'
                    });
                    break;
                case 'memberRight':
                    this.$router.push({
                        path: 'memberRight'
                    });
                    break;
            }
        },
        //请求用户微信基本信息
        async getWechatUserInfo() {
            let url = '/index/user/getWechatUserInfo',
                param = {},
                res = await this.$request.fetch(url, param, 'get');
            res = res.data;
            // console.log(res);
            if (res.code == '0') {
                this.userMsg = res.data;
                console.log(this.userMsg);
            }
        }
    },

    mounted() {
        this.getWechatUserInfo();
        this.$store.dispatch('getUser');
    }
};
</script>


