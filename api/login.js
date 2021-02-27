import strava from 'strava-v3';
import { serialize } from 'cookie';

module.exports = async (req, res) => {
  if (req.query.code) {
    try {
      const payload = await (req.query.refresh
        ? strava.oauth.refreshToken(req.query.code)
        : strava.oauth.getToken(req.query.code));

      // Set cookies
      res.setHeader('Set-Cookie', [
        serialize('access_token', payload.access_token, { expires: new Date(payload.expires_at * 1000), path: '/' }),
        serialize('refresh_token', payload.refresh_token, { expires: new Date('9999'), path: '/' })
      ]);
      res.redirect(302, '/');
      return;
    } catch (e) {
      // Clear cookies
      res.setHeader('Set-Cookie', [
        serialize('access_token', '_', { expires: new Date(0), path: '/' }),
        serialize('refresh_token', '_', { expires: new Date(0), path: '/' })
      ]);
      res.redirect(302, '/');
      return;
    }
  }
  res.redirect(302, '/');
};
