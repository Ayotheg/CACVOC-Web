function LiveDot() {
  return (
    <span aria-hidden="true" className="relative flex size-5 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-coral-500/40 motion-safe:animate-pulse" />
      <span className="relative size-2.5 rounded-full bg-coral-500" />
    </span>
  )
}

export default LiveDot
