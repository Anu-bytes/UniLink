// The "Find nearest" basemap: OpenFreeMap's light Positron style (vector
// tiles, no key), with place names relabelled for UniLink:
//  - names in the page's language (Arabic on /ar, English on /en), never in
//    Hebrew: a name written in Hebrew is replaced by its Latin form or hidden;
//  - the basemap's own country labels for Israel and Palestine are hidden, so
//    the only country label there is the map's own Palestine tag.

import type {
  ExpressionSpecification,
  LayerSpecification,
  StyleSpecification,
} from "maplibre-gl";

export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

export const MAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

const HIDDEN_COUNTRIES = ["Israel", "Palestine", "Palestinian Territories", "State of Palestine"];

const get = (key: string): ExpressionSpecification => ["to-string", ["coalesce", ["get", key], ""]];

/** True when a string starts with a Hebrew letter (U+0590 to U+05FF). */
function isHebrew(value: ExpressionSpecification): ExpressionSpecification {
  const first: ExpressionSpecification = ["slice", value, 0, 1];
  return ["all", [">=", first, "֐"], ["<=", first, "׿"]];
}

/** The first non-empty value; "" when all are empty. */
function firstOf(...values: ExpressionSpecification[]): ExpressionSpecification {
  return values.reduceRight<ExpressionSpecification>(
    (rest, value) => ["case", ["!=", value, ""], value, rest],
    ["literal", ""] as unknown as ExpressionSpecification,
  );
}

function labelFor(locale: string): ExpressionSpecification {
  // The feature's own name, unless it is Hebrew.
  const localName: ExpressionSpecification = ["case", isHebrew(get("name")), "", get("name")];
  const name = locale.startsWith("ar")
    ? firstOf(get("name:ar"), localName, get("name:en"), get("name:latin"))
    : firstOf(get("name:en"), get("name:latin"), localName, get("name:ar"));
  return [
    "case",
    ["in", get("name:en"), ["literal", HIDDEN_COUNTRIES]],
    "",
    // A Latin fallback can still carry Hebrew when nothing else exists.
    ["case", isHebrew(name), "", name],
  ];
}

function relabel(layer: LayerSpecification, locale: string): LayerSpecification {
  if (layer.type !== "symbol" || !layer.layout?.["text-field"]) return layer;
  // Road numbers and shields stay as they are; only name labels change.
  if (!JSON.stringify(layer.layout["text-field"]).includes("name")) return layer;
  return { ...layer, layout: { ...layer.layout, "text-field": labelFor(locale) } };
}

/** Fetches the base style and returns it relabelled for `locale`. */
export async function loadMapStyle(locale: string): Promise<StyleSpecification> {
  const response = await fetch(MAP_STYLE_URL);
  if (!response.ok) throw new Error(`Map style request failed (${response.status})`);
  const style = (await response.json()) as StyleSpecification;
  return { ...style, layers: style.layers.map((layer) => relabel(layer, locale)) };
}
