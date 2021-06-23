<template>
  <div class="todo-chart">
    <div class="title">
      <p>共设置</p>
      <span>{{ !isSampleMode ? todoTotal : 28 }}</span>
      <p>项待办，共完成</p>
      <span>{{ !isSampleMode ? todoTotalCompleted : 23 }}</span>
      <p>项</p>
    </div>
    <div class="svg-box" :style="svgBoxWidth">
      <svg
        class="svg"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        :viewBox="viewBox"
        :width="viewWidth"
        height="440px"
      >
        <!-- 定义渐变、模糊等属性 -->
        <defs>
          <linearGradient id="l1" x1="0%" y1="0%" x2="0" y2="100%">
            <stop offset="0%" id="stop1" />
            <stop offset="100%" id="stop2" />
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>
        <!-- 渐变层 -->
        <path :d="path" style="fill: url(#l1)" />
        <!-- 描边层 -->
        <path id="border" :d="path" />
        <!-- 点 -->
        <g v-for="p in points" :key="p" v-show="visiblePoint == p">
          <circle id="shadow" :cx="pX[p]" :cy="pY[p]" r="14" />
          <circle
            :cx="pX[p]"
            :cy="pY[p]"
            r="14"
            style="fill: rgba(255, 255, 255, 0.83)"
          />
          <circle id="m-circle" :cx="pX[p]" :cy="pY[p]" r="7" />
        </g>
      </svg>
    </div>
    <div class="date" :style="svgBoxWidth">
      <p v-for="(d, index) in date" :key="index">{{ d }}</p>
    </div>
    <div class="hover" :style="svgBoxWidth">
      <div
        class="hover-li"
        v-for="li in hoverBox"
        :key="li.id"
        @mouseover="setVisible(li.id)"
        @mouseleave="clearVisible()"
      ></div>
    </div>
  </div>
</template>

<script>
import DataAlgorithm from "./DataAlgorithm";

export default {
  mixins: [DataAlgorithm],
  name: "TodoChart",
  data() {
    return {
      // 视口宽度
      screenWidth: document.body.clientWidth,
      // 响应视口变化的x坐标参数，用来更新svg x坐标以及附属盒子的宽度值
      xCoordParm: 1,
      // 折线图点坐标
      pX: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      pY: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      // 折线图上的点应该显示哪一个（手动hover）
      visiblePoint: "0",
    };
  },
  computed: {
    // v-for需要用到的数组们
    date() {
      let date = [];
      for (let i = 7; i > 0; i--) {
        date.push(this.dayjs().month() + 1 + "/" + (this.dayjs().date() - i));
      }
      return date;
    },
    points() {
      let points = [];
      for (let i = 1; i <= 7; i++) {
        points.push(i);
      }
      return points;
    },
    hoverBox() {
      let hoverBox = [];
      for (let i = 0; i < 7; i++) {
        hoverBox[i] = {};
        hoverBox[i].id = i;
      }
      return hoverBox;
    },

    // 折线图展示数据（是否展示示例数据）
    visibleData() {
      return !this.isSampleMode
        ? this.todoNumberCompleted
        : [2, 1, 4, 3, 6, 2, 3, 2, 0];
    },
    // 根据最大待办完成数，计算行高
    rowHeight() {
      let maxRow = Math.max(...this.visibleData);
      return parseInt(328 / maxRow);
    },
    
    // svg viewBox
    viewBox() {
      return `0 -440 ${this.viewWidth} 440`;
    },
    // svg width
    viewWidth() {
      return 736 * this.xCoordParm;
    },
    // svg-box(外层hidden盒子) width
    svgBoxWidth() {
      return { width: (644 * this.xCoordParm) / 16 + "rem" };
    },
    /*
     * svg path数据
     * 因为通过viewbox位移到x轴上方的方式实现反转y轴方向，所以y轴参数要取相反数
     * 98是指svg viewbox底部到svg div底部的距离
     */
    path() {
      return `M ${this.pX[0]} ${this.pY[0]}
          C ${this.pX[0] + 50} ${this.pY[0]}, ${this.pX[1] - 50} ${this.pY[1]}, ${this.pX[1]} ${this.pY[1]}
          S ${this.pX[1] + 50} ${this.pY[2]}, ${this.pX[2]} ${this.pY[2]}
          S ${this.pX[2] + 50} ${this.pY[3]}, ${this.pX[3]} ${this.pY[3]}
          S ${this.pX[3] + 50} ${this.pY[4]}, ${this.pX[4]} ${this.pY[4]}
          S ${this.pX[4] + 50} ${this.pY[5]}, ${this.pX[5]} ${this.pY[5]}
          S ${this.pX[5] + 50} ${this.pY[6]}, ${this.pX[6]} ${this.pY[6]}
          S ${this.pX[6] + 50} ${this.pY[7]}, ${this.pX[7]} ${this.pY[7]}
          S ${this.pX[7] + 50} ${this.pY[8]}, ${this.pX[8]} ${this.pY[8]}`;
    },
  },
  methods: {
    // 鼠标移入移出切换hover显示
    setVisible(id) {
      this.visiblePoint = id + 1;
    },
    clearVisible() {
      this.visiblePoint = 0;
    },
  },
  watch: {
    // 侦听视口宽度，到达断点时改变svg折线图的x坐标参数/及其附属盒子的宽度
    screenWidth: {
      immediate: true,
      handler: function (newValue) {
        if (newValue < 1152) {
          this.xCoordParm = 1;
          for (let i = 0; i < 9; i++) {
            this.pX.splice(i, 1, 92 * this.xCoordParm * i);
          }
        } else if (newValue >= 1152 && newValue < 1280) {
          this.xCoordParm = 1.15;
          for (let i = 0; i < 9; i++) {
            this.pX.splice(i, 1, 92 * this.xCoordParm * i);
          }
        } else if (newValue >= 1280) {
          this.xCoordParm = 1.3;
          for (let i = 0; i < 9; i++) {
            this.pX.splice(i, 1, 92 * this.xCoordParm * i);
          }
        }
      },
    },
  },
  mounted() {
    // 计算并填充坐标数据
    for (let i = 0; i < 9; i++) {
      this.pX.splice(i, 0, parseInt(92 * this.xCoordParm * i * 100) / 100);
      this.pY.splice(i, 0, (98 + this.rowHeight * this.visibleData[i]) * -1);
    }
    // 持续侦听视口宽度
    const that = this;
    window.addEventListener("resize", function () {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    });
  },
};
</script>

<style scoped>
.todo-chart {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-width: 44.5rem;
  height: 31.5rem;
  padding: 2rem;
  border-radius: 16px;
  background-color: var(--BG);
}
.title {
  display: flex;
  align-items: baseline;
  height: 3rem;
}
.title > p {
  color: var(--Gray-7);
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 2px;
}
.title > span {
  margin: 0 0.5rem;
  color: var(--Gray-8);
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 3rem;
  letter-spacing: 2px;
}
.svg-box {
  overflow: hidden;
  position: absolute;
  top: 6rem;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 40.25rem;
  height: 22.25rem;
}
.svg {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  top: 0;
}
.date {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40.25rem;
}
.date > p {
  color: var(--Gray-5);
  font-size: 0.875rem;
  line-height: 0.875rem;
  font-weight: 500;
  text-align: center;
  min-width: 2.5rem;
}
.hover {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  justify-content: center;
  width: 40.25rem;
  height: 31.5rem;
}
.hover-li {
  display: block;
  width: 100%;
  height: 25rem;
  margin-top: 5.6875rem;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 12px;
  opacity: 0;
  box-shadow: 0 16px 37px 0 var(--Theme-A2);
}
.hover-li:hover {
  opacity: 1;
}

#stop1 {
  stop-color: var(--Theme-A2);
}
#stop2 {
  stop-color: rgba(255, 255, 255, 0);
}
#border {
  fill: none;
  stroke-width: 4px;
  stroke: var(--Theme-6);
}
#shadow {
  fill: var(--Theme-A2);
  filter: url(#blur);
}
#m-circle {
  fill: var(--Theme-6);
}
</style>