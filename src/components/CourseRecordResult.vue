<template>
  <div class="row justify-content-between">
    <div class="col-auto">
      <div class="text-muted small">Segment distance</div>
      <div class="h5">{{ distance }}</div>
    </div>
    <div class="col-auto">
      <div class="text-muted small">Best time</div>
      <div class="h5">{{ segment.computed?.bestTimeString }}</div>
    </div>
    <div class="col-auto">
      <div class="text-muted small">
        {{ label }}
      </div>
      <div class="h5">
        <strong>{{ speed }}</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import { ActivityType, type Segment } from '@/types';
  import { formatDistance, formatSpeed } from '@/utils';

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
      label(): string {
        return this.segment.details?.activity_type === ActivityType.Ride ? 'Best speed' : 'Best pace';
      },
    },
  });
</script>
