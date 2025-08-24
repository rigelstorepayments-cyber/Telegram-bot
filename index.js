// index.js
const express = require('express');
const admin = require('firebase-admin');
const TelegramBot = require('node-telegram-bot-api');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin SDK for bots database
const serviceAccount = require('./path/to/your-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vegavip-8c7a5-tools-rtdb.asia-southeast1.firebasedatabase.app'
});
const db = admin.database();

// In-memory store for bot instances
const bots = {};

// Fetch bots config and (re)initialize
function syncBots() {
  db.ref('bots').once('value').then(snapshot => {
    snapshot.forEach(botSnap => {
      const botId = botSnap.key;
      const { token, active, chats } = botSnap.val();

      // If bot not created yet, create instance
      if (!bots[botId]) {
        bots[botId] = new TelegramBot(token, { polling: true });
        bots[botId].on('message', msg => handleMessage(botId, msg));
      }

      // Start/stop bot polling
      if (active) {
        bots[botId].startPolling();
      } else {
        bots[botId].stopPolling();
      }

      // Store chat config
      bots[botId].chats = chats || {};
    });
  });
}

// Handle incoming message
function handleMessage(botId, msg) {
  const chatConfig = bots[botId].chats[msg.chat.id];
  if (!chatConfig || !chatConfig.active) return;
  // Approve request logic:
  // e.g., when user sends /approve in private channel, reply OK
  if (msg.text && msg.text.toLowerCase() === '/approve') {
    bots[botId].sendMessage(msg.chat.id, 'Request approved.');
  }
}

// Watch for changes in config
db.ref('bots').on('value', syncBots);

// Simple health check
app.get('/', (req, res) => res.send('Bot Manager Running'));

// Start Express
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  syncBots();
});
