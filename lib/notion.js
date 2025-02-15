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

export async function getPageBlocks(pageId) {
    try {
      const response = await notion.blocks.children.list({
        block_id: pageId,
      });
  
      // 各ブロックのデータを取得
      return response.results.map((block) => {
        if (block.type === "paragraph") {
          return {
            id: block.id,
            type: "paragraph",
            content: block.paragraph.rich_text.length > 0
              ? block.paragraph.rich_text[0].plain_text
              : "",
          };
        } else if (block.type === "image") {
          return {
            id: block.id,
            type: "image",
            imageUrl: block.image.file.url,
          };
        } else if (block.type === "heading_2") {
          return {
            id: block.id,
            type: "heading_2",
            content: block.heading_2.rich_text.length > 0
              ? block.heading_2.rich_text[0].plain_text
              : "",
          };
        }
        return null;
      }).filter(Boolean); // `null` のデータを除外
    } catch (error) {
      console.error("Error fetching page blocks:", error);
      return [];
    }
  }