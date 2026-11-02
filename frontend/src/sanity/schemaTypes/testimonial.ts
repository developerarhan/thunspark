import { defineType, defineField } from 'sanity';

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Client Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientRole',
      title: 'Role / Title',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company / Brand Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'verified',
      title: 'Verified Client (Requires Client Written Clearance)',
      type: 'boolean',
      initialValue: false,
      description: 'Per agency rules: never set to true unless written approval is archived.',
    }),
  ],
});
