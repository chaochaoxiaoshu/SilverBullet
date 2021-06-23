<template>
  <div class="home">
    <!-- 我的待办 -->
    <div class="mytodo">
      <div class="mytodo-title">
        <h2>我的待办</h2>
        <div class="button-box">
          <button
            @click="backToday"
            class="back-today"
            v-show="todayTimestamp !== selectTimestamp"
          >
            <svg-icon icon-class="icon-repeat"></svg-icon>
            回到今天
          </button>
          <button @click="openWindow('todo', 'create')" class="add-todo">
            新建待办
          </button>
        </div>
      </div>
      <calendar-box ref="calendar"></calendar-box>
      <todo-content @edit-item="editItem"></todo-content>
    </div>
    <!-- 右侧 -->
    <div class="others">
      <!-- 概览 -->
      <div class="status-bar">
        <div class="status-bar-title">
          <h2>概览</h2>
        </div>
        <status-bar></status-bar>
      </div>
      <!-- 打卡 -->
      <div class="clock-in">
        <div class="clock-in-title">
          <div class="title-box" @click="checkTitle">
            <h2 class="title">
              {{ !allClockInMode ? "今日打卡" : "全部打卡" }}
            </h2>
            <h4 class="vice-title">
              {{ !allClockInMode ? " /全部打卡" : "/今日打卡" }}
            </h4>
          </div>
          <div
            v-if="allClockInMode"
            @click="openWindow('clockIn', 'create')"
            class="add-clock-in"
          >
            新建打卡
          </div>
        </div>
        <clock-in ref="clockin" @edit-item="editItem"></clock-in>
      </div>
    </div>
    <!-- 新建待办窗口 -->
    <edit-todo ref="edit"></edit-todo>
    <!-- 弹窗 -->
    <popup ref="popup"></popup>
  </div>
</template>

<script>
import CalendarBox from "../components/CalendarBox.vue";
import TodoContent from "../components/TodoContent.vue";
import StatusBar from "../components/StatusBar.vue";
import ClockIn from "../components/ClockIn.vue";
import EditTodo from "../components/EditTodo.vue";
import Popup from "../components/Popup.vue";

export default {
  name: "MyTodo",
  components: {
    CalendarBox,
    TodoContent,
    StatusBar,
    ClockIn,
    EditTodo,
    Popup,
  },
  data() {
    return {
      // 今天
      today: {
        year: this.dayjs().year(),
        month: this.dayjs().month(),
        day: this.dayjs().date(),
      },
      allClockInMode: false,
    };
  },
  computed: {
    // 今天 格式化
    todayTimestamp() {
      return this.dayjs(this.today).valueOf();
    },
    // 选中 格式化
    selectTimestamp() {
      return this.$store.state.selectTimestamp;
    },
  },
  methods: {
    // 回到今天
    backToday() {
      this.$refs.calendar.selectInit();
      this.$refs.calendar.calendarIsOpen = false;
    },
    // 新建
    openWindow(type, action) {
      this.$refs.edit.openWindow(type, action);
      this.$refs.calendar.calendarIsOpen = false;
    },
    // 打卡标题切换
    checkTitle() {
      this.allClockInMode = !this.allClockInMode;
      this.$refs.clockin.checkMode();
    },
    // 打卡组件编辑模式
    editMode() {
      this.$refs.clockin.editMode();
    },
    // 空内容弹窗
    noContent() {
      this.$refs.popup.openPopup(1, "请输入内容");
    },
    // 格式错误弹窗
    formatError() {
      this.$refs.popup.openPopup(1, "设置选项格式错误或为空");
    },
    // 编辑按钮借父组件传个值
    editItem(value) {
      this.$refs.edit.openWindow(value.type, "edit", value.list);
    },
  },
};
</script>

<style scoped>
/* 定义标题样式 */
h2 {
  display: inline;
  color: var(--Gray-8);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
}
.home {
  display: flex;
}
/* 我的待办 */
.mytodo {
  margin: 0 2rem 0 2rem;
  width: 100%;
  min-width: 44.5rem;
  flex-grow: 1;
}
.mytodo-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
}
.button-box {
  display: flex;
  justify-content: flex-end;
}
.back-today {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7rem;
  height: 2rem;
  border: 1px solid var(--Gray-2);
  margin-left: 1rem;
  color: var(--Gray-6);
  font-size: 0.75rem;
  line-height: 1rem;
  border-radius: 2rem;
  background-color: var(--BG);
  cursor: pointer;
}
.back-today > svg {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}
.add-todo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  height: 2rem;
  border: none;
  margin-left: 1rem;
  color: var(--BG);
  font-size: 0.75rem;
  line-height: 1rem;
  border-radius: 2rem;
  background-color: var(--Theme-6);
  cursor: pointer;
}
.add-todo:hover {
  background-color: var(--Theme-7);
}
.add-todo:active {
  background-color: var(--Theme-8);
}

/* 右侧 */
.others {
  display: none;
  flex-direction: column;
  margin: 0 2rem 0 1.5rem;
}
/* 状态显示 */
.status-bar {
  display: flex;
  flex-direction: column;
  width: 22.5rem;
}
.status-bar-title {
  display: flex;
  align-items: center;
  height: 5rem;
}
/* 打卡 */
.clock-in-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
}
.title-box {
  display: flex;
  align-items: baseline;
  cursor: pointer;
}
.title-box:hover .title,
.title-box:hover .vice-title {
  color: var(--Theme-6);
}
.vice-title {
  color: var(--Gray-8);
  font-size: 1rem;
  line-height: 1rem;
  font-weight: 700;
}
.add-clock-in {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7rem;
  height: 2rem;
  border: none;
  color: var(--BG);
  font-size: 0.75rem;
  line-height: 1rem;
  border-radius: 2rem;
  background-color: var(--Theme-6);
  cursor: pointer;
}
.add-clock-in:hover {
  background-color: var(--Theme-7);
}
.add-clock-in:active {
  background-color: var(--Theme-8);
}

@media screen and (min-width: 1280px) {
  .mytodo {
    width: 100%;
    min-width: 36.5rem;
    margin: 0 0 0 2rem;
  }
  .others {
    display: flex;
  }
}
</style>