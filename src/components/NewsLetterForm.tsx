export const NewsletterForm = () => {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <p className="text-sm text-neutral-400">Receba nossas novidades:</p>
      <div className="flex gap-2">
        <input 
          type="email" 
          placeholder="seu-email@exemplo.com" 
          className="bg-[#1b1b1b] border border-white/10 px-3 py-2 rounded-lg text-white outline-none flex-1"
        />
        <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold">
          Ok
        </button>
      </div>
    </form>
  );
};