import { HDate, HebrewCalendar, Location } from '@hebcal/core'

// Converts a JS Date (or date string) into a readable Hebrew date string
export function toHebrewDate(dateInput) {
  const date = new Date(dateInput)
  const hd = new HDate(date)
  return hd.renderGematriya() // e.g. "כ״ד ניסן תשפ״ו"
}

// Returns any major Jewish holidays happening on a given JS Date
export function getHolidaysForDate(dateInput) {
  const date = new Date(dateInput)
  const hd = new HDate(date)
  const events = HebrewCalendar.getHolidaysOnDate(hd) || []
  return events.map((ev) => ev.render('en'))
}

// Returns all holidays in a given month/year range (for calendar view)
export function getHolidaysInRange(startDate, endDate) {
  const events = HebrewCalendar.calendar({
    start: new Date(startDate),
    end: new Date(endDate),
    isHebrewYear: false,
    candlelighting: false,
    sedrot: false,
    omer: false,
    noMinorFast: true,
    noRoshChodesh: false,
  })
  return events.map((ev) => ({
    title: ev.render('en'),
    date: ev.getDate().greg(),
  }))
}
// Given an original date, finds the next occurrence of that same Hebrew
// calendar date (day + month), which may fall on a different Gregorian date each year
export function getNextHebrewAnniversary(dateInput) {
  const original = new HDate(new Date(dateInput))
  const hDay = original.getDate()
  const hMonth = original.getMonth()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayHDate = new HDate(today)
  let hYear = todayHDate.getFullYear()

  let candidate = new HDate(hDay, hMonth, hYear)
  let candidateGreg = candidate.greg()
  candidateGreg.setHours(0, 0, 0, 0)

  if (candidateGreg < today) {
    candidate = new HDate(hDay, hMonth, hYear + 1)
    candidateGreg = candidate.greg()
    candidateGreg.setHours(0, 0, 0, 0)
  }

  return candidateGreg
}