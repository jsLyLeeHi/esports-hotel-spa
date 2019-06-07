<template>
  <div>
    <div class="invoiceEdmit">
      <div v-if="routeQuery" class="invoiceAdd">
        <div
          @click="invoiceStyle(1)"
          :class="{'invoiceApplyFor-active':item.invoice_status==1||item.invoice_status==2}"
          class="invoiceAdd-item"
        >普通发票(纸质)</div>
        <div
          @click="invoiceStyle(3)"
          :class="{'invoiceApplyFor-active':item.invoice_status==3}"
          class="invoiceAdd-item"
        >
          <div>增值税发票(纸质)</div>
          <div class="invoiceApplyFor-active-item">此类仅支持公司</div>
        </div>
      </div>
      <div v-if="routeQuery" class="invoiceAdd-bottom"></div>
      <div class="invoiceEdmit-top">
        <div class="invoiceEdmit-content">
          <div class="invoiceEdmit-content-title">
            <div>抬头类型</div>
          </div>
          <div class="invoiceEdmit-content-right">
            <div v-if="item.invoice_status===3" class="invoiceEdmit-content-right-choice">
              <img :src="images.self">
              <span :class="{'android-padding':$isAndroid}">企业</span>
            </div>
            <div v-else class="invoiceEdmit-content-right-choice" @click="invoiceStyle(1)">
              <img v-if="item.invoice_status===2" :src="images.enterprise">
              <img v-else :src="images.self">
              <span :class="{'android-padding':$isAndroid}">企业</span>
            </div>
            <div
              v-if="item.invoice_status===1 || item.invoice_status===2"
              class="invoiceEdmit-content-right-choice"
              @click="invoiceStyle(2)"
            >
              <img v-if="item.invoice_status===2" :src="images.self">
              <img v-else :src="images.enterprise">
              <span :class="{'android-padding':$isAndroid}">个人</span>
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
      <div class="invoiceEdmit-bot" :class="{'invoiceEdmit-bot-active' : submitStatus === false}">
        <div @click="invoiceUse(1)">保存并使用</div>
        <div @click="invoiceUse(2)">保存</div>
      </div>
    </div>
  </div>
</template>
<script>
import Common from '_utils_/common.js';
export default {
    data() {
        return {
            images: {
                enterprise: require('_images_/choiceno@2x.png'),
                self: require('_images_/choice@2x.png')
            },
            item: {
                invoice_status:
                    JSON.stringify(this.$route.query) == '{}' ? 1 : Number(this.$route.query.invoice_status),
                name: '',
                company_address: '',
                duty_paragraph: '',
                bank_of_deposit: '',
                card_number: '',
                phone: '',
                status: 0
            },
            submitStatus: false,
            routeQuery: JSON.stringify(this.$route.query) == '{}' ? true : false
        };
    },
    watch: {
        item: {
            handler() {
                //监听是否可提交
                switch (this.item.invoice_status) {
                    case 1:
                        if (this.item.name !== '' && this.item.duty_paragraph !== '') {
                            this.submitStatus = true;
                        } else {
                            this.submitStatus = false;
                        }
                        break;
                    case 2:
                        if (this.item.name !== '') {
                            this.submitStatus = true;
                        } else {
                            this.submitStatus = false;
                        }
                        break;
                    case 3:
                        for (const key in this.item) {
                            if (this.item[key] === '') {
                                return (this.submitStatus = false);
                            } else {
                                this.submitStatus = true;
                            }
                        }
                        break;
                }
            },
            deep: true
        }
    },

    methods: {
        //发票默认切换
        invoiceEdmitDefaultSwitch(num) {
            this.item.status = num;
        },
        //发票切换
        invoiceStyle(num) {
            if (JSON.stringify(this.$route.query) == '{}') {
                //从发票管理跳进来
                this.item.invoice_status = num;
                if (num !== 3) {
                    this.item.company_address = '';
                    this.item.bank_of_deposit = '';
                    this.item.card_number = '';
                    this.item.phone = '';
                    if (num === 2) {
                        this.item.duty_paragraph = '';
                    }
                }
                //从预定跳发票再跳进来
            } else if (this.$route.query.invoice_status == '1' && num !== 3) {
                this.item.invoice_status = num;
                if (num === 2) {
                    this.item.duty_paragraph = '';
                }
            }
            console.log(this.item);
        },
        //提交
        invoiceUse: Common.throttle(async function(num) {
            if (this.submitStatus === true) {
                //企业增值税
                if (this.item.invoice_status === 3) {
                    if (!this.$common.numSeparator(this.item.duty_paragraph).type) {
                        return this.$toast({
                            position: 'bottom',
                            message: '税号不正确'
                        });
                    }
                    if (!this.$common.numSeparator(this.item.card_number).type) {
                        return this.$toast({
                            position: 'bottom',
                            message: '卡号不正确'
                        });
                    }
                    if (!this.$common.verifyPhone(this.item.phone).type) {
                        return this.$toast({
                            position: 'bottom',
                            message: '手机号不正确'
                        });
                    }
                }
                //企业普通
                if (this.item.invoice_status === 1) {
                    if (!this.$common.numSeparator(this.item.duty_paragraph).type) {
                        return this.$toast({
                            position: 'bottom',
                            message: '税号不正确'
                        });
                    }
                }
                let url = '/index/Invoice/addInvoice',
                    param = this.item,
                    res = await this.$request.fetch(url, param, 'post');
                res = res.data;
                if (res.code == '0') {
                    if (num === 1) {
                        this.item['id'] = res.data.id;
                        console.log(this.item);
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
    }
};
</script>

