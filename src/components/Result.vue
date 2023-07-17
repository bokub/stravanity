<template>
  <div class="card mb-2">
    <div
      class="card-body pb-1"
      :class="{ 'bg-secondary bg-opacity-10': highlighted }"
      @click="$emit('highlight', segment.id)"
    >
      <div class="row mb-2">
        <div class="col-auto">
          <span class="h5 text-muted">#{{ index }}</span>
        </div>
        <div class="col ps-0">
          <span class="card-title h6" :class="highlighted ? 'text-secondary fw-bold' : 'text-primary'">
            {{ segment.name }}
          </span>
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
  import { defineComponent, type PropType } from 'vue';
  import { type Segment } from '@/types';
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
      highlighted: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>

<style lang="scss" scoped>
  .card-body {
    cursor: pointer;
  }
</style>
