// app/page.tsx
import { getDatabaseItems } from "../../lib/notion";
import Link from "next/link";

type Item = {
  id: string;
  name: string;
  url: string;
};

export const revalidate = 10;

export default async function Home() {
  const items = await getDatabaseItems();

  return (
    <div className="flex min-h-screen">
      {/* 左側のサイドメニュー */}
      <div className="w-64 bg-gray-100 p-4 fixed h-full overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Contents</h1>
        <nav>
          {items.map((item: Item) => (
            <Link
              key={item.id}
              href={`/pages/${item.id}`}
              className="block p-2 rounded hover:bg-gray-200 mb-1"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 右側のコンテンツエリア */}
      <div className="ml-64 flex-1 p-6">
        <h2 className="text-2xl font-bold">ページを選択してください</h2>
      </div>
    </div>
  );
}