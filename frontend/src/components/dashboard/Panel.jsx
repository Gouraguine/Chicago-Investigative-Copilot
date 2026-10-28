function Panel({
  title,
  subtitle,
  children,
  className = "",
}) {

  return (
    <section
      className={`
        rounded-lg
        border border-[#1b2838]
        bg-[#0c131c]
        ${className}
      `}
    >

      <header
        className="
          border-b border-[#172330]
          px-5 py-4
        "
      >

        <h3
          className="
            text-xs
            font-semibold uppercase
            tracking-[0.14em]
            text-slate-300
          "
        >
          {title}
        </h3>


        {subtitle && (

          <p
            className="
              mt-1
              text-[11px]
              text-slate-600
            "
          >
            {subtitle}
          </p>

        )}

      </header>


      <div className="p-5">
        {children}
      </div>

    </section>
  )
}


export default Panel