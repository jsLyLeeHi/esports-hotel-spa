<template>
  <div class="invoice">
    <div class="invoice-title" @click="addInvoice()">
      <img :src="images.addImage">
      <span>添加抬头</span>
    </div>
    <ul class="invoice-content">
      <li v-for="(item,index) in list" :key="index" class="invoice-content-li">
        <div
          @click="update(index)"
          class="invoice-content-item-self"
          v-if="item.invoice_status===2"
        >
          <div class="invoice-content-item-enterprise-name">
            <span>{{item.name}}</span>
            <span class="invoice-content-item-enterprise-default" v-if="item.status===1">默认</span>
          </div>
        </div>
        <div @click="update(index)" class="invoice-content-item-enterprise" v-else>
          <div class="invoice-content-item-enterprise-name">
            <span class="invoice-content-enterprise-name">{{item.name}}</span>
            <div class="invoice-content-item-enterprise-default" v-if="item.status===1">默认</div>
          </div>
          <div class="invoice-content-item-tallage">税号 {{item.duty_paragraph}}</div>
        </div>

        <div class="invoice-content-item-use" @click="use(index)">使用</div>
        <div class="invoice-content-item-hide">
          <div @click="updateInvoice(index)">设为默认</div>
          <div @click="delInvoice(index)">删除</div>
        </div>
      </li>
    </ul>
    <confirm-model name="confirmModel" ref="confirmModel" classes="invoice-confirm-model">
      <div class="invoice-confirm-model-title">确认使用？</div>
      <div class="invoice-confirm-model-btn">
        <div @click="cancleUse(0)">取消</div>
        <div @click="cancleUse(1)">确认</div>
      </div>
    </confirm-model>
  </div>
</template>
<script>
import Modal from '_components_/modal';
export default {
    components: {
        confirmModel: Modal
    },
    data() {
        return {
            list: [],
            images: {
                addImage: require('_images_/addtt@2x.png')
            },
            item: {}
        };
    },
    methods: {
        update(index) {
            this.$router.push({
                path: 'invoiceEdmit',
                query: { item: JSON.stringify(this.list[index]) }
            });
        },
        use(index) {
            this.item = this.list[index];
            this.$refs.confirmModel.show();
        },
        //添加抬头
        addInvoice() {
            if (this.$router.query == '') {
                this.$router.push({
                    path: 'invoiceAdd'
                });
            } else {
                this.$router.push({
                    path: 'invoiceAdd',
                    query: {
                        invoice_status: this.$route.query.invoice_status
                    }
                });
            }
        },
        cancleUse(num) {
            if (num === 1) {
                this.$refs.confirmModel.hide();
                this.$store.commit('setInvoice', this.item);
                this.$router.go(-1);
            } else {
                this.$refs.confirmModel.hide();
            }
        },

        //获取发票
        async getUserInvoice() {
            let url = '/index/Invoice/getUserInvoice',
                param = {},
                res = await this.$request.fetch(url, param, 'get');
            res = res.data;
            console.log(res);
            if (res.code == '0') {
                // console.log(JSON.stringify(this.$route.query));
                if (JSON.stringify(this.$route.query) == '{}') {
                    this.list = res.data;
                } else {
                    //发票筛选
                    let tallageInvoice = [],
                        ordinaryInvoice = [];
                    for (let index = 0; index < res.data.length; index++) {
                        if (res.data[index].invoice_status == 3) {
                            tallageInvoice.push(res.data[index]);
                        } else {
                            ordinaryInvoice.push(res.data[index]);
                        }
                    }
                    console.log(this.$route.query.invoice_status);
                    if (this.$route.query.invoice_status == '1') {
                        this.list = ordinaryInvoice;
                    } else if (this.$route.query.invoice_status == '3') {
                        this.list = tallageInvoice;
                    }
                }
                setTimeout(() => {
                    this.removes();
                }, 0);
            }
        },
        //向左划动
        removes() {
            let begin,
                end,
                to_right,
                to_left,
                that = this;
            for (let i in this.list) {
                let item = document.querySelectorAll('.invoice-content-li')[i];

                item.addEventListener(
                    'touchstart',
                    function(event) {
                        if (event.touches.length == 1) {
                            begin = parseInt(event.changedTouches[0].pageX);
                        }
                    },
                    { passive: true }
                );
                item.addEventListener(
                    'touchmove',
                    function(event) {
                        if (event.touches.length == 1) {
                            if (that.storage) {
                                that.storage.style.transition = 'all .7s';
                                that.storage.style.transform = 'translateX(' + 0 + 'px)';
                            }

                            end = parseInt(event.changedTouches[0].pageX);
                            to_left = begin - end;
                            to_right = end - begin;

                            if (Math.abs(to_left > 10)) {
                                that.storage = this;
                                this.style.transition = 'all .7s';
                                this.style.transform = 'translateX(' + -188 + 'px)';
                            }

                            if (Math.abs(to_right > 10)) {
                                this.style.transition = 'all .7s';
                                this.style.transform = 'translateX(' + 0 + 'px)';
                            }
                        }
                    },
                    { passive: true }
                );
            }
        },
        //设为默认
        async updateInvoice(p) {
            this.$toast.loading({
                mask: true,
                message: '更新中...'
            });
            let url = '/index/Invoice/updateInvoice',
                param = { id: this.list[p].id, status: 1 },
                res = await this.$request.fetch(url, param, 'get');
            res = res.data;

            if (res.code == '0') {
                this.$toast.clear();
                // this.getUserInvoice();
                window.location.reload();
            }
        },
        //删除
        async delInvoice(p) {
            this.$toast.loading({
                mask: true,
                message: '删除中...'
            });
            let url = '/index/Invoice/delInvoice',
                param = { id: this.list[p].id },
                res = await this.$request.fetch(url, param, 'get');
            res = res.data;
            if (res.code == '0') {
                this.$toast.clear();
                window.location.reload();
                // this.getUserInvoice();
                // this.style.transition = 'all .7s';
                // this.style.transform = 'translateX(' + 0 + 'rem)';
            }
        }
    },
    mounted() {
        this.getUserInvoice();
    }
};
</script>

