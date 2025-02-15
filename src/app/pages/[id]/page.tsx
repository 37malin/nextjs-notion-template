// app/pages/[id]/page.tsx
import { getDatabaseItems, getPageBlocks } from "../../../../lib/notion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  // 全てのアイテムを取得（サイドメニュー用）
  const items = await getDatabaseItems();
  
  // 現在のページのブロックを取得
  const blocks = await getPageBlocks(params.id);
  const currentItem = items.find(item => item.id === params.id);

  if (!currentItem) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      {/* 左側のサイドメニュー */}
      <div className="w-64 bg-gray-100 p-4 fixed h-full overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Contents</h1>
        <nav>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/pages/${item.id}`}
              className={`block p-2 rounded hover:bg-gray-200 mb-1 ${
                item.id === params.id ? 'bg-gray-200' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 右側のコンテンツエリア */}
      <div className="ml-64 flex-1">
        <div>
          <h2 className="text-2xl font-bold p-6 border-b">{currentItem.name}</h2>
          <div className="p-6">
            {blocks.map((block) => {
              if (!block) return null;
              if (block.type === "paragraph") {
                return <p key={block.id} className="my-4">{block.content}</p>;
              } else if (block.type === "heading_2") {
                return <h2 key={block.id} className="text-2xl font-bold my-4">{block.content}</h2>;
              } else if (block.type === "heading_3") {
                return <h3 key={block.id} className="text-xl font-bold my-3">{block.content}</h3>;
              } else if (block.type === "quote") {
                return <blockquote key={block.id} className="border-l-4 border-gray-300 pl-4 my-4">{block.content}</blockquote>;
              } else if (block.type === "code") {
                return (
                  <pre key={block.id} className="bg-gray-100 p-4 rounded my-4">
                    <code>{block.content}</code>
                  </pre>
                );
              } else if (block.type === "image") {
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
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}