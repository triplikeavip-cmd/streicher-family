import { HDate, HebrewCalendar, Location } from '@hebcal/core'

// Converts a JS Date (or date string) into a readable Hebrew date string
export function toHebrewDate(dateInput) {
  const date = new Date(dateInput)
  const hd = new HDate(date)
  return hd.render('en') // e.g. "15th of Nissan, 5786"
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
  })
  return events
    .filter((ev) => ev.getFlags() & 1) // only "major" holiday flags for now, can expand later
    .map((ev) => ({
      title: ev.render('en'),
      date: ev.getDate().greg(),
    }))
}