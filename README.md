# WTFD Standalone 365 Calendar

Independent, blank calendar. No connection to Fleet TV or DC Hartley. Six-month panels with previous/next navigation, clickable dates, searchable event management, and updated timestamps.

## Already configured
- Worker: `wtfd-standalone-calendar`
- D1 database: `wtfd-standalone-calendar`
- D1 binding: `DB`
- Wrangler config: `wrangler.toml` (configured with your database ID)
- D1 `events` table already created through Cloudflare SQL console

## GitHub / Cloudflare UI deployment
1. Upload the **extracted files and folders** in this ZIP to the **new** `wtfd-standalone-calendar` GitHub repository. Never upload them to `wtfd-fleet-tv`.
2. In Cloudflare Workers & Pages open the existing `wtfd-standalone-calendar` Worker. Connect it to the new GitHub repository if supported by the dashboard, or create a GitHub-backed Worker deployment pointing at that repo. Verify Worker name and binding before deploying.
3. Build command: none. Deploy command: `npx wrangler deploy` if Cloudflare asks. Root directory: `/`.
4. Confirm the existing `DB` binding points to `wtfd-standalone-calendar` (database ID in `wrangler.toml`).
5. Open `/calendar` for the public display, `/admin` for editing.

**WARNING:** No password or authentication is enforced on `/admin` or the event-writing API. Anyone on the internet who knows or discovers the address can add, change or delete events. Do not put sensitive information in events.
Initial Cloudflare deployment.
