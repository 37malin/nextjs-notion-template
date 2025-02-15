import { getDatabaseItems } from "../../lib/notion";

export default async function Home() {
  const items = await getDatabaseItems(); // Notionデータ取得

  return (
    <div>
      <h1>Notion Database Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p>{item.name}</p>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
