<template>
  <div>
    <div class="balance">
      <img :src="money">
      <div>我的零钱</div>
      <div class="balance-change">
        <span>￥</span>
        <span>{{memberMsg.balance}}</span>
      </div>
      <div class="balance-change-button" @click="topUp()">充值</div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            balance: '',
            money: require('_images_/money01@2x.png'),
            memberMsg: 0
        };
    },
    methods: {
        topUp() {
            this.$router.push({
                path: 'topUp'
            });
        }
    },
    mounted() {
        this.memberMsg = JSON.parse(sessionStorage.userInfo).treasure;
    }
};
</script>

