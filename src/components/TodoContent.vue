<template>
  <div class="todo-content">
    <div v-if="visibleListsAll.length">
      <div
        v-for="(list, index) in visibleListsAll"
        :key="index"
        class="todo-list"
        :class="{
          completed: list.isComplete == true,
        }"
      >
        <!-- 颜色分类 -->
        <div class="todo-class" :style="{ background: list.class.color }"></div>
        <!-- 左侧主体 -->
        <div class="todo-left">
          <!-- 打勾选框 -->
          <check-box
            :class="{ checked: list.isComplete == true }"
            @ischecked="list.isComplete = !list.isComplete"
          ></check-box>
          <!-- 主内容 -->
          <div class="todo-main">
            <div class="todo-text">
              {{ list.content }}
            </div>
            <div class="todo-sta" v-show="list.inputHour && list.inputMinute">
              <div
                class="todo-timeout"
                v-show="list.inputHour && list.inputMinute"
              >
                <svg-icon icon-class="icon-clock"></svg-icon>
                <p>{{ list.inputHour + ":" + list.inputMinute }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧按钮 -->
        <div class="todo-right" v-if="list.isComplete == false">
          <div @click="editItem('todo', list)">
            <svg-icon icon-class="icon-edit"></svg-icon>
          </div>
          <div class="icon-delete" @click="removeTodo(list)">
            <svg-icon icon-class="icon-delete"></svg-icon>
          </div>
        </div>
      </div>
    </div>
    <!-- 缺省页 -->
    <div v-else class="null">
      <svg-icon icon-class="null" v-if="$store.state.theme == 'blue'"></svg-icon>
      <svg-icon icon-class="null-rose" v-else-if="$store.state.theme == 'rose'"></svg-icon>
      <svg-icon icon-class="null-emerald" v-if="$store.state.theme == 'emerald'"></svg-icon>
      <svg-icon icon-class="null-orange" v-if="$store.state.theme == 'orange'"></svg-icon>
      <span
        style="
          color: var(--Gray-6);
          font-size: 1rem;
          line-height: 1.5rem;
          letter-spacing: 1px;
        "
        >当前暂无待办，点击<span style="color: var(--Theme-6)">
          右上方按钮 </span
        >添加</span
      >
    </div>
  </div>
</template>

<script>
import CheckBox from "../components/TodoContent/CheckBox.vue";

export default {
  name: "TodoContent",
  components: {
    CheckBox,
  },
  computed: {
    // 用于展示的待办数组
    visibleListsAll() {
      const that = this;
      return this.$store.state.todoListsAll.filter(function (list) {
        return list.timestamp == that.selectTimestamp;
      });
    },
    // 选中的日期时间戳
    selectTimestamp() {
      return this.$store.state.selectTimestamp;
    },
  },
  methods: {
    // 编辑
    editItem(type, list) {
      this.$emit("edit-item", {
        type,
        list,
      });
    },
    // 删除
    removeTodo(list) {
      this.$store.commit("removeItem", {
        type: "todo",
        list,
      });
    },
  },
};
</script>

<style scoped>
/* 大盒子 */
.todo-content {
  overflow: hidden;
  min-width: 44.5rem;
  height: 46rem;
  margin: 1.5rem 0 2rem;
  border-radius: 16px;
  background-color: var(--BG);
}
.todo-content::-webkit-scrollbar {
  display: none;
}
.null {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 42rem;
}
.null > svg {
  width: 18.75rem;
  height: 18.75rem;
  margin-bottom: 1rem;
}
/* 单条待办 */
.todo-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5.75rem;
  /* cursor: pointer; */
}
.todo-list.completed {
  opacity: 0.6;
}
.todo-class {
  position: absolute;
  left: 0.875rem;
  width: 0.25rem;
  height: 2rem;
  border-radius: 0.125rem;
}
/* 左侧内容 */
.todo-left {
  display: flex;
  align-items: center;
}
/* 主内容 */
.todo-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 6rem;
  margin-right: 2rem;
}
.star {
  margin-right: 0.5rem;
}
.todo-text {
  color: var(--gray-7);
  font-size: 1rem;
  line-height: 1.5rem;
  letter-spacing: 1px;
  font-weight: 600;
}
.todo-sta {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 1rem;
  margin-top: 0.25rem;
}
.todo-timeout {
  display: flex;
  height: 1rem;
  margin-right: 0.5rem;
}
.todo-timeout > svg {
  color: var(--Theme-6);
  width: 1rem;
  height: 1rem;
}
.todo-timeout > p {
  margin-left: 0.25rem;
  color: var(--Gray-6);
  font-size: 0.75rem;
  /* line-height: 1rem; */
  font-weight: 400;
}
/* 右侧图标的盒子 */
.todo-right {
  position: absolute;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  width: 24rem;
  height: 6rem;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 1)
  );
  opacity: 0;
  transition: 0.2s ease-in-out 0.1s;
}
/* 图标 */
.todo-right > div > svg {
  color: var(--Gray-6);
  margin-right: 1.5rem;
  cursor: pointer;
}
.todo-right > div > svg:hover {
  color: var(--Theme-6);
}
.icon-delete {
  margin-right: 0.5rem;
}
#icon-star:hover {
  color: #eed9ae;
}
/* 单条待办的hover样式 */
.todo-list:hover {
  background-color: var(--Gray-1);
}
.todo-list:hover .todo-right {
  opacity: 1;
}
.todo-list:hover.completed {
  background: none;
}

@media (min-width: 1280px) {
  .todo-content {
    min-width: 36.5rem;
  }
}
</style>