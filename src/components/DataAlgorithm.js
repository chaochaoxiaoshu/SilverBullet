const todoChartAlgorithm = {
  data() {
    return {
      today: {
        year: this.dayjs().year(),
        month: this.dayjs().month(),
        day: this.dayjs().date(),
      },
      // 为了svg蒙版剪切（父级盒子）过渡更加自然，七日的前后各一日也被纳入svg视图范围
      // 九日待办数目
      todoNumber: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      // 九日待办完成数
      todoNumberCompleted: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
  },
  computed: {
    // 是否打开示例模式
    isSampleMode() {
      return this.todoNumberCompleted[6] < 1 && this.todoNumberCompleted[7] < 1;
    },
    todoListsAll() {
      return this.$store.state.todoListsAll;
    },
    clockInAll() {
      return this.$store.state.clockInAll;
    },
    // 九日时间戳
    pastSevenDays() {
      let timestamps = [];
      const today = this.dayjs(this.today).valueOf();
      for (let i = 0; i < 9; i++) {
        timestamps[i] = today - (8 - i) * 86400000;
      }
      return timestamps;
    },
    // 九日待办总数
    todoTotal() {
      let total = 0;
      this.todoNumber.map(value => total += value);
      return total;
    },
    // 九日待办完成总数
    todoTotalCompleted() {
      let totalCompleted = 0;
      this.todoNumberCompleted.map(value => totalCompleted += value);
      return totalCompleted;
    },
  },
  methods: {
    // 删除八天以前的时间戳
    removePastDaysTimestamp() {
      this.$store.commit('removePastDaysTimestamp', this.dayjs(this.today).valueOf() - 8 * 86400000);
    },
  },
  // 计算待办数目
  mounted() {
    for (let i = 0; i < 9; i++) {
      let all = this.todoListsAll.filter((list) => list.timestamp == this.pastSevenDays[i]);
      this.todoNumber.splice(i, 0, all.length);
      let completed = all.filter((list) => list.isComplete);
      this.todoNumberCompleted.splice(i, 0, completed.length);
    }
  }
}

export default todoChartAlgorithm;