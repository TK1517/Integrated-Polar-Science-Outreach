"use client";



import { useEffect, useMemo, useState } from "react";

import {

  ArrowRight,

  CheckCircle2,

  ChevronRight,

  CircleAlert,

  Compass,

  FlaskConical,
  Moon,

  RotateCcw,

  Shield,

  Snowflake,
  Sun,

  Target,

  ThermometerSnowflake,

  Wind,

} from "lucide-react";



import { supabase } from "@/lib/supabase/client";



/* -------------------------------------------------------------------------- */

/* Types                                                                      */

/* -------------------------------------------------------------------------- */



type RouteOption = {

  id: string;

  name: string;

  description: string;

  energy: number;

  time: number;

  science: number;

  risk: number;

};



type EquipmentOption = {

  id: string;

  name: string;

  description: string;

  energy: number;

  science: number;

  risk: number;

};



type WeatherOption = {

  id: string;

  name: string;

  description: string;

  time: number;

  energy: number;

  science: number;

  risk: number;

};



type ObjectiveOption = {

  id: string;

  name: string;

  description: string;

  science: number;

  energy: number;

  risk: number;

};



type Stats = {

  energy: number;

  time: number;

  science: number;

  risk: number;

};



type DecisionKnowledge = {

  decision_type: string;

  option_id: string;

  scientific_reason: string;

  field_implication: string;



  topic: {

    name: string;

    slug: string;

  }[];



  resource: {

    id: string;

    title: string;

    slug: string;

  }[];

};



/* -------------------------------------------------------------------------- */

/* Options                                                                    */

/* -------------------------------------------------------------------------- */



const routeOptions: RouteOption[] = [

  {

    id: "safe",

    name: "Safe Route",

    description:

      "Follow a lower-risk path that preserves energy and keeps the expedition stable.",

    energy: -1,

    time: -1,

    science: 0,

    risk: 0,

  },

  {

    id: "research",

    name: "Research Route",

    description:

      "Take a scientifically valuable route with increased exposure to polar environments.",

    energy: -2,

    time: 0,

    science: 10,

    risk: 5,

  },

  {

    id: "extreme",

    name: "Extreme Route",

    description:

      "Enter a challenging field zone to maximize potential scientific observations.",

    energy: -3,

    time: 0,

    science: 20,

    risk: 20,

  },

];



const equipmentOptions: EquipmentOption[] = [

  {

    id: "standard",

    name: "Standard Field Kit",

    description:

      "Basic field equipment for essential observations and routine sampling.",

    energy: -1,

    science: 5,

    risk: 0,

  },

  {

    id: "climate",

    name: "Climate Sensor Kit",

    description:

      "Specialized sensors for collecting structured environmental and climate measurements.",

    energy: -2,

    science: 15,

    risk: 0,

  },

  {

    id: "advanced",

    name: "Advanced Research Suite",

    description:

      "A comprehensive research setup designed to maximize scientific output.",

    energy: -3,

    science: 25,

    risk: 8,

  },

];



const weatherOptions: WeatherOption[] = [

  {

    id: "shelter",

    name: "Take Shelter",

    description:

      "Pause field activity and protect the expedition from worsening conditions.",

    time: -1,

    energy: 0,

    science: 0,

    risk: -5,

  },

  {

    id: "continue",

    name: "Continue Sampling",

    description:

      "Continue observations despite changing weather to capture additional data.",

    time: 0,

    energy: -1,

    science: 15,

    risk: 20,

  },

];



const objectiveOptions: ObjectiveOption[] = [

  {

    id: "ice",

    name: "Ice & Glacier Study",

    description:

      "Investigate surface ice and glacier conditions to understand cryosphere change.",

    science: 20,

    energy: 0,

    risk: 0,

  },

  {

    id: "ocean",

    name: "Ocean Observation",

    description:

      "Study polar ocean conditions and their relationship with the climate system.",

    science: 25,

    energy: 0,

    risk: 5,

  },

  {

    id: "atmosphere",

    name: "Atmospheric Study",

    description:

      "Record atmospheric conditions and investigate polar weather variability.",

    science: 15,

    energy: -1,

    risk: 0,

  },

];



/* -------------------------------------------------------------------------- */

/* Initial state                                                              */

/* -------------------------------------------------------------------------- */



const initialStats: Stats = {

  energy: 10,

  time: 5,

  science: 0,

  risk: 0,

};



/* -------------------------------------------------------------------------- */

/* Main component                                                             */

/* -------------------------------------------------------------------------- */



export default function SurvivalChallengePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);


  const [stage, setStage] = useState(1);



  const [stats, setStats] = useState<Stats>(initialStats);



  const [route, setRoute] = useState("");

  const [selectedEquipment, setSelectedEquipment] = useState("");

  const [weather, setWeather] = useState("");

  const [objective, setObjective] = useState("");



  const [completed, setCompleted] = useState(false);



  const [decisionKnowledge, setDecisionKnowledge] = useState<

    DecisionKnowledge[]

  >([]);



  const [knowledgeLoading, setKnowledgeLoading] = useState(true);

  const [knowledgeError, setKnowledgeError] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("polar-theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      (savedTheme === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    setThemeReady(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("polar-theme", nextTheme ? "dark" : "light");
  };



  /* ------------------------------------------------------------------------ */

  /* Load mission intelligence                                               */

  /* ------------------------------------------------------------------------ */



  useEffect(() => {

    async function loadDecisionKnowledge() {

      setKnowledgeLoading(true);

      setKnowledgeError(false);



      const { data, error } = await supabase

        .from("mission_decision_knowledge")

        .select(`

          decision_type,

          option_id,

          scientific_reason,

          field_implication,

          topic:polar_topics (

            name,

            slug

          ),

          resource:knowledge_resources (

            id,

            title,

            slug

          )

        `);



      if (error) {

        console.error("Failed to load mission intelligence:", error);

        setKnowledgeError(true);

        setKnowledgeLoading(false);

        return;

      }



      const normalizedData: DecisionKnowledge[] = (data ?? []).map(

        (item) => ({

          decision_type: item.decision_type,

          option_id: item.option_id,

          scientific_reason: item.scientific_reason,

          field_implication: item.field_implication,



          topic: Array.isArray(item.topic)

            ? item.topic

            : item.topic

              ? [item.topic]

              : [],



          resource: Array.isArray(item.resource)

            ? item.resource

            : item.resource

              ? [item.resource]

              : [],

        })

      );



      setDecisionKnowledge(normalizedData);

      setKnowledgeLoading(false);

    }



    loadDecisionKnowledge();

  }, []);



  /* ------------------------------------------------------------------------ */

  /* Helpers                                                                  */

  /* ------------------------------------------------------------------------ */



  const applyStats = (changes: Partial<Stats>) => {

    setStats((current) => ({

      energy: Math.max(

        0,

        Math.min(10, current.energy + (changes.energy ?? 0))

      ),

      time: Math.max(0, current.time + (changes.time ?? 0)),

      science: Math.max(0, current.science + (changes.science ?? 0)),

      risk: Math.max(

        0,

        Math.min(100, current.risk + (changes.risk ?? 0))

      ),

    }));

  };



  const getDecisionKnowledge = (

    decisionType: string,

    optionId: string

  ) => {

    return decisionKnowledge.find(

      (item) =>

        item.decision_type === decisionType &&

        item.option_id === optionId

    );

  };



  const getDecisionName = (

    decisionType: string,

    optionId: string

  ) => {

    if (decisionType === "route") {

      return (

        routeOptions.find((option) => option.id === optionId)?.name ??

        optionId

      );

    }



    if (decisionType === "equipment") {

      return (

        equipmentOptions.find((option) => option.id === optionId)?.name ??

        optionId

      );

    }



    if (decisionType === "weather") {

      return (

        weatherOptions.find((option) => option.id === optionId)?.name ??

        optionId

      );

    }



    if (decisionType === "objective") {

      return (

        objectiveOptions.find((option) => option.id === optionId)?.name ??

        optionId

      );

    }



    return optionId;

  };



  /* ------------------------------------------------------------------------ */

  /* Decision handlers                                                        */

  /* ------------------------------------------------------------------------ */



  const chooseRoute = (option: RouteOption) => {

    setRoute(option.id);



    applyStats({

      energy: option.energy,

      time: option.time,

      science: option.science,

      risk: option.risk,

    });



    setStage(2);

  };



  const chooseEquipment = (option: EquipmentOption) => {

    setSelectedEquipment(option.id);



    applyStats({

      energy: option.energy,

      science: option.science,

      risk: option.risk,

    });



    setStage(3);

  };



  const chooseWeather = (option: WeatherOption) => {

    setWeather(option.id);



    applyStats({

      time: option.time,

      energy: option.energy,

      science: option.science,

      risk: option.risk,

    });



    setStage(4);

  };



  const chooseObjective = (option: ObjectiveOption) => {

    setObjective(option.id);



    setStats((current) => ({

      energy: Math.max(0, Math.min(10, current.energy + option.energy)),

      time: current.time,

      science: Math.max(0, current.science + option.science),

      risk: Math.max(

        0,

        Math.min(100, current.risk + option.risk)

      ),

    }));



    setCompleted(true);

  };



  /* ------------------------------------------------------------------------ */

  /* Restart                                                                  */

  /* ------------------------------------------------------------------------ */



  const restartMission = () => {

    setStage(1);

    setStats(initialStats);



    setRoute("");

    setSelectedEquipment("");

    setWeather("");

    setObjective("");



    setCompleted(false);



    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };



  /* ------------------------------------------------------------------------ */

  /* Grade                                                                    */

  /* ------------------------------------------------------------------------ */



  const grade = useMemo(() => {

    if (stats.energy <= 0 || stats.risk >= 70) {

      return {

        grade: "D",

        title: "Mission Compromised",

        description:

          "The mission generated useful observations, but operational conditions became too demanding.",

      };

    }



    if (stats.science >= 70 && stats.risk <= 35) {

      return {

        grade: "A",

        title: "Exceptional Mission",

        description:

          "The expedition achieved strong scientific value while maintaining controlled operational risk.",

      };

    }



    if (stats.science >= 50 && stats.risk <= 50) {

      return {

        grade: "B",

        title: "Successful Mission",

        description:

          "The expedition produced meaningful scientific observations with manageable operational risk.",

      };

    }



    return {

      grade: "C",

      title: "Partial Success",

      description:

        "The expedition completed its objective but there is room to improve scientific efficiency.",

    };

  }, [stats]);



  /* ------------------------------------------------------------------------ */

  /* Findings                                                                 */

  /* ------------------------------------------------------------------------ */



  const findings = useMemo(() => {

    if (objective === "ice") {

      return [

        "Surface ice and glacier conditions were documented.",

        "Observations can support comparison of cryosphere conditions over time.",

        "The mission contributes baseline information for understanding polar environmental change.",

      ];

    }



    if (objective === "ocean") {

      return [

        "Polar ocean conditions were observed during the mission.",

        "The observations contribute to understanding ocean–climate interactions.",

        "The collected information can support future studies of marine environmental change.",

      ];

    }



    if (objective === "atmosphere") {

      return [

        "Atmospheric conditions were recorded during the expedition.",

        "The observations provide information about polar weather variability.",

        "Repeated observations can help identify environmental and climate trends.",

      ];

    }



    return [];

  }, [objective]);



  /* ------------------------------------------------------------------------ */

  /* Recommendation                                                           */

  /* ------------------------------------------------------------------------ */



  const recommendation = useMemo(() => {

    if (stats.risk >= 50) {

      return {

        title: "Reduce Hazardous Exposure",

        text:

          "Future missions should consider safer routes or shelter decisions when operational risk begins to rise significantly.",

      };

    }



    if (stats.energy <= 2) {

      return {

        title: "Reserve More Mission Energy",

        text:

          "The expedition consumed a large portion of its available energy. Future planning should balance advanced equipment with longer operational endurance.",

      };

    }



    if (stats.science >= 70) {

      return {

        title: "Strategy Suitable for High-Value Research",

        text:

          "The selected strategy achieved a strong scientific return while maintaining an acceptable level of operational risk.",

      };

    }



    return {

      title: "Increase Scientific Value",

      text:

        "Future missions could increase scientific output by selecting specialized equipment or higher-value research zones.",

    };

  }, [stats]);



  /* ------------------------------------------------------------------------ */

  /* Progress                                                                 */

  /* ------------------------------------------------------------------------ */



  const progress = completed ? 100 : ((stage - 1) / 4) * 100;



  /* ------------------------------------------------------------------------ */

  /* Render                                                                   */

  /* ------------------------------------------------------------------------ */



  return (

    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">

      {/* Header */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">

                <Compass className="h-5 w-5" />

              </div>



              <div>

                <p className="text-sm font-semibold text-slate-950 dark:text-white">

                  Polar Mission Challenge

                </p>



                <p className="text-xs text-slate-500 dark:text-slate-400">

                  Interactive field simulation

                </p>

              </div>

            </div>

          </div>



          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">

            <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">

              Mission Progress

            </p>



            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">

              {completed ? "Complete" : `Stage ${stage} of 4`}

            </p>

          </div>

            </div>

            {themeReady && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  darkMode
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                title={
                  darkMode
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <div className="h-1 bg-slate-100 dark:bg-slate-900">

          <div

            className="h-full bg-slate-950 transition-all duration-500 dark:bg-cyan-400"

            style={{ width: `${progress}%` }}

          />

        </div>

      </header>



      {/* Main */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Intro */}

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">

              <Snowflake className="h-3.5 w-3.5" />

              Polar Field Simulation

            </div>



            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">

              Can you complete a successful polar expedition?

            </h1>



            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">

              Make a sequence of field decisions while balancing scientific

              value, energy, time and operational risk.

            </p>

          </div>

        </section>



        {/* Stats */}

        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <Stat

            label="Energy"

            value={stats.energy}

            max={10}

            icon={<FlaskConical className="h-4 w-4" />}

          />



          <Stat

            label="Time"

            value={stats.time}

            max={5}

            icon={<Target className="h-4 w-4" />}

          />



          <Stat

            label="Science"

            value={stats.science}

            icon={<Snowflake className="h-4 w-4" />}

          />



          <Stat

            label="Risk"

            value={stats.risk}

            icon={<CircleAlert className="h-4 w-4" />}

          />

        </section>



        {!completed ? (

          <>

            {/* Stage 1 */}

            {stage === 1 && (

              <DecisionCard

                number="01"

                eyebrow="Route Selection"

                title="Choose your field route"

                description="Your route determines the balance between operational safety and scientific opportunity."

                icon={<Compass className="h-5 w-5" />}

              >

                <div className="grid gap-4 md:grid-cols-3">

                  {routeOptions.map((option) => (

                    <ChoiceCard

                      key={option.id}

                      title={option.name}

                      description={option.description}

                      onClick={() => chooseRoute(option)}

                      stats={[

                        {

                          label: "Energy",

                          value: option.energy,

                        },

                        {

                          label: "Science",

                          value: option.science,

                        },

                        {

                          label: "Risk",

                          value: option.risk,

                        },

                      ]}

                    />

                  ))}

                </div>

              </DecisionCard>

            )}



            {/* Stage 2 */}

            {stage === 2 && (

              <DecisionCard

                number="02"

                eyebrow="Equipment Selection"

                title="Choose your research equipment"

                description="Specialized equipment can increase scientific output, but advanced systems consume more mission energy."

                icon={<FlaskConical className="h-5 w-5" />}

              >

                <div className="grid gap-4 md:grid-cols-3">

                  {equipmentOptions.map((option) => (

                    <ChoiceCard

                      key={option.id}

                      title={option.name}

                      description={option.description}

                      onClick={() => chooseEquipment(option)}

                      stats={[

                        {

                          label: "Energy",

                          value: option.energy,

                        },

                        {

                          label: "Science",

                          value: option.science,

                        },

                        {

                          label: "Risk",

                          value: option.risk,

                        },

                      ]}

                    />

                  ))}

                </div>

              </DecisionCard>

            )}



            {/* Stage 3 */}

            {stage === 3 && (

              <DecisionCard

                number="03"

                eyebrow="Weather Decision"

                title="A weather system is approaching"

                description="Conditions are changing. Decide whether to protect the team or continue collecting observations."

                icon={<Wind className="h-5 w-5" />}

              >

                <div className="grid gap-4 md:grid-cols-2">

                  {weatherOptions.map((option) => (

                    <ChoiceCard

                      key={option.id}

                      title={option.name}

                      description={option.description}

                      onClick={() => chooseWeather(option)}

                      stats={[

                        {

                          label: "Time",

                          value: option.time,

                        },

                        {

                          label: "Energy",

                          value: option.energy,

                        },

                        {

                          label: "Science",

                          value: option.science,

                        },

                        {

                          label: "Risk",

                          value: option.risk,

                        },

                      ]}

                    />

                  ))}

                </div>

              </DecisionCard>

            )}



            {/* Stage 4 */}

            {stage === 4 && (

              <DecisionCard

                number="04"

                eyebrow="Research Objective"

                title="Select your primary scientific objective"

                description="Your final objective determines the scientific focus of the expedition."

                icon={<Target className="h-5 w-5" />}

              >

                <div className="grid gap-4 md:grid-cols-3">

                  {objectiveOptions.map((option) => (

                    <ChoiceCard

                      key={option.id}

                      title={option.name}

                      description={option.description}

                      onClick={() => chooseObjective(option)}

                      stats={[

                        {

                          label: "Science",

                          value: option.science,

                        },

                        {

                          label: "Energy",

                          value: option.energy,

                        },

                        {

                          label: "Risk",

                          value: option.risk,

                        },

                      ]}

                    />

                  ))}

                </div>

              </DecisionCard>

            )}

          </>

        ) : (

          <>

            {/* Mission Complete */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

              <div className="bg-slate-950 p-7 text-white dark:bg-slate-900 sm:p-10">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white dark:bg-cyan-400/10 dark:text-cyan-300">

                      <CheckCircle2 className="h-4 w-4" />

                      Expedition Complete

                    </div>



                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

                      Mission Complete

                    </h2>



                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 dark:text-slate-400">

                      {grade.description}

                    </p>

                  </div>



                  <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-3xl bg-white text-slate-950 dark:bg-cyan-400 dark:text-slate-950">

                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-800">

                      Grade

                    </span>



                    <span className="text-4xl font-bold">

                      {grade.grade}

                    </span>

                  </div>

                </div>

              </div>



              {/* Final stats */}

              <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 sm:grid-cols-4">

                <ResultStat

                  label="Energy Remaining"

                  value={stats.energy}

                />



                <ResultStat

                  label="Time Remaining"

                  value={stats.time}

                />



                <ResultStat

                  label="Scientific Value"

                  value={stats.science}

                />



                <ResultStat

                  label="Operational Risk"

                  value={`${stats.risk}%`}

                />

              </div>

            </section>



            {/* Expedition summary */}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

              <div className="mb-6">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">

                  Expedition Summary

                </p>



                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">

                  Your mission decisions

                </h2>

              </div>



              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <SummaryItem

                  label="Route"

                  value={getDecisionName("route", route)}

                  icon={<Compass className="h-4 w-4" />}

                />



                <SummaryItem

                  label="Equipment"

                  value={getDecisionName(

                    "equipment",

                    selectedEquipment

                  )}

                  icon={<FlaskConical className="h-4 w-4" />}

                />



                <SummaryItem

                  label="Weather"

                  value={getDecisionName("weather", weather)}

                  icon={<ThermometerSnowflake className="h-4 w-4" />}

                />



                <SummaryItem

                  label="Objective"

                  value={getDecisionName("objective", objective)}

                  icon={<Target className="h-4 w-4" />}

                />

              </div>

            </section>



            {/* Scientific findings */}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

              <div className="mb-6">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">

                  Scientific Output

                </p>



                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">

                  Scientific Findings

                </h2>



                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">

                  Based on the research objective selected during the

                  expedition.

                </p>

              </div>



              <div className="grid gap-3">

                {findings.map((finding, index) => (

                  <div

                    key={finding}

                    className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70"

                  >

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white dark:bg-cyan-400 dark:text-slate-950">

                      {index + 1}

                    </div>



                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">

                      {finding}

                    </p>

                  </div>

                ))}

              </div>

            </section>



            {/* Mission Intelligence */}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

              <div className="mb-6">

                <div className="flex flex-wrap items-center gap-3">

                  <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">

                    <FlaskConical className="h-3.5 w-3.5" />

                    Knowledge Graph Connected

                  </span>



                  {knowledgeLoading && (

                    <span className="text-xs text-slate-400 dark:text-slate-500">

                      Loading scientific intelligence...

                    </span>

                  )}

                </div>



                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">

                  Decision Analysis

                </h2>



                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">

                  Each mission decision is connected to polar science

                  knowledge. This explains why the choice matters

                  scientifically and what it means for field operations.

                </p>

              </div>



              {knowledgeError ? (

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/30">

                  <div className="flex gap-3">

                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />



                    <div>

                      <p className="font-semibold text-amber-900 dark:text-amber-300">

                        Mission intelligence unavailable

                      </p>



                      <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-400">

                        The mission was completed successfully, but the

                        scientific knowledge connections could not be loaded.

                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="space-y-4">

                  {[

                    {

                      type: "route",

                      id: route,

                      label: "Route Decision",

                      icon: <Compass className="h-5 w-5" />,

                    },

                    {

                      type: "equipment",

                      id: selectedEquipment,

                      label: "Equipment Decision",

                      icon: <FlaskConical className="h-5 w-5" />,

                    },

                    {

                      type: "weather",

                      id: weather,

                      label: "Weather Decision",

                      icon: <Wind className="h-5 w-5" />,

                    },

                    {

                      type: "objective",

                      id: objective,

                      label: "Research Objective",

                      icon: <Target className="h-5 w-5" />,

                    },

                  ].map((decision) => {

                    const intelligence = getDecisionKnowledge(

                      decision.type,

                      decision.id

                    );



                    return (

                      <div

                        key={`${decision.type}-${decision.id}`}

                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/60"

                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">

                              {decision.icon}

                            </div>



                            <div>

                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">

                                {decision.label}

                              </p>



                              <h3 className="mt-1 text-base font-semibold text-slate-950 dark:text-white">

                                {getDecisionName(

                                  decision.type,

                                  decision.id

                                )}

                              </h3>

                            </div>

                          </div>



                          {intelligence?.topic?.[0] && (

                            <span className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/50 dark:text-cyan-300">

                              {intelligence.topic[0].name}

                            </span>

                          )}

                        </div>



                        {intelligence ? (

                          <>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">

                              <AnalysisRow

                                title="Why this matters scientifically"

                                text={intelligence.scientific_reason}

                              />



                              <AnalysisRow

                                title="Field implication"

                                text={intelligence.field_implication}

                              />

                            </div>



                            {intelligence.resource?.[0] && (

                              <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/30 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">

                                    Connected Knowledge

                                  </p>



                                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">

                                    {intelligence.resource[0].title}

                                  </p>



                                  {intelligence.topic?.[0] && (

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

                                      Topic: {intelligence.topic[0].name}

                                    </p>

                                  )}

                                </div>



                                <a

                                  href={`/knowledge?search=${encodeURIComponent(

                                    intelligence.resource[0].title

                                  )}`}

                                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"

                                >

                                  Explore Knowledge

                                  <ArrowRight className="h-4 w-4" />

                                </a>

                              </div>

                            )}

                          </>

                        ) : (

                          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">

                            Scientific intelligence is not available for

                            this decision.

                          </div>

                        )}

                      </div>

                    );

                  })}

                </div>

              )}

            </section>



            {/* Recommendation */}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950">

                  <Shield className="h-5 w-5" />

                </div>



                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">

                    Field Recommendation

                  </p>



                  <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">

                    {recommendation.title}

                  </h2>



                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">

                    {recommendation.text}

                  </p>

                </div>

              </div>

            </section>



            {/* Field report */}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

              <div className="mb-6">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">

                  Expedition Record

                </p>



                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">

                  Field Report

                </h2>

              </div>



              <div className="grid gap-4 md:grid-cols-2">

                <MiniStat

                  label="Mission Outcome"

                  value={grade.title}

                />



                <MiniStat

                  label="Primary Objective"

                  value={getDecisionName(

                    "objective",

                    objective

                  )}

                />



                <MiniStat

                  label="Scientific Value"

                  value={`${stats.science} points`}

                />



                <MiniStat

                  label="Operational Risk"

                  value={`${stats.risk}%`}

                />

              </div>



              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">

                <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">

                  The expedition selected{" "}

                  <strong className="text-slate-950 dark:text-white">

                    {getDecisionName("route", route)}

                  </strong>{" "}

                  and deployed the{" "}

                  <strong className="text-slate-950 dark:text-white">

                    {getDecisionName(

                      "equipment",

                      selectedEquipment

                    )}

                  </strong>

                  . During the weather stage, the team chose{" "}

                  <strong className="text-slate-950 dark:text-white">

                    {getDecisionName("weather", weather)}

                  </strong>{" "}

                  before completing the{" "}

                  <strong className="text-slate-950 dark:text-white">

                    {getDecisionName("objective", objective)}

                  </strong>

                  .

                </p>

              </div>

            </section>



            {/* Restart */}

            <div className="mt-8 flex justify-center">

              <button

                type="button"

                onClick={restartMission}

                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"

              >

                <RotateCcw className="h-4 w-4" />

                Run Another Mission

              </button>

            </div>

          </>

        )}

      </div>

    </main>

  );

}



/* -------------------------------------------------------------------------- */

/* Components                                                                 */

/* -------------------------------------------------------------------------- */



function Stat({

  label,

  value,

  max,

  icon,

}: {

  label: string;

  value: number;

  max?: number;

  icon: React.ReactNode;

}) {

  const percentage =

    max !== undefined

      ? Math.min(100, Math.max(0, (value / max) * 100))

      : Math.min(100, value);



  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">

            {icon}

          </div>



          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">

            {label}

          </span>

        </div>



        <span className="text-lg font-bold text-slate-950 dark:text-white">

          {value}

        </span>

      </div>



      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

        <div

          className="h-full rounded-full bg-slate-950 transition-all duration-500 dark:bg-cyan-400"

          style={{ width: `${percentage}%` }}

        />

      </div>

    </div>

  );

}



function DecisionCard({

  number,

  eyebrow,

  title,

  description,

  icon,

  children,

}: {

  number: string;

  eyebrow: string;

  title: string;

  description: string;

  icon: React.ReactNode;

  children: React.ReactNode;

}) {

  return (

    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950">

          {icon}

        </div>



        <div>

          <div className="flex items-center gap-3">

            <span className="text-xs font-bold tracking-wider text-cyan-600 dark:text-cyan-400">

              DECISION {number}

            </span>



            <span className="h-px w-8 bg-slate-200 dark:bg-slate-700" />



            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">

              {eyebrow}

            </span>

          </div>



          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">

            {title}

          </h2>



          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">

            {description}

          </p>

        </div>

      </div>



      {children}

    </section>

  );

}



function ChoiceCard({

  title,

  description,

  onClick,

  stats,

}: {

  title: string;

  description: string;

  onClick: () => void;

  stats: {

    label: string;

    value: number;

  }[];

}) {

  return (

    <button

      type="button"

      onClick={onClick}

      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:shadow-black/20"

    >

      <div className="flex items-start justify-between gap-3">

        <h3 className="font-semibold text-slate-950 dark:text-white">

          {title}

        </h3>



        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-950 group-hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-cyan-400 dark:group-hover:text-slate-950">

          <ChevronRight className="h-4 w-4" />

        </div>

      </div>



      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">

        {description}

      </p>



      <div className="mt-5 flex flex-wrap gap-2">

        {stats.map((stat) => (

          <MiniStat

            key={stat.label}

            label={stat.label}

            value={formatChange(stat.value)}

          />

        ))}

      </div>

    </button>

  );

}



function MiniStat({

  label,

  value,

}: {

  label: string;

  value: string | number;

}) {

  return (

    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">

        {label}

      </p>



      <p className="mt-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">

        {value}

      </p>

    </div>

  );

}



function ResultStat({

  label,

  value,

}: {

  label: string;

  value: string | number;

}) {

  return (

    <div className="border-b border-slate-200 p-5 last:border-b-0 dark:border-slate-800 sm:border-b-0 sm:border-r sm:last:border-r-0">

      <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">

        {label}

      </p>



      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">

        {value}

      </p>

    </div>

  );

}



function SummaryItem({

  label,

  value,

  icon,

}: {

  label: string;

  value: string;

  icon: React.ReactNode;

}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">

      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">

        {icon}



        <span className="text-xs font-semibold uppercase tracking-wider">

          {label}

        </span>

      </div>



      <p className="mt-3 text-sm font-semibold leading-5 text-slate-950 dark:text-white">

        {value}

      </p>

    </div>

  );

}



function AnalysisRow({

  title,

  text,

}: {

  title: string;

  text: string;

}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">

        {title}

      </p>



      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">

        {text}

      </p>

    </div>

  );

}



function formatChange(value: number) {

  if (value > 0) {

    return `+${value}`;

  }



  return `${value}`;

}
