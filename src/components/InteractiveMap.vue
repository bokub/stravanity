<template>
  <div id="map"></div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import L, { type LocateOptions, Map } from 'leaflet';
  import 'leaflet.locatecontrol';
  import { debounce } from 'debounce';
  import { type Segment } from '@/types';
  import { decode } from '@mapbox/polyline';

  const ORANGE = '#fc5200';

  export default defineComponent({
    name: 'InteractiveMap',
    data: () => ({
      map: null as Map | null,
    }),
    mounted() {
      this.map = L.map('map').setView([0.66, 0.42], 2);

      this.map.zoomControl.setPosition('topright');

      const locator = (L.control as any).locate({ position: 'topright' } as LocateOptions).addTo(this.map);

      const locatorMessage = (L.control as any)({ position: 'topright' });

      locatorMessage.onAdd = function () {
        this._div = L.DomUtil.create('div', 'welcome-locator border border-primary text-primary bg-white rounded');
        this._div.innerHTML = '<div>Locate yourself to start using the map<img src="/img/arrow-turn-up.svg" /></div>';
        return this._div;
      };

      navigator.permissions?.query({ name: 'geolocation' }).then((PermissionStatus) => {
        if (PermissionStatus.state == 'granted') {
          // If location is enabled
          locator.start();
        } else {
          // If location is disabled or not granted
          locatorMessage.addTo(this.map);
          (this.map as any)._handlers.forEach((handler) => handler.disable());
        }
      });

      this.map.whenReady(() => {
        this.$emit('ready');
      });

      // Fixing Leaflet bugs...
      L.Tooltip.include({
        _updatePosition: function () {
          if (this._map) {
            this._setPosition(this._map.latLngToLayerPoint(this._latlng));
          }
        },
        _animateZoom: function (e: any) {
          if (this._map) {
            const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
            this._setPosition(pos);
          }
        },
      });

      if (this.map) {
        L.tileLayer(
          `https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/reduced.day/{z}/{x}/{y}/256/png?apiKey=${
            import.meta.env.VITE_HERE_MAPS_API_KEY
          }`,
          {
            tileSize: 256,
            subdomains: '1234',
            attribution: '&copy; HERE ' + new Date().getFullYear(),
          }
        ).addTo(this.map as Map);

        this.map.on(
          'moveend',
          debounce(() => {
            this.onMoveEnd();
          }, 250)
        );

        this.map.addEventListener('locationfound', () => {
          if (locatorMessage._map) {
            locatorMessage.remove();
            (this.map as any)._handlers.forEach((handler) => handler.enable());
          }
        });
      }
    },

    methods: {
      onMoveEnd() {
        const bounds = this.map?.getBounds();
        const boundsArray = [bounds?.getSouth(), bounds?.getWest(), bounds?.getNorth(), bounds?.getEast()];
        this.$emit('move', boundsArray);
      },
      fitBounds(bounds: [number, number][]) {
        this.map?.fitBounds(bounds);
      },
      drawSegment(segment: Segment) {
        const polyline = L.polyline(decode(segment.points), {
          color: ORANGE,
          interactive: false,
        });
        const marker = L.circleMarker(segment.start_latlng, {
          radius: 6,
          stroke: false,
          fillColor: ORANGE,
          fillOpacity: 1,
        });
        const tooltip = L.tooltip().setContent(segment.name);

        if (this.map) {
          polyline.addTo(this.map as Map);
          marker.addTo(this.map as Map);
          marker.bindTooltip(tooltip);
        }
      },
    },
  });
</script>

<style lang="scss">
  #map {
    min-height: 200px;
    height: calc(100vh - 200px);

    .fa-map-marker {
      display: block;
      text-indent: -9999px;
      width: 30px;
      height: 30px;
      background: url(../assets/locate.svg) no-repeat center;
      background-size: 20px;
    }

    .welcome-locator {
      font-size: 16px;
      font-weight: bold;
      padding: 8px 12px;
      img {
        position: relative;
        bottom: 6px;
        margin-left: 6px;
      }
    }
  }
</style>
