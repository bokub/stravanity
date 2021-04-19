<template>
  <div class="card mb-2">
    <div class="card-body pb-1" @click="fitBounds">
      <div class="row mb-2">
        <div class="col-auto">
          <span class="h5 text-muted">#{{ index }}</span>
        </div>
        <div class="col ps-0">
          <span class="card-title text-primary h6">{{ segment.name }}</span>
        </div>
        <div class="col-auto">
          <img :src="segment.elevation_profile" alt="Elevation profile" height="25" />
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Segment } from '@/types';
  export default defineComponent({
    name: 'Result',
    props: {
      segment: {
        type: Object as PropType<Segment>,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },
    methods: {
      fitBounds() {
        (this.$root?.$refs.map as any).fitBounds([this.segment.start_latlng, this.segment.end_latlng]);
      },
    },
  });
</script>

<style lang="scss" scoped>
  .card-body {
    cursor: pointer;
  }
</style>
