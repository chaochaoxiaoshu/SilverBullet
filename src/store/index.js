import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    // 主题配色
    theme: 'blue',


    // todoContent数据列表
    todoListsAll: [],
    // clockin数据列表
    clockInAll: [],
    // 颜色分类列表
    classLists: [],

    // 选中日期的时间戳
    selectTimestamp: '',
    // 有待办时添加时间戳
    pastDaysTimestamp: [],

    // 临时保存表单输入数据
    input: {
      inputContent: "",
      settingIsOpen: false,
      checkRepeat: "day",
      checkRepeatWeek: [],
      inputHour: '',
      inputMinute: '',
      inputMonthDay: '',
      inputYearMonth: '',
      inputYearDay: '',
      class: {
        name: "红色",
        color: "var(--class-red)",
        secondaryColor: "var(--class-red-sec)",
      },
    },
    inputSettingIsError: false,

    todayIsDay: '',
    todayDate: '',
    todayMonth: '',
  },
  getters: {
    inputSettingEmpty(state) {
      return state.input.settingIsOpen && !state.input.inputHour ||
        state.input.settingIsOpen && !state.input.inputMinute ||
        state.input.settingIsOpen && !state.input.inputMonthDay ||
        state.input.settingIsOpen && !state.input.inputYearMonth ||
        state.input.settingIsOpen && !state.input.inputYearDay ||
        state.input.settingIsOpen && !state.input.checkRepeatWeek
    },
    visibleClockIn(state) {
      let isDay = state.todayIsDay;
      let date = state.date;
      let month = state.todayMonth;
      let arr1 = state.clockInAll.filter(
        (list) => list.repeatModel == "day"
      );
      let baseArr2 = state.clockInAll.filter(
        (list) => list.repeatModel == "week"
      );
      let arr2 = baseArr2.filter((list) => list.repeat.includes(isDay));
      let baseArr3 = state.clockInAll.filter(
        (list) => list.repeatModel == "month"
      );
      let arr3 = baseArr3.filter((list) => list.repeat == date);
      let baseArr4 = state.clockInAll.filter(
        (list) => list.repeatModel == "year"
      );
      let arr4 = baseArr4.filter(
        (list) => list.repeat.month == month && list.repeat.day == date
      );
      return arr4.concat(arr3.concat(arr2.concat(arr1)));
    },
  },
  mutations: {
    // 切换主题
    changeTheme(state, payload) {
      state.theme = payload;
    },

    // 更新日期选中状态
    updateSelect(state, newSelect) {
      state.selectTimestamp = newSelect;
    },

    // 新建
    createItem(state, payload) {
      if (payload.type == 'todo') {
        state.todoListsAll.push(payload.push);
      } else {
        state.clockInAll.push(payload.push);
      }
    },
    // 更新
    updateItem(state, payload) {
      if (payload.type == "todo") {
        const i = state.todoListsAll.indexOf(state.oldValue);
        state.todoListsAll.splice(i, 1, payload.push);
      } else if (payload.type == "clockIn") {
        const i = state.clockInAll.indexOf(state.oldValue);
        state.clockInAll.splice(i, 1, payload.push);
      }
      state.oldValue = {};
    },
    // 删除
    removeItem(state, payload) {
      if (payload.type == "todo") {
        const i = state.todoListsAll.indexOf(payload.list);
        state.todoListsAll.splice(i, 1);
      } else if (payload.type == "clockIn") {
        const i = state.clockInAll.indexOf(payload.list);
        state.clockInAll.splice(i, 1);
      }
    },
    // 清空所有
    clearAll(state) {
      state.todoListsAll.splice(0, state.todoListsAll.length);
      state.clockInAll.splice(0, state.clockInAll.length);
    },

    // 编辑状态时将旧值填入表单
    editItem(state, payload) {
      if (payload.type == "todo") {
        state.input = {
          inputContent: payload.oldValue.content,
          settingIsOpen: payload.oldValue.settingIsOpen,
          inputHour: payload.oldValue.inputHour,
          inputMinute: payload.oldValue.inputMinute,
          class: payload.oldValue.class,
        }
      } else if (payload.type == "clockIn") {
        let input = {
          inputContent: payload.oldValue.content,
          settingIsOpen: payload.oldValue.settingIsOpen,
          class: payload.oldValue.class,
          checkRepeatWeek: [],
          inputMonthDay: "",
          inputYearMonth: "",
          inputYearDay: "",
        }
        switch (payload.oldValue.repeatModel) {
          case 'day':
            state.input.checkRepeat = 'day';
            break;
          case 'week':
            state.input.checkRepeat = 'week';
            state.input.checkRepeatWeek = payload.oldValue.repeat;
            break;
          case 'month':
            state.input.checkRepeat = 'month';
            state.input.inputMonthDay = payload.oldValue.repeat;
            break;
          case 'year':
            state.input.checkRepeat = 'year';
            state.input.inputYearMonth = payload.oldValue.repeat.month;
            state.input.inputYearDay = payload.oldValue.repeat.day;
            break;
        }
        state.input = input;
      }
    },
    // 保存或取消后清空表单
    clearInput(state) {
      state.input = {
        inputContent: "",
        settingIsOpen: false,
        checkRepeat: "day",
        checkRepeatWeek: [],
        inputHour: "",
        inputMinute: "",
        inputMonthDay: "",
        inputYearMonth: "",
        inputYearDay: "",
        class: {
          name: "红色",
          color: "var(--class-red)",
          secondaryColor: "var(--class-red-sec)",
        }
      };
      state.inputSettingIsError = false;
    },
    // 选中分类
    selectClass(state, list) {
      state.input.class = list;
    },
    // 输入是否错误
    inputSettingIsErrorMethods(state, type) {
      if (type == 'init') {
        state.inputSettingIsError = false;
      } else if (type == 'test') {
        state.inputSettingIsError = true;
      }
    },

    // 传入今天日期
    importToday(state, payload) {
      state.todayIsDay = payload.todayIsDay;
      state.todayDate = payload.todayDate;
      state.todayMonth = payload.todayMonth;
    },

    // 插入前七日时间戳
    addPastDaysTimestamp(state) {
      state.pastDaysTimestamp.push(state.selectTimestamp);
    },
    removePastDaysTimestamp(state, payload) {
      for (let item of state.pastDaysTimestamp) {
        if (item < payload) {
          let i = state.pastDaysTimestamp.indexOf(item);
          state.pastDaysTimestamp.splice(i, 1);
        }
      }
    }
  },
  actions: {},
  modules: {},
})