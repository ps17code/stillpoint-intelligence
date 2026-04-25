/* ── Input page data types ── */

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface HowItsMadeCard {
  label: string;
  content: string;
  whyItsHard: string;
  statValue: string;
  statLabel: string;
}

export interface SoWhatBlock {
  id: string;
  label: string;
  question: string;
  teaser: string;
  analysis: { type: string; text?: string; author?: string; name?: string; desc?: string }[];
}

export interface IdeaBrief {
  name: string;
  ticker: string;
  category: string;
  metrics: { label: string; value: string }[];
  sections: { label: string; items: { title?: string; text: string }[] }[];
  disclaimer: string;
}

export interface WtmiLayer {
  label: string;
  ideas: { id: string; name: string; ticker: string; category: string; line1: string }[];
}

export interface ConnectedInput {
  name: string;
  linked: boolean;
  href: string;
  desc?: string;
}

export interface DependencyHeader {
  label: string;
  width: string;
  right?: boolean;
}

export interface DependencyRow {
  [key: string]: string | boolean | undefined;
}

export interface InputPageData {
  slug: string;
  title: string;
  accent: string;
  /** Color used for callout borders in So What section (defaults to accent if omitted) */
  calloutAccent?: string;
  type: "raw-material" | "component";
  treeComponentId: "germanium" | "gallium" | "fiber";

  breadcrumbs: {
    default: BreadcrumbItem[];
    resources?: BreadcrumbItem[];
  };

  execSummary: {
    bullets: string[];
  };

  supplyTree: {
    keyTakeaways: string[];
    howItsMade: HowItsMadeCard[];
    /** Extra text shown below How It's Made cards (e.g. "Click any node...") */
    treeFooterText?: string;
  };

  dependencies: {
    upstream?: {
      label: string;
      headers: DependencyHeader[];
      rows: DependencyRow[];
      summaryRows?: { label: string; values: string[] }[];
      takeaway: string;
    };
    downstream: {
      label: string;
      headers: DependencyHeader[];
      rows: DependencyRow[];
      totalRow?: DependencyRow;
      takeaway: string;
      /** Optional note shown before the takeaway (e.g. italicized methodology note) */
      note?: string;
    };
  };

  supplyDemand: {
    supply: { value: string; analysis: string };
    demand: { value: string; analysis: string };
    gap: { value: string; analysis: string };
  };

  soWhat: SoWhatBlock[];

  risk: {
    easeSupply: { risk: string; assessment: string }[];
    softenDemand: { risk: string; assessment: string }[];
    bottomLine: string;
  };

  wtmi: {
    layers: WtmiLayer[];
    briefs: Record<string, IdeaBrief>;
  };

  catalysts: {
    nearTerm: { date: string; desc: string }[];
    mediumTerm: { date: string; desc: string }[];
    longTerm: { date: string; desc: string }[];
  };

  connectedInputs: {
    upstream?: ConnectedInput[];
    downstream?: ConnectedInput[];
  };
}
