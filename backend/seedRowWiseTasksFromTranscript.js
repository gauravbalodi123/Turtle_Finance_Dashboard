const mongoose = require("mongoose");
const RowWiseTask = require("./models/rowwisetask");
const Client = require("./models/client");
const Advisor = require("./models/advisor");

// ✅ Helper: Add 7 days to a given date
function getDueDateSevenDaysLater(baseDate) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 7);
    return date;
}

// ✅ Helper to parse actionItems
function parseActionItems(rawActionItems) {
    const items = [];
    const lines = rawActionItems?.split("\n").filter(Boolean) || [];

    let currentPerson = null;

    lines.forEach(line => {
        if (line.startsWith("**") && line.endsWith("**")) {
            currentPerson = line.replace(/\*\*/g, "").trim();
        } else if (currentPerson && line) {
            const taskText = line.replace(/\(\d{2}:\d{2}\)/, "").trim();
            items.push({ responsiblePerson: currentPerson, actionItem: taskText });
        }
    });

    return items;
}

async function seedRowWiseTasksFromTranscript(transcriptData) {
    try {
        const emails = transcriptData.participants || [];
        let matchedClient = null;
        let matchedAdvisor = null;

        for (const email of emails) {
            if (!matchedClient) matchedClient = await Client.findOne({ email });
            if (!matchedAdvisor) matchedAdvisor = await Advisor.findOne({ email });
            if (matchedClient && matchedAdvisor) break;
        }

        if (!matchedClient) {
            console.log("⚠️ No matching client found among participants:", emails);
            return;
        }

        const parsedItems = parseActionItems(transcriptData.summary?.action_items);

        if (!parsedItems.length) {
            console.log("⚠️ No valid action items found to create row-wise tasks.");
            return;
        }

        const baseTaskData = {
            title: transcriptData.title,
            participants: emails,
            date: transcriptData.date,
            dueDate: getDueDateSevenDaysLater(transcriptData.date), // ⏳ add dueDate here
            client: matchedClient._id,
        };

        if (matchedAdvisor) {
            baseTaskData.advisor = matchedAdvisor._id;
        }

        const tasksToInsert = parsedItems.map(({ responsiblePerson, actionItem }) => ({
            ...baseTaskData,
            responsiblePerson,
            actionItems: actionItem,
        }));

        await RowWiseTask.insertMany(tasksToInsert);

        console.log(`✅ ${tasksToInsert.length} row-wise task(s) created from transcript!`);
    } catch (err) {
        console.error("❌ Error creating row-wise tasks from transcript:", err.message);
    }
}

module.exports = {
    seedRowWiseTasksFromTranscript,
};
