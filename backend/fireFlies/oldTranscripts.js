require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const { seedTaskFromTranscript } = require('../tasksSeed');
const { seedRowWiseTasksFromTranscript } = require('../seedRowWiseTasksFromTranscript');

// Fireflies API
const API_KEY = '40fbef4f-c889-4eb2-9e29-8fa464cb255e';
const API_URL = "https://api.fireflies.ai/graphql";

// MongoDB connect
mongoose.connect("mongodb+srv://Gaurav:SFZJlOsXIpC6CDYt@cluster0.gt8apq8.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('✅ Connected to MongoDB');
    fetchTranscripts(); // Only start fetching after DB connection is ready
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

const QUERY = `
  query Transcripts($organizerEmail: String, $participantEmail: String, $limit: Int, $skip: Int) {
    transcripts(organizer_email: $organizerEmail, participant_email: $participantEmail, limit: $limit, skip: $skip) {
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
`;

const variables = {
  participantEmail:'hariteja.526@gmail.com', // or use process.env.PARTICIPANT_EMAIL
  limit: 1,
  skip: 0,
};

async function fetchTranscripts() {
  try {
    const response = await axios.post(
      API_URL,
      { query: QUERY, variables },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const transcripts = response.data?.data?.transcripts || [];

    if (!transcripts.length) {
      console.log("❌ No transcripts found.");
      mongoose.disconnect();
      return;
    }

    for (const transcript of transcripts) {
      const parentTaskId = await seedTaskFromTranscript(transcript);

      if (parentTaskId) {
        await seedRowWiseTasksFromTranscript(transcript, parentTaskId);
      }
    }

    console.log(`✅ Done! Seeded ${transcripts.length} transcript(s) to DB.`);
  } catch (error) {
    console.error("❌ Error fetching transcripts:", error.response?.data || error.message);
  } finally {
    mongoose.disconnect(); // Close connection when done
  }
}
