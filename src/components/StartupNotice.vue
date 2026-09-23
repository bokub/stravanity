<template>
  <div v-if="visible" class="startup-modal" role="dialog" @click.self="close">
    <div class="startup-modal-content shadow-sm">
      <h4 class="mb-3">Stravanity is no longer operational</h4>
      <p>
        <b>Important update:</b>
        in June 2026, Strava changed their developer program and now requires a paid subscription to access their API.
        Because of this change, the application can no longer access the Strava API and therefore cannot function
        anymore.
      </p>
      <p>
        Stravanity and the source code remain available in their current state for anyone who wants to inspect or fork
        the project, but there will be no further updates or fixes unless the access policy changes.
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
        Thank you to everyone who used Stravanity since its start in 2021. Over the years, several thousand of you tried
        the app, explored local segments and some of you even managed to beat Strava segments with the help of
        Stravanity. Your feedback, bug reports and contributions helped improve the project and shape it into what it
        became. Thank you.
      </p>
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
