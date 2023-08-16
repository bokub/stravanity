<template>
  <div class="container bg-white shadow rounded px-3 py-3 my-3">
    <Top class="mt-3 mb-4 mx-2"></Top>
    <Problems v-bind="problems"></Problems>
    <div class="row">
      <div class="col-12 col-lg-6">
        <InteractiveMap @move="loadSegments" @ready="onMapReady" ref="map"></InteractiveMap>
        <img src="/img/powered-by-strava.svg" alt="Powered by Strava" height="30" class="float-end" />
      </div>
      <div class="col-12 col-lg-6">
        <Results :segments="segmentsArray" :bounds="bounds" v-if="bounds">
          <template v-slot:activityType>
            <div class="col-auto mb-4">
              <div class="btn-group">
                <input type="radio" class="btn-check" id="run-radio" v-model="activityType" :value="ActivityType.Run" />
                <label class="btn btn-outline-primary" for="run-radio">{{ ActivityType.Run }}</label>
                <input
                  type="radio"
                  class="btn-check"
                  id="ride-radio"
                  v-model="activityType"
                  :value="ActivityType.Ride"
                />
                <label class="btn btn-outline-primary" for="ride-radio">{{ ActivityType.Ride }}</label>
              </div>
            </div>
          </template>
        </Results>
        <div v-if="problems.notConnected" class="pt-5 text-center">
          <h4>
            <span class="text-muted">Not connected</span>
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import InteractiveMap from './components/InteractiveMap.vue';
  import Results from './components/Results.vue';
  import { ActivityType, type Bounds, type Segment, type SegmentDetails } from '@/types';
  import Cookies from 'js-cookie';
  import axios from 'axios';
  import Problems from '@/components/Problems.vue';
  import Top from '@/components/Top.vue';

  let timeout = 0;

  const api = axios.create({
    baseURL: 'https://www.strava.com/api/v3/',
    headers: {
      Authorization: 'Bearer ' + Cookies.get('access_token'),
    },
  });

  export default defineComponent({
    name: 'App',
    components: {
      Top,
      Problems,
      InteractiveMap,
      Results,
    },
    data: () => ({
      ActivityType,
      activityType: ActivityType.Run,
      segments: {} as { [key: number]: Segment },
      bounds: undefined as Bounds | undefined,
      problems: {
        limitReached: false,
        notConnected: false,
      },
    }),
    watch: {
      activityType(newVal, oldVal) {
        if (oldVal !== newVal) {
          localStorage.setItem('activityType', newVal);
          const map = this.$refs.map as any;
          if (map) {
            map.clearSegments();
            this.onMapReady();
            this.loadSegments(this.bounds as Bounds);
          }
        }
      },
    },
    created() {
      api.interceptors.response.use(
        (res) => {
          this.problems.notConnected = false;
          this.problems.limitReached = false;
          return res;
        },
        (error) => {
          this.problems.notConnected = error.response.status === 401;
          this.problems.limitReached = error.response.status === 429;
          if (error.response.status === 401) {
            Cookies.remove('access_token');
          }

          if (this.problems.limitReached) {
            const secondsLeft = 60 * (15 - (new Date().getMinutes() % 15)) - new Date().getSeconds() + 15;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              this.problems.limitReached = false;
            }, secondsLeft * 1000);
          }

          return Promise.reject(error);
        }
      );
    },
    beforeMount() {
      const activityType = localStorage.getItem('activityType');
      if (activityType) {
        this.activityType = activityType as ActivityType;
      }
    },
    methods: {
      async loadSegments(bounds: Bounds) {
        this.bounds = bounds;

        if (this.problems.limitReached) {
          return;
        }

        const payload: Segment[] = await api
          .get('/segments/explore', {
            params: {
              bounds: bounds.join(','),
              activity_type: this.activityType === ActivityType.Ride ? 'riding' : 'running',
            },
          })
          .then((res) => res.data.segments);

        await Promise.all(
          payload.map(async (segment) => {
            if (!this.segments[segment.id]) {
              this.segments[segment.id] = segment;
              (this.$refs.map as any).drawSegment(segment);

              const key = `segment_${segment.id}`;
              const cached = localStorage.getItem(key);
              if (!cached) {
                await this.fetchSegment(segment.id);
              } else {
                this.segments[segment.id].details = JSON.parse(cached).details;
              }
            }
          })
        );
      },
      async fetchSegment(segmentId: number) {
        const key = `segment_${segmentId}`;
        await api
          .get('/segments/' + segmentId)
          .then((res) => res.data)
          .then((res: SegmentDetails) => {
            this.segments[segmentId].details = res;
            localStorage.setItem(key, JSON.stringify(this.segments[segmentId]));
          });
      },
      onMapReady() {
        this.segments = Object.keys(localStorage)
          .filter((k) => k.indexOf('segment_') === 0)
          .filter((k) => {
            const segmentString = localStorage.getItem(k);
            const segment: Segment = segmentString && JSON.parse(segmentString);
            return segment.details?.activity_type === this.activityType;
          })
          .reduce((p: any, c: string) => {
            const key = c.substring('segment_'.length);
            p[key] = JSON.parse(localStorage.getItem(c) as string);
            (this.$refs.map as any).drawSegment(p[key]);
            return p;
          }, {});
      },
    },
    computed: {
      segmentsArray(): Segment[] {
        return Object.values(this.segments);
      },
    },
  });
</script>

<style lang="scss">
  @import './assets/bootstrap';
  @import '../node_modules/leaflet/dist/leaflet.css';
  @import '../node_modules/leaflet.locatecontrol/src/L.Control.Locate';
  @import url('https://fonts.googleapis.com/css2?family=Fira+Sans&family=Merriweather:wght@900&display=swap');

  .title {
    font-family: 'Merriweather', serif;
  }
</style>
