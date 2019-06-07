<template>
  <div>
    <keep-alive :include="keepAlive">
      <router-view/>
    </keep-alive>
  </div>
</template>
<script type='text/javascript'>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['keepAlive'])
    }
};
</script>