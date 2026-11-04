/* The navy band that opens each homepage section. It sticks under the fixed navbar until
   its section ends, when the next section's tape takes over. Its parent must be the section,
   with no overflow set on it, or the sticking stops working.
   Decorative: each section still needs its own real heading. */
function SectionTape({ children }) {
  return (
    <div
      aria-hidden="true"
      className="sticky top-17 z-20 h-16 overflow-hidden bg-bg-dark lg:h-22 xl:top-18"
    >
      <div className="mx-auto max-w-300 px-5 pt-4.5 md:px-10 lg:pt-6">
        <span className="block font-accent text-[96px] leading-19 font-extrabold tracking-[-0.045em] whitespace-nowrap text-blue-800 select-none lg:text-[140px] lg:leading-26">
          {children}
        </span>
      </div>
    </div>
  )
}

export default SectionTape
