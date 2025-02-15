import { getDatabaseItems, getPageBlocks } from "../../lib/notion";

export default async function Home() {
  const items = await getDatabaseItems(); // Notionのデータベースの一覧を取得

  // 各ページごとの詳細情報（ブロックデータ）を取得
  const itemsWithDetails = await Promise.all(
    items.map(async (item) => {
      const blocks = await getPageBlocks(item.id);
      return { ...item, blocks };
    })
  );

  return (
    <div>
      <h1>Notion Database Items</h1>
      {itemsWithDetails.map((item) => (
        <section key={item.id}>
          <h2>{item.name}</h2>
          <div>
            {item.blocks.map((block) => {
              if (block.type === "paragraph") {
                return <p key={block.id}>{block.content}</p>;
              } else if (block.type === "heading_2") {
                return <h2 key={block.id}>{block.content}</h2>;
              } else if (block.type === "image") {
                return <img key={block.id} src={block.imageUrl} alt="Notion Image" style={{ maxWidth: "100%" }} />;
              }
              return null;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
