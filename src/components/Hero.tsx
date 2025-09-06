import { ArrowRight, Play, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom'; // fix: react-router-dom
import useDashboardLayout from '../pages/Dashboard/dashboard.hooks';

const avatarArr = [
  'https://lh3.googleusercontent.com/a/ACg8ocLSaDMGf-Uab-xuiFaubCo-LFR9Wg7rJRFj7beQW_JkgMtKN5nW=s288-c-no',
  'https://avatars.githubusercontent.com/u/78331614?v=4',
  'https://media.licdn.com/dms/image/v2/D4E22AQE5eXu2ZV5zUA/feedshare-shrink_800/B4EZcg9mkiHcAg-/0/1748604715803?e=2147483647&v=beta&t=6LOu22oG6uWr8JtTtSiXdQJltgF2tJhbB62SZ2vRmt8',
  'https://media.licdn.com/dms/image/v2/C4D22AQEuK80NP7_RTg/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1597896267452?e=2147483647&v=beta&t=6VRdqD6Jtn2xKudA97FA-HMfLugmbgmxoBH2nZfbHf4'
];
const Hero = () => {
  const { user } = useDashboardLayout();

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      {/* Soft blobs */}
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-200/40 blur-3xl" />
      {/* Pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          maskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
        }}
      >
        <div className="h-full w-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23dbeafe%22%20fill-opacity%3D%220.35%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"/>
      </div>

      <div className="relative mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Announcement pill */}
        <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-blue-100/70 px-4 py-2 text-sm font-medium text-blue-800 backdrop-blur">
          {/* <GraduationCap className="h-4 w-4" />
          <span>Trusted by 50+ educational institutions</span>
          <span className="mx-1 text-blue-600">•</span>
          <span className="text-blue-700">99.9% uptime</span> */}
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
            Run your institution
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              beautifully, at scale
            </span>
            <span className="mt-2 block text-4xl font-bold text-gray-700 md:text-5xl">
              with CRITH
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
            Launch a modern University Management System in minutes—not months. CRITH is modular, cloud-native, and built for the real-world workflows of schools, colleges, and universities.
          </p>

          {/* CTA Row */}
          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-2xl ring-1 ring-blue-600/80 transition-all hover:scale-[1.02] hover:bg-blue-700 hover:shadow-3xl sm:w-auto"
            >
              {user ? 'Continue to Dashboard' : 'Get Started Free'}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Secondary CTA with subtle ring */}
            <button
              className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white/70 px-6 py-4 text-lg font-semibold text-gray-800 shadow ring-1 ring-gray-200 backdrop-blur transition-all hover:bg-white sm:w-auto"
              onClick={() => {
                // open your demo modal / route
                const el = document.getElementById('schedule-demo');
                el?.dispatchEvent(new Event('open-demo'));
              }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-inner ring-1 ring-gray-200 transition group-hover:shadow-md">
                <Play className="ml-0.5 h-3 w-3 text-blue-600" />
              </span>
              Schedule a Demo
            </button>
          </div>

          {/* Social proof: avatars + copy */}
          <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-3 text-sm text-gray-500">
            <div className="flex -space-x-3">
              {avatarArr.map((src, i) => (
                <div key={i} className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-white shadow">
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <span className="hidden sm:inline text-left">Loved by admin teams and faculty alike.</span>
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span className='text-left'>Privacy-first • SOC-ready</span>
          </div>
        </div>

        {/* Feature chips */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: 'Faster onboarding', d: 'Go live in days with presets', icon: <Sparkles className="h-4 w-4 text-indigo-600" /> },
            { t: 'Built to scale', d: 'Multi-campus & multi-role', icon: <CheckCircle2 className="h-4 w-4 text-blue-600" /> },
            { t: 'Modular by design', d: 'Enable only what you need', icon: <CheckCircle2 className="h-4 w-4 text-blue-600" /> },
            { t: 'Human support', d: 'Real people, real answers', icon: <Sparkles className="h-4 w-4 text-indigo-600" /> },
          ].map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blue-50" />
              <div className="relative flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">{f.icon}</span>
                <div className="font-semibold text-gray-900">{f.t}</div>
              </div>
              <div className="mt-1 text-sm text-gray-600">{f.d}</div>
            </div>
          ))}
        </div>

        {/* Stats (glass) */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: 'System Uptime', v: '99.9%' },
            { k: 'Institutes Using CRITH', v: '50+' },
            { k: 'Students Supported', v: '2M+' },
            { k: 'Regions', v: '2' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-blue-200/60 bg-blue-50/60 p-4 text-center shadow-sm backdrop-blur"
            >
              <div className="text-2xl font-extrabold text-blue-700">{s.v}</div>
              <div className="text-xs font-medium text-blue-900/80">{s.k}</div>
            </div>
          ))}
        </div>

        {/* Mini trust bar */}
        <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Live status: All systems normal
          </span>
          <span className="hidden sm:inline">•</span>
          <span>No credit card required</span>
          <span className="hidden sm:inline">•</span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
