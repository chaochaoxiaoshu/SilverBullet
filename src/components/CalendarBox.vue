<template>
  <div class="calendar-box" :class="{ isopen: calendarIsOpen }">
    <!-- 展开与关闭的盒子，用hidden属性为内部元素添加蒙板 -->
    <div class="base-box" :class="{ isopen: calendarIsOpen }">
      <!-- 相对定位的盒子 -->
      <div class="calendar-body" :class="{ isopen: calendarIsOpen }">
        <!-- 日期标题和切换按钮 -->
        <div class="calendar-body-title">
          <div class="arrow-box" @click="handlePreMonth">
            <svg-icon id="left-arrow" icon-class="icon-jiantou"></svg-icon>
          </div>
          <div class="title-text">
            {{ year + "年" + (month + 1) + "月" + day + "日" }}
          </div>
          <div class="arrow-box" @click="handleNextMonth">
            <svg-icon id="right-arrow" icon-class="icon-jiantou"></svg-icon>
          </div>
        </div>
        <!-- 日历主体部分 -->
        <div class="calendar-body-main">
          <div
            v-for="oneDay in visibleCalendar"
            :key="oneDay.id"
            class="day-box"
            :class="{
              notnormal: visibleCalendar[oneDay.id].type !== 'normal',
              selectDay: highLight == oneDay.id,
            }"
            @click="selectMethods(oneDay)"
          >
            <span class="day-num">{{ oneDay.content }}</span>
            <span class="is-has" :class="{ checked: isHasTodo(oneDay) }"></span>
          </div>
        </div>
      </div>
      <!-- 星期 -->
      <div class="week" :class="{ isopen: calendarIsOpen }">
        <span class="week-title" v-for="(d, index) in week" :key="index">{{
          d
        }}</span>
      </div>
      <!-- 展开和关闭按钮 -->
      <div class="calendar-footer" :class="{ isopen: calendarIsOpen }">
        <div @click="switchBox">
          <svg
            class="svg"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 60 16"
            width="60px"
            height="16px"
          >
            <path id="open-btn" :d="openBtnPath" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarAlgorithm from "./CalendarAlgorithm";

export default {
  // 日历逻辑在单独的js文件中
  mixins: [CalendarAlgorithm],
  name: "CalendarBox",
  data() {
    return {
      // 星期
      week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      // 盒子开关状态
      calendarIsOpen: false,
      // 点击时将盒子的id存储到这个属性，用来确定哪一天应该高亮
      highLight: null,
      // 获取style对象，用于修改css变量
      declaration: document.styleSheets[0].cssRules[0].style,
      // 打开关闭盒子按钮的路径
      openBtnPath: `M 16 8 L 30 8 L 44 8 Z`,
    };
  },
  computed: {
    // 日历盒子位移参数
    boxDisplacement() {
      return parseInt(this.highLight / 7);
    },
    // 当前选中日期的时间戳
    selectTimestamp() {
      return this.dayjs(new Date(this.year, this.month, this.day)).valueOf();
    },
  },
  methods: {
    // 当前选中日期是否拥有待办事项
    isHasTodo(oneDay) {
      return this.$store.state.todoListsAll.filter(
        (list) => list.timestamp == oneDay.timestamp
      ).length;
    },
    // 打开关闭日历盒子
    switchBox() {
      this.calendarIsOpen = !this.calendarIsOpen;
    },
    // 选中某个日期
    selectMethods(oneDay) {
      this.year = oneDay.year;
      this.month = oneDay.month;
      this.day = oneDay.content;
      this.highLight = this.day + this.targetDay - 1;
      this.$store.commit("updateSelect", this.selectTimestamp);
    },
    // 切换到上个月
    handlePreMonth() {
      if (this.month === 0) {
        this.year = this.year - 1;
        this.month = 11;
      } else {
        this.month = this.month - 1;
      }
      this.day = 1;
      this.highLight = this.targetDay;
      this.$store.commit("updateSelect", this.selectTimestamp);
    },
    // 切换到下个月
    handleNextMonth() {
      if (this.month === 11) {
        this.year = this.year + 1;
        this.month = 0;
      } else {
        this.month = this.month + 1;
      }
      this.day = 1;
      this.highLight = this.targetDay;
      this.$store.commit("updateSelect", this.selectTimestamp);
    },
    // 回到今天
    selectInit() {
      this.year = this.dayjs().year();
      this.month = this.dayjs().month();
      this.day = this.dayjs().date();
      this.highLight = this.day + this.targetDay - 1;
      const today = {
        year: this.dayjs().year(),
        month: this.dayjs().month(),
        day: this.dayjs().date(),
      };
      this.$store.commit("updateSelect", this.dayjs(today).valueOf());
    },
  },
  mounted() {
    // 初始化日期选中
    this.selectInit();
  },
  updated() {
    // css变量绑定
    this.declaration.setProperty("--calendar-1", this.boxDisplacement);
  },
};
</script>

<style scoped>
:root {
  --calendar-1: 0;
}
/* 大盒子 */
.calendar-box {
  z-index: 10;
  position: relative;
  display: flex;
  justify-content: center;
  min-width: 44.5rem;
  height: 7rem;
  border-radius: 16px;
  background-color: var(--BG);
}
/* 星期 */
.week {
  z-index: 3;
  position: absolute;
  top: 0.6rem;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  transition: 0.6s ease-in-out;
}
/* 星期文字 */
.week-title {
  flex-shrink: 0;
  color: var(--Gray-6);
  font-size: 0.75rem;
  line-height: 1rem;
  margin: 0 1.75rem;
}
/* 相对定位盒子 */
.calendar-body {
  position: relative;
  /* 变量驱动的相对定位 */
  top: calc(((var(--calendar-1) * 6rem + 3rem) * -1));
  width: 35rem;
  height: 38.5rem;
  transition: 0.6s ease-in-out;
}
/* 日历标题盒子 */
.calendar-body-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 35rem;
  height: 2rem;
  margin-bottom: 3rem;
}
/* 包裹箭头的盒子 */
.arrow-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  margin-left: 6rem;
  border-radius: 1rem;
}
.arrow-box:nth-last-of-type(1) {
  margin-right: 6rem;
  margin-left: 0;
}
.arrow-box:hover {
  background-color: var(--Gray-2);
}
.arrow-box:active {
  background-color: var(--Theme-6);
}
/* 箭头 */
#left-arrow {
  color: var(--Gray-6);
  width: 1.2rem;
  height: 1.2rem;
}
#right-arrow {
  transform: rotate(180deg);
  color: var(--Gray-6);
  width: 1.2rem;
  height: 1.2rem;
}
.arrow-box:hover #left-arrow,
.arrow-box:hover #right-arrow {
  color: var(--Gray-8);
}
.arrow-box:active #left-arrow,
.arrow-box:active #right-arrow {
  color: var(--BG);
}
/* 日历标题文字 */
.title-text {
  color: var(--Gray-7);
  font-size: 1.2rem;
  line-height: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
}
/* 日历主体部分 */
.calendar-body-main {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 35rem;
  height: 34rem;
}
/* day 小盒子 */
.day-box {
  display: inline-flex;
  flex-direction: column;
  width: 4rem;
  height: 4rem;
  margin: 0 0.5rem 2rem;
  cursor: default;
}
/* day 数字 */
.day-num {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  margin: 0 0.5rem;
  border-radius: 1.5rem;
  color: var(--Gray-8);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  transition: 0.1s;
}
.day-num:hover {
  background-color: var(--Theme-1);
}
.notnormal .day-num {
  color: var(--Gray-6);
}
.selectDay .day-num {
  color: var(--BG);
  background-color: var(--Theme-6);
}
/* 待办标记 */
.is-has {
  width: 6px;
  height: 6px;
  margin: 0.3125rem 1.8125rem;
  border-radius: 3px;
}
/* 待办标记激活 */
.is-has.checked {
  background-color: var(--Theme-4);
}
/* 包裹展开盒子按钮的大盒子 */
.calendar-footer {
  z-index: 2;
  position: absolute;
  top: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35rem;
  height: 1rem;
}
.calendar-footer > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 16px;
  cursor: pointer;
}
/* 展开盒子按钮样式 */
#open-btn {
  stroke: var(--Gary-6);
  stroke-width: 4px;
  fill: none;
}
.calendar-footer > div:hover .calendar-is-open {
  background-color: var(--Theme-2);
}

.base-box {
  position: absolute;
  overflow: hidden;
  display: flex;
  justify-content: center;
  min-width: 44.5rem;
  height: 7rem;
  border-radius: 16px;
  background-color: var(--BG);
  box-shadow: 0 0 0 0 rgba(148, 163, 184, 0);
  transition: 0.6s ease-in-out;
}
/* 盒子展开 */
.base-box.isopen {
  min-width: 44.5rem;
  height: 44rem;
  box-shadow: 0 16px 36px 0 rgba(148, 163, 184, 0.2);
}
/* 展开后的大盒子定位 */
.calendar-body.isopen {
  top: 2rem;
}
/* 展开后的星期 */
.week.isopen {
  top: 5.5rem;
}
/* 展开后按钮上移 */
.calendar-footer.isopen {
  top: 0.5rem;
}

@media (min-width: 1280px) {
  .calendar-box {
    min-width: 36.5rem;
  }
  .base-box {
    min-width: 36.5rem;
  }
  .base-box.isopen {
    min-width: 42.5rem;
  }
}
</style>