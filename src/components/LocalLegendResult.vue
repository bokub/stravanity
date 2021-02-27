<template>
  <div class="row justify-content-between">
    <div class="col-auto">
      <div class="text-muted small">Segment distance</div>
      <div class="h5">{{ distance }}</div>
    </div>
    <div class="col-auto">
      <div class="text-muted small">Effort count</div>
      <div class="h5">{{ segment.computed?.effortCount }}</div>
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
  import { defineComponent, PropType } from 'vue';
  import { Segment } from '@/types';
  import { formatDistance } from '@/utils';

  export default defineComponent({
    name: 'LocalLegendResult',
    props: {
      segment: {
        type: Object as PropType<Segment>,
        required: true
      }
    },
    computed: {
      distance(): string {
        return formatDistance(this.segment.details?.distance);
      },
      totalDistance(): string {
        return formatDistance(this.segment.computed?.distanceToLocalLegend);
      }
    }
  });
</script>
