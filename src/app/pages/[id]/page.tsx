// src/app/pages/[id]/page.tsx
import { getDatabaseItems, getPageBlocks } from "../../../../lib/notion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// 型定義
type Block =
  | { id: string; type: "paragraph" | "heading_2" | "heading_3" | "quote"; content: string }
  | { id: string; type: "code"; content: string; language: string }
  | { id: string; type: "image"; imageUrl: string };

type NotionItem = {
  id: string;
  name: string;
  url: string;
};

// Props の型定義：params が Promise であると定義する
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const items = await getDatabaseItems();
  return items.map((item: NotionItem) => ({ id: item.id }));
}

export default async function Page({ params }: Props) {
  // params を await して解決する
  const { id } = await params;

  // 全てのアイテムを取得（サイドメニュー用）
  const items: NotionItem[] = await getDatabaseItems();
  
  // 現在のページのブロックを取得
  const blocks: Block[] = (await getPageBlocks(id)).filter((block): block is Block => block !== null);
  
  const currentItem = items.find((item) => item.id === id);
  if (!currentItem) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      {/* 左側のサイドメニュー */}
      <div className="w-64 bg-gray-100 p-4 fixed h-full overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Contents</h1>
        <nav>
          {items.map((item: NotionItem) => (
            <Link
              key={item.id}
              href={`/pages/${item.id}`}
              className={`block p-2 rounded hover:bg-gray-200 mb-1 ${
                item.id === id ? "bg-gray-200" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 右側のコンテンツエリア */}
      <div className="ml-64 flex-1">
        <h2 className="text-2xl font-bold p-6 border-b">{currentItem.name}</h2>
        <div className="p-6">
          {blocks.map((block) => {
            switch (block.type) {
              case "paragraph":
                return <p key={block.id} className="my-4">{block.content}</p>;
              case "heading_2":
                return <h2 key={block.id} className="text-2xl font-bold my-4">{block.content}</h2>;
              case "heading_3":
                return <h3 key={block.id} className="text-xl font-bold my-3">{block.content}</h3>;
              case "quote":
                return <blockquote key={block.id} className="border-l-4 border-gray-300 pl-4 my-4">{block.content}</blockquote>;
              case "code":
                return (
                  <pre key={block.id} className="bg-gray-100 p-4 rounded my-4">
                    <code>{block.content}</code>
                  </pre>
                );
              case "image":
                return (
                  <div key={block.id} className="my-4">
                    <Image
                      src={block.imageUrl}
                      alt="Notion Image"
                      width={600}
                      height={400}
                      className="rounded"
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
