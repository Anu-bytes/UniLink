# UniLink — Figma AI Prompt Package

Prompts to generate the UniLink Phase 1 design with **Figma Make** (recommended — prompt → working styled prototype, supports Arabic/RTL) or **First Draft** (one frame at a time — paste the "Design System" block above each per-screen prompt).

Everything the AI needs is embedded below — it can't see the SRS/PDFs, so the brand tokens, sample Egyptian data, and screen content are all inline.

---

## 1. Master prompt (paste this whole block into Figma Make)

```
Design "UniLink" — a bilingual (English + Arabic) university & program discovery platform for students in Egypt. Think ApplyBoard, but Egypt-focused. Clean, modern, trustworthy ed-tech web app. Generate a navigable, responsive prototype with a working EN/AR language toggle in the header.

=== BRAND & VISUAL SYSTEM ===
Colors:
- Primary brand blue #0047FF (hover/darker #0035C7 and #003EE0; tints #3D6EFF, #B7C8FF, #E1E8FF, #F2F5FF).
- Accent red #F82C1F (darker #C71B11) — used sparingly for the "Find near me" action, verification, and key highlights.
- Neutrals: page background #F8FAFD, cards/surfaces #FFFFFF, borders/dividers #DCE0EC, primary text #0B1220 (dark navy), muted text #5B6478.
Typography:
- English: headings "Plus Jakarta Sans", body/UI "Inter".
- Arabic: headings "Cairo", body/UI "IBM Plex Sans Arabic".
- Small tags/IDs may use "JetBrains Mono".
Shape & spacing: 8px spacing grid; cards radius 16px; inputs/buttons radius 10px; chips/filters full pill radius; soft, subtle blue-tinted shadows; generous whitespace.
Components:
- Primary button: solid #0047FF, white text. Secondary: white with #DCE0EC border. Text/ghost: blue text. "Find near me" button: accent style with a location-pin icon.
- Search bar: large, 12px radius, leading search icon, clear placeholder.
- Filter chips: pill, selectable, filled blue when active.
- University card: logo, name, city, verification badge, field-of-study tags, fee-range pill (EGP), star rating, save/heart icon.
- Custom map markers: branded blue pins (not default map pins); clustered where dense; popup card on click.
Accessibility: WCAG AA contrast, visible focus rings, min 44px touch targets.

=== PRODUCT DATA (use this realistic Egyptian content) ===
Fields of study: Engineering; Computer Science, AI & IT; Medicine & Healthcare; Pharmacy; Dentistry; Business & Management; Law; Arts & Design; Media & Communication; Economics & Political Science; Education; Languages & Translation; Tourism & Hospitality; Applied Sciences; Social Sciences & Humanities.
Degree types: Undergraduate, Postgraduate.
Tuition fee buckets (EGP): Budget Friendly (Under 50,000); Mid-Range (50,000–100,000); Upper Mid-Range (100,000–150,000); Premium (150,000–250,000); Elite (Above 250,000).
Sample universities (name — city — verified?):
- Cairo University — Giza — no
- The American University in Cairo (AUC) — New Cairo — verified
- German University in Cairo (GUC) — New Cairo — verified
- Ain Shams University — Cairo — no
- Alexandria University — Alexandria — no
- Zewail City of Science & Technology — 6th of October — verified
- Nile University — 6th of October — no
- MSA University — 6th of October — no
- Mansoura University — Mansoura — no
Governorates/cities: Cairo, Giza, New Cairo, 6th of October, Alexandria, Mansoura, Aswan, Assiut.

=== SCREENS (design each at desktop 1440px and mobile 390px) ===
1) LANDING / HOME
- Sticky header: UniLink logo (left), nav links (Universities, Map, About), EN/AR language toggle, "Sign in / Register" button (right).
- Hero: bold headline "Find your university in Egypt", supporting subline, a large primary search bar ("Search universities, programs, or fields…"), and a prominent accent "Find universities near me" button with a pin icon below it.
- Field-of-study quick chips row (Engineering, Medicine, CS & AI, Business, Pharmacy, Law…) that link into search.
- Stats strip: "120+ universities · 3,400+ programs · 15 fields of study".
- Featured / Trending universities: row of university cards.
- "How it works" 3 steps: Search → Compare → Apply.
- Footer: About, Contact, Legal, language, social links.

2) SEARCH RESULTS
- Left filter sidebar: Field of Study (multi-select), Degree Type (default Undergraduate), Tuition Fee bucket (the 5 buckets + a min/max EGP slider), Location (city/governorate), National vs International certification, "Clear all".
- Results header: query text, result count, sort dropdown (Fees Low→High, Fees High→Low, Name, Distance).
- Split layout: scrollable results list (~60% width) beside a sticky interactive map (~40%) with clustered blue pins. On mobile: a List/Map toggle.
- Active filter chips shown above results.

3) UNIVERSITY PROFILE
- Cover image + logo, university name, city, verification badge, star rating, save button, and an "Apply" button in a disabled "Coming soon" state.
- Sections: Overview (bio); Location (embedded map); Faculties → Departments → Programs hierarchy showing degree type, duration, tuition fees (EGP), and field of study; Accreditation & Partnerships; Images gallery.
- Sidebar: quick facts (established year, National/International, city, number of fields), contact.

4) MAP VIEW (full page)
- Full-bleed custom-styled map of Egypt with clustered branded blue pins (dense cluster over Cairo). Floating search bar + filter chips on top. A "Search this area" button. A collapsible list panel on the left, synced with the map (hover a card → highlight its pin). Marker popup card: logo, name, city, top fields, fee range, "View profile". Distinct user-location marker + radius circle. Radius selector: 5 / 10 / 25 / 50 km.

5) FIND NEAR ME
- Location-permission prompt ("Allow UniLink to use your location to find nearby universities"). Granted state: results sorted by distance with km labels + map with user pin and radius circle. Denied state: friendly message with a manual city-input fallback.

=== BILINGUAL / RTL ===
Produce every screen in two versions:
- English: LTR layout, Plus Jakarta Sans / Inter, English labels.
- Arabic: fully mirrored RTL layout, Cairo / IBM Plex Sans Arabic, Arabic labels (see glossary). The language toggle switches direction and font live.
```

---

## 2. Per-screen prompts (for First Draft — repeat the Design System block, then paste ONE)

**Landing:** *"A landing page for UniLink, a university discovery platform for Egypt. Sticky header with logo, nav (Universities, Map, About), EN/AR toggle, and a Sign in button. Hero with headline 'Find your university in Egypt', a large search bar, and an accent 'Find universities near me' button with a pin icon. A row of field-of-study chips (Engineering, Medicine, CS & AI, Business, Pharmacy, Law). A stats strip. A 'Featured universities' row of cards (logo, name, city, verified badge, field tags, fee-range pill, rating). A 'How it works' 3-step section. Footer."*

**Search results:** *"A university search-results page for UniLink. Left filter sidebar: Field of Study (multi-select), Degree Type (Undergraduate default), Tuition Fee buckets (Budget Friendly / Mid-Range / Upper Mid-Range / Premium / Elite) with an EGP min–max slider, Location, National vs International, and Clear all. Header with result count and a Sort dropdown. A results list of university cards on the left (60%) beside a sticky map with clustered blue pins on the right (40%). Active filter chips above the list."*

**University profile:** *"A university profile page for The American University in Cairo on UniLink. Cover image, logo, name, 'New Cairo', verified badge, star rating, Save button, and a disabled 'Apply — Coming soon' button. Sections: Overview, Location with an embedded map, and a Faculties → Departments → Programs list showing degree type, duration, tuition fees in EGP, and field of study. Accreditation & partnerships and an image gallery. A sidebar with quick facts."*

**Map view:** *"A full-page interactive map view for UniLink over Egypt. Custom-styled map with clustered branded blue pins, a dense cluster over Cairo. Floating search bar and filter chips on top, a 'Search this area' button, a collapsible list panel on the left synced to the map, a marker popup card (logo, name, city, top fields, fee range, View profile), a user-location marker with a radius circle, and a radius selector 5/10/25/50 km."*

**Find near me:** *"A 'Find universities near me' flow for UniLink: a location-permission prompt card, then a results list sorted by distance with km labels beside a map showing the user's location pin and a radius circle; plus a permission-denied state with a friendly message and a manual city-input fallback."*

**Mobile:** append *"Design this as a mobile screen, 390px wide, with a bottom-anchored primary action and a List/Map toggle where a map appears."* to any prompt above.

---

## 3. Arabic label glossary (for the RTL versions)

| English | العربية |
|---|---|
| UniLink | يوني لينك |
| Sign in / Register | تسجيل الدخول / إنشاء حساب |
| Universities | الجامعات |
| Map | الخريطة |
| About | عن المنصة |
| Find your university in Egypt | اعثر على جامعتك في مصر |
| Search universities, programs, or fields… | ابحث عن جامعات أو برامج أو تخصصات… |
| Find universities near me | ابحث عن جامعات بالقرب مني |
| Featured universities | جامعات مميزة |
| How it works | كيف تعمل المنصة |
| Filters / Clear all | الفلاتر / مسح الكل |
| Field of Study | مجال الدراسة |
| Degree Type | نوع الدرجة |
| Undergraduate / Postgraduate | بكالوريوس / دراسات عليا |
| Tuition Fees | الرسوم الدراسية |
| Location | الموقع |
| Sort by | ترتيب حسب |
| Verified | تمّ التحقق |
| Save | حفظ |
| Apply — Coming soon | قدّم الآن — قريبًا |
| Search this area | ابحث في هذه المنطقة |
| View profile | عرض الملف |
| Fee buckets | اقتصادي · متوسط · فوق المتوسط · مميز · نخبة |
| Fields | هندسة · طب · حاسبات وذكاء اصطناعي · صيدلة · إدارة أعمال · قانون |

---

## 4. Design-token reference (paste if the AI asks, or to set variables)

```
--brand-600:#0035C7  --brand-500:#003EE0  --brand:#0047FF  --brand-400:#3D6EFF
--brand-200:#B7C8FF  --brand-100:#E1E8FF  --brand-50:#F2F5FF
--accent:#F82C1F  --accent-700:#C71B11
--bg:#F8FAFD  --surface:#FFFFFF  --border:#DCE0EC  --text:#0B1220  --muted:#5B6478
Font EN headings: Plus Jakarta Sans | EN body: Inter
Font AR headings: Cairo | AR body: IBM Plex Sans Arabic
Radius: card 16 · input/button 10 · chip pill · Grid: 8px
```

---

### Tips
- **Figma Make:** paste section 1 as-is; then ask follow-ups like "now add the Arabic RTL version of the search page" to extend.
- **First Draft:** generate English screens first, then duplicate each frame and translate + mirror to RTL using the glossary — First Draft's native Arabic/RTL is weak, so treat AR as a manual pass.
- Fonts "Plus Jakarta Sans", "Cairo", and "IBM Plex Sans Arabic" are free Google Fonts available in Figma.
