// Closer Sparring — core types.
// Schema mirrors closer-curriculum/curriculum/personas/PERSONAS.md.

export type Track = "T1" | "T2" | "T3" | "T4" | "T5";
export type BuyingAuthority =
  | "economic"
  | "technical"
  | "user"
  | "champion"
  | "mobilizer"
  | "blocker"
  | "gatekeeper"
  | "counterparty"
  | "unclear";
export type Appraisal = "positive" | "neutral" | "negative" | "neutral-suspicious" | "adversarial" | "neutral-adversarial" | "negative-by-default" | "protective-suspicious";
export type StatusPosture = "dominant" | "prestige-driven" | "submissive" | "rotating";
export type Readability = "low" | "medium" | "high";
export type PersuasionKnowledge = "low" | "low-medium" | "medium" | "high" | "very high";

export interface Persona {
  id: string;
  track: Track;
  role: string;
  seniority: string;
  buyingAuthority: BuyingAuthority;
  spendAuthorityThreshold: string;
  firingCriteria: string[];
  decisionCriteriaStated: string;
  decisionCriteriaHidden: string;
  appraisal: Appraisal;
  valence: number; // -3 to +3
  certainty: number; // 0 to 5
  agency: number; // 0 to 5
  persuasionKnowledge: PersuasionKnowledge;
  statusPosture: StatusPosture;
  readability: Readability;
  typicalObjections: string[];
  contraindicatedTechniques: string[]; // technique ids
  likelyResponsiveTechniques: string[]; // technique ids
  narrativeArc: string;
  hiddenCurveBall: string;
}

export type AtlasCluster =
  | "compliance"
  | "cialdini"
  | "framing"
  | "structural-close"
  | "question-form"
  | "negotiation-anchor"
  | "post-objection"
  | "closing-environment";

export type AtlasVerdict =
  | "well-studied"
  | "partially-studied"
  | "untested-in-database"
  | "replication-failed";

export type FolkloreRisk = "low" | "low-medium" | "medium" | "medium-high" | "high";

export interface Technique {
  id: string; // taxonomy_id from Atlas
  name: string;
  cluster: AtlasCluster;
  mechanism: string; // one-line behavioral-science vocabulary
  atlasVerdict: AtlasVerdict;
  folkloreRisk: FolkloreRisk;
  canonicalSource: string;
  primaryFailureMode: string;
  contraindication: string;
  stageRouting: ("S3" | "S4" | "S5")[];
}

export interface RubricDimension {
  name: string;
  description: string;
  anchors: {
    score0: string;
    score3: string;
    score5: string;
    score7: string;
    score10: string;
  };
}

export interface SessionTurn {
  role: "operator" | "persona";
  text: string;
  timestamp: number;
  // techniques deployed in this turn (operator turns only) — Claude-tagged on end-of-session scoring
  techniquesDeployed?: string[];
}

export interface Session {
  id: string;
  personaId: string;
  intendedTechniques: string[]; // operator's pre-registered intent
  turns: SessionTurn[];
  startedAt: number;
  endedAt?: number;
  scorecard?: Scorecard;
}

export interface Scorecard {
  deliveryCleanness: number; // 0-10
  recognitionCorrectness: number; // 0-10
  personaResponseMatch: number; // 0-10
  composite: number; // product / 100
  techniquesObservedDeployed: string[];
  techniquesIntendedNotDeployed: string[];
  techniquesUnintentionalDeployed: string[];
  contraindicatedDeployed: string[]; // red flag if any
  personaHiddenCriteriaSurfaced: boolean;
  notes: string;
  failureModesFlagged: string[]; // L1-L7 failure mode IDs
}
