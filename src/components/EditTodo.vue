<template>
  <div>
    <!-- 黑色模糊遮罩 -->
    <transition name="mask">
      <div class="mask" v-if="newTodoIsOpen"></div>
    </transition>
    <!-- 待办窗口主体 -->
    <transition name="todo">
      <div class="todo-window" v-if="newTodoIsOpen">
        <div class="top">
          <!-- 标题 -->
          <div class="title">
            <h2>{{ windowMode.title }}</h2>
            <div class="btns">
              <button @click="closeWindow" class="btn cancel">取消</button>
              <button
                @click="saveInput(windowMode.settingType)"
                class="btn save"
              >
                确定
              </button>
            </div>
          </div>
          <!-- 正文输入框 -->
          <textarea
            class="textarea"
            :placeholder="
              windowMode.settingType == 'todo'
                ? '想做点什么？'
                : '坚持打卡，养成好习惯'
            "
            v-model="input.inputContent"
            @keyup.enter="saveInput(windowMode.settingType)"
          ></textarea>
        </div>
        <!-- 设置 -->
        <div class="bottom">
          <div class="settings">
            <check-setting
              ref="setting"
              :icon="windowMode.iconClass"
              :setting="windowMode.settingType"
              :isopen="settingIsOpen"
              @toparent="settingIsOpen = !settingIsOpen"
            ></check-setting>
            <check-class ref="class"></check-class>
          </div>
          <set-timing
            ref="timeout"
            v-if="settingIsOpen && windowMode.settingType == 'todo'"
          ></set-timing>
          <set-repeat
            ref="repeat"
            v-if="settingIsOpen && windowMode.settingType == 'clockIn'"
          ></set-repeat>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import CheckSetting from "../components/newTodo/CheckSetting.vue";
import CheckClass from "../components/newTodo/CheckClass.vue";
import SetTiming from "./newTodo/SetTiming.vue";
import SetRepeat from "../components/newTodo/SetRepeat.vue";

export default {
  name: "EditTodo",
  components: {
    CheckSetting,
    CheckClass,
    SetTiming,
    SetRepeat,
  },
  data() {
    return {
      // 新建待办页面是否打开
      newTodoIsOpen: false,
      // 盒子模式，通过新建按钮点击传入参数确定盒子的模式
      windowMode: {},
      // 编辑模式，通过编辑按钮进入窗口时激活此属性
      editMode: false,
      // 待办设置是否打开
      settingIsOpen: false,
      // 输入正文
      // inputContent: "",
    };
  },
  computed: {
    todoListsAll() {
      return this.$store.state.todoListsAll;
    },
    clockInAll() {
      return this.$store.state.clockInAll;
    },
    oldValue() {
      return this.$store.state.oldValue;
    },
    input() {
      return this.$store.state.input;
    },
    selectTimestamp() {
      return this.$store.state.selectTimestamp;
    },
  },
  methods: {
    // 打开窗口
    openWindow(type, action, oldValue) {
      this.newTodoIsOpen = true;
      this.windowMode = {
        title: type == "todo" ? "新建待办" : "新建打卡",
        iconClass: type == "todo" ? "icon-clock" : "icon-repeat",
        settingType: type,
      };
      this.settingIsOpen = type == "todo" ? false : true;
      if (action == "edit") {
        this.editMode = true;
        if (type == "todo") {
          this.$store.commit("editItem", {
            type: "todo",
            oldValue,
          });
        } else if (type == "clockIn") {
          this.$store.commit("editItem", {
            type: "clockIn",
            oldValue,
          });
        }
      }
    },
    // 关闭窗口
    closeWindow() {
      this.newTodoIsOpen = false;
      if (this.input.inputContent && !this.editMode) {
        let b = confirm("当前有正在编辑的内容，是否存为草稿？");
        if (!b) {
          this.$store.commit("clearInput");
        }
      } else {
        this.$store.commit("clearInput");
        this.editMode = false;
      }
    },
    // 保存数据
    saveInput(type) {
      if (this.input.inputContent) {
        if (
          !this.inputSettingIsEmpty(type) &&
          !this.$store.state.inputSettingIsError
        ) {
          let push = {
            isComplete: false,
            isStar: false,
            timestamp: this.selectTimestamp,
            content: this.input.inputContent,
            class: this.input.class,
          };
          if (type == "todo") {
            this.saveNewTodo(push);
            this.$store.commit('addPastDaysTimestamp');
          } else if (type == "clockIn") {
            this.saveNewClockIn(push);
          }
          this.$store.commit("clearInput");
          this.newTodoIsOpen = false;
        } else {
          this.$parent.formatError();
        }
      } else {
        this.$parent.noContent();
      }
    },
    // 检测打开设置时是否有输入框留空
    inputSettingIsEmpty(type) {
      let value = false;
      if (type == "todo") {
        value =
          (this.settingIsOpen && !this.input.inputHour) ||
          (this.settingIsOpen && !this.input.inputMinute);
      } else if (type == "clockIn") {
        if (this.input.checkRepeat == "week") {
          value = this.settingIsOpen && !this.input.checkRepeatWeek.length;
        } else if (this.input.checkRepeat == "month") {
          value = this.settingIsOpen && !this.input.inputMonthDay;
        } else if (this.input.checkRepeat == "year") {
          value =
            (this.settingIsOpen && !this.input.inputYearMonth) ||
            (this.settingIsOpen && !this.input.inputYearDay);
        }
      }
      return value;
    },
    // 保存待办
    saveNewTodo(push) {
      push.isStar = false;
      // 如果打开了定时设置，就保存定时数据
      if (this.settingIsOpen) {
        push.isHasSetting = this.settingIsOpen;
        push.inputHour = this.input.inputHour;
        push.inputMinute = this.input.inputMinute;
      }
      // 检测是否为编辑状态
      if (!this.editMode) {
        this.$store.commit("createItem", {
          push,
          type: "todo",
        });
      } else {
        this.$store.commit("updateItem", {
          type: 'todo',
          push,
        });
        this.editMode = false;
      }
    },
    // 保存打卡
    saveNewClockIn(push) {
      // 根据选中的重复模式，保存对应的值
      if (this.settingIsOpen) {
        if (this.input.checkRepeat == "day") {
          push.repeatModel = this.input.checkRepeat;
        } else if (
          this.input.checkRepeat == "week" &&
          this.input.checkRepeatWeek
        ) {
          push.repeat = this.input.checkRepeatWeek;
          push.repeatModel = this.input.checkRepeat;
        } else if (
          this.input.checkRepeat == "month" &&
          this.input.inputMonthDay
        ) {
          push.repeat = this.input.inputMonthDay;
          push.repeatModel = this.input.checkRepeat;
        } else if (
          this.input.checkRepeat == "year" &&
          this.input.inputYearMonth &&
          this.input.inputYearDay
        ) {
          push.repeat = {
            month: this.input.inputYearMonth,
            day: this.input.inputYearDay,
          };
          push.repeatModel = this.input.checkRepeat;
        }
      }
      // 检测是否为编辑状态
      if (!this.editMode) {
        this.$store.commit("createItem", {
          push,
          type: "clockIn",
        });
      } else {
        this.$store.commit("updateItem", {
          type: "clockIn",
          push,
        });
        this.editMode = false;
      }
    },
  },
};
</script>

<style scoped>
/* 遮罩层 */
.mask-enter-active {
  animation: anim 0.4s ease-in-out;
}
.mask-leave-active {
  animation: anim 0.6s ease-in-out reverse;
}
@keyframes anim {
  0% {
    background-color: rgba(0, 0, 0, 0);
    /* backdrop-filter: blur(0px); */
  }
  100% {
    background-color: rgba(0, 0, 0, 0.4);
    /* backdrop-filter: blur(10px); */
  }
}
.mask {
  z-index: 99;
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 67.5rem;
  background-color: rgba(0, 0, 0, 0.4);
  /* backdrop-filter: blur(10px); */
}

/* 待办窗口 */
.todo-enter-active {
  animation: anim1 0.4s ease-in-out;
}
.todo-leave-active {
  animation: anim2 0.6s;
}
@keyframes anim1 {
  0% {
    top: calc(50% - 14rem);
    opacity: 0;
  }
  100% {
    top: calc(50% - 12rem);
    opacity: 1;
  }
}
@keyframes anim2 {
  0% {
    top: calc(50% - 12rem);
    opacity: 1;
  }
  100% {
    top: calc(50% - 10rem);
    opacity: 0;
  }
}
.todo-window {
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  left: calc(50% - 26rem);
  top: calc(50% - 12rem);
  width: 52rem;
  min-height: 16rem;
  max-height: 36rem;
  padding: 2rem;
  border-radius: 16px;
  opacity: 1;
  background-color: var(--BG);
  transition: 0.5s ease-in-out;
}
/* 标题和按钮 */
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 2rem;
}
.title > h2 {
  color: var(--Gray-8);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
}
.btn {
  border: 0;
  background: none;
  font-size: 1.25rem;
  line-height: 2rem;
  font-weight: 600;
  cursor: pointer;
}
.cancel {
  color: var(--Gray-6);
}
.cancel:hover {
  color: var(--Gray-7);
}
.cancel:active {
  color: var(--Gray-8);
}
.save {
  margin-left: 2rem;
  color: var(--Theme-6);
}
.save:hover {
  color: var(--Theme-7);
}
.save:active {
  color: var(--Theme-9);
}
/* 输入框 */
.textarea {
  display: flex;
  width: 100%;
  min-height: 4rem;
  margin: 2rem 0 2rem 0;
  border: 0;
  color: var(--Gray-7);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 400;
  letter-spacing: 2px;
  outline: none;
  resize: none;
}
.textarea::placeholder {
  color: var(--Gray-4);
}

.settings {
  display: flex;
  align-items: center;
}
</style>