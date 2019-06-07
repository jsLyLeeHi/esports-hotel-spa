<template>
  <div class="topUp">
    <div class="topUp-top">
      <div>
        <span></span>
        <span>充值金额</span>
      </div>
      <span>会员号 {{mid}}</span>
    </div>
    <div class="topUp-content">
      <ul>
        <li
          v-for="(item,index) in moneys"
          :key="index"
          class="topUp-content-li"
          :class="{'topUp-content-li-active': activeName === index }"
          @click="changeClass(index)"
        >
          <img v-if="activeName === index" :src="activeMoneyIcon">
          <img v-else :src="MoneyIcon">
          <span :class="{'android-padding':$isAndroid}">{{item.money}}元</span>
        </li>
      </ul>
      <div
        class="topUp-content-balance"
        :class="{'topUp-content-balance-active': activeName === false}"
        @click="changeClass(false)"
      >
        <div v-if="activeName !== false" class="topUp-content-balance-hide">
          <img :src="MoneyIcon">
          <span :class="{'android-padding':$isAndroid}">其他金额</span>
        </div>
        <div v-if="activeName === false" class="topUp-content-balance-show">
          <div class="topUp-content-balance-show-money">
            <input type="number" v-model="payment">
            <span>元</span>
          </div>
          <div class="topUp-content-balance-show-tip">请输入金额(元)</div>
        </div>
      </div>
    </div>
    <div>
      <div class="confirm-pay" @click="confirmPay()">
        <div :class="{'android-padding':$isAndroid}">确认支付</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            payment: 100,
            activeName: true,
            activeMoneyIcon: require('_images_/money02@2x.png'),
            MoneyIcon: require('_images_/money03@2x.png'),
            mid: '',
            moneys: []
        };
    },
    methods: {
        changeClass(item) {
            this.activeName = item;
            if (this.activeName !== false) {
                this.payment = 100;
            }
        },
        confirmPay() {
            if (this.activeName === false) {
                if (this.payment === 0) {
                    return this.$toast({
                        position: 'bottom',
                        message: '请选择充值金额'
                    });
                } else if (!this.$common.numSeparator(this.payment).type) {
                    return this.$toast({
                        position: 'bottom',
                        message: this.$common.numSeparator(this.isPhone).text
                    });
                } else {
                    console.log(this.payment);
                    this.createOrder(this.payment);
                }
            } else {
                console.log(this.moneys[this.activeName].money);
                this.createOrder(this.moneys[this.activeName].money);
            }
        },
        //获取充值的金额
        async getRechargeNum() {
            let url = '/index/pay/getRechargeNum',
                param = {},
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            console.log(res);
            if (res.code == '0') {
                this.moneys = res.data;
            }
        },
        // c创建订单
        async createOrder(par) {
            let url = '/index/order/createOrder',
                param = {
                    type: '4',
                    recharge: par
                },
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            console.log(res);
            console.log(param);
            if (res.code == '0') {
                console.log(res.data.id);
                this.distPayWay(res.data.id);
            }
        },
        //发起支付
        async distPayWay(par) {
            let url = '/index/pay/distPayWay',
                param = {
                    type: '1',
                    order: par
                },
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            console.log(res);
            if (res.code == '0') {
                // console.log(res.data);
                let p = {
                    order: res.data.order
                };
                location.href = GlobalUrl + 'index/pay/wxPay?data=' + encodeURIComponent(JSON.stringify(p));
            }
        }
        //支付
    },
    mounted() {
        this.getRechargeNum();
        console.log(this.$isAndroid);

        this.mid = JSON.parse(sessionStorage.userInfo).mid;
    }
};
</script>
