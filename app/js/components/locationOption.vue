<template>
  <div>
    <div class="location-option-content">
      <div class="title">{{title}}</div>
      <div class="form">
        <div class="form-item">
          <span>请选择</span>
          <div class="item-input location-option">
            <div class="option-item flex-center" @click="locationActive('1')">
              <div class="option-img" :class="{'option-active':location.siteType===1}"></div>
              <div :class="{'android-padding':$isAndroid}">房间号</div>
            </div>
            <div class="option-item flex-center" @click="locationActive('2')">
              <div class="option-img" :class="{'option-active':location.siteType===2}"></div>
              <div :class="{'android-padding':$isAndroid}">座位号</div>
            </div>
          </div>
        </div>

        <div class="form-item room">
          <span>{{location.siteType===1?'房间号':'座位号'}}</span>
          <div class="item-input">
            <input type="text" v-model.lazy.trim="location.site" placeholder="请输入您的位置信息">
          </div>
        </div>
      </div>

      <div class="btn-area flex-center">
        <div class="unkown" @click="unkownLocation">忘记房间号</div>
        <div class="btn flex-center" :class="[smallbtn?'small-btn':'big-btn']" v-on:click="confirm">
          <span :class="{'android-padding':$isAndroid}">确认</span>
        </div>
      </div>

      <div v-if="unkownModal" class="unknow-modal">
        <div class="mask" @click="closeUnkownModal"></div>
        <div class="container">
          <div class="title">有以下几种方法可方便您找到房间</div>
          <div class="content">
            <div class="item" :key="index" v-for="(item,index) in unkownItem">
              <div class="item-num" :class="{'android':$isAndroid}">{{index+1}}</div>
              <div>{{item}}</div>
            </div>
          </div>
          <div class="confirm-btn flex-center" @click="closeUnkownModal">
            <span :class="{'android-padding':$isAndroid}">知道了</span> </div>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
export default {
    data() {
        return {
            location: {
                siteType: 1,
                site: ''
            },
            unkownModal: false,
            unkownItem: [
                '打电话联系酒店前台，告诉工作人员身份证号码查询。',
                '房卡上面有显示房间号',
                '打电话联系酒店前台，告诉工作人员身份证号码查询。',
                '房卡上面有显示房间号'
            ]
        };
    },
    props: {
        title: {
            type: String,
            default: '请准确填写您的位置信息'
        },
        smallbtn: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        locationActive(type) {
            if (this.location.siteType !== Number(type)) {
                this.location.siteType = Number(type);
                this.location.site = '';
            }
        },
        confirm() {
            this.$emit('confirm', this.location.siteType, this.location.site);
        },
        unkownLocation() {
            this.unkownModal = true;
        },
        closeUnkownModal() {
            this.unkownModal = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../../style/basic/_variables';

.location-option-content {
    width: 100%;
    height: 100%;
    padding: 0 10px 20px;
    background-color: #fff;
    .title {
        width: 100%;
        height: 37px;
        line-height: 37px;
        font-size: 16px;
        color: #333;
    }
    .form-item {
        display: flex;
        align-items: center;
        margin-top: 20px;
        height: 30px;
        span {
            width: 70px;
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        input::-webkit-input-placeholder {
            font-size: 12px;
            color: #999;
        }
    }
    .form-item:first-child {
        margin-top: 16px;
    }
    .item-input {
        flex: 1;
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #ebebeb;
        font-size: 14px;
        font-weight: 400;
        color: #666;
        input {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: none;
        }
    }
    .location-option {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: auto;
        .option-item {
            margin-left: 20px;
        }
        .option-img {
            width: 24px;
            height: 24px;
            background: url('../../images/choiceno@2x.png') no-repeat 0 0;
            background-size: cover;
        }
        .option-active {
            background: url('../../images/choice@2x.png') no-repeat 0 0;
            background-size: cover;
        }
    }
    .btn-area {
        margin-top: 15px;
        .unkown {
            font-size: 14px;
            color: #999;
            margin-right: 50px;
        }
        .btn {
            background: $default-color;
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            letter-spacing: 2px;
        }
        .small-btn {
            width: 110px;
            height: 35px;
            border-radius: 5px;
        }
        .big-btn {
            width: 100%;
            height: 48px;
            margin-top: 15px;
        }
    }
}
.unknow-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 306px;
        padding: 25px 15px;
        background-color: #fff;
        border-radius: 5px;
        font-size: 16px;
        color: #333;
        .content {
            font-size: 14px;
            color: #666;
            .item {
                display: flex;
                line-height: 2;
                .item-num {
                    flex-shrink: 0;
                    width: 12px;
                    height: 12px;
                    line-height: 12px;
                    margin-top: 7px;
                    margin-right: 7px;
                    text-align: center;
                    background: url('../../images/yuan@2x.png') no-repeat 0 0;
                    background-size: cover;
                    color: #fff;
                    font-size: 10px;
                }
                .android {
                    line-height: 14px;
                }
            }
        }
        .confirm-btn {
            width: 110px;
            height: 35px;
            background: $default-color;
            border-radius: 5px;
            color: #fff;
            font-size: 16px;
            margin: 10px auto 0;
        }
    }
}
</style>