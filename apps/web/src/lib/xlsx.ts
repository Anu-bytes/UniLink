// A small .xlsx writer for the admin exports: styled cells, merged ranges,
// frozen headers, filters, formulas, data bars, an embedded logo and native
// Excel bar charts. Written here rather than pulling in a spreadsheet
// library, which would add a large dependency tree for a handful of reports.
// Server-only (node:zlib).

import { deflateRawSync } from "node:zlib";

/**
 * The fixed style table. Each key maps to one entry in styles.xml, so a cell
 * names its look instead of carrying formatting of its own.
 */
export type CellStyle =
  | "text"
  | "textAlt"
  | "title"
  | "subtitle"
  | "section"
  | "header"
  | "headerStart"
  | "number"
  | "numberAlt"
  | "decimal"
  | "decimalAlt"
  | "change"
  | "changeAlt"
  | "label"
  | "totalLabel"
  | "total"
  | "muted"
  | "tileLabel"
  | "tileValue"
  | "tileValuePercent"
  | "tileHint"
  | "statusWell"
  | "statusAttention"
  | "statusSteady"
  | "percent"
  | "percentAlt"
  | "accent";

export type Cell = { value: string | number | null; style?: CellStyle; formula?: string } | string | number | null;

/** A cell position, 0-based. */
export type Anchor = { col: number; row: number };

export type BarChart = {
  title: string;
  /** "col" draws upright columns, "bar" horizontal bars. */
  direction?: "col" | "bar";
  /** Full references such as A5:A34, on this sheet. */
  categories: string;
  series: { name: string; values: string; color: string }[];
  from: Anchor;
  to: Anchor;
};

export type Sheet = {
  name: string;
  /** Column widths in characters. */
  columns: number[];
  rows: Cell[][];
  /** Ranges such as "A1:F1". */
  merges?: string[];
  /** Rows (from the top) and columns (from the start) kept in view. */
  freeze?: { rows: number; columns?: number };
  autoFilter?: string;
  /** Ranges that get an in-cell bar scaled to the largest value. */
  dataBars?: { range: string; color: string }[];
  /** Row heights in points, by 1-based row number. */
  heights?: Record<number, number>;
  rightToLeft?: boolean;
  /** The logo, top-start corner. */
  logo?: { png: Buffer; width: number; height: number; at: Anchor };
  charts?: BarChart[];
};

const STYLE_INDEX: Record<CellStyle, number> = {
  text: 1,
  textAlt: 2,
  title: 3,
  subtitle: 4,
  section: 5,
  header: 6,
  headerStart: 7,
  number: 8,
  numberAlt: 9,
  decimal: 10,
  decimalAlt: 11,
  change: 12,
  changeAlt: 13,
  label: 14,
  totalLabel: 15,
  total: 16,
  muted: 17,
  tileLabel: 18,
  tileValue: 19,
  tileValuePercent: 20,
  tileHint: 21,
  statusWell: 22,
  statusAttention: 23,
  statusSteady: 24,
  percent: 25,
  percentAlt: 26,
  accent: 27,
};

// Number formats: 164 thousands, 165 one decimal, 166 change with a green
// up / red down arrow, 167 whole percent.
// Fonts: 0 body, 1 title, 2 subtitle, 3 section, 4 header, 5 bold body,
// 6 muted, 7 tile label, 8 tile value, 9 tile hint, 10-12 status colours.
// Fills: 2 navy header, 3 zebra, 4 tile, 5 total, 6-8 status, 9 accent.
// Borders: 1 hairline bottom, 2 total, 3 tile middle, 4 tile top, 5 tile
// bottom (white sides make the gaps between tiles), 6 brand-blue underline.
const XF = (attrs: string, alignment?: string) =>
  `<xf ${attrs} xfId="0"${alignment ? ' applyAlignment="1"' : ""}>${alignment ? `<alignment ${alignment}/>` : ""}</xf>`;
const WHITE = '<color rgb="FFFFFFFF"/>';
const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="4"><numFmt numFmtId="164" formatCode="#,##0"/><numFmt numFmtId="165" formatCode="0.0"/><numFmt numFmtId="166" formatCode="[Color10]&quot;▲ &quot;0%;[Red]&quot;▼ &quot;0%;0%"/><numFmt numFmtId="167" formatCode="0%"/></numFmts>
<fonts count="13">
<font><sz val="11"/><color rgb="FF334155"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="18"/><color rgb="FF0B1220"/><name val="Calibri"/><family val="2"/></font>
<font><sz val="10"/><color rgb="FF64748B"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="12"/><color rgb="FF0B1220"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="10.5"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FF0B1220"/><name val="Calibri"/><family val="2"/></font>
<font><i/><sz val="10"/><color rgb="FF94A3B8"/><name val="Calibri"/><family val="2"/></font>
<font><sz val="10"/><color rgb="FF64748B"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="22"/><color rgb="FF0B1220"/><name val="Calibri"/><family val="2"/></font>
<font><sz val="9.5"/><color rgb="FF64748B"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="10"/><color rgb="FF0F7B45"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="10"/><color rgb="FFC81F15"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="10"/><color rgb="FF475569"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="10">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF0B1220"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF7F9FC"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF1F5FB"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFEAF2FE"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFE7F6EE"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFF0EE"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF1E6DEB"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="7">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left/><right/><top/><bottom style="thin"><color rgb="FFE2E8F0"/></bottom><diagonal/></border>
<border><left/><right/><top style="medium"><color rgb="FF0B1220"/></top><bottom style="thin"><color rgb="FFE2E8F0"/></bottom><diagonal/></border>
<border><left style="thick">${WHITE}</left><right style="thick">${WHITE}</right><top/><bottom/><diagonal/></border>
<border><left style="thick">${WHITE}</left><right style="thick">${WHITE}</right><top style="thick">${WHITE}</top><bottom/><diagonal/></border>
<border><left style="thick">${WHITE}</left><right style="thick">${WHITE}</right><top/><bottom style="thick">${WHITE}</bottom><diagonal/></border>
<border><left/><right/><top/><bottom style="medium"><color rgb="FF1E6DEB"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="28">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
${XF('numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1"', 'vertical="center" wrapText="1" indent="1"')}
${XF('numFmtId="0" fontId="0" fillId="3" borderId="1" applyFill="1" applyBorder="1"', 'vertical="center" wrapText="1" indent="1"')}
${XF('numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1"', 'vertical="center"')}
${XF('numFmtId="0" fontId="2" fillId="0" borderId="6" applyFont="1" applyBorder="1"', 'vertical="center"')}
${XF('numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1"', 'vertical="bottom"')}
${XF('numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1"', 'horizontal="center" vertical="center" wrapText="1"')}
${XF('numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1"', 'vertical="center" wrapText="1" indent="1"')}
${XF('numFmtId="164" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="164" fontId="0" fillId="3" borderId="1" applyNumberFormat="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="165" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="165" fontId="0" fillId="3" borderId="1" applyNumberFormat="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="166" fontId="5" fillId="0" borderId="1" applyNumberFormat="1" applyFont="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="166" fontId="5" fillId="3" borderId="1" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="0" fontId="5" fillId="0" borderId="1" applyFont="1" applyBorder="1"', 'vertical="center" wrapText="1" indent="1"')}
${XF('numFmtId="0" fontId="5" fillId="5" borderId="2" applyFont="1" applyFill="1" applyBorder="1"', 'vertical="center" indent="1"')}
${XF('numFmtId="164" fontId="5" fillId="5" borderId="2" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="0" fontId="6" fillId="0" borderId="0" applyFont="1"', 'vertical="center" wrapText="1"')}
${XF('numFmtId="0" fontId="7" fillId="4" borderId="4" applyFont="1" applyFill="1" applyBorder="1"', 'vertical="bottom" indent="1"')}
${XF('numFmtId="164" fontId="8" fillId="4" borderId="3" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"', 'horizontal="left" vertical="center" indent="1"')}
${XF('numFmtId="167" fontId="8" fillId="4" borderId="3" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"', 'horizontal="left" vertical="center" indent="1"')}
${XF('numFmtId="0" fontId="9" fillId="4" borderId="5" applyFont="1" applyFill="1" applyBorder="1"', 'vertical="top" wrapText="1" indent="1"')}
${XF('numFmtId="0" fontId="10" fillId="6" borderId="1" applyFont="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="0" fontId="11" fillId="7" borderId="1" applyFont="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="0" fontId="12" fillId="8" borderId="1" applyFont="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="167" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="167" fontId="0" fillId="3" borderId="1" applyNumberFormat="1" applyFill="1" applyBorder="1"', 'horizontal="center" vertical="center"')}
${XF('numFmtId="0" fontId="0" fillId="9" borderId="0" applyFill="1"')}
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
<dxfs count="0"/>
</styleSheet>`;

const escapeXml = (text: string) =>
  text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** 0 -> "A", 26 -> "AA". */
export function columnName(index: number) {
  let name = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  return name;
}

function cellXml(cell: Cell, ref: string) {
  if (cell === null || cell === undefined) return "";
  const { value, style, formula } = typeof cell === "object" ? cell : { value: cell, style: undefined, formula: undefined };
  const s = style ? ` s="${STYLE_INDEX[style]}"` : "";
  if (formula) {
    const cached = typeof value === "number" ? `<v>${value}</v>` : "";
    return `<c r="${ref}"${s}><f>${escapeXml(formula)}</f>${cached}</c>`;
  }
  if (value === null || value === "") return style ? `<c r="${ref}"${s}/>` : "";
  if (typeof value === "number") return Number.isFinite(value) ? `<c r="${ref}"${s}><v>${value}</v></c>` : `<c r="${ref}"${s}/>`;
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function sheetXml(sheet: Sheet, hasDrawing: boolean) {
  const width = Math.max(sheet.columns.length, ...sheet.rows.map((row) => row.length), 1);
  const lastRef = `${columnName(width - 1)}${Math.max(sheet.rows.length, 1)}`;
  const freeze = sheet.freeze;
  const pane = freeze
    ? (() => {
        const x = freeze.columns ?? 0;
        const y = freeze.rows;
        const top = `${columnName(x)}${y + 1}`;
        const active = x && y ? "bottomRight" : y ? "bottomLeft" : "topRight";
        return `<pane${x ? ` xSplit="${x}"` : ""}${y ? ` ySplit="${y}"` : ""} topLeftCell="${top}" activePane="${active}" state="frozen"/><selection pane="${active}" activeCell="${top}" sqref="${top}"/>`;
      })()
    : "";
  const cols = sheet.columns.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("");
  const rows = sheet.rows
    .map((row, r) => {
      const height = sheet.heights?.[r + 1];
      const cells = row.map((cell, c) => cellXml(cell, `${columnName(c)}${r + 1}`)).join("");
      return `<row r="${r + 1}"${height ? ` ht="${height}" customHeight="1"` : ""}>${cells}</row>`;
    })
    .join("");
  const merges = sheet.merges?.length
    ? `<mergeCells count="${sheet.merges.length}">${sheet.merges.map((ref) => `<mergeCell ref="${ref}"/>`).join("")}</mergeCells>`
    : "";
  const bars = (sheet.dataBars ?? [])
    .map(
      (bar, i) =>
        `<conditionalFormatting sqref="${bar.range}"><cfRule type="dataBar" priority="${i + 1}"><dataBar><cfvo type="num" val="0"/><cfvo type="max"/><color rgb="FF${bar.color}"/></dataBar></cfRule></conditionalFormatting>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<dimension ref="A1:${lastRef}"/>
<sheetViews><sheetView workbookViewId="0" showGridLines="0" zoomScale="100"${sheet.rightToLeft ? ' rightToLeft="1"' : ""}>${pane}</sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="20" customHeight="1"/>
${cols ? `<cols>${cols}</cols>` : ""}
<sheetData>${rows}</sheetData>
${sheet.autoFilter ? `<autoFilter ref="${sheet.autoFilter}"/>` : ""}
${merges}${bars}
<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>
<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>
${hasDrawing ? '<drawing r:id="rId1"/>' : ""}
</worksheet>`;
}

// ---- Drawings: the logo and bar charts. ----

const EMU_PER_PX = 9525;

function anchorXml(tag: "from" | "to", at: Anchor, offsetPx = 0) {
  return `<xdr:${tag}><xdr:col>${at.col}</xdr:col><xdr:colOff>${offsetPx * EMU_PER_PX}</xdr:colOff><xdr:row>${at.row}</xdr:row><xdr:rowOff>${offsetPx * EMU_PER_PX}</xdr:rowOff></xdr:${tag}>`;
}

function drawingXml(sheet: Sheet) {
  const parts: string[] = [];
  let id = 2;
  let rel = 1;
  if (sheet.logo) {
    // Shown 34px tall, keeping its proportions.
    const height = 34;
    const width = Math.round((sheet.logo.width / sheet.logo.height) * height);
    parts.push(
      `<xdr:oneCellAnchor>${anchorXml("from", sheet.logo.at, 6)}<xdr:ext cx="${width * EMU_PER_PX}" cy="${height * EMU_PER_PX}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${id++}" name="UniLink"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="rId${rel++}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${width * EMU_PER_PX}" cy="${height * EMU_PER_PX}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`,
    );
  }
  for (const [index, chart] of (sheet.charts ?? []).entries()) {
    parts.push(
      `<xdr:twoCellAnchor editAs="oneCell">${anchorXml("from", chart.from)}${anchorXml("to", chart.to)}<xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${id++}" name="Chart ${index + 1}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart r:id="rId${rel++}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`,
    );
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart">${parts.join("")}</xdr:wsDr>`;
}

const textProps = (size: number, color: string, bold = false) =>
  `<c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="${size}" b="${bold ? 1 : 0}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Calibri"/></a:defRPr></a:pPr><a:endParaRPr lang="en-US"/></a:p></c:txPr>`;

function chartXml(chart: BarChart, sheetName: string) {
  const ref = (range: string) => `'${escapeXml(sheetName.replace(/'/g, "''"))}'!${range.replace(/([A-Z]+)(\d+)/g, (_, c: string, r: string) => `$${c}$${r}`)}`;
  const horizontal = chart.direction === "bar";
  const series = chart.series
    .map(
      (s, i) =>
        `<c:ser><c:idx val="${i}"/><c:order val="${i}"/><c:tx><c:v>${escapeXml(s.name)}</c:v></c:tx><c:spPr><a:solidFill><a:srgbClr val="${s.color}"/></a:solidFill><a:ln><a:noFill/></a:ln></c:spPr><c:invertIfNegative val="0"/><c:cat><c:strRef><c:f>${ref(chart.categories)}</c:f></c:strRef></c:cat><c:val><c:numRef><c:f>${ref(s.values)}</c:f></c:numRef></c:val></c:ser>`,
    )
    .join("");
  const legend = chart.series.length > 1 ? `<c:legend><c:legendPos val="t"/><c:overlay val="0"/>${textProps(900, "475569")}</c:legend>` : "";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><c:roundedCorners val="0"/><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="1200" b="1"><a:solidFill><a:srgbClr val="0B1220"/></a:solidFill></a:defRPr></a:pPr><a:r><a:rPr lang="en-US" sz="1200" b="1"><a:solidFill><a:srgbClr val="0B1220"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${escapeXml(chart.title)}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title><c:autoTitleDeleted val="0"/><c:plotArea><c:layout/><c:barChart><c:barDir val="${horizontal ? "bar" : "col"}"/><c:grouping val="clustered"/><c:varyColors val="0"/>${series}<c:gapWidth val="${horizontal ? 40 : 55}"/><c:axId val="1001"/><c:axId val="1002"/></c:barChart><c:catAx><c:axId val="1001"/><c:scaling><c:orientation val="${horizontal ? "maxMin" : "minMax"}"/></c:scaling><c:delete val="0"/><c:axPos val="${horizontal ? "l" : "b"}"/><c:numFmt formatCode="General" sourceLinked="0"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:spPr><a:ln w="9525"><a:solidFill><a:srgbClr val="CBD5E1"/></a:solidFill></a:ln></c:spPr>${textProps(850, "64748B")}<c:crossAx val="1002"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/><c:noMultiLvlLbl val="0"/></c:catAx><c:valAx><c:axId val="1002"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="${horizontal ? "b" : "l"}"/><c:majorGridlines><c:spPr><a:ln w="9525"><a:solidFill><a:srgbClr val="EEF1F5"/></a:solidFill></a:ln></c:spPr></c:majorGridlines><c:numFmt formatCode="#,##0" sourceLinked="0"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:spPr><a:ln><a:noFill/></a:ln></c:spPr>${textProps(850, "94A3B8")}<c:crossAx val="1001"/><c:crosses val="${horizontal ? "max" : "autoZero"}"/><c:crossBetween val="between"/></c:valAx><c:spPr><a:noFill/><a:ln><a:noFill/></a:ln></c:spPr></c:plotArea>${legend}<c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart><c:spPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:ln w="9525"><a:solidFill><a:srgbClr val="E2E8F0"/></a:solidFill></a:ln></c:spPr></c:chartSpace>`;
}

/** Excel sheet names: at most 31 characters, none of []:*?/\ and unique. */
function safeSheetNames(names: string[]) {
  const used = new Set<string>();
  return names.map((name, i) => {
    let base = name.replace(/[[\]:*?/\\]/g, " ").trim().slice(0, 31) || `Sheet${i + 1}`;
    while (used.has(base.toLowerCase())) base = `${base.slice(0, 28)} ${i + 1}`;
    used.add(base.toLowerCase());
    return base;
  });
}

// ---- Zip (deflate), enough for an Office Open XML package. ----

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files: { name: string; data: string | Buffer }[]) {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  // Fixed DOS timestamp (1 Jan 2020): entries do not need a real one.
  const time = 0;
  const date = ((2020 - 1980) << 9) | (1 << 5) | 1;
  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const raw = typeof file.data === "string" ? Buffer.from(file.data, "utf8") : file.data;
    const packed = deflateRawSync(raw);
    const crc = crc32(raw);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, packed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);
    offset += local.length + name.length + packed.length;
  }
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

/** Excel expects each filter range registered as a hidden name; an empty list is invalid. */
function definedNames(sheets: Sheet[], names: string[]) {
  const entries = sheets.flatMap((sheet, i) => {
    if (!sheet.autoFilter) return [];
    const range = sheet.autoFilter.replace(/([A-Z]+)(\d+)/g, (_, col: string, row: string) => `$${col}$${row}`);
    return [`<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${escapeXml(names[i].replace(/'/g, "''"))}'!${range}</definedName>`];
  });
  return entries.length ? `<definedNames>${entries.join("")}</definedNames>` : "";
}

const REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

/** Builds the .xlsx file. */
export function buildWorkbook(sheets: Sheet[], options: { title?: string } = {}) {
  const names = safeSheetNames(sheets.map((sheet) => sheet.name));
  const files: { name: string; data: string | Buffer }[] = [];
  const overrides: string[] = [];
  let drawingCount = 0;
  let chartCount = 0;
  let imageCount = 0;

  sheets.forEach((sheet, i) => {
    const hasDrawing = Boolean(sheet.logo || sheet.charts?.length);
    files.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(sheet, hasDrawing) });
    overrides.push(`<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`);
    if (!hasDrawing) return;

    const drawing = ++drawingCount;
    files.push({
      name: `xl/worksheets/_rels/sheet${i + 1}.xml.rels`,
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/drawing" Target="../drawings/drawing${drawing}.xml"/></Relationships>`,
    });
    files.push({ name: `xl/drawings/drawing${drawing}.xml`, data: drawingXml(sheet) });
    overrides.push(`<Override PartName="/xl/drawings/drawing${drawing}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`);

    // Relationship ids follow the order drawingXml uses: logo first, then charts.
    const rels: string[] = [];
    let rel = 1;
    if (sheet.logo) {
      const image = ++imageCount;
      files.push({ name: `xl/media/image${image}.png`, data: sheet.logo.png });
      rels.push(`<Relationship Id="rId${rel++}" Type="${REL}/image" Target="../media/image${image}.png"/>`);
    }
    for (const chart of sheet.charts ?? []) {
      const n = ++chartCount;
      files.push({ name: `xl/charts/chart${n}.xml`, data: chartXml(chart, names[i]) });
      overrides.push(`<Override PartName="/xl/charts/chart${n}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`);
      rels.push(`<Relationship Id="rId${rel++}" Type="${REL}/chart" Target="../charts/chart${n}.xml"/>`);
    }
    files.push({
      name: `xl/drawings/_rels/drawing${drawing}.xml.rels`,
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels.join("")}</Relationships>`,
    });
  });

  files.unshift(
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${overrides.join("")}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
    },
    {
      name: "docProps/core.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(options.title ?? "")}</dc:title><dc:creator>UniLink</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>`,
    },
    {
      name: "xl/workbook.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="${REL}"><bookViews><workbookView/></bookViews><sheets>${names
        .map((name, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
        .join("")}</sheets>${definedNames(sheets, names)}</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets
        .map((_, i) => `<Relationship Id="rId${i + 1}" Type="${REL}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`)
        .join("")}<Relationship Id="rId${sheets.length + 1}" Type="${REL}/styles" Target="styles.xml"/></Relationships>`,
    },
    { name: "xl/styles.xml", data: STYLES_XML },
  );
  return zip(files);
}
