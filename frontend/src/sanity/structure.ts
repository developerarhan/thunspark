import type { StructureResolver, DefaultDocumentNodeResolver } from 'sanity/structure';
import { IframePreview } from './components/IframePreview';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('ThunSpark Content Desk')
    .items([
      // ── SINGLETON: SITE SETTINGS ──────────────────────────
      S.listItem()
        .title('Global Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Global Site Settings')
        ),

      S.divider(),

      // ── MARKETING & PERFORMANCE ───────────────────────────
      S.listItem()
        .title('Marketing & Growth')
        .child(
          S.list()
            .title('Marketing & Content')
            .items([
              S.documentTypeListItem('project').title('Case Studies & Client Work'),
              S.documentTypeListItem('post').title('Blog & Thought Leadership'),
              S.divider(),
              S.documentTypeListItem('category').title('Taxonomy & Categories'),
              S.documentTypeListItem('author').title('Content Authors'),
            ])
        ),

      // ── AGENCY, TEAM & HIRING ─────────────────────────────
      S.listItem()
        .title('Agency & Talent')
        .child(
          S.list()
            .title('Agency & Talent')
            .items([
              S.documentTypeListItem('teamMember').title('Team & Leadership'),
              S.documentTypeListItem('jobOpening').title('Career Openings'),
              S.documentTypeListItem('testimonial').title('Client Testimonials'),
            ])
        ),

      S.divider(),

      // Fallback for any other custom schemas added later
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'siteSettings',
            'project',
            'post',
            'category',
            'author',
            'teamMember',
            'jobOpening',
            'testimonial',
          ].includes(item.getId() || '')
      ),
    ]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (schemaType === 'post') {
    return S.document().views([
      S.view.form().title('Editor'),
      S.view
        .component(IframePreview)
        .options({
          url: (doc: any) => {
            const slug = doc?.slug?.current;
            return slug ? `/blog/${slug}` : null;
          },
        })
        .title('Live Preview'),
    ]);
  }

  if (schemaType === 'project') {
    return S.document().views([
      S.view.form().title('Editor'),
      S.view
        .component(IframePreview)
        .options({
          url: (doc: any) => {
            const slug = doc?.slug?.current;
            return slug ? `/projects/${slug}` : null;
          },
        })
        .title('Live Preview'),
    ]);
  }

  return S.document().views([S.view.form().title('Editor')]);
};
