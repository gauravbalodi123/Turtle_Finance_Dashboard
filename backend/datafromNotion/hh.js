require("dotenv").config();
const axios = require("axios");


async function fetchDatabaseData(databaseId) {
    const notionAPI = `https://api.notion.com/v1/databases/${databaseId}/query`;
    let hasMore = true;
    let nextCursor = null;
    let allFilteredRows = []; // Stores only required rows
    const maxRows = 90; // Limit to first 5 rows after filtering

    try {
        while (hasMore && allFilteredRows.length < maxRows) {
            const requestBody = nextCursor ? { start_cursor: nextCursor } : {};
            const response = await axios.post(notionAPI, requestBody, {
                headers: {
                    "Authorization": `Bearer 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`,
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json",
                },
            });

            const rows = response.data.results;
            nextCursor = response.data.next_cursor;
            hasMore = response.data.has_more;

            // Extract and filter only required rows
            const matchingRows = rows
                .filter(row => {
                    const status = row.properties["Subscription Status"]?.formula?.string;
                    return status === "Expired❌" || status === "Active✅";
                })
                .map(row => {
                    const properties = row.properties;
                    return {

                        fullName: properties["Client Name"]?.title?.[0]?.text?.content || "",
                        subscriptionStatus: properties["Subscription Status"]?.formula?.string?.replace("Active✅", "Active").replace("Expired❌", "Expired") || "",
                        phone: properties["Phone"]?.phone_number || "",
                        email: properties["Email"]?.email || "",
                        subscriptionDate: properties["Subscription Date"]?.date?.start ? new Date(properties["Subscription Date"].date.start) : null,
                        dob: properties["DOB"]?.date?.start ? new Date(properties["DOB"].date.start) : null,
                        companyName: properties["Company Name"]?.rich_text?.[0]?.text?.content || "",
                    };
                });




            allFilteredRows.push(...matchingRows);

            // Stop fetching if we reach maxrows filtered rows
            if (allFilteredRows.length >= maxRows) break;
        }

        // Trim to first 5 rows in case extra ones were fetched
        const finalData = allFilteredRows.slice(0, maxRows);
        console.log(JSON.stringify(finalData, null, 2));
        return finalData;

        // ✅ Print the total count at the end
        // console.log("\n-------------------------------------");
        // console.log(`✅ Showing first ${finalData.length} matching clients`);
        // console.log("-------------------------------------\n");
    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
    }
}

// Run the function with your Notion Database ID
// fetchDatabaseData("95a2d0f29c6844e9bab0b563496e2752");
module.exports = {fetchDatabaseData};
