<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import Chart from "chart.js";
import { Scatter, mixins } from "vue-chartjs";

@Component
export default class CsScatter extends Mixins(Scatter, mixins.reactiveProp) {
  @Prop({ type: Object, default: null }) readonly chartData!: Chart.ChartData;
  @Prop({ type: Object, default: null })
  readonly chartOptions!: Chart.ChartOptions;

  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
}
</script>
