<template>
  <div class="dashboard">
    <div class="dashboard-title">
      <h2>数据统计（前七日）</h2>
      <div class="warning" :class="{ close: !warningIsSHow }" v-if="isSampleMode">
        <svg-icon icon-class="icon-warning"></svg-icon>
        <p class="warning-info">
          当前展示的是示例数据，您的数据统计将在您使用一段时间后生成。
        </p>
        <div class="close" @click="warningIsSHow = false">
          <svg-icon icon-class="icon-close"></svg-icon>
        </div>
      </div>
    </div>
    <todo-chart ref="chart"></todo-chart>
    <analysis-model></analysis-model>
    <data-report></data-report>
  </div>
</template>

<script>
import TodoChart from "../components/TodoChart.vue";
import AnalysisModel from "../components/AnalysisModel.vue";
import DataReport from "../components/DataReport.vue";
import DataAlgorithm from "../components/DataAlgorithm";

export default {
  mixins: [DataAlgorithm],
  name: "Dashboard",
  components: {
    TodoChart,
    AnalysisModel,
    DataReport,
  },
  data() {
    return {
      warningIsSHow: true,
    };
  },
};
</script>

<style scoped>
.dashboard {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  min-width: 44.5rem;
  padding: 0 2rem;
}
.dashboard-title {
  min-width: 44.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
}
h2 {
  display: inline;
  color: var(--Gray-8);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
}
.warning {
  position: absolute;
  right: 2rem;
  display: flex;
  align-items: center;
  height: 3rem;
  padding: 0 2rem;
  border-radius: 6px;
  background-color: var(--BG);
}
.warning.close {
  display: none;
}
.warning-info {
  margin: 0 1rem;
  color: var(--Gray-7);
  font-size: 0.875rem;
  line-height: 2rem;
  letter-spacing: 1px;
  font-weight: 500;
}
.close {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--Gray-7);
  border-radius: 100%;
  background-color: var(--Gray-2);
  cursor: pointer;
}
.close:hover {
  background-color: var(--Gray-3);
}
.todo-chart,
.analysis-model,
.data-report {
  margin-bottom: 1.5rem;
}
</style>