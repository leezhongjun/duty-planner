# Frequently Asked Questions

## What is this?

This assigns duties to everyone on the name list as fairly as possible for all working days of a month.

You can add extra duties (for particular people), blockout dates (dates that someone cannot do duty on), and additional dates with no duties.

In the case where not everyone be assigned an equal number of duties (before adding extra duties), leftover duties will be assigned pseudo-randomly, seeded on the month and year of the duty schedule.

## How do I use it?

Follow the input formats as stated in the website.

1. Add names to the name list (line separated) [e.g. `John`]
2. Add [extra duties](#can-i-put-negative-extra-duties) (if any) behind the relavant names in the name list [e.g. `John 2`]
3. Add blockout dates (if any) with the format dd-mm-yyyy [e.g. `01-01-2024, 10-01-2024 - 15-01-2024`]
4. Add dates with no duties in the calendar picker (if any)
5. Add names to [exclude from random selection](#what-does-exclude-from-random-selection-do) (if any)
6. Click "Get result"
7. Click "Copy result" to copy the result to the clipboard

## How do I change the month/year?

Add at least one blockout date on the desired month and year.

## What does "Exclude from random selection" do?

Each name in the list is first assigned duties equally. Then, extra duties are added. If there are **leftover duties**, they are assigned randomly to the names that are **not excluded from random selection**.

## Can I put negative extra duties?

Yes. This is useful if you want to assign only a particular person (or a particular few people) a certain number of duties less than everyone else.

Example:

```
Ian
John -2
Tom
```

is the same as

```
Ian 2
John
Tom 2
```

## What does the random seed do?

The random seed is used to seed the random number generator. This means that if you use the same random seed, you will get the same result.

For reproducibility, the seed by default is the year and month of the duty schedule. (yyyymm)

Leave the random seed blank to use a randomly-generated seed. This means that you will get a different result each time you click "Get result".
