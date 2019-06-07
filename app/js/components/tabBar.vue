<template>
  <div>
    <div class="tabbar-placeholder"/>
    <div class="tabbar-box">
      <div class="tabbar">
        <div
          class="tab-item"
          v-for="(item,index) in data"
          :key="item.index"
          @click="jumpTo(item,index)"
        >
          <img class="tabitem-icon" v-if="num == index" :src="item.iconActive">
          <img class="tabitem-icon" :src="item.icon" v-else>
          <span class="tabitem-title" :class="{'tabitem-active':num == index}">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    props: {
        active: {
            required: true,
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            data: [
                {
                    name: '预订',
                    icon: require('_images_/book@2x.png'),
                    iconActive: require('_images_/book_active@2x.png')
                },
                {
                    name: '服务',
                    icon: require('_images_/service@2x.png'),
                    iconActive: require('_images_/service_active@2x.png')
                },
                {
                    name: '我的',
                    icon: require('_images_/me@2x.png'),
                    iconActive: require('_images_/me_active@2x.png')
                }
            ],
            num: this.active
        };
    },
    methods: {
        jumpTo(item, index) {
            switch (index) {
                case 0:
                    if (this.active != 0) {
                        this.$router.push({
                            path: 'homePage'
                        });
                    }
                    break;
                case 1:
                    if (this.active != 1) {
                        this.$router.push({
                            path: 'service'
                        });
                    } else {
                        this.$emit('service-modal');
                    }
                    break;
                case 2:
                    if (this.active != 2) {
                        this.$router.push({
                            path: 'mine'
                        });
                    }
                    break;
            }
        }
    }
};
</script>
<style scoped lang="scss">
@charset "utf-8";
// sass 基础依赖
@import '../../style/basic/variables';
@import '../../style/basic/mixins';
.tabbar-placeholder {
    height: 49px;
}
.tabbar-box {
    position: fixed;
    bottom: 0;
    z-index: 999;
    .tabbar {
        width: 375px;
        background: rgba(252, 252, 252, 1);
        display: flex;
        flex-direction: row;
        border-top: 1px solid #e7e7e7;
        .tab-item {
            height: 49px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            .tabitem-icon {
                display: block;
                width: 28px;
                height: 28px;
            }
            .tabitem-title {
                margin-top: 4px;
                font-size: 10px;
                color: #333;
            }
        }
        .tabitem-active {
            color: $default-color !important;
        }
    }
}
</style>
