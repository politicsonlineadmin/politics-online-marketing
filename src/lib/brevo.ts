const BREVO_BASE = "https://api.brevo.com/v3";

async function brevoFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY not set");

  const url = new URL(`${BREVO_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API ${res.status}: ${body}`);
  }

  return res.json();
}

// ---- Types matching Brevo API responses ----

interface BrevoAccount {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  plan: { type: string; credits: number; creditsType: string }[];
}

interface BrevoCampaignStats {
  sent: number;
  delivered: number;
  viewed: number;
  uniqueViews: number;
  clickers: number;
  uniqueClicks: number;
  hardBounces: number;
  softBounces: number;
  unsubscriptions: number;
}

interface BrevoCampaign {
  id: number;
  name: string;
  subject: string;
  status: string;
  sentDate?: string;
  scheduledAt?: string;
  createdAt: string;
  recipients: { lists: number[]; exclusionLists: number[] };
  statistics: { globalStats: BrevoCampaignStats };
}

interface BrevoCampaignsResponse {
  campaigns: BrevoCampaign[];
  count: number;
}

interface BrevoContactsResponse {
  contacts: unknown[];
  count: number;
}

interface BrevoAggregatedReport {
  requests: number;
  delivered: number;
  hardBounces: number;
  softBounces: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  spamReports: number;
  unsubscribed: number;
  blocked: number;
  invalid: number;
}

// ---- Public API functions ----

export async function getBrevoAccount() {
  return brevoFetch<BrevoAccount>("/account");
}

export async function getBrevoContacts() {
  const data = await brevoFetch<BrevoContactsResponse>("/contacts", { limit: "1", offset: "0" });
  return { totalContacts: data.count };
}

export async function getBrevoEmailCampaigns() {
  const data = await brevoFetch<BrevoCampaignsResponse>("/emailCampaigns", {
    statistics: "globalStats",
    limit: "20",
    sort: "desc",
    excludeHtmlContent: "true",
  });
  return data.campaigns.map((c) => {
    const stats = c.statistics?.globalStats;
    const sent = stats?.sent || 0;
    return {
      id: String(c.id),
      name: c.name,
      subject: c.subject,
      status: mapCampaignStatus(c.status),
      sentDate: c.sentDate || c.scheduledAt || c.createdAt,
      recipients: sent,
      openRate: sent > 0 ? round((stats.uniqueViews / sent) * 100) : 0,
      clickRate: sent > 0 ? round((stats.uniqueClicks / sent) * 100) : 0,
      bounceRate: sent > 0 ? round(((stats.hardBounces + stats.softBounces) / sent) * 100) : 0,
      unsubscribeRate: sent > 0 ? round((stats.unsubscriptions / sent) * 100) : 0,
    };
  });
}

export async function getBrevoAggregatedStats() {
  return brevoFetch<BrevoAggregatedReport>("/smtp/statistics/aggregatedReport", { days: "90" });
}

export async function getBrevoDashboardData() {
  const [contacts, campaigns, aggregated] = await Promise.all([
    getBrevoContacts(),
    getBrevoEmailCampaigns(),
    getBrevoAggregatedStats().catch(() => null),
  ]);

  // Compute averages from sent campaigns
  const sentCampaigns = campaigns.filter((c) => c.status === "sent");
  const avgOpenRate = sentCampaigns.length > 0
    ? round(sentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / sentCampaigns.length)
    : 0;
  const avgClickRate = sentCampaigns.length > 0
    ? round(sentCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / sentCampaigns.length)
    : 0;

  // Deliverability from aggregated transactional stats, or from campaigns
  let deliverabilityRate = 0;
  if (aggregated && aggregated.requests > 0) {
    deliverabilityRate = round((aggregated.delivered / aggregated.requests) * 100);
  } else if (sentCampaigns.length > 0) {
    const avgBounce = sentCampaigns.reduce((sum, c) => sum + c.bounceRate, 0) / sentCampaigns.length;
    deliverabilityRate = round(100 - avgBounce);
  }

  return {
    totalContacts: contacts.totalContacts,
    avgOpenRate,
    avgClickRate,
    deliverabilityRate,
    campaigns,
  };
}

// ---- Helpers ----

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function mapCampaignStatus(brevoStatus: string): "sent" | "scheduled" | "draft" {
  switch (brevoStatus) {
    case "sent": return "sent";
    case "queued":
    case "inProcess":
    case "suspended":
    case "inReview":
      return "scheduled";
    default:
      return "draft";
  }
}
