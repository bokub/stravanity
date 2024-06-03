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
        <div class="col-auto position-relative">
          <img :src="segment.elevation_profile" alt="Elevation profile" height="25" />
          <div class="avg-grade" v-if="segment.avg_grade">{{ segment.avg_grade }} %</div>
        </div>
        <div class="col-auto">
          <div class="dropdown dropstart">
            <button class="btn btn-link" type="button" data-bs-toggle="dropdown" aria-expanded="false" @click.stop>
              <img src="/img/ellipsis-vertical.svg" alt="More actions" />
            </button>
            <ul class="dropdown-menu" ref="dropdownMenu">
              <li>
                <a
                  class="dropdown-item"
                  v-if="segment.details"
                  target="_blank"
                  @click.stop="closeDropdown"
                  :href="segment.details.xoms.destination.href.replace('strava://', 'https://strava.com/')"
                >
                  Open in Strava
                </a>
              </li>
              <li><a class="dropdown-item" @click.stop="refresh" href="javascript:void(0)">Refresh data</a></li>
            </ul>
          </div>
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
    methods: {
      closeDropdown() {
        (this.$refs.dropdownMenu as any).classList.remove('show');
      },
      async refresh() {
        this.closeDropdown();
        await (this.$root as any).fetchSegment(this.segment.id);
      },
    },
  });
</script>

<style scoped>
  .card-body {
    cursor: pointer;
  }
  .avg-grade {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.75rem;
    text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
  }
</style>
