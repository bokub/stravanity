<template>
  <div class="row justify-content-between">
    <div class="col-auto">
      <div class="text-muted small">Segment distance</div>
      <div class="h5">{{ distance }}</div>
      <template v-if="showAthleteData">
        <div class="text-muted small fst-italic">Your efforts count</div>
        <div class="h5">{{ segment.details?.athlete_segment_stats.effort_count }}</div>
      </template>
    </div>
    <div class="col-auto">
      <div class="text-muted small">Best time</div>
      <div class="h5">{{ segment.computed?.bestTimeString }}</div>
      <template v-if="showAthleteData">
        <div class="text-muted small fst-italic">Your best time</div>
        <div class="h5">{{ athleteBestTime }}</div>
      </template>
    </div>
    <div class="col-auto">
      <div class="text-muted small">
        {{ label }}
      </div>
      <div class="h5">
        <strong>{{ speed }}</strong>
      </div>
      <template v-if="showAthleteData">
        <div class="text-muted small fst-italic">
          {{ athleteLabel }}
        </div>
        <div class="h5">
          {{ athleteBestSpeed }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import { ActivityType, type Segment } from '@/types';
  import { formatDistance, formatSpeed, formatTime } from '@/utils';

  export default defineComponent({
    name: 'CourseRecordResult',
    props: {
      segment: {
        type: Object as PropType<Segment>,
        required: true,
      },
    },
    computed: {
      distance(): string {
        return formatDistance(this.segment.details?.distance);
      },
      speed(): string {
        return formatSpeed(this.segment.computed?.speedRecord, this.segment.details?.activity_type);
      },
      showAthleteData(): boolean {
        return !!this.segment.details?.athlete_segment_stats.effort_count;
      },
      athleteBestSpeed(): string {
        if (!this.segment.details) {
          return 'N/A';
        }
        const minutes = this.segment.details.athlete_segment_stats.pr_elapsed_time / 60;
        const kms = this.segment.details.distance / 1000;
        return formatSpeed(minutes / kms, this.segment.details?.activity_type);
      },
      athleteBestTime(): string {
        return formatTime(this.segment.details?.athlete_segment_stats.pr_elapsed_time || 0);
      },
      label(): string {
        return this.segment.details?.activity_type === ActivityType.Ride ? 'Best speed' : 'Best pace';
      },
      athleteLabel(): string {
        return this.segment.details?.activity_type === ActivityType.Ride ? 'Your best speed' : 'Your best pace';
      },
    },
  });
</script>
