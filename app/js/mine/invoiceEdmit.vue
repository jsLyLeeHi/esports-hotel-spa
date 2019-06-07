<template>
  <div class="invoiceEdmit">
    <div class="invoiceEdmit-top">
      <div class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div>抬头类型</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <div class="invoiceEdmit-content-right-choice">
            <img :src="images.enterprise">
            <span v-if="item.invoice_status===2">个人</span>
            <span v-else>企业</span>
          </div>
        </div>
      </div>
      <div class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div v-if="item.invoice_status!==2">公司抬头</div>
          <div v-if="item.invoice_status===2">抬头名称</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <input
            type="text"
            v-model="item.name"
            placeholder-style="color:#999999"
            placeholder="请输入准确的抬头名称(必填)"
          >
        </div>
      </div>
      <div v-if="item.invoice_status!==2" class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div>公司税号</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <input
            type="text"
            v-model="item.duty_paragraph"
            placeholder-style="color:#999999"
            placeholder="请输入税号(必填)"
          >
        </div>
      </div>
      <div v-if="item.invoice_status===3" class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div>单位地址</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <input
            type="text"
            v-model="item.company_address"
            placeholder-style="color:#999999"
            placeholder="请输入准确的单位地址(必填)"
          >
        </div>
      </div>
      <div v-if="item.invoice_status===3" class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div>电话</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <input
            type="text"
            v-model="item.phone"
            placeholder-style="color:#999999"
            placeholder="请输入电话(必填)"
          >
        </div>
      </div>
      <div v-if="item.invoice_status===3" class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div>开户银行</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <input
            type="text"
            v-model="item.bank_of_deposit"
            placeholder-style="color:#999999"
            placeholder="请输入准确的开户银行(必填)"
          >
        </div>
      </div>
      <div v-if="item.invoice_status===3" class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div>银行账户</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <input
            type="text"
            v-model="item.card_number"
            placeholder-style="color:#999999"
            placeholder="请输入准确的银行账户(必填)"
          >
        </div>
      </div>
      <div class="invoiceEdmit-content">
        <div class="invoiceEdmit-content-title">
          <div>设为默认</div>
        </div>
        <div class="invoiceEdmit-content-right">
          <span
            v-if="item.status===1"
            @click="invoiceEdmitDefaultSwitch(0)"
            class="invoiceEdmit-default-on"
          >
            <i></i>
          </span>
          <span v-else @click="invoiceEdmitDefaultSwitch(1)" class="invoiceEdmit-default-off">
            <i></i>
          </span>
        </div>
      </div>
    </div>
    <div class="invoiceEdmit-bot">
      <div @click="invoiceUse(1)">保存并使用</div>
      <div @click="invoiceUse(2)">保存</div>
    </div>
  </div>
</template>
<script>
import Common from '_utils_/common.js';
export default {
    data() {
        return {
            images: {
                enterprise: require('_images_/choice@2x.png')
            },
            item: '',
            submitStatus: true
        };
    },
    methods: {
        invoiceEdmitDefaultSwitch(num) {
            switch (num) {
                case 1:
                    this.item.status = 1;
                    break;
                case 0:
                    this.item.status = 0;
                    break;
            }
        },
        //提交
        invoiceUse: Common.throttle(async function(num) {
            if (this.submitStatus === true) {
                console.log(1);

                let url = '/index/Invoice/updateInvoice',
                    param = this.item,
                    res = await this.$request.fetch(url, param, 'post');
                res = res.data;

                if (res.code == '0' || res.code == '10024') {
                    if (num === 1) {
                        this.$store.commit('setInvoice', this.item);
                    }
                    this.$router.go(-1);
                }
            } else {
                return this.$toast({
                    position: 'bottom',
                    message: '请填写完整',
                    mask: 'true'
                });
            }
        }, 3000)
    },
    mounted() {
        //防止直接输路径进
        if (this.$route.query.item) {
            this.item = JSON.parse(this.$route.query.item);
        } else {
            this.$router.push({
                path: 'invoice'
            });
        }
    }
};
</script>

