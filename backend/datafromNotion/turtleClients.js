require("dotenv").config();
const axios = require("axios");

async function fetchAllSubscribers(databaseId) {
    const notionAPI = `https://api.notion.com/v1/databases/${databaseId}/query`;
    let hasMore = true;
    let nextCursor = null;
    let allSubscribers = [];

    try {
        while (hasMore) {
            const requestBody = nextCursor ? { start_cursor: nextCursor } : {};
            const response = await axios.post(notionAPI, requestBody, {
                headers: {
                    "Authorization": `hh`, 
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json",
                },
            });

            const rows = response.data.results;
            nextCursor = response.data.next_cursor;
            hasMore = response.data.has_more;

            const checkedSubscribers = rows
                .filter(row => row.properties["Subscriber"]?.checkbox === true)
                .map(row => {
                    const properties = row.properties;
                    return {
                        fullName: properties["Client Name"]?.title?.[0]?.text?.content || "",
                        phone: properties["Phone"]?.phone_number || "",
                        email: properties["Email"]?.email || "",
                        subscriptionDate: properties["Subscription Date"]?.date?.start || null,
                        dob: properties["DOB"]?.date?.start || null,
                        companyName: properties["Company Name"]?.rich_text?.[0]?.text?.content || "",
                    };
                });

            allSubscribers.push(...checkedSubscribers);
        }

        console.log("\n=== Clients with 'Subscriber' Checked ===\n");
        allSubscribers.forEach((client, i) => {
            console.log(`${i + 1}. ${client.fullName} (${client.email})`);
        });

        console.log(`\n✅ Total Subscribers Found: ${allSubscribers.length}\n`);
        return allSubscribers;

    } catch (error) {
        console.error("❌ Error fetching subscriber data:", error.response?.data || error.message);
    }
}

// Run the function
// fetchAllSubscribers("95a2d0f29c6844e9bab0b563496e2752");