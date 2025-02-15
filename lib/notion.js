import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Notionデータベースの一覧を取得
export async function getDatabaseItems() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    return response.results.map((page) => ({
      id: page.id,
      name: page.properties.Name.title.length > 0
        ? page.properties.Name.title[0].plain_text
        : "No Title",  // Nameが空の場合
      url: page.url
    }));
  } catch (error) {
    console.error("Error fetching database items:", error);
    return [];
  }
}

// Notionページの詳細（ブロック）を取得
export async function getPageBlocks(pageId) {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    return response.results.map((block) => {
      if (block.type === "paragraph") {
        return {
          id: block.id,
          type: "paragraph",
          content: block.paragraph.rich_text.length > 0
            ? block.paragraph.rich_text[0].plain_text
            : "",
        };
      } else if (block.type === "heading_2") {
        return {
          id: block.id,
          type: "heading_2",
          content: block.heading_2.rich_text.length > 0
            ? block.heading_2.rich_text[0].plain_text
            : "",
        };
      } else if (block.type === "heading_3") {
        return {
          id: block.id,
          type: "heading_3",
          content: block.heading_3.rich_text.length > 0
            ? block.heading_3.rich_text[0].plain_text
            : "",
        };
      } else if (block.type === "quote") {
        return {
          id: block.id,
          type: "quote",
          content: block.quote.rich_text.length > 0
            ? block.quote.rich_text[0].plain_text
            : "",
        };
      } else if (block.type === "code") {
        return {
          id: block.id,
          type: "code",
          language: block.code.language,
          content: block.code.rich_text.length > 0
            ? block.code.rich_text[0].plain_text
            : "",
        };
      } else if (block.type === "image") {
        return {
          id: block.id,
          type: "image",
          imageUrl: block.image.file.url,
        };
      }
      return null;
    }).filter(Boolean); // `null` のデータを除外
  } catch (error) {
    console.error("Error fetching page blocks:", error);
    return [];
  }
}
