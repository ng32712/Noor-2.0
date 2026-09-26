import { PremiumCard, GlassCard, PremiumButton } from "../components/premium";
import { Icon } from "../components/ui";

export function PremiumLandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-soft to-forest-deep text-white">
        <div className="absolute inset-0 pattern-islamic opacity-10" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-sun rounded-full animate-pulse" />
                <span className="text-sm font-medium">Your personal Qur'an learning journey</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Learn Qur'an.<br />
                Build Consistency.<br />
                <span className="text-sun">Grow with Noor.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                Read, understand, memorize, and practice the Qur'an with AI-powered recitation tracking, personalized learning paths, and beautiful progress visualization.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#/register">
                  <PremiumButton variant="primary" size="lg" className="bg-sun text-ink hover:bg-sun-deep">
                    Start Learning
                    <Icon name="arrowR" className="w-5 h-5" />
                  </PremiumButton>
                </a>
                <a href="#/quran">
                  <PremiumButton variant="secondary" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    Explore Qur'an
                  </PremiumButton>
                </a>
              </div>
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold">6,236</div>
                  <div className="text-sm text-white/60">Ayahs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">114</div>
                  <div className="text-sm text-white/60">Surahs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-white/60">Verified</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <GlassCard dark className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sun/20 rounded-2xl mb-4">
                    <Icon name="moon" className="w-8 h-8 text-sun" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Daily Progress</h3>
                  <p className="text-white/60 text-sm">Track your learning journey</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Today's Goal</span>
                      <span className="text-xs bg-sun/20 text-sun px-2 py-0.5 rounded-full">8/10</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-sun h-2 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold">7</div>
                      <div className="text-xs text-white/60">Day Streak</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-xs text-white/60">Memorized</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Everything you need to learn the Qur'an
            </h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto">
              A complete learning platform designed to help you read, understand, memorize, and practice the Qur'an with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <PremiumCard hover className="group">
              <div className="bg-forest/5 p-3 rounded-xl w-fit mb-4 group-hover:bg-forest/10 transition-colors">
                <Icon name="book" className="w-6 h-6 text-forest" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Beautiful Qur'an Reader</h3>
              <p className="text-ink/60 mb-4">
                Read the complete Qur'an with beautiful Arabic typography, translations, transliterations, and audio playback from renowned reciters.
              </p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Full 114 surahs with verified text
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Multiple reciters and playback speeds
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Bookmarks, notes, and highlights
                </li>
              </ul>
            </PremiumCard>

            {/* Feature 2 */}
            <PremiumCard hover className="group">
              <div className="bg-lav/20 p-3 rounded-xl w-fit mb-4 group-hover:bg-lav/30 transition-colors">
                <Icon name="brain" className="w-6 h-6 text-lav-deep" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Smart Memorization</h3>
              <p className="text-ink/60 mb-4">
                Memorize the Qur'an with spaced repetition, hidden-ayah testing, and intelligent review scheduling based on your progress.
              </p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Spaced repetition algorithm
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Hidden-ayah memorization mode
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Smart review queue
                </li>
              </ul>
            </PremiumCard>

            {/* Feature 3 */}
            <PremiumCard hover className="group">
              <div className="bg-blush/20 p-3 rounded-xl w-fit mb-4 group-hover:bg-blush/30 transition-colors">
                <Icon name="mic" className="w-6 h-6 text-burg" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">AI Recitation Practice</h3>
              <p className="text-ink/60 mb-4">
                Practice your recitation with real-time speech recognition that tracks every word and provides instant feedback on your pronunciation.
              </p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Real-time word tracking
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Live audio visualization
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Detailed feedback on each word
                </li>
              </ul>
            </PremiumCard>

            {/* Feature 4 */}
            <PremiumCard hover className="group">
              <div className="bg-sun/15 p-3 rounded-xl w-fit mb-4 group-hover:bg-sun/25 transition-colors">
                <Icon name="sparkle" className="w-6 h-6 text-sun-deep" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Tajweed Academy</h3>
              <p className="text-ink/60 mb-4">
                Learn tajweed rules with interactive lessons, examples from the Qur'an, audio demonstrations, and quizzes to test your knowledge.
              </p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  10 comprehensive tajweed lessons
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Real Qur'anic examples
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Interactive quizzes
                </li>
              </ul>
            </PremiumCard>

            {/* Feature 5 */}
            <PremiumCard hover className="group">
              <div className="bg-sage/15 p-3 rounded-xl w-fit mb-4 group-hover:bg-sage/25 transition-colors">
                <Icon name="chart" className="w-6 h-6 text-sage" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Progress Tracking</h3>
              <p className="text-ink/60 mb-4">
                Track your learning journey with beautiful analytics, XP system, achievements, streaks, and detailed progress visualization.
              </p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  XP and leveling system
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Achievement badges
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Weekly activity charts
                </li>
              </ul>
            </PremiumCard>

            {/* Feature 6 */}
            <PremiumCard hover className="group">
              <div className="bg-burg/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-burg/20 transition-colors">
                <Icon name="shield" className="w-6 h-6 text-burg" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Verified & Trustworthy</h3>
              <p className="text-ink/60 mb-4">
                All Qur'anic text comes from a validated dataset. AI never generates or modifies Qur'anic text. Your data is private and secure.
              </p>
              <ul className="space-y-2 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Verified Qur'anic text only
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Private, isolated user data
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-sage" />
                  Works offline
                </li>
              </ul>
            </PremiumCard>
          </div>
        </div>
      </section>

      {/* Learning Loop Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Your Learning Journey
            </h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto">
              A complete cycle designed to help you learn effectively and build lasting consistency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Learn", desc: "Read and understand the Qur'an with beautiful typography and translations", icon: "book", color: "forest" },
              { step: "02", title: "Listen", desc: "Hear authentic recitations from renowned qaris with word-by-word tracking", icon: "headphones", color: "lav" },
              { step: "03", title: "Recite", desc: "Practice your recitation with real-time AI feedback on every word", icon: "mic", color: "burg" },
              { step: "04", title: "Memorize", desc: "Build your memorization with spaced repetition and smart review", icon: "brain", color: "sun" },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="card-soft p-6 h-full">
                  <div className="text-5xl font-bold text-forest/10 mb-4">{item.step}</div>
                  <div className={`bg-${item.color}/10 p-3 rounded-xl w-fit mb-4`}>
                    <Icon name={item.icon} className={`w-6 h-6 text-${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-ink/60">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <Icon name="arrowR" className="w-6 h-6 text-forest/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-forest to-forest-deep text-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to start your<br />Qur'an learning journey?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are building consistency with the Qur'an through Noor's personalized learning platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#/register">
              <PremiumButton variant="primary" size="lg" className="bg-sun text-ink hover:bg-sun-deep">
                Create Free Account
                <Icon name="arrowR" className="w-5 h-5" />
              </PremiumButton>
            </a>
            <a href="#/login">
              <PremiumButton variant="secondary" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Sign In
              </PremiumButton>
            </a>
          </div>
          <p className="text-sm text-white/50 mt-6">
            No credit card required · Free forever · Works offline
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-deep text-white/60 py-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sun rounded-xl flex items-center justify-center">
                  <Icon name="moon" className="w-5 h-5 text-ink" />
                </div>
                <span className="font-display text-xl text-white">NOOR</span>
              </div>
              <p className="text-sm">
                Your personal Qur'an learning journey. Read, memorize, practice, and grow.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#/quran" className="hover:text-white transition-colors">Qur'an Reader</a></li>
                <li><a href="#/app/memorize" className="hover:text-white transition-colors">Memorization</a></li>
                <li><a href="#/app/tajweed" className="hover:text-white transition-colors">Tajweed Academy</a></li>
                <li><a href="#/app/practice" className="hover:text-white transition-colors">Recitation Practice</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Track</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#/app/progress" className="hover:text-white transition-colors">Progress</a></li>
                <li><a href="#/app/bookmarks" className="hover:text-white transition-colors">Bookmarks</a></li>
                <li><a href="#/app/review" className="hover:text-white transition-colors">Review Queue</a></li>
                <li><a href="#/app/profile" className="hover:text-white transition-colors">Profile</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#/about" className="hover:text-white transition-colors">About Noor</a></li>
                <li><a href="#/about" className="hover:text-white transition-colors">Data Safety</a></li>
                <li><a href="#/about" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#/about" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm">
            <p>© 2024 Noor. All Qur'anic text from verified sources. Built with care for the Ummah.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
