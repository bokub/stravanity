<template>
  <div class="row justify-content-between">
    <div class="col-auto">
      <div class="text-muted small">Segment distance</div>
      <div class="h5">{{ distance }}</div>
      <template v-if="showAthleteData">
        <div class="text-muted small fst-italic">Your best time</div>
        <div class="h5">{{ athleteBestTime }}</div>
      </template>
    </div>
    <div class="col-auto">
      <div class="text-muted small">Effort count (90 days)</div>
      <div class="h5">{{ segment.computed?.effortCount }}</div>
      <template v-if="showAthleteData">
        <div class="text-muted small fst-italic">Your effort count (total)</div>
        <div class="h5">{{ segment.details?.athlete_segment_stats.effort_count }}</div>
      </template>
    </div>
    <div class="col-auto">
      <div class="text-muted small">Total distance</div>
      <div class="h5">
        <strong>{{ totalDistance }}</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import { type Segment } from '@/types';
  import { formatDistance, formatTime } from '@/utils';

  export default defineComponent({
    name: 'LocalLegendResult',
    props: {
      segment: {
        type: Object as PropType<Segment>,
        required: true,
      },
    },
    computed: {
      showAthleteData(): boolean {
        return !!this.segment.details?.athlete_segment_stats.effort_count;
      },
      distance(): string {
        return formatDistance(this.segment.details?.distance);
      },
      totalDistance(): string {
        return formatDistance(this.segment.computed?.distanceToLocalLegend);
      },
      athleteBestTime(): string {
        return formatTime(this.segment.details?.athlete_segment_stats.pr_elapsed_time || 0);
      },
    },
  });
</script>
