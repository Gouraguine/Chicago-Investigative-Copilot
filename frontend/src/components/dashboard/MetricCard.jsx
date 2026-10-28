function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  accent = "blue",
}) {

  const accents = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  }


  return (
    <article
      className="
        rounded-lg
        border border-[#1b2838]
        bg-[#0c131c]
        p-5
      "
    >

      <div className="flex items-start justify-between">

        <div>

          <p
            className="
              text-[10px]
              font-medium uppercase
              tracking-[0.16em]
              text-slate-600
            "
          >
            {label}
          </p>


          <p
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-tight
              text-slate-100
            "
          >
            {value}
          </p>

        </div>


        <div
          className={`
            flex h-9 w-9
            items-center justify-center
            rounded-md border
            ${accents[accent]}
          `}
        >

          <Icon
            size={17}
            strokeWidth={1.7}
          />

        </div>

      </div>


      {subtitle && (

        <p
          className="
            mt-3
            text-[11px]
            text-slate-600
          "
        >
          {subtitle}
        </p>

      )}

    </article>
  )
}


export default MetricCard