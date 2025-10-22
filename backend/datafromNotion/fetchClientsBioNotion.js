require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const axios = require("axios");
const mongoose = require("mongoose");
const Client = require("../models/client");

const NOTION_TOKEN = process.env.NOTION_TOKEN || "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";
const NOTION_VERSION = "2022-06-28";
const MONGO_URI = process.env.DB_URL || "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster";

// ✅ Fetch all subscribers with bio & LinkedIn
async function fetchAllSubscribers(databaseId) {
    const notionAPI = `https://api.notion.com/v1/databases/${databaseId}/query`;
    let hasMore = true, nextCursor = null, allSubscribers = [];

    try {
        while (hasMore) {
            const requestBody = {
                page_size: 50,
                filter: { property: "Subscriber", checkbox: { equals: true } }
            };
            if (nextCursor) requestBody.start_cursor = nextCursor;

            const response = await axios.post(notionAPI, requestBody, {
                headers: {
                    "Authorization": `Bearer ${NOTION_TOKEN}`,
                    "Notion-Version": NOTION_VERSION,
                    "Content-Type": "application/json",
                },
            });

            const rows = response.data.results;
            nextCursor = response.data.next_cursor;
            hasMore = response.data.has_more;

            // Process rows
            const subscribers = await Promise.all(
                rows.map(async (row) => {
                    const fullName = row.properties["Client Name"]?.title?.[0]?.text?.content || "";
                    const emailRaw = row.properties["Email"]?.email || "";
                    const emailArray = emailRaw.split(/[\s,;]+/).filter(Boolean); // split multiple emails

                    const pageId = row.id;
                    const { bio, linkedin } = await fetchBioAndLinkedin(pageId);

                    return { fullName, emails: emailArray, bio, linkedin };
                })
            );

            allSubscribers.push(...subscribers);
        }

        console.log(`\n✅ Total Subscribers Found: ${allSubscribers.length}\n`);
        return allSubscribers;
    } catch (error) {
        console.error("❌ Error fetching subscriber data:", error.response?.data || error.message);
        return [];
    }
}

// ✅ Extract bio & LinkedIn from page blocks
async function fetchBioAndLinkedin(pageId) {
    try {
        const url = `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`;
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${NOTION_TOKEN}`,
                "Notion-Version": NOTION_VERSION,
            },
        });

        const blocks = response.data.results;
        let bioStarted = false;
        let bioText = [];
        let linkedin = null;
        let bioFound = false;

        for (const block of blocks) {
            const textArray = block[block.type]?.rich_text || [];
            const fullText = textArray.map(rt => rt.href ? rt.href : rt.plain_text).join("").trim();

            if (!fullText) continue;

            // ✅ Case: "Bio:" marker found
            if (fullText.toLowerCase().startsWith("bio:")) {
                bioFound = true;
                const afterBio = fullText.slice(4).trim();
                if (afterBio) bioText.push(afterBio);
                bioStarted = true;
                continue;
            }

            // ✅ Case: LinkedIn found → stop collecting bio, store URL if present
            if (fullText.toLowerCase().startsWith("linkedin")) {
                linkedin = extractLinkedinUrl(fullText);
                break;
            }

            // ✅ Collect logic:
            // - if "Bio:" exists → after Bio start collecting
            // - if "Bio:" doesn't exist → collect until LinkedIn or end
            if (bioStarted || !bioFound) {
                bioText.push(fullText);
            }
        }

        return {
            bio: bioText.length > 0 ? bioText.join(" ") : null,
            linkedin: linkedin
        };
    } catch (error) {
        console.error(`❌ Error fetching blocks for page ${pageId}:`, error.response?.data || error.message);
        return { bio: null, linkedin: null };
    }
}

// ✅ Extract LinkedIn URL
function extractLinkedinUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
}

// ✅ Update only bio & linkedin, keep emails untouched
async function updateClientsWithBios(databaseId) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const subscribers = await fetchAllSubscribers(databaseId);

        for (const sub of subscribers) {
            if (!sub.emails || sub.emails.length === 0) continue;

            // Match any email from Notion with any email in Client.email array
            const client = await Client.findOne({ email: { $in: sub.emails } });

            if (client) {
                // Only update bio & linkedin, don't overwrite email array
                client.bio = sub.bio;
                client.linkedinProfile = sub.linkedin;
                await client.save();
                console.log(`✅ Updated: ${sub.fullName} (${sub.emails.join(", ")})`);
            } else {
                console.log(`⚠️ No client found for ${sub.emails.join(", ")}`);
            }
        }

        console.log("\n🎉 All clients updated!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error updating clients:", error.message);
        mongoose.connection.close();
    }
}

// Run
// updateClientsWithBios("95a2d0f29c6844e9bab0b563496e2752");
