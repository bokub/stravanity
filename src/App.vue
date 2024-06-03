<template>
  <div class="container bg-white shadow rounded px-3 py-3 my-3">
    <Corner></Corner>
    <Top class="mt-3 mb-4 mx-2"></Top>
    <Problems v-bind="problems"></Problems>
    <div class="row align-items-start">
      <div class="col-12 col-lg-6 mb-5 map-col">
        <InteractiveMap @move="loadSegments" @ready="onMapReady" ref="map"></InteractiveMap>
        <img src="/img/powered-by-strava.svg" alt="Powered by Strava" height="30" class="float-end" />
      </div>
      <div class="col-12 col-lg-6">
        <Results :segments="segmentsArray" :bounds="bounds" v-if="bounds">
          <template v-slot:activityType>
            <div class="btn-group">
              <input type="radio" class="btn-check" id="run-radio" v-model="activityType" :value="ActivityType.Run" />
              <label class="btn btn-outline-primary" for="run-radio">{{ ActivityType.Run }}</label>
              <input type="radio" class="btn-check" id="ride-radio" v-model="activityType" :value="ActivityType.Ride" />
              <label class="btn btn-outline-primary" for="ride-radio">{{ ActivityType.Ride }}</label>
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
  import Corner from '@/components/Corner.vue';
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
      Corner,
      Top,
      Problems,
      InteractiveMap,
      Results,
    },
    data: () => ({
      ActivityType,
      activityType: ActivityType.Run as ActivityType,
      segments: {} as { [key: number]: Segment },
      bounds: null as Bounds | null,
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
            this.loadSegments(this.bounds);
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
      async loadSegments(bounds: Bounds | null) {
        if (!bounds) {
          return;
        }
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
              await this.fetchSegment(segment.id);
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
            this.segments[segmentId].cache_date = new Date().getTime();
            localStorage.setItem(key, JSON.stringify(this.segments[segmentId]));
          });
      },
      onMapReady() {
        this.segments = Object.keys(localStorage)
          .filter((k) => k.indexOf('segment_') === 0)
          .reduce((p: any, c: string) => {
            const key = c.substring('segment_'.length);
            const segment = JSON.parse(localStorage.getItem(c) as string);
            const isExpired = new Date().getTime() - (segment.cache_date || 0) > 1000 * 3600 * 24 * 30; // 30 days
            if (isExpired) {
              localStorage.removeItem(c);
            } else if (segment.details?.activity_type === this.activityType) {
              p[key] = segment;
              (this.$refs.map as any).drawSegment(p[key]);
            }
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

  @media (min-width: 992px) {
    .map-col {
      position: sticky;
      top: 100px;
    }
  }
</style>
