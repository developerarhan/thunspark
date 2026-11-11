import { defineType, defineField } from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Case Study / Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Homepage Short Description',
      type: 'string',
      description: 'Concise one-line summary shown in the homepage client selector (max 110 characters).',
      validation: (Rule) => Rule.max(110),
    }),
    defineField({
      name: 'headline',
      title: 'Case Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Executive Overview',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'scope',
      title: 'Delivered Scope Items',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'servicesRendered',
      title: 'Services Rendered Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'year',
      title: 'Completion Year',
      type: 'number',
      initialValue: 2024,
    }),
    defineField({
      name: 'honestyNote',
      title: 'Data Honesty Note',
      type: 'string',
      initialValue: 'Scope-first showcase. Detailed revenue metrics remain client-confidential.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured On Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
      description: 'Optional client logo (rendered on a light rounded tile when no cover image is set).',
      options: {
        hotspot: false,
      },
    }),
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      description: 'Featured project visual displayed in the homepage selector.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Legacy Cover Image (Deprecated)',
      type: 'image',
      hidden: true,
      options: {
        hotspot: true,
      },
    }),
  ],
});
