<template>
  <div class="relative h-screen w-screen">
    <div class="blur-background absolute inset-0"></div>
    <div class="loading">
      <div>
        <span class="animate-spin"></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blur-background {
  filter: blur(10px);
}
.loading {
  @apply bg-light-medium/50 dark:bg-dark-medium/50;
  top: 0;
  left: 0;
  z-index: 101;
  height: 100vh;
  width: 100vw;
  // padding-top: 4rem;
  // background-color: rgba(0, 0, 0, 0.7);
  // background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }
  div {
    span {
      display: block;
      // width: 60px;
      // height: 60px;
      margin: 0 auto;
      border: 3px solid transparent;

      border-radius: 50%;
      animation: spin ease 1000ms infinite;
      @apply h-6 w-6 border-t-dark-medium border-b-dark-medium dark:border-t-light-medium dark:border-b-light-medium;
    }
  }
}
</style>
