import { getDatabaseItems, getPageBlocks } from "../../lib/notion";
import Image from "next/image";

export default async function Home() {
  const items = await getDatabaseItems();

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
              if (!block) return null; // null の場合はスキップ
              if (block.type === "paragraph") {
                return <p key={block.id}>{block.content}</p>;
              } else if (block.type === "heading_2") {
                return <h2 key={block.id}>{block.content}</h2>;
              } else if (block.type === "image") {
                return <Image key={block.id} src={block.imageUrl} alt="Notion Image" width={600} height={400} />;
              }
              return null;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
