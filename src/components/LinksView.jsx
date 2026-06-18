import { ExternalLink } from 'lucide-react'

const LINKS = [
  { label: 'Facebook Reels', url: 'https://www.facebook.com/profile.php?id=100086318859195&sk=reels_tab' },
  { label: 'Facebook Reels', url: 'https://www.facebook.com/profile.php?id=61572877183939&sk=reels_tab' },
  { label: 'Dr. Godric Fitness', url: 'https://www.facebook.com/Dr.Godricfitness/reels/' },
]

export function LinksView() {
  return (
    <div className="max-w-xl mx-auto space-y-3">
      {LINKS.map(({ label, url }, i) => (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-white rounded-2xl shadow-card border border-slate-100 px-5 py-4 hover:shadow-card-hover transition-shadow"
        >
          <div className="min-w-0">
            <p className="text-[17px] font-semibold text-slate-800">{label}</p>
            <p className="text-[13px] text-slate-400 truncate mt-0.5">{url}</p>
          </div>
          <ExternalLink size={16} className="shrink-0 ml-3 text-slate-400" />
        </a>
      ))}
    </div>
  )
}
