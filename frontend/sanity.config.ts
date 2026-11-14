import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure, defaultDocumentNode } from './src/sanity/structure';
import { thunsparkStudioTheme } from './src/sanity/theme';
import { StudioNavbar } from './src/sanity/components/StudioNavbar';
import { StudioLogo } from './src/sanity/components/StudioLogo';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder-project-id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'thunspark-studio',
  title: 'ThunSpark Studio',
  projectId,
  dataset,
  basePath: '/studio',
  theme: thunsparkStudioTheme,
  studio: {
    components: {
      navbar: StudioNavbar,
      logo: StudioLogo,
    },
  },
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
