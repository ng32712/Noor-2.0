import { useApp } from "../lib/core";
import { surahMeta } from "../data/quran";
import { PremiumCard, StatCard, XPBadge, StreakBadge, AchievementCard, ProgressBar, Badge } from "../components/premium";
import { Icon } from "../components/ui";
import { todayActivity, memorizedCount, streak, reviewQueue, last7Days } from "../lib/core";

export function PremiumDashboard() {
  const { user, data } = useApp();
  if (!user || !data) return null;

  const today = todayActivity(data);
  const mem = memorizedCount(data);
  const st = streak(data);
  const q = reviewQueue(data);
  const week = last7Days(data);
  const maxWeek = Math.max(1, ...week.map((d) => d.count));
  const last = data.lastRead ?? { s: data.goals.targetSurah, a: 1 };
  const lastMeta = surahMeta(last.s);
  const firstName = user.name.split(" ")[0];
  const g = data.gamification;

  // Get unlocked and locked achievements
  const unlockedAchievements = g.achievements.filter(a => a.unlockedAt);
  const lockedAchievements = g.achievements.filter(a => !a.unlockedAt).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 animate-fade-in">
      {/* Header with greeting */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">
          Assalamu Alaikum, {firstName} 👋
        </h1>
        <p className="text-ink/60">Continue your journey with the Qur'an</p>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <XPBadge xp={g.xp} level={g.level} />
        <StreakBadge days={g.streak} longest={g.longestStreak} />
        <div className="col-span-2 md:col-span-2">
          <div className="card-soft p-5 h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-ink/60">Today's Goal</div>
              <Badge variant="info">{today.read + today.practiced} / {today.read + today.practiced >= today.goal ? "✓" : today.goal}</Badge>
            </div>
            <ProgressBar
              value={today.read + today.practiced}
              max={today.goal}
              color="forest"
              size="md"
            />
            <div className="flex gap-2 mt-3">
              <a href="#/app/quran" className="flex-1">
                <button className="w-full bg-forest text-white rounded-lg py-2 text-sm font-semibold hover:bg-forest-soft transition-colors">
                  Read Qur'an
                </button>
              </a>
              <a href="#/app/memorize" className="flex-1">
                <button className="w-full bg-sun text-ink rounded-lg py-2 text-sm font-semibold hover:bg-sun-deep transition-colors">
                  Memorize
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <PremiumCard className="h-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-ink/60 mb-1">Continue Learning</div>
                <h2 className="text-2xl font-bold text-ink">Surah {lastMeta.name}</h2>
                <p className="text-sm text-ink/60 mt-1">
                  Ayah {last.a} · {lastMeta.meaning}
                </p>
              </div>
              <div className="bg-forest/5 p-3 rounded-xl">
                <Icon name="book" className="w-6 h-6 text-forest" />
              </div>
            </div>
            <div className="bg-cream rounded-xl p-4 mb-4">
              <p dir="rtl" lang="ar" className="font-quran text-xl text-right leading-relaxed">
                {lastMeta.arabic}
              </p>
            </div>
            <div className="flex gap-3">
              <a href={`#/app/quran/${last.s}/${last.a}`} className="flex-1">
                <button className="w-full bg-forest text-white rounded-xl py-3 font-semibold hover:bg-forest-soft transition-colors flex items-center justify-center gap-2">
                  <Icon name="play" className="w-4 h-4" />
                  Continue Reading
                </button>
              </a>
              <a href={`#/app/practice/${last.s}/${last.a}`} className="flex-1">
                <button className="w-full bg-white border-2 border-forest/10 text-forest rounded-xl py-3 font-semibold hover:border-forest/20 transition-colors flex items-center justify-center gap-2">
                  <Icon name="mic" className="w-4 h-4" />
                  Practice
                </button>
              </a>
            </div>
          </PremiumCard>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <StatCard
            label="Ayahs Memorized"
            value={mem}
            icon={<Icon name="brain" className="w-5 h-5" />}
            color="lav"
          />
          <StatCard
            label="Needs Review"
            value={q.attention.length}
            icon={<Icon name="refresh" className="w-5 h-5" />}
            color="burg"
          />
          <StatCard
            label="Minutes Today"
            value={Math.round(data.sessions.filter(s => Date.now() - s.ts < 86400000).reduce((sum, s) => sum + (s.durationMs || 0), 0) / 60000)}
            icon={<Icon name="clock" className="w-5 h-5" />}
            color="sun"
          />
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <PremiumCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ink">Weekly Activity</h3>
            <Badge variant="info">{week.reduce((sum, d) => sum + d.count, 0)} touches</Badge>
          </div>
          <div className="flex items-end gap-2 h-32">
            {week.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-forest/5 rounded-lg flex-1 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-forest to-forest-soft rounded-lg transition-all duration-500"
                    style={{ height: `${(d.count / maxWeek) * 100}%`, minHeight: d.count ? 8 : 0 }}
                  />
                </div>
                <span className="text-xs font-medium text-ink/60">{d.label}</span>
              </div>
            ))}
          </div>
        </PremiumCard>

        {/* Achievements */}
        <PremiumCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ink">Achievements</h3>
            <Badge variant="success">{unlockedAchievements.length} / {g.achievements.length}</Badge>
          </div>
          <div className="space-y-3">
            {unlockedAchievements.slice(0, 2).map((ach) => (
              <AchievementCard
                key={ach.id}
                icon={ach.icon}
                name={ach.name}
                description={ach.description}
                unlocked={true}
              />
            ))}
            {lockedAchievements.slice(0, 1).map((ach) => (
              <AchievementCard
                key={ach.id}
                icon={ach.icon}
                name={ach.name}
                description={ach.description}
                unlocked={false}
                progress={ach.progress}
              />
            ))}
          </div>
          <a href="#/app/progress" className="block text-center mt-4 text-sm font-semibold text-forest hover:text-forest-soft transition-colors">
            View all achievements →
          </a>
        </PremiumCard>
      </div>

      {/* Review Queue */}
      {q.attention.length > 0 && (
        <PremiumCard className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-ink">Needs Your Attention</h3>
              <p className="text-sm text-ink/60 mt-1">These ayahs need review to maintain your progress</p>
            </div>
            <a href="#/app/review">
              <button className="bg-burg text-white rounded-xl px-6 py-3 font-semibold hover:bg-burg-deep transition-colors flex items-center gap-2">
                <Icon name="refresh" className="w-4 h-4" />
                Start Review
              </button>
            </a>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {q.attention.slice(0, 3).map((item) => {
              const meta = surahMeta(item.s);
              return (
                <a
                  key={`${item.s}:${item.a}`}
                  href={`#/app/practice/${item.s}/${item.a}/review`}
                  className="card-soft p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-burg bg-burg/10 px-2 py-0.5 rounded-full">
                      {item.rec.strength}% strength
                    </span>
                  </div>
                  <div className="font-semibold text-ink">{meta.name}</div>
                  <div className="text-sm text-ink/60">{item.s}:{item.a}</div>
                </a>
              );
            })}
          </div>
        </PremiumCard>
      )}

      {/* Daily Ayah */}
      <PremiumCard className="bg-gradient-to-br from-forest/5 to-forest/10">
        <div className="flex items-start gap-4">
          <div className="bg-forest p-3 rounded-xl">
            <Icon name="sparkle" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-forest mb-2">Daily Ayah</div>
            <p dir="rtl" lang="ar" className="font-quran text-2xl text-right leading-relaxed mb-3">
              إِنَّ مَعَ الْعُسْرِ يُسْرًا
            </p>
            <p className="text-sm text-ink/70 italic">
              "Indeed, with hardship comes ease."
            </p>
            <p className="text-xs text-ink/50 mt-2">Surah Ash-Sharh (94:6)</p>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}
