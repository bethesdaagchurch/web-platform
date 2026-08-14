export interface CalendarCell {
  date: Date | null // null = padding cell outside this month
}

/**
 * Builds a 6-row x 7-col grid of calendar cells for the given month,
 * Sunday-first, with leading/trailing nulls for days outside the month.
 * Pure function — no dependency on "today", so it works for any month
 * the user navigates to via the Prev/Next controls.
 */
export function getMonthGrid(year: number, month: number): CalendarCell[][] {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = firstOfMonth.getDay() // 0 = Sunday

  const cells: CalendarCell[] = []
  for (let i = 0; i < startWeekday; i++) cells.push({ date: null })
  for (let day = 1; day <= daysInMonth; day++) cells.push({ date: new Date(year, month, day) })
  while (cells.length % 7 !== 0) cells.push({ date: null })

  const weeks: CalendarCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isWithinRange(date: Date, start: Date, end: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  return d >= s && d <= e
}
