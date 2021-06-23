<template>
  <div class="analysis-model">
    <h6>时间掌控程度评估</h6>
    <div class="anonymous">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 266 266"
        x="0px"
        y="0px"
      >
        <path d="M 133 0 L 19 199 L 246 199 Z" />
        <path d="M 133 22 L 38 188 L 227 188 Z" />
        <path d="M 133 44 L 57 177 L 209 177 Z" />
        <path d="M 133 66 L 76 166 L 190 166 Z" />
        <path d="M 133 88 L 95 155 L 171 155 Z" />
        <path d="M 133 110 L 114 144 L 152 144 Z" />
        <path id="hlight" :d="path" />
      </svg>
      <span>勤奋</span><span>一般</span><span>懒惰</span>
    </div>
    <p class="text">
      <span class="i">{{ levelPercentage + "%" }}</span
      >的时间你在 {{ visibleText }} 中度过<br />加油，我们在山顶见
    </p>
  </div>
</template>

<script>
import DataAlgorithm from "./DataAlgorithm";

export default {
  mixins: [DataAlgorithm],
  name: "AnalysisModel",
  data() {
    return {
      // 点坐标
      topY: ["133", "110", "88", "66", "44", "22", "0"],
      bottomLeftX: ["133", "114", "95", "76", "57", "38", "19"],
      bottomRigthX: ["133", "152", "171", "190", "209", "227", "246"],
      bottomY: ["133", "144", "155", "166", "177", "188", "199"],
      // 每日已完成与待办总数的比例
      ratio: [],
      // 用于展示的点的坐标
      visibleL3Y: 0,
      visibleL2X: 0,
      visibleL2Y: 0,
      visibleL1X: 0,
      visibleL1Y: 0,
    };
  },
  computed: {
    // 勤奋
    level3() {
      return this.ratio.filter((val) => val >= 0.8).length;
    },
    // 一般
    level2() {
      return this.ratio.filter((val) => val >= 0.5 && val < 0.8).length;
    },
    // 懒惰
    level1() {
      return this.ratio.filter((val) => val < 0.5).length;
    },
    max() {
      let arr = [this.level3, this.level2, this.level1];
      return Math.max(...arr);
    },
    levelPercentage() {
      return !this.isSampleMode
        ? parseInt((this.max / this.ratio.length) * 100)
        : 57;
    },
    visibleText() {
      let text = "";
      let nums = 0;
      for (let n of this.ratio) {
        nums += n;
      }
      let average = nums / this.ratio.length;
      if (!this.isSampleMode) {
        if (average < 0.5) {
          text = "懒惰";
        } else if (average >= 0.5 && this.max < 0.8) {
          text = "一般";
        } else if (average >= 0.8) {
          text = "勤奋";
        }
      } else {
        text = "一般";
      }
      return text;
    },

    // 路径
    path() {
      return `M 133 ${this.visibleL3Y} L ${this.visibleL2X} ${this.visibleL2Y} L ${this.visibleL1X} ${this.visibleL1Y} Z`;
    },
  },
  mounted() {
    for (let i = 1; i <= 7; i++) {
      if (this.todoNumber[i] !== 0) {
        let value =
          Math.floor((this.todoNumberCompleted[i] / this.todoNumber[i]) * 100) /
          100;
        this.ratio.splice(i - 1, 0, value);
      } else {
        this.ratio.splice(i - 1, 0, 0);
      }
    }
    // 计算并填充点坐标数据
    this.visibleL3Y = !this.isSampleMode ? this.topY[this.level3] : "88";
    this.visibleL2X = !this.isSampleMode ? this.bottomLeftX[this.level2] : "76";
    this.visibleL2Y = !this.isSampleMode ? this.bottomY[this.level2] : "166";
    this.visibleL1X = !this.isSampleMode
      ? this.bottomRigthX[this.level1]
      : "171";
    this.visibleL1Y = !this.isSampleMode ? this.bottomY[this.level1] : "155";

    this.removePastDaysTimestamp();
  },
};
</script>

<style scoped>
.analysis-model {
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 22.5rem;
  height: 29rem;
  border-radius: 16px;
  background-color: var(--BG);
}
h6 {
  color: var(--Gray-7);
  font-size: 1rem;
  letter-spacing: 1px;
  font-weight: 500;
  line-height: 1.5rem;
  margin: 2rem 0 4rem;
}
svg {
  width: 17rem;
  height: 17rem;
}
path {
  stroke: var(--Gray-2);
  stroke-width: 4px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
#hlight {
  stroke: var(--Theme-6);
  stroke-width: 4px;
  fill: var(--Theme-A2);
}
.anonymous {
  position: relative;
  display: flex;
  justify-content: center;
  width: 18rem;
}
span {
  position: absolute;
  color: var(--Gray-7);
  font-size: 0.75rem;
  line-height: 1rem;
  letter-spacing: 1px;
  font-weight: 500;
}
span:nth-of-type(1) {
  top: -1.6rem;
  left: 8.2rem;
}
span:nth-of-type(2) {
  top: 13.3rem;
  left: 0rem;
}
span:nth-of-type(3) {
  top: 13.3rem;
  left: 16.2rem;
}
.i {
  position: static;
  color: var(--Theme-6);
  font-size: 0.875rem;
}
.text {
  color: var(--Gray-7);
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5rem;
  letter-spacing: 1px;
}
@media (min-width: 1280px) {
  .analysis-model {
    width: calc((100% - 1.5rem) / 2);
    margin-right: 1.5rem;
  }
}
</style>