# Duty Planner

This planner assigns duties to everyone on the name list as fairly as possible for all working days of a month.

You can add extra duties (for particular people), blockout dates (dates that someone cannot do duty on), and additional dates with no duties.

Read more in the [FAQ](FAQ.md).

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

## TODO

- [ ] Improve performance
