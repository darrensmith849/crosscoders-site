# Runbook: Shared Admin Cockpit Access

This runbook is for Dan to expose the CrossCoders admin cockpit at:

```text
https://cockpit.crosscoders.co.za
```

Access should be email-gated through Cloudflare Zero Trust. The cockpit itself should remain bound to the server locally on `localhost:8090`.

## What Dan Needs

- Cloudflare access to the `crosscoders.co.za` zone
- Cloudflare Zero Trust access
- SSH access to `ma130-data` as `root`
- The email addresses that should be allowed into the cockpit

## 1. Create the Cloudflare Tunnel

In Cloudflare:

1. Open **Zero Trust**.
2. Go to **Networks** -> **Tunnels**.
3. Create a tunnel named:

```text
crosscoders-cockpit
```

4. Choose **Cloudflared**.
5. Copy the install token Cloudflare gives you.

On `ma130-data`, install the tunnel service:

```bash
cloudflared service install <TOKEN>
```

Back in the tunnel settings, add a public hostname:

```text
Hostname: cockpit.crosscoders.co.za
Service:  HTTP localhost:8090
```

Cloudflare should create the DNS record automatically.

## 2. Gate the Cockpit with Cloudflare Access

In Cloudflare Zero Trust:

1. Go to **Access** -> **Applications**.
2. Add a **Self-hosted** application.
3. Use:

```text
Application name: CrossCoders Cockpit
Domain:           cockpit.crosscoders.co.za
```

4. Add an allow policy:

```text
Action:  Allow
Include: Emails
Emails:  Dan's email and any other approved admin emails
```

Cloudflare will send a one-time PIN to allowed email addresses. Anyone not on the policy should be blocked before they reach the app.

## 3. Update the Server Environment

On `ma130-data`, edit:

```text
/srv/factory/server-test.env
```

Set the public URLs to the cockpit domain:

```bash
BETTER_AUTH_URL=https://cockpit.crosscoders.co.za
SITE_URL=https://cockpit.crosscoders.co.za
CORS_ORIGINS=https://cockpit.crosscoders.co.za
```

Keep localhost in trusted origins so local service-to-service/admin flows still work:

```bash
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:8090,http://127.0.0.1:8090,https://cockpit.crosscoders.co.za
```

Then restart the admin service:

```bash
systemctl restart crosscoders-admin
```

## 4. Create the Admin Login

On `ma130-data`:

```bash
cd /srv/factory/crosscoders-backend
set -a
source /srv/factory/server-test.env
set +a
node dist/src/scripts/create-admin.js "<email>" "<Name>" "<password>"
```

Replace the placeholders with the actual admin email, display name, and initial password.

## 5. Test Access

Test from an allowed email:

1. Visit `https://cockpit.crosscoders.co.za`.
2. Cloudflare Access should ask for email.
3. Enter an allow-listed email.
4. Confirm the one-time PIN.
5. Log into the cockpit with the admin account.

Test from a non-listed email:

1. Visit the same URL.
2. Enter an email that is not in the policy.
3. Confirm Cloudflare blocks access.

## 6. Persistence Warning

Check whether these services are persistent across reboot:

```bash
systemctl status crosscoders-admin
systemctl status crosscoders-runner
```

If either service is transient, create proper systemd unit files before relying on the cockpit operationally. The admin and runner should survive a machine reboot without manual restart.

## Quick Checklist

- Tunnel created: `crosscoders-cockpit`
- Public hostname points to `HTTP localhost:8090`
- Cloudflare Access self-hosted app created
- Only approved emails allowed
- Server env points to `https://cockpit.crosscoders.co.za`
- `crosscoders-admin` restarted
- Admin user created with `create-admin.js`
- Allowed email can log in
- Non-allowed email is blocked
- Admin and runner services are persistent
