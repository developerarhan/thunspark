import { buildLegacyTheme } from 'sanity';

export const thunsparkStudioTheme = buildLegacyTheme({
  /* Base theme colors */
  '--black': '#09090b',
  '--white': '#fafafa',

  '--gray': '#71717a',
  '--gray-base': '#27272a',

  '--component-bg': '#0f0f12',
  '--component-text-color': '#fafafa',

  /* Brand Colors */
  '--brand-primary': '#ea580c',

  /* Default button colors */
  '--default-button-color': '#71717a',
  '--default-button-primary-color': '#ea580c',
  '--default-button-success-color': '#10b981',
  '--default-button-warning-color': '#f59e0b',
  '--default-button-danger-color': '#ef4444',

  /* State badges & alerts */
  '--state-info-color': '#ea580c',
  '--state-success-color': '#10b981',
  '--state-warning-color': '#f59e0b',
  '--state-danger-color': '#ef4444',

  /* Studio Navigation bar */
  '--main-navigation-color': '#09090b',
  '--main-navigation-color--inverted': '#fafafa',

  '--focus-color': '#ea580c',
});
