<template>
  <div>
    <div class="row justify-content-around">
      <div class="col-auto mb-4">
        <div class="btn-group">
          <input type="radio" class="btn-check" id="local-legend-radio" v-model="recordType" value="LocalLegend" />
          <label class="btn btn-outline-primary" for="local-legend-radio">Local Legend</label>

          <input type="radio" class="btn-check" id="course-record-radio" v-model="recordType" value="CourseRecord" />
          <label class="btn btn-outline-primary" for="course-record-radio">Course Record</label>
        </div>
      </div>
      <div class="col-auto mb-4">
        <div class="btn-group">
          <input type="radio" class="btn-check" id="overall-radio" v-model="onlyWomen" :value="false" />
          <label class="btn btn-outline-primary" for="overall-radio">Overall</label>

          <input type="radio" class="btn-check" id="women-radio" v-model="onlyWomen" :value="true" />
          <label class="btn btn-outline-primary" for="women-radio">Women</label>
        </div>
      </div>
    </div>

    <Result v-for="(segment, i) in orderedSegments" :key="segment.id" :segment="segment" :index="i + 1">
      <component
        :is="recordType === 'LocalLegend' ? 'LocalLegendResult' : 'CourseRecordResult'"
        :segment="segment"
      ></component>
    </Result>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { RecordType, Segment } from '@/types';
  import LocalLegendResult from '@/components/LocalLegendResult.vue';
  import CourseRecordResult from '@/components/CourseRecordResult.vue';
  import { isInBounds, parseTime } from '@/utils';
  import Result from '@/components/Result.vue';

  export default defineComponent({
    name: 'Results',
    components: { Result, LocalLegendResult, CourseRecordResult },
    props: {
      segments: {
        type: Array as PropType<Segment[]>,
        required: true,
      },
      bounds: {
        type: Object as PropType<[number, number, number, number]>,
        required: true,
      },
    },

    data: () => ({
      recordType: RecordType.LocalLegend,
      onlyWomen: false,
    }),

    computed: {
      visibleSegments(): Segment[] {
        return this.segments.filter((s: Segment) => {
          return isInBounds(s.start_latlng, this.bounds) || isInBounds(s.end_latlng, this.bounds);
        });
      },
      orderedSegments(): Segment[] {
        const array: Segment[] = this.visibleSegments.map((s: Segment) => {
          s.computed = {};
          if (s.details) {
            if (s.local_legend_enabled && s.details.local_legend) {
              s.computed.effortCount = parseFloat(
                s.details.local_legend.effort_counts[this.onlyWomen ? 'female' : 'overall']
              );
              s.computed.distanceToLocalLegend = s.details.distance * s.computed.effortCount;
            }

            if (s.details.xoms) {
              s.computed.bestTimeString = s.details.xoms[this.onlyWomen ? 'qom' : 'kom'] || '';
              if (s.computed.bestTimeString) {
                const time = parseTime(s.computed.bestTimeString);
                s.computed.speedRecord = (1000 * time) / (s.details.distance * 60);
              }
            }
          }

          return s;
        });

        if (this.recordType === RecordType.LocalLegend) {
          // Sort by distance
          array.sort((a, b) => (a.computed?.distanceToLocalLegend || 0) - (b.computed?.distanceToLocalLegend || 0));
          return array.filter((s) => s.local_legend_enabled && s.computed?.distanceToLocalLegend);
        }
        if (this.recordType === RecordType.CourseRecord) {
          // Sort by speed
          array.sort((a, b) => (b.computed?.speedRecord || 0) - (a.computed?.speedRecord || 0));
          return array.filter((s) => s.computed?.speedRecord);
        }
        return array;
      },
    },
  });
</script>
