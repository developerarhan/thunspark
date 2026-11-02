import { defineType, defineField } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'agencyName',
      title: 'Agency Name',
      type: 'string',
      initialValue: 'ThunSpark',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'We solve business problems. Marketing is how.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Primary Contact Email',
      type: 'string',
      initialValue: 'hello@thunspark.agency',
    }),
    defineField({
      name: 'phone',
      title: 'Contact Phone / WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Office Address',
      type: 'text',
      rows: 2,
    }),
  ],
});
