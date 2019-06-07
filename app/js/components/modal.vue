<template>
  <transition name="overlay-fade">
    <div class="modal-alert" :data-modal="name" v-if="visible">
      <div class="modal-alert-bg" @click="close()"/>
      <div class="modal-alert-modal" :class="classes">
        <slot/>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
    data() {
        return {
            visible: false
        };
    },
    props: {
        name: {
            required: true,
            type: String
        },
        classes: {
            type: [String, Array],
            default: 'modal-alert-modal'
        }
    },
    methods: {
        close() {
            this.$emit('closed', true);
        },
        show() {
            this.visible = true;
            this.$common.modalHelperOpen();
        },
        hide() {
            this.visible = false;
            this.$common.modalHelperClose();
        }
    }
};
</script>

<style lang="scss" scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: all 0.3s;
}
.overlay-fade-enter,
.overlay-fade-leave-active {
    transform: translate3d(0, 1134px, 0);
}
.modal-alert {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    .modal-alert-bg {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1;
        opacity: 1;
    }
    .modal-alert-modal {
        z-index: 998;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        top: 50%;
        left: 50%;
        right: auto;
        bottom: auto;
        margin-right: -50%;
        transform: translate(-50%, -50%);
    }
}
</style>