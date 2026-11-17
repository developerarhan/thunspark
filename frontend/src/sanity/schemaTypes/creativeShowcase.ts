import { defineType, defineField } from 'sanity';

export const creativeShowcaseType = defineType({
  name: 'creativeShowcase',
  title: 'Creative Showcase (Drift Wall)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Deliverable Name',
      type: 'string',
      description: 'e.g. "Viral Problem-Solution Story Reel" or "Conversion Lander"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client / Brand Name',
      type: 'string',
      description: 'e.g. "Coo & Cry" or "Medilove"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category / Asset Type',
      type: 'string',
      description: 'e.g. "Meta Reels Ad", "Conversion Lander", "3D Product Render", "Motion Teaser"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metric',
      title: 'Metric Badge (Optional)',
      type: 'string',
      description: 'e.g. "+285% CVR", "4.8x ROAS", "14K Downloads"',
    }),
    defineField({
      name: 'accent',
      title: 'Accent Color (Hex or Token)',
      type: 'string',
      initialValue: '#FFD21F',
      description: 'Color hex code for monogram and border accents (e.g. #FF6B00, #3B82F6, #10B981, #FFD21F).',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Card Visual / Thumbnail (Optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional thumbnail image displayed as the card background or media preview.',
    }),
    defineField({
      name: 'project',
      title: 'Linked Case Study (Optional)',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Select an existing case study. When clicked, visitors will navigate to this project page.',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Live URL (Optional)',
      type: 'url',
      description: 'Used if there is no case study page, e.g. a direct link to a live ad, Instagram reel, or website.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers display first across the drifting wall columns.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'thumbnail',
      category: 'category',
    },
    prepare({ title, subtitle, media, category }) {
      return {
        title: title || 'Untitled Creative',
        subtitle: `${subtitle || 'Unknown Brand'} • ${category || 'Showcase'}`,
        media,
      };
    },
  },
});
