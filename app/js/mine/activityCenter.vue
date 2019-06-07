<template>
  <div class="activityCenter">
    <div v-if="avtivityList==''" class="activityCenter-no">
      <img :src="activityImg">
      <div>活动正在策划中，敬请期待！</div>
    </div>
    <ul v-else>
      <li
        class="activityCenter-item"
        v-for="(item,index) in avtivityList"
        :key="index"
        @click="activityDetail(item.url)"
      >
        <div class="activityCenter-time">{{item.create_at | dateformat('YYYY-MM-DD')}}</div>
        <img :src="item.imageUrl">
        <div class="activityCenter-title">
          <span>{{item.contnet}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    data() {
        return {
            avtivityList: [],
            activityImg: require('_images_/build@2x.png')
        };
    },
    methods: {
        activityDetail(url) {
            window.location.href = 'http://' + url;
        },
        async getActivityList() {
            let url = '/index/index/getActivityList',
                param = {},
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            console.log(res);

            if (res.code == '0') {
                // this.avtivityList = res.data;
            }
        }
    },
    mounted() {
        this.getActivityList();
    }
};
</script>

