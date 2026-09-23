<template>
  <div v-if="visible" class="startup-modal" role="dialog" @click.self="close">
    <div class="startup-modal-content shadow-sm">
      <h4 class="mb-3">Stravanity is no longer available</h4>
      <p>
        <b>Important update:</b>
        Since September 1, 2026, Strava has restricted access to the segment exploration feature that Stravanity relied
        on to find and explore local segments. Access is now limited to apps approved for Strava's Extended Access Tier
        with a qualifying use case, and Stravanity doesn't meet that bar. As a result, it can no longer work.
      </p>
      <p>
        This follows other changes Strava made to its developer access in June 2026, including new paid subscription
        requirements.
      </p>
      <p>
        Stravanity and its source code remain available as they are, for anyone who wants to inspect or reuse the code.
        There won't be any further updates or fixes, unless Strava changes its access policy.
      </p>
      <p>
        For more details, see:
        <a
          href="https://communityhub.strava.com/insider-journal-9/an-update-to-our-developer-program-13428"
          target="_blank"
          rel="noopener"
        >
          Strava announcement
        </a>
      </p>
      <p class="mt-3">
        Thank you to everyone who's used Stravanity since it launched in 2021. Over the years, several thousand of you
        tried the app, explored local segments, and some of you even managed to beat Strava segments with its help. Your
        feedback, bug reports, and contributions helped shape the project into what it became. Thank you.
      </p>
      <div class="mt-4 mb-3">
        <span class="text-muted">Boris</span>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-primary" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';

  export default defineComponent({
    name: 'StartupNotice',
    setup() {
      const visible = ref(false);
      const close = () => {
        visible.value = false;
      };

      onMounted(() => {
        setTimeout(() => {
          visible.value = true;
        }, 2000);
      });

      return { visible, close };
    },
  });
</script>

<style scoped>
  .startup-modal {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1050;
  }

  .startup-modal-content {
    background: #fff;
    padding: 1.25rem;
    border-radius: 0.375rem;
    max-width: 600px;
    width: calc(100% - 2rem);
  }
</style>
