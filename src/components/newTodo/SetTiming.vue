<template>
  <div class="set-timeout">
    <input
      id="hour"
      type="number"
      :class="{ error: inputSettingIsError }"
      v-model="input.inputHour"
      @input="testingInputType(input.inputHour, 'hour')"
    />
    <label for="hour">时</label>
    <input
      id="minute"
      type="number"
      :class="{ error: inputSettingIsError }"
      v-model="input.inputMinute"
      @input="testingInputType(input.inputMinute, 'minute')"
    />
    <label for="minute">分</label>
    <p v-if="inputSettingIsError" id="error">请检查输入时间格式</p>
  </div>
</template>

<script>
export default {
  name: "SetTiming",
  computed: {
    inputSettingIsError() {
      return this.$store.state.inputSettingIsError;
    },
    input() {
      return this.$store.state.input;
    },
  },
  watch: {},
  methods: {
    testingInputType(input, type) {
      this.$store.commit('inputSettingIsErrorMethods', 'init');
      let baseInput = input;
      if (input.length == 1) {
        baseInput = "0" + input;
      }
      let hour = /^[0][0-9]$|^[1][0-9]$|^[2][0-3]$/;
      let minute = /^[0][0-9]$|^[1-5][0-9]$/;
      if (input.length !== 0) {
        switch (type) {
          case "hour":
            if (!hour.test(baseInput)) {
              this.$store.commit('inputSettingIsErrorMethods', 'test');
            }
            break;
          case "minute":
            if (!minute.test(baseInput)) {
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
.set-timeout {
  display: flex;
  align-items: center;
  margin-top: 2rem;
}
#hour,
#minute {
  width: 4rem;
  height: 2rem;
  padding: 0.25rem;
  border: 1px solid var(--Gray-4);
  color: var(--Gray-7);
  text-align: right;
  border-radius: 6px;
}
#hour.error {
  border: 1px solid #ef4444;
}
#minute.error {
  border: 1px solid #ef4444;
}
.set-timeout > label {
  margin: 0 0.5rem;
  color: var(--Gray-6);
  line-height: 2rem;
}
.set-timeout > p {
  margin-left: 2rem;
  color: var(--Gray-6);
  line-height: 2rem;
  letter-spacing: 1px;
}
#error {
  color: #ef4444;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
} /* chrome */
input[type="number"] {
  -moz-appearance: textfield; /* firefox */
}
</style>