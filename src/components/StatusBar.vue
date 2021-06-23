<template>
  <div class="status-bar" @click="$store.commit('clearAll')">
    <div class="ring">
      <svg
        id="svg"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xml:space="preserve"
        width="100%"
        height="100%"
      >
        <circle
          class="clock-in-bg"
          cx="108"
          cy="108"
          r="83"
          fill="none"
          stroke="#F1F5F9"
          stroke-width="4"
          shape-rendering="optimizeQuality"
        />
        <circle
          class="clock-in-fg"
          cx="108"
          cy="108"
          r="83"
          fill="none"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
          shape-rendering="optimizeQuality"
          :stroke-dasharray="visiblePercentageClockIn"
          transform="rotate(-90 108 108)"
        />
        <circle
          class="todo-bg"
          cx="108"
          cy="108"
          r="99"
          fill="none"
          stroke="#F1F5F9"
          stroke-width="4"
          shape-rendering="optimizeQuality"
        />
        <circle
          class="todo-fg"
          id="today"
          cx="108"
          cy="108"
          r="99"
          fill="none"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
          shape-rendering="optimizeQuality"
          :stroke-dasharray="visiblePercentageTodo"
          transform="rotate(-90 108 108)"
        ></circle>
      </svg>
    </div>
    <div class="text">
      <p class="text-info" v-if="todayListsAll.length">
        今日共
        <span style="color: #3b82f6">{{ todayListsAll.length }}</span>
        项待办，已完成
        <span style="color: #3b82f6">{{ todayCompleted }}</span> 项
      </p>
      <p class="text-info" v-else>今日暂无待办，创建待办后将在此展示</p>
      <p class="text-info">已打卡 <span class="clock-in-num">{{ todayClockIn }}</span> 项</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  components: {},
  data() {
    return {
      // 今天的日期数据，用于生成时间戳
      today: {
        year: this.dayjs().year(),
        month: this.dayjs().month(),
        day: this.dayjs().date(),
      },
    };
  },
  computed: {
    // 今天 格式化
    todayTimestamp() {
      return this.dayjs(this.today).valueOf();
    },
    // 今日所有待办事项
    todayListsAll() {
      const that = this;
      return this.$store.state.todoListsAll.filter(function (list) {
        return list.timestamp == that.todayTimestamp;
      });
    },
    // 今日已完成待办
    todayCompleted() {
      return this.todayListsAll.filter(function (list) {
        return list.isComplete;
      }).length;
    },
    // 待办百分比
    todoPercentage() {
      return (this.todayCompleted / this.todayListsAll.length).toFixed(2) * 100 || 0;
    },
    // 待办描边参数
    visiblePercentageTodo() {
      return parseInt(this.todoPercentage * 6.2) + " 620";
    },

    // 今日打卡
    todayClockIn() {
      return this.$store.getters.visibleClockIn.filter(list => list.isComplete).length;
    },
    // 打卡百分比
    clockInPercentage() {
      return (this.todayClockIn / this.$store.state.clockInAll.length).toFixed(2) * 100 || 0;
    },
    // 打卡描边参数
    visiblePercentageClockIn() {
      return parseInt(this.clockInPercentage * 5.2) + " 520";
    }
  },
};
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19rem;
  height: 23rem;
  border-radius: 16px;
  background-color: var(--BG);
}
.ring {
  width: 13.5rem;
  height: 13.5rem;
  margin-bottom: 2.5rem;
}
.text-info {
  color: var(--Gray-6);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
  line-height: 1.5rem;
}
#svg {
  transition: 0.6s ease-in-out;
}
.todo-fg {
  stroke: var(--Theme-6);
}
.clock-in-fg {
  stroke: var(--Vice-Theme);
}
.clock-in-num {
  color: var(--Vice-Theme);
}
</style>