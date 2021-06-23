const calendarAlgorithm = {
  data() {
    return {
      // 驱动日历算法的时间参数
      year: null,
      month: null,
      day: null,
    }
  },
  computed: {
    // 每个月有多少天
    daysInMonth() {
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (
        (this.year % 4 === 0 && this.year % 100 !== 0) ||
        this.year % 400 === 0
      ) {
        daysInMonth[1] = 29;
      }
      return daysInMonth;
    },
    // 某月的1号是星期几
    targetDay() {
      return this.dayjs(new Date(this.year, this.month, 1)).day();
    },
    // 前月从几号开始渲染
    startAdd() {
      let startAdd = 0;
      if (this.month === 0) {
        startAdd = this.daysInMonth[11] - this.targetDay + 1;
      } else {
        startAdd = this.daysInMonth[this.month - 1] - this.targetDay + 1;
      }
      return startAdd;
    },
    // 用于渲染的数组
    visibleCalendar() {
      let visibleList = [];
      this.preMonth(visibleList);
      this.thisMonth(visibleList);
      this.nextMonth(visibleList);
      for (let i = 0; i < visibleList.length; i++) {
        this.addYear(visibleList, i);
        this.addTimestamp(visibleList, i);
        visibleList[i].id = i;
      }
      return visibleList;
    },
  },
  methods: {
    // 前月
    preMonth(visibleList) {
      if (this.targetDay > 0) {
        let startAdd = this.startAdd;
        for (let i = 0; i < this.targetDay; i++) {
          let obj = {
            type: "pre",
            content: startAdd,
          };
          // 如果当前月份是1月，则上个月是12月
          if (this.month === 0) {
            obj.month = 11;
          } else {
            obj.month = this.month - 1;
          }
          startAdd++;
          visibleList.push(obj);
        }
      }
    },
    // 本月
    thisMonth(visibleList) {
      for (let i = 0; i < this.daysInMonth[this.month]; i++) {
        let obj = {
          type: "normal",
          content: i + 1,
          month: this.month,
        };
        visibleList.push(obj);
      }
    },
    // 次月
    nextMonth(visibleList) {
      // 判断下一个月需要展示多少天
      if (visibleList.length > 35) {
        var nextNum = 42 - visibleList.length;
      } else {
        nextNum = 35 - visibleList.length;
      }
      for (let i = 0; i < nextNum; i++) {
        let obj = {
          type: "next",
          content: i + 1,
        };
        // 如果当前为12月，则次月为1月
        if (this.month === 11) {
          obj.month = 0;
        } else {
          obj.month = this.month + 1;
        }
        visibleList.push(obj);
      }
    },
    addYear(visibleList, i) {
      // 如果month属性的值是11，且type属性为pre，则年份减1，month为1时同理
      if (visibleList[i].month == 11 && visibleList[i].type == "pre") {
        visibleList[i].year = this.year - 1;
      } else if (visibleList[i].month == 0 && visibleList[i].type == "next") {
        visibleList[i].year = this.year + 1;
      } else {
        visibleList[i].year = this.year;
      }
    },
    addTimestamp(visibleList, i) {
      let date = this.dayjs(
        new Date(
          visibleList[i].year,
          visibleList[i].month,
          visibleList[i].content
        )
      );
      visibleList[i].isDay = date.day();
      visibleList[i].timestamp = date.valueOf();
      visibleList[i].formatDate = date.format("YYYY-MM-DD");
    },
  }
}

export default calendarAlgorithm;