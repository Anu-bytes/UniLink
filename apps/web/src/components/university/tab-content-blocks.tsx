import { getTranslations } from "next-intl/server";

import { ManageSectionsButton } from "@/components/university/profile-editor";
import { EmptySection, Paragraphs } from "@/components/university/prose";
import { CONTENT_SECTIONS } from "@/lib/content-blocks";
import type { UniversityDetailData } from "@/lib/catalog";

/**
 * The "More info" tab: the free-text sections admins add to a profile,
 * grouped by kind. Plain text only (see <Paragraphs>), never HTML.
 */
export async function TabContentBlocks({
  sections,
  canEdit = false,
}: {
  sections: UniversityDetailData["sections"];
  canEdit?: boolean;
}) {
  const t = await getTranslations("UniversityDetail");

  const groups = CONTENT_SECTIONS.map((kind) => ({
    kind,
    blocks: sections.filter((block) => block.section === kind),
  })).filter((group) => group.blocks.length > 0);

  return (
    <div className="space-y-10">
      {canEdit ? (
        <div className="flex justify-end">
          <ManageSectionsButton />
        </div>
      ) : null}

      {groups.length === 0 ? <EmptySection message={t("emptySection")} /> : null}

      {groups.map((group) => (
        <section key={group.kind} aria-labelledby={`section-${group.kind}`} className="space-y-6">
          <h2 id={`section-${group.kind}`} className="text-xl font-bold text-[#1F2A44] md:text-2xl">
            {t(`sectionKinds.${group.kind}`)}
          </h2>
          {group.blocks.map((block) => (
            <article key={block.id} className="rounded-2xl bg-[#F5F8FF] p-5 md:p-6">
              {block.title ? (
                <h3 className="text-lg font-bold text-[#1F2A44]">{block.title}</h3>
              ) : null}
              <div className={block.title ? "mt-3" : undefined}>
                <Paragraphs text={block.body} />
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
