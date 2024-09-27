# Stravanity

> Easy to beat Strava segments

[![Screenshot](https://github.com/user-attachments/assets/f80bac1a-c01d-4f58-8220-1ffbb6a12d8b)](https://stravanity.boris.sh/)

Stravanity is a simple tool designed to help you explore Strava segments near you, and find the **easiest ones to beat**.

Visit [stravanity.boris.sh](https://stravanity.boris.sh/) to try it.

### There are 2 ways to beat a Strava segment

1.  #### Local Legend

    The Local Legend achievement is awarded to the athlete who completes a given segment the most over a rolling 90-day period regardless of pace or speed.

    > Stravanity computes the total distance you need to run in order to beat the current local legend

2.  #### Course Record

    The Course Record achievement is awarded to the fastest athlete to date on a segment’s overall leaderboard.

    > Stravanity computes the average speed you need to run in order to beat the current course record

### How to use Stravanity

Just explore the map to load segments. Use a high zoom level to load less popular (and probably easier) segments, then zoom out to see everything you've loaded.

Stravanity will show you a list of the segments visible on the map, ordered from the easiest to the most difficult

### About Strava API limits

Because of the Strava API limits, Stravanity can only load 300 segments every 15 minutes, with up to 3,000 segments per day. These limits are shared **by all users**.

The 15-minute limit is reset at natural 15-minute intervals corresponding to 0, 15, 30 and 45 minutes after the hour, and the daily limit resets at midnight UTC.

If you reach one of these limits, **the only thing you can do is to wait** and come back later to load new segments.
