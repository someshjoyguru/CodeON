import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const features = [
  { title: 'Track Progress', desc: 'Monitor your Codeforces stats & rating trajectory in one place.' },
  { title: 'Compete & Rank', desc: 'Live leaderboard fosters healthy competition among peers.' },
  { title: 'Learn & Share', desc: 'Community posts with AI summary to digest knowledge faster.' },
  { title: 'Plan Ahead', desc: 'Stay prepared with upcoming contests schedule & quick links.' },
];

const gradients = [
  'from-violet-500/10 to-fuchsia-500/10',
  'from-blue-500/10 to-cyan-500/10',
  'from-emerald-500/10 to-lime-500/10',
  'from-amber-500/10 to-rose-500/10'
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-20 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.03] dark:bg-grid-white/[0.04] pointer-events-none" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80rem] h-[80rem] bg-gradient-radial from-primary/15 via-transparent to-transparent rounded-full" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                NITJSR Competitive Programming Portal
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Practice smarter. Compete fairly. Grow faster. One unified platform for stats, contests, learning & community collaboration.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login"><Button size="lg">Get Started</Button></Link>
                <Link to="/register"><Button size="lg" variant="outline">Create Account</Button></Link>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f,i) => (
                <div key={f.title} className={cn('relative rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition group overflow-hidden', 'before:absolute before:inset-0 before:bg-gradient-to-br', gradients[i], 'before:opacity-0 hover:before:opacity-60 before:transition')}> 
                  <div className="relative">
                    <h3 className="font-semibold tracking-tight mb-2 text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 border-t">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold tracking-tight">Why this portal?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Built for passionate problem solvers, this portal streamlines competitive programming workflows. No more bouncing across tabs—track ratings, scout contests, discuss strategies, and grow together. The integrated AI summaries reduce cognitive overhead so you can focus on solving.
              </p>
              <ul className="text-sm grid gap-2">
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"/>Unified dashboard</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"/>Lightweight & fast (Vite + Tailwind)</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"/>Zero clutter navigation</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"/>Accessible component system</li>
              </ul>
              <div className="pt-2 flex gap-3">
                <Link to="/register"><Button>Create Account</Button></Link>
                <Link to="/login"><Button variant="outline">Sign In</Button></Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl border bg-card/50 backdrop-blur p-6 shadow-sm">
                <div className="text-xs uppercase tracking-wide font-medium text-muted-foreground mb-3">Platform Snapshot</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-muted/60 p-4">
                    <p className="text-2xl font-bold">Live</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Contest feed</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-4">
                    <p className="text-2xl font-bold">AI</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Post summaries</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-4">
                    <p className="text-2xl font-bold">Stats</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Rating tracker</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-4">
                    <p className="text-2xl font-bold">Social</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Community hub</p>
                  </div>
                </div>
                <div className="mt-6 text-[11px] text-muted-foreground text-right">More modules coming...</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 border-t bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to level up?</h2>
            <p className="text-sm text-muted-foreground mb-8">Start tracking and improving your competitive programming journey today.</p>
            <Link to="/register"><Button size="lg">Join Now</Button></Link>
          </div>
        </section>
      </main>
      <footer className="py-10 text-center text-[11px] text-muted-foreground">
        Built with passion • © {new Date().getFullYear()} NITJSR CP Portal
      </footer>
    </div>
  );
}
