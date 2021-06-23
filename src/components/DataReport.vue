<template>
  <div class="data-report">
    <div class="box" v-for="(li, index) in visibleInfo" :key="index">
      <div class="top">
        <span class="number">{{ li.data }}</span>
        <span class="unit">{{
          index == 1 || index == 4 ? "%" : index == 5 ? "" : "项"
        }}</span>
      </div>
      <p class="label">{{ li.text }}</p>
    </div>
  </div>
</template>

<script>
import DataAlgorithm from "./DataAlgorithm";

export default {
  mixins: [DataAlgorithm],
  name: "DataReport",
  data() {
    return {};
  },
  computed: {
    visibleInfo() {
      return [
        {
          text: "昨日完成待办",
          data: !this.isSampleMode ? this.todoNumberCompleted[7] || 0 : 2,
        },
        {
          text: "昨日完成率",
          data: !this.isSampleMode
            ? parseInt((this.todoNumberCompleted[7] / this.todoNumber[7]) * 100)
            : 50,
        },
        { text: "星标待办", data: !this.isSampleMode ? 0 : 3 },
        { text: "本周期完成待办", data: !this.isSampleMode ? this.todoTotalCompleted : 23 },
        { text: "本周期完成率", data: !this.isSampleMode
            ? parseInt((this.todoTotalCompleted / this.todoTotal) * 100)
            : 82, },
        { text: "", data: null },
      ];
    },
  },
};
</script>

<style scoped>
.data-report {
  position: relative;
  overflow: hidden;
  flex-grow: 2;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 21.5rem;
  border-radius: 16px;
  background-color: var(--BG);
}
.box {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33%;
  height: 50%;
}
.box:hover {
  background-color: var(--Gray-1);
}
.box:nth-child(1),
.box:nth-child(2),
.box:nth-child(4),
.box:nth-child(5) {
  border-right: 1px solid var(--Gray-2);
}
.box:nth-child(1),
.box:nth-child(2),
.box:nth-child(3) {
  border-bottom: 1px solid var(--Gray-2);
}
.top {
  display: flex;
  align-items: baseline;
}
.number {
  color: var(--Gray-7);
  font-size: 3rem;
  font-weight: 600;
  line-height: 3rem;
  letter-spacing: 1px;
}
.unit {
  position: relative;
  top: -0.125rem;
  color: var(--Gray-6);
  font-weight: 500;
  margin-left: 0.3rem;
}
.label {
  margin-top: 1rem;
  color: var(--Gray-6);
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
}
@media (min-width: 1280px) {
  .data-report {
    width: calc((100% - 1.5rem) / 2);
    height: 29rem;
  }
}
</style>