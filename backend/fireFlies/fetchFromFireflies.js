const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const axios = require("axios");
const {seedTaskFromTranscript} = require('../tasksSeed')
const {seedRowWiseTasksFromTranscript} = require('../seedRowWiseTasksFromTranscript')
require("dotenv").config();

const router = express.Router();
router.use(bodyParser.json());

const FIRELIES_WEBHOOK_SECRET = process.env.FIRELIES_WEBHOOK_SECRET;
const FIRELIES_API_KEY = process.env.FIRELIES_API_KEY;
const FIRELIES_API_URL = "https://api.fireflies.ai/graphql";

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FIRELIES_API_KEY}`,
};

// Webhook route
router.post("/fireflies-webhook-turtlebackend", async (req, res) => {
    try {
        const signature = req.headers["x-hub-signature"];
        if (!signature) {
            console.error("❌ Missing signature header");
            return res.status(400).send("Missing signature header");
        }

        const payload = JSON.stringify(req.body);
        const hash = "sha256=" + crypto.createHmac("sha256", FIRELIES_WEBHOOK_SECRET).update(payload).digest("hex");

        if (signature !== hash) {
            console.error("❌ Invalid signature");
            return res.status(401).send("Invalid signature");
        }

        const { meetingId, eventType } = req.body;

        if (!meetingId || !eventType) {
            console.error("❌ Missing meetingId or eventType in payload");
            return res.status(400).send("Missing meetingId or eventType");
        }

        if (eventType === "Transcription completed") {
            try {
                const transcriptData = await fetchTranscriptData(meetingId);

                console.log("✅ Transcription data for meeting:", meetingId);
                console.dir(transcriptData, { depth: null, colors: true });
                await seedTaskFromTranscript(transcriptData);
                await seedRowWiseTasksFromTranscript(transcriptData);
                return res.status(200).send("Transcript fetched and logged.");
            } catch (error) {
                console.error("❌ Error during transcript fetch:", error.message);
                return res.status(500).send("Error fetching transcript.");
            }
        }

        console.log("ℹ️ Event type not handled:", eventType);
        return res.status(200).send("Webhook received, but event type not handled.");
    } catch (err) {
        console.error("🔥 Unexpected error in webhook:", err);
        return res.status(500).send("Internal server error");
    }
});

async function fetchTranscriptData(transcriptId) {
    const data = {
        query: `
            query Transcript($transcriptId: String!) {
                transcript(id: $transcriptId) {
                    id
                    title
                    organizer_email
                    participants
                    date
                    video_url
                    transcript_url
                    duration
                    speakers {
                        id
                        name
                    }
                    summary {
                        action_items
                        shorthand_bullet
                        overview
                    }
                    
                }
            }
        `,
        variables: { transcriptId },
    };

    // Try up to 5 times, waiting 60s each time if summary is not ready
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            const response = await axios.post(FIRELIES_API_URL, data, { headers });
            const transcript = response?.data?.data?.transcript;

            if (!transcript) {
                throw new Error("Transcript data not found in response");
            }

            const summary = transcript.summary;

            const isSummaryReady = summary && Object.values(summary).some(value => value); // Check if at least one field is non-null

            if (isSummaryReady) {
                console.log(`✅ Summary ready on attempt ${attempt}`);
                return transcript;
            } else {
                console.log(`⏳ Summary not ready yet (attempt ${attempt}/5). Retrying in 60s...`);
                await new Promise(res => setTimeout(res, 60000));
            }

        } catch (error) {
            console.error(`❌ Error on attempt ${attempt}:`, error.message);
            if (attempt === 5) throw error; // Only throw on final attempt
            await new Promise(res => setTimeout(res, 40000)); // wait 40s before retry
        }
    }

    throw new Error("Summary not available after 5 attempts");
}

module.exports = {
    firefliesRouter: router
};
