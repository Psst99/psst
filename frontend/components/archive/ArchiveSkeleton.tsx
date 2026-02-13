export default function ArchiveSkeleton() {
  return (
    <div className="p-6 rounded-md max-w-4xl mx-auto animate-pulse">
      <div className="h-10 bg-[color:var(--section-accent)]/30 rounded w-1/2 mx-auto mb-6" />
      <div className="h-6 bg-[color:var(--section-accent)]/20 rounded mb-8" />
      <div className="bg-[color:var(--section-accent)]/30 p-4 rounded-3xl mb-8 h-32" />
      <div className="h-6 bg-[color:var(--section-accent)]/20 rounded mb-8" />
      <div className="bg-[color:var(--section-accent)]/30 p-4 rounded-3xl mb-8 h-16" />
    </div>
  )
}
