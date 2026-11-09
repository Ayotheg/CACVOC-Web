/* A field people never see or reach, named "website". Spam bots fill in every field; when this one
   arrives filled, the server quietly drops the submission. */
function BotTrap() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}

export default BotTrap
