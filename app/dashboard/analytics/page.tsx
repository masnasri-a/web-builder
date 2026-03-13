import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import {
  Users, TrendingUp, CheckCircle2, Clock, XCircle,
  Heart, BarChart3, CalendarDays, MessageSquare,
} from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(n: number, total: number) {
  return total === 0 ? 0 : Math.round((n / total) * 100)
}

function fmt(n: number) {
  return n.toLocaleString("id-ID")
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

function AttendancePill({
  label,
  count,
  total,
  bg,
  text,
}: {
  label: string
  count: number
  total: number
  bg: string
  text: string
}) {
  const p = pct(count, total)
  return (
    <div className="flex items-center gap-3">
      <span className={`w-24 shrink-0 rounded-full px-2.5 py-0.5 text-center text-[11px] font-semibold ${bg} ${text}`}>
        {label}
      </span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${bg}`}
          style={{ width: `${p}%` }}
        />
      </div>
      <span className="w-16 text-right text-xs font-semibold tabular-nums">
        {fmt(count)} <span className="font-normal text-muted-foreground">({p}%)</span>
      </span>
    </div>
  )
}

// ─── SVG Bar Chart ─────────────────────────────────────────────────────────────

function RsvpBarChart({
  data,
}: {
  data: { date: string; label: string; count: number }[]
}) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const W = 560
  const H = 120
  const BAR_W = Math.floor((W - (data.length - 1) * 4) / data.length)
  const GAP = 4

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H + 28}`}
        className="w-full"
        aria-label="RSVP per hari"
      >
        {data.map((d, i) => {
          const barH = max === 0 ? 0 : Math.max(2, Math.round((d.count / max) * H))
          const x = i * (BAR_W + GAP)
          const y = H - barH
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                rx={3}
                className="fill-primary opacity-80"
              />
              {d.count > 0 && (
                <text
                  x={x + BAR_W / 2}
                  y={y - 3}
                  textAnchor="middle"
                  fontSize={8}
                  className="fill-foreground"
                  opacity={0.7}
                >
                  {d.count}
                </text>
              )}
              <text
                x={x + BAR_W / 2}
                y={H + 16}
                textAnchor="middle"
                fontSize={8}
                className="fill-muted-foreground"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Fetch all invitations with guests
  const invitations = await db.invitation.findMany({
    where: { userId: session.user.id },
    include: {
      theme: { select: { name: true, slug: true } },
      guests: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })

  // ── Aggregate totals ──────────────────────────────────────────────────────
  const allGuests = invitations.flatMap((i) => i.guests)
  const totalRsvp = allGuests.length
  const attending = allGuests.filter((g) => g.attendance === "ATTENDING")
  const notAttending = allGuests.filter((g) => g.attendance === "NOT_ATTENDING")
  const pending = allGuests.filter((g) => g.attendance === "PENDING")

  const totalAttendingCount = attending.reduce((s, g) => s + g.guestCount, 0)
  const attendanceRate = pct(attending.length, totalRsvp)
  const withMessage = allGuests.filter((g) => g.message && g.message.trim().length > 0).length

  // ── RSVP trend: last 14 days ──────────────────────────────────────────────
  const today = new Date()
  const trendDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (13 - i))
    return d
  })

  const trendData = trendDays.map((d) => {
    const dayStr = d.toISOString().slice(0, 10)
    const count = allGuests.filter(
      (g) => g.createdAt.toISOString().slice(0, 10) === dayStr
    ).length
    const label = `${d.getDate()}/${d.getMonth() + 1}`
    return { date: dayStr, label, count }
  })

  // ── Per-invitation stats ──────────────────────────────────────────────────
  const invStats = invitations.map((inv) => {
    const g = inv.guests
    const att = g.filter((x) => x.attendance === "ATTENDING")
    const notAtt = g.filter((x) => x.attendance === "NOT_ATTENDING")
    const pend = g.filter((x) => x.attendance === "PENDING")
    const headcount = att.reduce((s, x) => s + x.guestCount, 0)
    return { inv, att, notAtt, pend, headcount, total: g.length }
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Analytics"
        description="Statistik RSVP dan undangan kamu"
      />

      <div className="space-y-6 p-6">

        {/* ── Overview Stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Heart}
            label="Total Undangan"
            value={invitations.length}
            sub={`${invitations.filter((i) => i.isPublished).length} published`}
            color="bg-rose-500"
          />
          <StatCard
            icon={Users}
            label="Total RSVP"
            value={fmt(totalRsvp)}
            sub={`${fmt(totalAttendingCount)} tamu hadir`}
            color="bg-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Tingkat Hadir"
            value={`${attendanceRate}%`}
            sub={`${attending.length} dari ${totalRsvp} konfirmasi`}
            color="bg-emerald-500"
          />
          <StatCard
            icon={MessageSquare}
            label="Pesan Masuk"
            value={fmt(withMessage)}
            sub={`dari ${fmt(totalRsvp)} total tamu`}
            color="bg-violet-500"
          />
        </div>

        {/* ── RSVP Trend + Attendance Distribution ──────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Bar chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">RSVP 14 Hari Terakhir</h2>
            </div>
            {totalRsvp === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Belum ada RSVP masuk
              </div>
            ) : (
              <RsvpBarChart data={trendData} />
            )}
          </div>

          {/* Attendance breakdown */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Status Kehadiran</h2>
            </div>
            {totalRsvp === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Belum ada RSVP masuk
              </div>
            ) : (
              <div className="space-y-4">
                <AttendancePill
                  label="Hadir"
                  count={attending.length}
                  total={totalRsvp}
                  bg="bg-emerald-500"
                  text="text-white"
                />
                <AttendancePill
                  label="Tidak Hadir"
                  count={notAttending.length}
                  total={totalRsvp}
                  bg="bg-rose-400"
                  text="text-white"
                />
                <AttendancePill
                  label="Menunggu"
                  count={pending.length}
                  total={totalRsvp}
                  bg="bg-amber-400"
                  text="text-white"
                />

                <div className="mt-4 rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Total tamu hadir (headcount):{" "}
                    <span className="font-semibold text-foreground">
                      {fmt(totalAttendingCount)} orang
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Per-Invitation Breakdown ───────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Breakdown per Undangan</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Detail statistik RSVP untuk setiap undangan
            </p>
          </div>

          {invitations.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Belum ada undangan
            </div>
          ) : (
            <div className="divide-y divide-border">
              {invStats.map(({ inv, att, notAtt, pend, headcount, total }) => (
                <div key={inv.id} className="px-5 py-4">
                  {/* Title row */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {inv.groomName} &amp; {inv.brideName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{inv.slug} · {inv.theme.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          inv.isPublished
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {inv.isPublished ? "Live" : "Draft"}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {fmt(total)} RSVP
                      </span>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="mb-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-4">
                    <div className="rounded-xl bg-emerald-50 px-2 py-2 dark:bg-emerald-900/20">
                      <CheckCircle2 className="mx-auto mb-1 h-3.5 w-3.5 text-emerald-600" />
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        {att.length}
                      </p>
                      <p className="text-[10px] text-emerald-600">Hadir</p>
                    </div>
                    <div className="rounded-xl bg-rose-50 px-2 py-2 dark:bg-rose-900/20">
                      <XCircle className="mx-auto mb-1 h-3.5 w-3.5 text-rose-500" />
                      <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {notAtt.length}
                      </p>
                      <p className="text-[10px] text-rose-500">Tidak Hadir</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 px-2 py-2 dark:bg-amber-900/20">
                      <Clock className="mx-auto mb-1 h-3.5 w-3.5 text-amber-500" />
                      <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {pend.length}
                      </p>
                      <p className="text-[10px] text-amber-500">Menunggu</p>
                    </div>
                    <div className="hidden rounded-xl bg-blue-50 px-2 py-2 dark:bg-blue-900/20 sm:block">
                      <Users className="mx-auto mb-1 h-3.5 w-3.5 text-blue-500" />
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {fmt(headcount)}
                      </p>
                      <p className="text-[10px] text-blue-500">Headcount</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {total > 0 && (
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${pct(att.length, total)}%` }}
                      />
                      <div
                        className="bg-rose-400"
                        style={{ width: `${pct(notAtt.length, total)}%` }}
                      />
                      <div
                        className="bg-amber-300"
                        style={{ width: `${pct(pend.length, total)}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent RSVP Messages ──────────────────────────────────────── */}
        {allGuests.filter((g) => g.message).length > 0 && (
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Pesan Terbaru dari Tamu</h2>
              </div>
            </div>
            <div className="divide-y divide-border">
              {allGuests
                .filter((g) => g.message && g.message.trim())
                .slice(-5)
                .reverse()
                .map((g) => {
                  const inv = invitations.find((i) =>
                    i.guests.some((x) => x.id === g.id)
                  )
                  return (
                    <div key={g.id} className="px-5 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{g.name}</p>
                          {inv && (
                            <p className="text-[10px] text-muted-foreground">
                              {inv.groomName} &amp; {inv.brideName}
                            </p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            g.attendance === "ATTENDING"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : g.attendance === "NOT_ATTENDING"
                              ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                              : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500"
                          }`}
                        >
                          {g.attendance === "ATTENDING"
                            ? "Hadir"
                            : g.attendance === "NOT_ATTENDING"
                            ? "Tidak Hadir"
                            : "Menunggu"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground italic">
                        &ldquo;{g.message}&rdquo;
                      </p>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
