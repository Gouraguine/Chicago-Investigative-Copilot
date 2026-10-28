function StatusBadge({ level }) {

  const styles = {
    HIGH: `
      border-red-500/20
      bg-red-500/10
      text-red-400
    `,

    MEDIUM: `
      border-amber-500/20
      bg-amber-500/10
      text-amber-400
    `,

    LOW: `
      border-emerald-500/20
      bg-emerald-500/10
      text-emerald-400
    `,
  }


  return (
    <span
      className={`
        inline-flex
        rounded
        border
        px-2 py-1
        text-[9px]
        font-semibold
        tracking-[0.12em]
        ${styles[level] || styles.LOW}
      `}
    >
      {level}
    </span>
  )
}


export default StatusBadge