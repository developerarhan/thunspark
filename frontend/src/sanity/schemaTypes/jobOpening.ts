import { defineType, defineField } from 'sanity';

export const jobOpeningType = defineType({
  name: 'jobOpening',
  title: 'Job Opening',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'team',
      title: 'Team / Department',
      type: 'string',
      description: 'e.g., Engineering, Growth, Strategy, Design',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Remote (India), Hybrid (Bangalore), Remote (Global)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'FULL_TIME' },
          { title: 'Part-time', value: 'PART_TIME' },
          { title: 'Contract', value: 'CONTRACT' },
          { title: 'Internship', value: 'INTERN' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Job Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'applyEmail',
      title: 'Application Email',
      type: 'string',
      description: 'Email where candidates should send their applications',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'active',
      title: 'Active / Published',
      type: 'boolean',
      initialValue: true,
      description: 'Only active roles are displayed on the careers page.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'team',
      active: 'active',
    },
    prepare({ title, subtitle, active }) {
      return {
        title,
        subtitle: `${subtitle || 'General'} • ${active ? 'Active' : 'Archived'}`,
      };
    },
  },
});
