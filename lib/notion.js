import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Notionデータベース内の「Name」プロパティの一覧を取得
export async function getDatabaseItems() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    // 各ページの "Name" プロパティを抽出
    const items = response.results.map((page) => {
      return {
        id: page.id,
        name: page.properties.Name.title.length > 0 
          ? page.properties.Name.title[0].plain_text
          : "No Title",  // Nameが空の場合
        url: page.url
      };
    });

    return items;
  } catch (error) {
    console.error("Error fetching database items:", error);
    return [];
  }
}
