<template>
  <div>
    <div class="row justify-content-around mb-4">
      <div class="col text-center">
        <h1 class="display-3 title">Stravanity</h1>
        <h2>Easy to beat Strava segments</h2>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card shadow-sm border-0 mb-2">
          <div class="card-body">
            <div class="mb-3">
              Stravanity is a simple tool designed to help you explore Strava segments near you, and
              <b>find the easiest ones to beat.</b>
              <br />
              <br />
              <h6><strong>There are 2 ways to beat a Strava segment</strong></h6>
            </div>

            <ol>
              <li>
                <h6><strong>Local Legend</strong></h6>
                <div>
                  The Local Legend achievement is awarded to the athlete who completes a given segment the most over a
                  rolling 90-day period regardless of pace or speed.
                  <br />
                  <div class="text-muted my-1">
                    Stravanity computes the
                    <u>total distance</u>
                    you need to run in order to beat the current local legend
                  </div>
                </div>
              </li>
              <li>
                <h6><strong>Course Record</strong></h6>
                <div>
                  The Course Record achievement is awarded to the fastest athlete to date on a segment’s overall
                  leaderboard.
                  <br />
                  <div class="text-muted my-1">
                    Stravanity computes the
                    <u>average speed</u>
                    you need to run in order to beat the current course record
                  </div>
                </div>
              </li>
            </ol>

            <h6><strong>How to use Stravanity</strong></h6>
            <div>
              <div>
                Just explore the map to load segments. Use a high zoom level to load less popular (and probably easier)
                segments, then zoom out to see everything you've loaded.
              </div>
              <div>
                Stravanity will show you a list of the segments visible on the map, ordered from the easiest to the most
                difficult
              </div>
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
    name: 'Top',
  });
</script>

<style lang="scss" scoped>
  .card {
    background-color: #fff4ee;
  }
</style>
