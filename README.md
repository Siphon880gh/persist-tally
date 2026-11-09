By Weng (Weng Fei Fung)
![Last Commit](https://img.shields.io/github/last-commit/Siphon880gh/persist-tally/master)
<a target="_blank" href="https://github.com/Siphon880gh" rel="nofollow"><img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" alt="Github" data-canonical-src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" style="max-width:8.5ch;"></a>
<a target="_blank" href="https://www.linkedin.com/in/weng-fung/" rel="nofollow"><img src="https://img.shields.io/badge/LinkedIn-blue?style=flat&logo=linkedin&labelColor=blue" alt="Linked-In" data-canonical-src="https://img.shields.io/badge/LinkedIn-blue?style=flat&amp;logo=linkedin&amp;labelColor=blue" style="max-width:10ch;"></a>
<a target="_blank" href="https://www.youtube.com/@WengTeachesCode/" rel="nofollow"><img src="https://img.shields.io/badge/Youtube-red?style=flat&logo=youtube&labelColor=red" alt="Youtube" data-canonical-src="https://img.shields.io/badge/Youtube-red?style=flat&amp;logo=youtube&amp;labelColor=red" style="max-width:10ch;"></a>

# Persistent Tally

A plain-text notepad that auto-saves and keeps a running total of every line that starts with a number, so positive and negative lines balance each other out over weeks or months. Example: log hours worked as `4 refactoring auth` and recovery as `-2 played video games`, and a formula reminds you how many hours you have left before burnout.

![Main view: work hours and recovery lines, running tally, and burnout formulas](screenshots/main.png)

## Good fit: balancing tallies that persist

Tallies that keep running for weeks or months, where positive and negative lines balance each other out to keep you in balance.

- **Work hours vs. recovery:** positive lines for hours worked, negative lines for games, walks, or the gym, and a formula like `40 - tally` for the hours you have left before burnout
- **Freelance hours:** one quick line per entry, hours first so it tallies, then the time range and what you did, like `8 9a-5p Worked on the chat agent on the website`. The tally keeps your total hours automatically, and the log lines can later be cleanly formatted into an invoice.
- **Budgets and balances:** money in and money out against a starting balance
- **Hours left on a contract or retainer:** subtract hours as you bill them
- **Habits and streaks:** add for days done, subtract for days missed

## Not a great fit: workout logs

The tally never resets, so a log of reps or sets just keeps growing. It only works if you start a new file each week.

## Features

- **Auto-saving tally files:** each tally is its own file. Name it with the save icon, switch files with the folder icon, or open one by URL (`?open=filename`).
- **Running tally:** every line that starts with a number (or simple math like `1/2`) is added to **Tallied**, and **Count** shows how many lines were counted.
- **Formulas:** click **Add formula** to add a row with a description and a JavaScript expression in `{ }`. Use `tally` and `counter`, and reference another formula's result with `getResult(X)`, where `X` is the `[index]` shown next to it.
- **Saved formula views:** click **Rearrange**, drag formulas into the order you want, then **Save view**. Switch views from the dropdown, or rename and delete them. A view only changes the display order, so the original order and the `getResult(X)` indices never change.
- **Bookmarks:** jump to lines that start with a token you choose, like `#` for weekly headings.
- **Find text:** search the notes and jump between matches.
- **Notes, Status and per-line code:** two notes boxes, a Status line a formula can write to, and optional JavaScript that runs before each tallied line or after all lines.
- **Backup:** download the current file as a dated JSON backup. Print and copy buttons are at the top of the notes.

| Saved view (custom order) | Rearrange mode |
| --- | --- |
| ![A saved view showing formulas in a custom order](screenshots/saved-view.png) | ![Rearrange mode with draggable formula rows](screenshots/rearrange.png) |

## Run it

1. Serve the folder with PHP, for example by putting it under MAMP's document root, or with `php -S localhost:8000` from the repo folder.
2. Create the data folder. It's gitignored so your tallies stay local:
   ```
   mkdir data
   ```
3. Open `index.php` in your browser, type a few lines, and click the save icon to name your tally.
