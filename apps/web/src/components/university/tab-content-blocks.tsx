import { getTranslations } from "next-intl/server";

import { EmptySection, Paragraphs } from "@/components/university/prose";

type Block = { id: string; title: string | null; body: string };

/** Shared renderer for the Admission Requirements and Criteria tabs. */
export async function TabContentBlocks({ blocks }: { blocks: Block[] }) {
  const t = await getTranslations("UniversityDetail");

  if (blocks.length === 0) {
    return <EmptySection message={t("emptySection")} />;
  }

  return (
    <div className="space-y-10">
      {blocks.map((block) => (
        <section key={block.id}>
          {block.title ? (
            <h2 className="text-xl font-bold text-[#1F2A44] md:text-2xl">
              {block.title}
            </h2>
          ) : null}
          <div className="mt-5">
            <Paragraphs text={block.body} />
          </div>
        </section>
      ))}
    </div>
  );
}
