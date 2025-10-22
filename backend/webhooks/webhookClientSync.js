const axios = require('axios');
const crypto = require('crypto');

// Map each logical dataset to its dedicated webhook URL from env
const URL_MAP = {
    Advisors: process.env.WEBHOOK_Advisors_URL,
    Bookings: process.env.WEBHOOK_Bookings_URL,
    Clients: process.env.WEBHOOK_Clients_URL,
    Fireflies: process.env.WEBHOOK_Fireflies_URL,
    Meetings: process.env.WEBHOOK_Meetings_URL,
};

function getWebhookUrlFor(name) {
    return URL_MAP[name] || null; // skip if not explicitly configured
}

function ensureConfig(url, dbName) {
    if (!url) {
        console.warn(`[webhookClientSync] Missing webhook URL for "${dbName}"; skipping send.`);
        return false;
    }
    return true;
}

function genEventId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `evt_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

function toPlainClientSnapshot(clientDoc) {
    // Accepts a Mongoose document or plain object and returns it as-is without cleaning.
    return typeof clientDoc?.toObject === 'function'
        ? clientDoc.toObject({ depopulate: true })
        : { ...clientDoc };
}

// 🔸 Simplified version — send once, no retries
async function postWebhook(url, body, headers = {}) {
    const baseHeaders = { 'Content-Type': 'application/json', ...headers };
    try {
        await axios.post(url, body, {
            timeout: 10000,
            headers: baseHeaders,
            maxRedirects: 3,
            validateStatus: (s) => s >= 200 && s < 300, // only 2xx is success
        });
    } catch (err) {
        console.error('[webhookClientSync] Webhook send failed:', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
        });
        throw err;
    }
}

// NOTE: we keep the same exported names so call sites don't have to change.
// The last argument is now treated as the logical DB name used to choose the URL.
async function sendClientUpsert(clientDoc, eventType = 'updated', dbName) {
    const url = getWebhookUrlFor(dbName);
    if (!ensureConfig(url, dbName)) return;
    if (!clientDoc) {
        console.warn('[webhookClientSync] sendClientUpsert called with empty clientDoc');
        return;
    }

    const eventId = genEventId();
    const webdata = toPlainClientSnapshot(clientDoc);
    const payload = {
        eventId,
        eventType, // treat create/update the same; receiver will upsert by _id
        occurredAt: new Date().toISOString(),
        webdata,
    };

    try {
        await postWebhook(url, payload, { 'x-idempotency-key': eventId });
    } catch (e) {
        console.error('[webhookClientSync] sendClientUpsert failed:', e.message);
    }
}

async function sendClientDelete(clientId, dbName) {
    const url = getWebhookUrlFor(dbName);
    if (!ensureConfig(url, dbName)) return;
    if (!clientId) {
        console.warn('[webhookClientSync] sendClientDelete called without clientId');
        return;
    }

    const eventId = genEventId();
    const payload = {
        eventId,
        eventType: 'deleted',
        occurredAt: new Date().toISOString(),
        webdata: { id: String(clientId) },
    };

    try {
        await postWebhook(url, payload, { 'x-idempotency-key': eventId });
    } catch (e) {
        console.error('[webhookClientSync] sendClientDelete failed:', e.message);
    }
}

module.exports = {
    sendClientUpsert,
    sendClientDelete,
};
