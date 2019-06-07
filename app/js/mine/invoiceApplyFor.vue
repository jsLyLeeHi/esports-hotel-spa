<template>
  <div>
    <ul class="invoiceApplyFor">
      <!-- <li
        v-for="(item,index) in list"
        :class="{'invoiceApplyFor-active':self===index}"
        :key="index"
        @click="invoiceStyle(index)"
      >
        <div>
          <div>{{item.name}}</div>
          <div class="invoiceApplyFor-active-item">{{item.tips}}</div>
        </div>
      </li>-->
      <li :class="{'invoiceApplyFor-active':self===0}" @click="invoiceStyle(0)">
        <div class="li-content">
          <div>不需要发票</div>
        </div>
      </li>
      <li :class="{'invoiceApplyFor-active':self===1||self===2}" @click="invoiceStyle(1)">
        <div class="li-content">
          <div>普通发票(纸质)</div>
        </div>
      </li>
      <li :class="{'invoiceApplyFor-active':self===3}" @click="invoiceStyle(3)">
        <div class="li-content">
          <div class="li-content-add">增值税发票(纸质)</div>
          <div class="invoiceApplyFor-active-item">此类仅支持公司</div>
        </div>
      </li>
    </ul>
    <!-- 不需要发票-->
    <ul v-if="self===0" class="invoiceApplyFor-body">
      <li>
        <div></div>
        <span>
          发票由酒店开具，您可以现在预约发票，退房时在酒店前台
          领取。如需预约，请选择发票类型
        </span>
      </li>
    </ul>
    <!-- 普通发票-->
    <div v-if="self===1 || self===2 || self===3">
      <div class="invoiceEdmit invoiceApplyFor-ordinary">
        <div class="invoiceEdmit-top">
          <div class="invoiceEdmit-content">
            <div class="invoiceEdmit-content-title">
              <div>发票抬头</div>
            </div>
            <div class="invoiceEdmit-content-right invoiceApplyFor-ordinary-right">
              <div class="invoiceApplyFor-ordinary-right-msg">
                <div class="invoice-content-enterprise-name">{{invoiceTitle.name}}</div>
                <div v-if="invoiceTitle==''">请添加抬头信息</div>
              </div>
              <img @click="toInvoice()" :src="images.rightImage">
            </div>
          </div>
          <div class="invoiceEdmit-content">
            <div class="invoiceEdmit-content-title">
              <div>发票项目</div>
            </div>
            <div class="invoiceEdmit-content-right invoiceApplyFor-ordinary-right">
              <div>
                <div>{{invoice.invoiceItem}}</div>
              </div>
            </div>
          </div>
          <div class="invoiceEdmit-content">
            <div class="invoiceEdmit-content-title">
              <div>备注</div>
            </div>
            <div class="invoiceEdmit-content-right invoiceApplyFor-ordinary-right">
              <div>酒店名称及日期</div>
              <img v-if="invoice.isNote==false" :src="images.squareImage" @click="isNote()">
              <img
                class="invoiceApplyFor-ordinary-right-img"
                v-else
                :src="images.square2Image"
                @click="isNote()"
              >
            </div>
          </div>
          <div v-if="invoice.isNote==true" class="invoiceApplyFor-ordinary-note">
            <div>魔王电竞酒店</div>
            <div>{{this.homeMsg.beginDate | dateformat('MM-DD')}}入住，{{this.homeMsg.endDate | dateformat('MM-DD')}}离店，{{this.homeMsg.isDate}}晚</div>
          </div>
        </div>
      </div>
      <div class="invoiceApplyFor-ordinary-submit" @click="invoiceSub()">
        <span :class="{'android-padding':$isAndroid}">提交</span>
      </div>
      <ul class="invoiceApplyFor-body">
        <li>
          <div>·</div>
          <span>发票金额为实际付款金额</span>
        </li>
        <li>
          <div>·</div>
          <span>发票由酒店开具，您可根据领取时间，在前台直接领取发票</span>
        </li>
        <li>
          <div>·</div>
          <span>国家规定2017年7月1日起，申请企业增值税普通发票，需提供公司税号，否则不能作为税收凭证</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
    name: 'invoiceApplyFor',
    data() {
        return {
            self: sessionStorage.userInfoInvoice ? JSON.parse(sessionStorage.userInfoInvoice).invoice_status : 0,
            images: {
                rightImage: require('_images_/up@2x.png'),
                squareImage: require('_images_/note@2x.png'),
                square2Image: require('_images_/note2@2x.png')
            },
            invoiceTitle: sessionStorage.userInfoInvoice ? JSON.parse(sessionStorage.userInfoInvoice) : '',
            invoice: {
                invoiceItem: '住宿费',
                note: '',
                currentDate: new Date().getTime(),
                isNote: false
                // isNote: false
            },
            homeMsg: {
                beginDate: 0,
                endDate: 0,
                isDate: 0
            }
        };
    },
    methods: {
        //顶部切换
        invoiceStyle(index) {
            //不需要发票
            if (index === 0) {
                sessionStorage.removeItem('userInfoInvoiceMsg');
                // console.log(sessionStorage.userInfoInvoiceMsg);

                this.$router.go(-1);
            } else if (index !== this.self) {
                this.invoiceTitle = '';
            }
            this.self = index;
        },
        //是否备注
        isNote() {
            this.invoice.isNote = !this.invoice.isNote;
            console.log(this.invoice.isNote);
            this.$store.commit('setNote', this.invoice.isNote);
        },
        //时间插件
        //跳发票管理
        //     beforeRouteLeave(to, from, next) {
        //     if (to.name === '房型选择') {
        //         //判断是从哪个路由过来的，若是detail页面不需要刷新获取新数据，直接用之前缓存的数据即可
        //         this.$store.commit('setKeepAlive', []);
        //         // this.$destroy();
        //     }
        //     next();
        // },
        toInvoice() {
            if (this.self === 1 || this.self === 2) {
                this.$router.push({
                    path: 'invoice',
                    query: {
                        invoice_status: 1
                    }
                });
            } else if (this.self === 3) {
                this.$router.push({
                    path: 'invoice',
                    query: {
                        invoice_status: 3
                    }
                });
            }
        },

        //发票信息保存
        invoiceSub() {
            if (this.self !== this.invoiceTitle.invoice_status) {
                return this.$toast({
                    position: 'middle',
                    message: '该抬头的发票类型不是所选发票类型',
                    mask: 'true'
                });
            }
            let nodes = '';
            if (this.invoice.isNote === true) {
                nodes = document.querySelector('.invoiceApplyFor-ordinary-note').textContent;
            }
            let param = {
                id: JSON.parse(sessionStorage.userInfoInvoice).id,
                invoiceItem: '住宿费',
                note: nodes
            };
            this.$store.commit('invoiceMsg', param);
            this.$router.go(-1);
        }
    },
    mounted() {
        this.homeMsg = this.$route.query;
        this.invoice.isNote = JSON.parse(this.$store.state.keepAlive.isNote);
        // this.$store.commit('setKeepAlive', ['orderSubmitted', 'invoiceApplyFor']);
    }
};
</script>

