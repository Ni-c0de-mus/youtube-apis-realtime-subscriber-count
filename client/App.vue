<template>
  <main>
    <section class="main">
      <h6>Pewdiepie vs T-Series Subscriber Count</h6>
      <div class="numbers">
        <animated-number
          :value="pewdiepieStats.subscriberCount"
          :formatValue="formatCount"
          :duration="duration"
        />·
        <animated-number
          :value="tseriesStats.subscriberCount"
          :formatValue="formatCount"
          :duration="duration"
        />
      </div>
      <span>{{currentTime}}</span>
    </section>
  </main>
</template>

<script>
import io from "socket.io-client";
import AnimatedNumber from "animated-number-vue";
import moment from "moment";

export default {
  components: { AnimatedNumber },
  data: () => ({
    pewdiepieStats: {},
    tseriesStats: {},
    currentTime: null,
    duration: 1000
  }),
  async mounted() {
    this.getCurrentTime();
    const BASE_URL = "http://localhost:4000";
    const res = await fetch(`${BASE_URL}/stats`);
    const { pewdiepieStats, tseriesStats } = await res.json();
    this.pewdiepieStats = pewdiepieStats;
    this.tseriesStats = tseriesStats;

    const socket = io(BASE_URL);
    socket.on("stats", ({ pewdiepieStats, tseriesStats }) => {
      this.pewdiepieStats = pewdiepieStats;
      this.tseriesStats = tseriesStats;
    });
  },
  methods: {
    formatCount(value) {
      return Number(value).toFixed(0);
    },
    getCurrentTime() {
      setInterval(() => {
        this.currentTime = moment().format("MMM Do, h:mm:ss a");
      }, 1000);
    }
  }
};
</script>

<style>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10vh 0;
}

.numbers {
  display: flex;
}
</style>
