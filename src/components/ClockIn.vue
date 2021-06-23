<template>
  <div class="clock-in">
    <div v-if="!allClockInMode" class="today">
      <div v-if="visibleClockIn.length">
        <div
          class="list"
          v-for="(list, index) in visibleClockIn"
          :key="index"
          :class="{ completed: list.isComplete == true }"
        >
          <div class="class" :style="{ background: list.class.color }"></div>
          <check-box
            :class="{ checked: list.isComplete == true }"
            @ischecked="list.isComplete = !list.isComplete"
          ></check-box>
          <div class="content-box">
            <p class="content">{{ list.content }}</p>
          </div>
        </div>
      </div>
      <div v-else class="null">
        <svg-icon icon-class="clockin-null" v-if="$store.state.theme == 'blue'"></svg-icon>
        <svg-icon icon-class="clockin-null-emerald" v-if="$store.state.theme == 'emerald'"></svg-icon>
        <svg-icon icon-class="clockin-null-rose" v-if="$store.state.theme == 'rose'"></svg-icon>
        <svg-icon icon-class="clockin-null-orange" v-if="$store.state.theme == 'orange'"></svg-icon>
        <p>今日暂无打卡事项</p>
      </div>
    </div>
    <div v-else-if="allClockInMode" class="all">
      <div v-if="clockInAll.length">
        <div class="list" v-for="(list, index) in clockInAll" :key="index">
          <div class="class" :style="{ background: list.class.color }"></div>
          <div class="content-box all">
            <p class="content">{{ list.content }}</p>
            <p class="info">
              {{ repeatModel(list) }}
            </p>
          </div>
          <div class="clockin-right">
            <div @click="editItem('clockIn', list)">
              <svg-icon icon-class="icon-edit"></svg-icon>
            </div>
            <div class="icon-delete" @click="removeClockIn(list)">
              <svg-icon icon-class="icon-delete"></svg-icon>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="null">
        <svg-icon icon-class="clockin-null"></svg-icon>
        <p>暂无打卡，点击右上角按钮添加</p>
      </div>
    </div>
  </div>
</template>

<script>
import CheckBox from "../components/TodoContent/CheckBox.vue";

export default {
  name: "ClockIn",
  props: [],
  components: {
    CheckBox,
  },
  data() {
    return {
      allClockInMode: false,
      todayIsDay: String(this.dayjs().day()),
      todayDate: String(this.dayjs().date()),
      todayMonth: String(this.dayjs().month() + 1),
    };
  },
  computed: {
    // 所有打卡事项
    clockInAll() {
      return this.$store.state.clockInAll;
    },
    // 用于展示的打卡事项
    visibleClockIn() {
      return this.$store.getters.visibleClockIn;
    },
  },
  methods: {
    // 切换显示模式
    checkMode() {
      this.allClockInMode = !this.allClockInMode;
    },
    // 重复
    repeatModel(list) {
      let model = "";
      let day = ["日", "一", "二", "三", "四", "五", "六"];
      let visibleWeek;
      switch (list.repeatModel) {
        case "day":
          model = "每天";
          break;
        case "week":
          visibleWeek = list.repeat.map((d) => day[d]);
          model = "每周 " + visibleWeek;
          break;
        case "month":
          model = "每月 " + list.repeat + "日";
          break;
        case "year":
          model = "每年 " + list.repeat.month + "月" + list.repeat.day + "日";
          break;
      }
      return model;
    },
    // 编辑
    editItem(type, list) {
      this.$emit("edit-item", {
        type,
        list,
      });
    },
    // 删除
    removeClockIn(list) {
      this.$store.commit("removeItem", {
        type: "clockIn",
        list,
      });
    },
  },
  mounted() {
    this.$store.commit('importToday', {
      todayIsDay: this.todayIsDay,
      todayDate: this.todayDate,
      todayMonth: this.todayMonth
    })
  }
};
</script>

<style scoped>
.clock-in {
  overflow: hidden;
  width: 22.5rem;
  height: 26.5rem;
  margin-bottom: 2rem;
  border-radius: 16px;
  background-color: var(--BG);
}
.list {
  position: relative;
  display: flex;
  align-items: center;
  height: 5.3125rem;
}
.list.completed {
  opacity: 0.6;
}
.list:hover {
  background-color: var(--Gray-1);
}
.list:hover.list.completed {
  background: none;
}
.class {
  position: absolute;
  left: 0.875rem;
  width: 0.25rem;
  height: 2rem;
  border-radius: 0.125rem;
}
.content-box {
  display: flex;
  flex-direction: column;
}
.content-box.all {
  margin-left: 2rem;
}
.content {
  color: var(--Gray-8);
  font-size: 0.875rem;
  font-weight: 600;
}
.info {
  color: var(--Gray-6);
  font-size: 0.75rem;
  font-weight: 400;
}
.null {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 26.5rem;
}
.null > svg {
  width: 12rem;
  height: 12rem;
  margin-bottom: 2rem;
}
.null > p {
  color: var(--Gray-6);
  font-size: 0.875rem;
  line-height: 1.5rem;
  letter-spacing: 1px;
}
.clockin-right {
  position: absolute;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.clockin-right > div > svg {
  color: var(--Gray-6);
  margin-right: 1.5rem;
  cursor: pointer;
}
.clockin-right > div > svg:hover {
  color: var(--Theme-6);
}
</style>