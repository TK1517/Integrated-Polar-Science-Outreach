"use client";



import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import Link from "next/link";

import {

  Snowflake,

  Cloud,

  Waves,

  Mountain,

  BookOpen,

  FlaskConical,

  Image as ImageIcon,

  Database,

  ArrowDown,

  Sparkles,

} from "lucide-react";



import { supabase } from "@/lib/supabase/client";

import Reveal from "@/components/ui/Reveal";

import GlassCard from "@/components/ui/GlassCard";



type Topic = {

  id: string;

  name: string;

  slug: string;

  description: string | null;

  icon: string | null;

};



type Resource = {

  id: string;

  title: string;

  description: string | null;

  category: string | null;

  resource_type: string | null;

};



type GraphEdge = {
  source_type: string;
  source_id: string;
  target_type: string;
  target_id: string;
  relationship_type: string;
};

type GraphRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
};

function normalizeGraphType(value: string) {
  const type = value.trim().toLowerCase();

  if (["resource", "resources", "knowledge_resource", "knowledge_resources"].includes(type)) {
    return "resource";
  }

  if (["publication", "publications"].includes(type)) {
    return "publication";
  }

  if (["expedition", "expeditions"].includes(type)) {
    return "expedition";
  }

  if (["media", "medias"].includes(type)) {
    return "media";
  }

  if (["topic", "topics"].includes(type)) {
    return "topic";
  }

  return type;
}

function normalizeGraphId(value: string) {
  return value.trim().toLowerCase();
}



export default function KnowledgeGraphPage() {

  const [topics, setTopics] = useState<Topic[]>([]);

  const [resources, setResources] = useState<Resource[]>([]);

  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [publications, setPublications] = useState<GraphRecord[]>([]);
  const [expeditions, setExpeditions] = useState<GraphRecord[]>([]);
  const [media, setMedia] = useState<GraphRecord[]>([]);



  const [selectedTopic, setSelectedTopic] = useState<string | null>(

    null

  );



  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);



  useEffect(() => {

    async function loadGraph() {

      setLoading(true);

      setError(null);



      const [

        topicsResponse,

        relationshipsResponse,

        resourcesResponse,
        graphEdgesResponse,
        publicationsResponse,
        expeditionsResponse,
        mediaResponse,

      ] = await Promise.all([

        supabase

          .from("polar_topics")

          .select("id,name,slug,description,icon")

          .order("name"),



        supabase

          .from("knowledge_resource_topics")

          .select("resource_id,topic_id"),



        supabase

          .from("knowledge_resources")

          .select(

            "id,title,description,category,resource_type"

          )

          .eq("published", true)

          .order("published_date", {

            ascending: false,

          }),

        supabase
          .from("graph_edges")
          .select("source_type,source_id,target_type,target_id,relationship_type"),

        supabase
          .from("publications")
          .select("id,title")
          .eq("published", true),

        supabase
          .from("expeditions")
          .select("id,name")
          .eq("published", true),

        supabase
          .from("media")
          .select("id,title")
          .eq("published", true),

      ]);



      if (topicsResponse.error) {

        setError(topicsResponse.error.message);

        setLoading(false);

        return;

      }



      if (relationshipsResponse.error) {

        setError(relationshipsResponse.error.message);

        setLoading(false);

        return;

      }



      if (resourcesResponse.error) {

        setError(resourcesResponse.error.message);

        setLoading(false);

        return;

      }

      if (graphEdgesResponse.error) {
        setError(graphEdgesResponse.error.message);
        setLoading(false);
        return;
      }

      if (publicationsResponse.error) {
        setError(publicationsResponse.error.message);
        setLoading(false);
        return;
      }

      if (expeditionsResponse.error) {
        setError(expeditionsResponse.error.message);
        setLoading(false);
        return;
      }

      if (mediaResponse.error) {
        setError(mediaResponse.error.message);
        setLoading(false);
        return;
      }



      setTopics(topicsResponse.data || []);

      setResources(resourcesResponse.data || []);

      const legacyEdges: GraphEdge[] = (relationshipsResponse.data || []).map(
        (relationship) => ({
          source_type: "resource",
          source_id: relationship.resource_id,
          target_type: "topic",
          target_id: relationship.topic_id,
          relationship_type: "tagged_with",
        })
      );

      setGraphEdges(
        [...(graphEdgesResponse.data || []), ...legacyEdges].map((edge) => ({
          ...edge,
          source_type: normalizeGraphType(edge.source_type),
          source_id: normalizeGraphId(edge.source_id),
          target_type: normalizeGraphType(edge.target_type),
          target_id: normalizeGraphId(edge.target_id),
        }))
      );
      setPublications(publicationsResponse.data || []);
      setExpeditions(expeditionsResponse.data || []);
      setMedia(mediaResponse.data || []);



      setLoading(false);

    }



    loadGraph();

  }, []);



  const selectedTopicData = topics.find(

    (topic) => topic.id === selectedTopic

  );


  const edgeConnects = (
    edge: GraphEdge,
    sourceType: string,
    sourceId: string,
    targetType: string,
    targetId: string
  ) =>
    (edge.source_type === normalizeGraphType(sourceType) &&
      edge.source_id === normalizeGraphId(sourceId) &&
      edge.target_type === targetType &&
      edge.target_id === normalizeGraphId(targetId)) ||
    (edge.source_type === normalizeGraphType(targetType) &&
      edge.source_id === normalizeGraphId(targetId) &&
      edge.target_type === normalizeGraphType(sourceType) &&
      edge.target_id === normalizeGraphId(sourceId));

  const resourceIdsForTopic = (topicId: string) =>
    new Set(
      resources
        .filter((resource) =>
          graphEdges.some((edge) =>
            edgeConnects(edge, "topic", topicId, "resource", resource.id)
          )
        )
        .map((resource) => normalizeGraphId(resource.id))
    );

  const selectedResourceIds = selectedTopic
    ? resourceIdsForTopic(selectedTopic)
    : new Set(resources.map((resource) => normalizeGraphId(resource.id)));

  const filteredResources = selectedTopic
    ? resources.filter((resource) =>
        selectedResourceIds.has(normalizeGraphId(resource.id))
      )
    : resources;

  const connectedRecordCount = (recordType: string) => {
    const records =
      recordType === "publication"
        ? publications
        : recordType === "expedition"
          ? expeditions
          : media;
    const recordIds = new Set(
      records.map((record) => normalizeGraphId(record.id))
    );
    const connectedIds = new Set<string>();

    for (const edge of graphEdges) {
      if (
        edge.source_type === "resource" &&
        edge.target_type === recordType &&
        selectedResourceIds.has(edge.source_id) &&
        recordIds.has(edge.target_id)
      ) {
        connectedIds.add(edge.target_id);
      }

      if (
        edge.target_type === "resource" &&
        edge.source_type === recordType &&
        selectedResourceIds.has(edge.target_id) &&
        recordIds.has(edge.source_id)
      ) {
        connectedIds.add(edge.source_id);
      }
    }

    return connectedIds.size;
  };

  const regionTopics = topics.filter((topic) =>
    ["arctic", "antarctica"].includes(topic.slug.toLowerCase())
  );

  const domainTopics = topics.filter((topic) =>
    ["climate", "ocean", "glaciers"].includes(topic.slug.toLowerCase())
  );

  const otherTopics = topics.filter(
    (topic) =>
      !["arctic", "antarctica", "climate", "ocean", "glaciers"].includes(
        topic.slug.toLowerCase()
      )
  );

  const renderTopicCard = (topic: Topic, index: number) => {
    const active = selectedTopic === topic.id;

    const connectedCount = new Set(
      graphEdges.flatMap((edge) => {
        if (edge.source_type === "topic" && edge.source_id === topic.id) {
          return [`${edge.target_type}:${edge.target_id}`];
        }
        if (edge.target_type === "topic" && edge.target_id === topic.id) {
          return [`${edge.source_type}:${edge.source_id}`];
        }
        return [];
      })
    ).size;

    return (
      <Reveal key={topic.id} delay={index * 0.06}>
        <button
          type="button"
          onClick={() => setSelectedTopic(active ? null : topic.id)}
          className="group w-full text-left"
        >
          <div
            className={[
              "h-full rounded-2xl border p-4 transition-all duration-300",
              active
                ? "border-cyan-400/50 bg-cyan-400/[0.09] shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                : "border-white/15 bg-white/[0.035] hover:border-cyan-400/30 hover:bg-white/[0.055]",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-xl border transition",
                  active
                    ? "border-cyan-300/30 bg-cyan-300/15"
                    : "border-white/10 bg-white/[0.04]",
                ].join(" ")}
              >
                <TopicIcon icon={topic.icon} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-white">
                  {topic.name}
                </h3>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {connectedCount}{" "}
                  {connectedCount === 1 ? "connection" : "connections"}
                </p>
              </div>
            </div>

            {topic.description && (
              <p className="mt-3 text-xs leading-5 text-slate-400">
                {topic.description}
              </p>
            )}
          </div>
        </button>
      </Reveal>
    );
  };

  return (
    <main className="theme-page min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
                  Interactive Knowledge
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  Polar Knowledge Graph
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Explore how polar regions, scientific domains, research
                  resources, evidence and mission decisions connect with each
                  other.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Graph Layers
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {loading
                    ? "Loading..."
                    : `${graphEdges.length} connected relationships`}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-10 md:py-12">
        <div className="pointer-events-none absolute left-1/2 top-40 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.035] blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <div className="flex justify-center">
              <GlassCard className="w-full max-w-sm border-white/15 bg-white/[0.06] p-5 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10">
                  <Snowflake className="h-5 w-5 text-sky-300" />
                </div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Layer 0
                </p>
                <h2 className="mt-1 text-base font-semibold">Polar Science</h2>
                <p className="mt-1 text-xs text-slate-500">
                  India&apos;s gateway to polar knowledge
                </p>
              </GlassCard>
            </div>
          </Reveal>

          <LayerConnector label="GEOGRAPHY" />

          <Reveal>
            <LayerShell
              number="01"
              eyebrow="Geography Layer"
              title="Polar Regions"
              description="Start with the physical regions that frame the research context."
            >
              {loading ? (
                <TopicSkeleton count={2} />
              ) : regionTopics.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {regionTopics.map(renderTopicCard)}
                </div>
              ) : (
                <EmptyLayer text="No polar region topics are currently available." />
              )}
            </LayerShell>
          </Reveal>

          <LayerConnector label="SCIENCE" />

          <Reveal>
            <LayerShell
              number="02"
              eyebrow="Scientific Domain Layer"
              title="Scientific Domains"
              description="Connect the polar regions to the scientific processes being studied."
            >
              {loading ? (
                <TopicSkeleton count={3} />
              ) : domainTopics.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {domainTopics.map(renderTopicCard)}
                </div>
              ) : (
                <EmptyLayer text="No scientific domain topics are currently available." />
              )}

              {otherTopics.length > 0 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {otherTopics.map(renderTopicCard)}
                </div>
              )}
            </LayerShell>
          </Reveal>

          <LayerConnector label="RESEARCH" />

          <Reveal>
            <GlassCard className="border-white/15 bg-white/[0.035] p-5 md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Layer 03 · Research Layer
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Knowledge Resources
                  </h2>
                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                    {selectedTopicData
                      ? `Showing resources connected to ${selectedTopicData.name}.`
                      : "Scientific resources connected to the topics above."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Database className="h-3.5 w-3.5" />
                  {loading ? "Loading..." : `${filteredResources.length} resources`}
                </div>
              </div>

              {error ? (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-5">
                  <p className="text-sm font-medium text-red-300">
                    Unable to load the knowledge graph.
                  </p>
                  <p className="mt-1 text-xs text-red-400/70">{error}</p>
                </div>
              ) : loading ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-xl border border-white/10 bg-white/[0.025]"
                    />
                  ))}
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {filteredResources.map((resource) => (
                    <Link
                      key={resource.id}
                      href={`/knowledge?search=${encodeURIComponent(resource.title)}`}
                      className="group rounded-xl border border-white/10 bg-slate-950/40 p-4 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06]">
                          <BookOpen className="h-4 w-4 text-cyan-300" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-medium text-white transition group-hover:text-cyan-300">
                            {resource.title}
                          </h3>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {resource.category ||
                              resource.resource_type ||
                              "Knowledge Resource"}
                          </p>
                          {resource.description && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-white/10 p-6 text-center">
                  <Sparkles className="mx-auto h-5 w-5 text-slate-600" />
                  <p className="mt-2 text-sm text-slate-400">
                    No resources are connected to this topic yet.
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    More scientific relationships can be added from the database.
                  </p>
                </div>
              )}
            </GlassCard>
          </Reveal>

          <LayerConnector label="EVIDENCE" />

          <Reveal>
            <LayerShell
              number="04"
              eyebrow="Evidence Layer"
              title="Research Evidence"
              description="Move from knowledge resources to the observations, missions and scientific outputs they represent."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <EvidenceCard
                  href="/publications"
                  icon={<BookOpen className="h-4 w-4 text-cyan-300" />}
                  title="Publications"
                  count={connectedRecordCount("publication")}
                  text="Connect scientific research with polar topics and documented findings."
                />
                <EvidenceCard
                  href="/expeditions"
                  icon={<FlaskConical className="h-4 w-4 text-cyan-300" />}
                  title="Expeditions"
                  count={connectedRecordCount("expedition")}
                  text="Link field missions to the science they produce and the regions they explore."
                />
                <EvidenceCard
                  href="/media"
                  icon={<ImageIcon className="h-4 w-4 text-cyan-300" />}
                  title="Media"
                  count={connectedRecordCount("media")}
                  text="Connect visual stories and observations with research and discovery."
                />
              </div>
            </LayerShell>
          </Reveal>

          <LayerConnector label="DECISIONS" />

          <Reveal>
            <GlassCard className="border-cyan-400/20 bg-cyan-400/[0.035] p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                      Layer 05 · Mission Intelligence
                    </p>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold">
                    From knowledge to field decisions
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-slate-400 md:text-sm">
                    Knowledge relationships can explain why a field decision
                    matters scientifically. Continue to the Survival Challenge
                    to turn this graph into an interactive mission scenario.
                  </p>
                </div>

                <Link
                  href="/polar-challenge"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Open Survival Challenge
                </Link>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function TopicIcon({ icon }: { icon: string | null }) {
  const className = "h-4 w-4 text-cyan-300";

  switch (icon) {
    case "cloud":
      return <Cloud className={className} />;
    case "waves":
      return <Waves className={className} />;
    case "mountain":
      return <Mountain className={className} />;
    case "snowflake":
    default:
      return <Snowflake className={className} />;
  }
}

function LayerConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="h-5 w-px bg-gradient-to-b from-cyan-400/40 to-white/10" />
      <div className="flex items-center gap-2 py-1">
        <ArrowDown className="h-4 w-4 text-cyan-400/60" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-600">
          {label}
        </span>
        <ArrowDown className="h-4 w-4 text-cyan-400/60" />
      </div>
      <div className="h-5 w-px bg-gradient-to-b from-white/10 to-cyan-400/40" />
    </div>
  );
}

function LayerShell({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <GlassCard className="border-white/15 bg-white/[0.035] p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Layer {number} · {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-cyan-300">
          {number}
        </div>
      </div>
      {children}
    </GlassCard>
  );
}

function TopicSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
        />
      ))}
    </div>
  );
}

function EmptyLayer({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
      <Sparkles className="mx-auto h-5 w-5 text-slate-600" />
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  );
}

function EvidenceCard({
  href,
  icon,
  title,
  count,
  text,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  count: number;
  text: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06]">
          {icon}
        </div>
        <h3 className="mt-3 text-sm font-semibold text-white transition group-hover:text-cyan-300">
          {title}
        </h3>
        <p className="mt-1 text-xs font-semibold text-cyan-300">
          {count} connected records
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
      </div>
    </Link>
  );
}
