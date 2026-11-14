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
      title: 'Contact Phone',
      type: 'string',
      description: 'Leave blank if unverified. Never use placeholders.',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Contact',
      type: 'string',
      description: 'Leave blank if unverified. Never use placeholders.',
    }),
    defineField({
      name: 'address',
      title: 'Office Address',
      type: 'text',
      rows: 2,
      description: 'Physical registered agency address. Leave blank if remote-only.',
    }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'X / Twitter URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub URL', type: 'url' }),
      ],
    }),
  ],
});
