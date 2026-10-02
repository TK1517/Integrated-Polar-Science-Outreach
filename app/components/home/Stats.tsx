const stats = [
  {
    value: "10+",
    label: "Major Expeditions",
  },
  {
    value: "250+",
    label: "Research Publications",
  },
  {
    value: "500+",
    label: "Knowledge Resources",
  },
  {
    value: "20+",
    label: "Years of Polar Research",
  },
];

export default function Stats() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="px-6 py-10"
          >
            <div className="text-3xl font-semibold tracking-tight text-slate-950">
              {stat.value}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              {stat.label}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}