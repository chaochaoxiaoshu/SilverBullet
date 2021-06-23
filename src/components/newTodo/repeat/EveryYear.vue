<template>
  <div class="every-year">
    <label for="every-year-month">每年的</label>
    <input
      id="every-year-month"
      type="number"
      :class="{ error: inputSettingIsError }"
      v-model="input.inputYearMonth"
      @input="testingInputType(input.inputYearMonth, 'month')"
    />
    <label for="every-year-month">月</label>
    <input
      id="every-year-day"
      type="number"
      :class="{ error: inputSettingIsError }"
      v-model="input.inputYearDay"
      @input="testingInputType(input.inputYearDay, 'day')"
    />
    <label for="every-year-day">日</label>
    <p v-show="inputSettingIsError == true" id="error">请检查输入格式</p>
  </div>
</template>

<script>
export default {
  name: "EveryYear",
  computed: {
    input() {
      return this.$store.state.input;
    },
    inputSettingIsError() {
      return this.$store.state.inputSettingIsError;
    },
  },
  methods: {
    testingInputType(input, type) {
      this.$store.commit('inputSettingIsErrorMethods', 'init');
      let baseInput = input;
      if (input.length == 1) {
        baseInput = "0" + input;
      }
      let month = /^[0][1-9]$|^[1][0-2]$/;
      let day = /^[0][1-9]$|^[1-2][0-9]$|^[3][0-1]$/;
      if (input.length !== 0) {
        switch (type) {
          case "month":
            if (!month.test(baseInput)) {
              this.$store.commit('inputSettingIsErrorMethods', 'test');
            }
            break;
          case "day":
            if (!day.test(baseInput)) {
              this.$store.commit('inputSettingIsErrorMethods', 'test');
            }
            break;
        }
      }
    },
  },
};
</script>

<style scoped>
.every-year {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
input {
  width: 4rem;
  height: 2rem;
  padding: 0.25rem;
  border: 1px solid var(--Gray-4);
  color: var(--Gray-7);
  text-align: right;
  border-radius: 6px;
}
label {
  margin: 0 0.5rem;
  color: var(--Gray-6);
  line-height: 2rem;
}
#error {
  margin-left: 1rem;
  color: #ef4444;
}
input.error {
  border: 1px solid #ef4444;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
} /* chrome */
input[type="number"] {
  -moz-appearance: textfield; /* firefox */
}
</style>