/* Stand-in for pages that are not built yet, including the 404. */
function Placeholder({ title }) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <h1 className="type-h1 text-center text-heading">{title}</h1>
    </section>
  )
}

export default Placeholder
