const axios = require('axios');
require('dotenv').config();

const token = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzUzMjY1NDU2LCJqdGkiOiJiOGEyYWJjYy01YmU4LTRlMWYtYmY5Yy03YThlMzM4OTMwN2IiLCJ1c2VyX3V1aWQiOiI5NzRhZTY0MC03ZGI2LTRhMDEtYWRhYi0xZDg3NWVlNWEwMTAifQ.sMuyBzwfiO5Pp1tRZRrl-pjnRA0xU1dspfrlU2pcym5kA86fL4xWDZtY5tSbnsdzsEdr1Cxs33AqUjb8C7DITA";
const baseUrl = "https://85025c148540.ngrok-free.app";
const webhookUrl = `${baseUrl}/admin/api/calendly/webhook`;
const scope = 'organization';
const orgUri = "https://api.calendly.com/organizations/497f3709-ded4-4706-8882-7bbd5c038d14";


const allEvents = [
  'invitee.created',
  'invitee.canceled',
  'invitee_no_show.created',
  'invitee_no_show.deleted',
];

axios.post('https://api.calendly.com/webhook_subscriptions', {
  url: webhookUrl,
  events: allEvents,
  organization: orgUri,
  scope: scope
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}).then(res => {
  console.log('Webhook created:', res.data);
}).catch(err => {
  console.error(err.response?.data || err.message);
});
