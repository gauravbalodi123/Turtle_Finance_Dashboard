const axios = require('axios');
require('dotenv').config();

const token = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQ3NjA2NDc0LCJqdGkiOiIzOWM5MDRmNS1iNjQzLTRkNDEtOTk4My00ODJiYjkzNTRjZGUiLCJ1c2VyX3V1aWQiOiI5NzRhZTY0MC03ZGI2LTRhMDEtYWRhYi0xZDg3NWVlNWEwMTAifQ.1BEcFGUbEySHDxlCicvWSAAspB5J2wwdEZvPTpcU3W7c-fxmYO4xjOKHTC3BWSSta4OByvG-O5SHmvQkDuC7Tw";
const baseUrl = "https://a9fc-2401-4900-1cd7-a8e9-65f9-6f6b-b238-1edf.ngrok-free.app";
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
