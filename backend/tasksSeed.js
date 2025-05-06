const mongoose = require("mongoose");
const Task = require("./models/task");
const Client = require("./models/client");
const Advisor = require("./models/advisor");

async function seedTaskFromTranscript(transcriptData) {
    try {
        const emails = transcriptData.participants || [];

        let matchedClient = null;
        let matchedAdvisor = null;

        for (const email of emails) {
            // really simple if !(i.e opposite) , meaning id oppaosite of something beomes true that means it was false at first simple
            if (!matchedClient) {
                matchedClient = await Client.findOne({ email });
            }
            if (!matchedAdvisor) {
                matchedAdvisor = await Advisor.findOne({ email });
            }
            if (matchedClient && matchedAdvisor) break;
        }

        if (!matchedClient) {
            console.log("⚠️ No matching client found among participants:", emails);
            return;
        }

        if (!matchedAdvisor) {
            console.log("ℹ️ No matching advisor found — proceeding without advisor reference.");
        }

        const newTask = {
            title: transcriptData.title,
            transcriptUrl: transcriptData.transcript_url,
            videoUrl: transcriptData.video_url,
            participants: emails,
            date: transcriptData.date,
            actionItems: transcriptData.summary?.action_items || null,
            detailedNotes: transcriptData.summary?.shorthand_bullet || null,
            summary: transcriptData.summary?.overview || null,
            client: matchedClient._id,
        };
        if (matchedAdvisor) {
            newTask.advisor = matchedAdvisor._id;
        }

        const createdTask = await Task.create(newTask); 
        console.log("✅ Task created from transcript successfully!");
        return createdTask._id; 
    } catch (err) {
        console.error("❌ Error creating task from transcript:", err.message);
    }
}

module.exports = {
    seedTaskFromTranscript
};
