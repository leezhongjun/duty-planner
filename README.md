# Duty Planner

Plans a level duty schedule for every working day of a month, given a list of people and their availability.

Created with HTML, JavaScript, and Tailwind CSS

Libraries used:

- [date-holidays](https://github.com/commenthol/date-holidays) - Public holidays
- [seedrandom](https://github.com/davidbau/seedrandom) - Seed random number generator
- [flatpickr](https://github.com/flatpickr/flatpickr) - Date picker UI

---

Build CSS with:

```
npx tailwindcss -i input.css -o output.css  --minify
```

---

### TODO

- [ ] Allow for inital 0 duties per person when number of people > days in month
- [ ] Display inital duties per person
- [ ] Improve performance
