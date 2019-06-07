<template>
  <div>
    <div class="pay-detail">
      <div class="pay-person">
        <div>{{payData.name}} {{payData.phone}}</div>
        <div class="order-number">订单号：{{payData.orderNo}}</div>
      </div>

      <div class="pay-cotent">
        <p>付款时间：{{payData.payTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
        <p>下单时间：{{payData.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
        <p>支付方式：{{payData.payMethod}}</p>
        <p>总价：{{payData.originPrice}}</p>
        <p>实付：<span class="em-color">{{payData.payPrice}}</span> </p>
        <div class="go-home-btn flex-center" @click="goHome">返回</div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            payData: {}
        };
    },
    created() {
        this.payData = JSON.parse(this.$route.query.payData);
        // console.log(JSON.parse(this.$route.query.payData));

        // let payData = {
        //     orderNo: res.data.order_no,
        //     originPrice: res.data.money,
        //     payMethod: '余额支付',
        //     payPrice: res.data.pay_money,
        //     createTime: res.data.create_at * 1000,
        //     payTime: res.data.pay_time * 1000,
        //     type: res.data.type                  1为网吧点餐，2为酒店预订，3为酒店服务,4:余额充值
        // };
    },
    beforeRouteLeave(to, from, next) {
        console.log(to);

        if (to.path === '/serviceOrder') {
            this.$router.replace({
                path: 'service'
            });
        } else if (to.path === '/ordersSubmitted') {
            this.$router.replace({
                path: 'homePage'
            });
        }
        next();
    },
    methods: {
        goHome() {
            this.$router.go(-1);
        }
    }
};
</script>
