const axios = require("axios");
require("dotenv").config();

const notionApiKey = "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";
// const databaseId = "951f266835164926bc2d2b5d133cdc57";

async function fetchDatabaseDataAdvisors(databaseId) {
    const notionAPI = `https://api.notion.com/v1/databases/${databaseId}/query`;

    try {
        const response = await axios.post(
            notionAPI,
            {},
            {
                headers: {
                    "Authorization": `Bearer ${notionApiKey}`,
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json"
                }
            }
        );

        const results = response.data.results;

        const advisors = results.map((page) => {
            const properties = page.properties;

            return {
                advisorFullName: properties["Advisor Name"]?.title?.[0]?.plain_text || "",
                phone: properties["Phone"]?.phone_number || "",
                email: properties["Email(s)"]?.email || "",
                
            };
        });

        console.log(advisors);
        // console.log(`\nTotal advisors fetched: ${advisors.length}`);
        return advisors;

    } catch (error) {
        console.error("Error fetching advisors:", error.response?.data || error.message);
    }
}

module.exports = {fetchDatabaseDataAdvisors}
