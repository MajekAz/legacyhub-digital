# LegacyHub SEO audit and content roadmap

Audit date: 4 September 2026. This document records implementation findings and a content backlog; it does not represent keyword-volume research or ranking guarantees.

## Technical audit summary

Production returned 200 for all existing public routes, robots.txt, sitemap.xml, the social image and the approved PDF. `/resources` returned 404 before this change. All checked HTML pages had one H1, canonical metadata and no missing `alt` attribute. The thank-you and unsubscribe utility pages were correctly noindexed and absent from the sitemap. Internal links returned 200. HTTP upgraded to HTTPS.

Page metadata was unique but often generic. `pageMetadata()` set empty Open Graph and Twitter image arrays, overriding the valid sitewide social image. Root JSON-LD described WebSite and Service but lacked an Organization entity, publisher/provider relationships and page-level structures. Services, packages and who-we-serve skipped from H1 to H3. Paid landing pages rendered little campaign-specific copy despite having it in the content model. Important routes had few contextual links. UK relevance existed; Glasgow relevance did not. No approved street address exists, so LocalBusiness/address schema would be unsupported.

The `www` host serves a separate 200 response. Canonicals correctly prefer non-www, but Hostinger/CDN should permanently redirect every www URL to its equivalent non-www HTTPS URL. Implement this at the edge after testing GET and POST behaviour; do not apply a generic application redirect that could replay or discard lead-form bodies.

Hero files are modest JPEGs delivered through Next Image with dimensions, responsive sizing and priority for LCP. Empty alt text is intentional for decorative full-bleed backgrounds; visible copy and linked credits provide context. Fonts are self-hosted WOFF2 with `font-display: swap`. The 1.9 MB `og.png` is larger than necessary for social crawlers and can be recompressed later after visual approval. Sitewide privacy/tracking JavaScript is purposeful; no safe removal was identified. Monitor field Core Web Vitals in Search Console because a source audit cannot prove LCP, CLS or INP.

Privacy and terms still display “review draft” on production. That is a legal/content-governance issue for business review, not something to silently rewrite during SEO work.

## Implemented information architecture

The Resources hub connects the guide to services, process and consultation pages. Footer links expose Resources, Who We Serve and Packages. Services links contextually to packages and process. Each landing page now renders its audience-specific problem and benefit with a relevant services link. Navigation structure and lead funnels otherwise remain unchanged.

Structured data uses only supported facts: Organization (without invented address, telephone, price or review data), WebSite, homepage WebPage, page-level WebPage or Service, BreadcrumbList, and FAQPage only on pages where those questions and answers are visible. The organization area served is the United Kingdom, with Glasgow represented as the stated business base. The Baba Muyi page remains a case study/WebPage rather than an Article because no publication authorship/date is supplied.

## Page themes

| Route                                | Primary theme                                                   |
| ------------------------------------ | --------------------------------------------------------------- |
| `/`                                  | digital legacy archives for families, leaders and organisations |
| `/services`                          | digital legacy archive services UK                              |
| `/how-it-works`                      | digital legacy preservation process                             |
| `/who-we-serve`                      | family, leadership and organisational archives                  |
| `/case-studies`                      | digital family archive example                                  |
| `/case-studies/baba-muyi`            | digital family archive case study                               |
| `/packages`                          | family archive and biography service options                    |
| `/about`                             | Glasgow digital heritage studio                                 |
| `/contact`                           | contact a Glasgow heritage archive service                      |
| `/book-consultation`                 | legacy archive consultation                                     |
| `/resources`                         | family legacy preservation guidance                             |
| `/resources/family-legacy-checklist` | free family legacy preservation guide                           |

Campaign pages target family legacy websites, diaspora family archives, memorial archives, leadership/veteran archives and organisational heritage respectively. Copy should remain useful and audience-specific before search indexing is expanded further.

## Content opportunities

| Group                    | Proposed title                                              | Target query                           | Intent                   | Internal destination              | Funnel stage  |
| ------------------------ | ----------------------------------------------------------- | -------------------------------------- | ------------------------ | --------------------------------- | ------------- |
| Informational            | How to Preserve Family Memories Before They Are Lost        | how to preserve family memories        | Informational            | Family legacy guide               | Awareness     |
| Informational            | What Is a Digital Family Archive?                           | digital family archive                 | Informational            | Services                          | Awareness     |
| Informational            | A Practical Family Archive Checklist                        | family archive checklist               | Informational            | Family legacy guide               | Awareness     |
| Informational            | How to Organise Family History Documents                    | organise family history documents      | Informational            | How It Works                      | Awareness     |
| Commercial investigation | Choosing a Family History Preservation Service              | family history preservation service UK | Commercial investigation | Services                          | Consideration |
| Commercial investigation | Family Biography Service: What to Expect                    | family biography service               | Commercial investigation | How It Works                      | Consideration |
| Commercial investigation | Digital Legacy Website or Cloud Folder?                     | legacy website for families            | Commercial investigation | Packages                          | Consideration |
| Family history           | How to Build a Family History Archive Across Generations    | family history archive                 | Informational            | Who We Serve                      | Awareness     |
| Family history           | Preserving Family History Across the African Diaspora       | diaspora family archive                | Informational            | Diaspora landing page             | Awareness     |
| Photograph preservation  | How to Preserve Old Family Photographs and Their Stories    | preserve old photographs               | Informational            | Family legacy guide               | Awareness     |
| Photograph preservation  | How to Caption Family Photographs for Future Generations    | caption old family photos              | Informational            | Family legacy guide               | Awareness     |
| Oral history             | How to Record an Oral History Interview with a Relative     | record family oral history             | Informational            | Services                          | Awareness     |
| Oral history             | Family Interview Questions That Preserve More Than Dates    | family history interview questions     | Informational            | How It Works                      | Awareness     |
| Biography                | How to Write a Family Biography with Care                   | how to write a family biography        | Informational            | Services                          | Awareness     |
| Biography                | Biography Writing and Digital Archives: A Combined Approach | biography writing and digital archive  | Commercial investigation | Packages                          | Consideration |
| Digital archives         | What Belongs in a Digital Heritage Archive?                 | digital heritage archive               | Informational            | Services                          | Awareness     |
| Digital archives         | Public or Private Family Archive: Questions to Consider     | private family archive website         | Commercial investigation | How It Works                      | Consideration |
| Legacy planning          | When Should a Family Begin Legacy Preservation?             | family legacy planning                 | Service investigation    | Book Consultation                 | Decision      |
| Organisational heritage  | How to Preserve an Organisation’s History                   | organisational heritage archive        | Informational            | Organisations landing page        | Awareness     |
| Organisational heritage  | Building a Leadership Legacy Archive                        | leadership legacy archive              | Service intent           | Leaders and Veterans landing page | Decision      |

Before publishing, validate search demand and SERP intent in Google Search Console and an approved keyword tool. Publish a small, authoritative cluster first; avoid generating thin articles merely to cover keywords. Every article should link to one relevant service page and one next-step resource, use real expertise, and include authorship/review dates only when approved and accurate.

## Local SEO follow-up

Keep Glasgow references natural on About and Contact. Establish and verify a Google Business Profile only if the business is eligible and the public service-area/address choice is approved. Keep the business name, website, telephone and address/service-area consistent across the site and profile; do not publish a private address. Add LocalBusiness or ProfessionalService schema only after those facts are approved and visible. Create location-specific service content only when it describes real availability and contains useful, non-duplicated information.
