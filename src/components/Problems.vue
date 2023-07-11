<template>
  <div>
    <div class="row justify-content-center" v-if="limitReached">
      <div class="col">
        <div class="alert alert-primary px-4" role="alert">
          <div class="row justify-content-between">
            <div class="col-auto">
              Strava API limits have been reached... Please try again in {{ nextLimitReset }} minutes
            </div>
            <div class="col-auto">
              <a href="https://github.com/bokub/stravanity/blob/master/limits.md" class="alert-link" target="_blank">
                About Strava limits
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center" v-if="notConnected">
      <div class="col">
        <div class="alert alert-primary px-4" role="alert">
          <div class="row align-items-baseline">
            <div class="col">Please connect with Strava to continue</div>
            <div class="col-auto connect-button">
              <a :href="connectURI">
                <img alt="Connect with Strava" src="/img/button-connect.png" height="48" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'Problems',
    data: () => ({
      now: new Date(),
    }),
    props: {
      limitReached: {
        type: Boolean,
      },
      notConnected: {
        type: Boolean,
      },
    },
    computed: {
      connectURI() {
        const params = new URLSearchParams();
        params.append('scope', 'read');
        params.append('response_type', 'code');
        params.append('client_id', import.meta.env.VITE_STRAVA_CLIENT_ID);
        params.append('redirect_uri', `${window.location.protocol}//${window.location.host}/api/login`);
        return `https://www.strava.com/oauth/authorize?${params.toString()}`;
      },
      nextLimitReset(): string {
        const minutes = this.now.getMinutes();
        return `${15 - (minutes % 15)}`;
      },
    },
    created() {
      setInterval(() => {
        const now = new Date();
        now.setSeconds(now.getSeconds() - 15);
        this.now = now;
      }, 1000);
    },
  });
</script>

<style lang="scss" scoped>
  .connect-button {
    margin: -8px auto;
  }
</style>
