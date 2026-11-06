/**
 * Canonical Studio & Workspace Layout Configuration.
 * 
 * Core settings preserving the approved UI layout architecture:
 * 1. Decoupled column heights (`items-start` on the parent row)
 * 2. Dedicated code editor sizing (`h-[460px] lg:h-[500px] shrink-0`)
 * 3. Uncapped database schema explorer (natural depth without artificial max-h constraint)
 * 4. Uncapped query results explorer (`max-h-[600px]`, full preview without artificial row LIMIT)
 * 5. Syllabus footer placed at the end of the scrollable exercise list
 */
export const LAYOUT_SETTINGS = {
  editor: {
    heightClass: 'h-[460px] lg:h-[500px] shrink-0',
    minHeightClass: 'min-h-[300px]',
  },
  schemaExplorer: {
    uncappedDepth: true,
  },
  resultsExplorer: {
    maxHeightClass: 'max-h-[600px]',
    minHeightClass: 'min-h-[140px]',
    truncatePreviewLimit: false,
  },
  workspace: {
    rowAlignment: 'items-start',
  },
  sidebar: {
    footerAtEndOfScroll: true,
  },
} as const;
