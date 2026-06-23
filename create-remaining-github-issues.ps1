# create-remaining-github-issues.ps1
#
# Creates the 8 GitHub issues that failed on the first run (project
# Issue 1, 3, 6, 7, 8, 9, 10, 11) for the therugbydraft repo.
#
# Fix vs. the original script: instead of passing the body as a
# --body command-line argument (which broke on any text containing
# quote marks and spaces), this writes each body to a temporary file
# and uses --body-file, which never goes through argument parsing.
#
# Run from the repo root in PowerShell, with `gh` already authenticated.
#
# NOTE on numbering: the GitHub numbering no longer follows a clean
# "+1" offset from project issue numbers (a duplicate Issue 0 was
# created on the first run, and gh never reuses numbers). Treat the
# issue TITLE ("Issue N: ...") as the source of truth for project
# numbering from now on, not the GitHub issue number.

$ErrorActionPreference = "Stop"

function New-ProjectIssue {
    param(
        [string]$Title,
        [string]$Body
    )
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $Body -Encoding UTF8 -NoNewline

    Write-Host "Creating: $Title" -ForegroundColor Cyan
    gh issue create --title $Title --body-file $tempFile

    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAILED to create: $Title (exit code $LASTEXITCODE)" -ForegroundColor Red
        Write-Host "Stopping here so failures don't compound - check the error above." -ForegroundColor Red
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        exit 1
    }

    Remove-Item $tempFile -ErrorAction SilentlyContinue
    Write-Host ""
}

# ---------------------------------------------------------------------------
# Issue 1
# ---------------------------------------------------------------------------
$body1 = @'
**Model: Sonnet**

Plain English: builds the first thing a visitor actually sees - a mode-select home page (Prem 20-0 live, three other modes shown locked) and the settings screen where difficulty is chosen before drafting starts.

## Home page (/)
- Hero: site name "The Rugby Draft", tagline "Draft a Prem XV. Go unbeaten."
- A "Prem 20-0" mode card with a "Play" button (goes to /settings) and a "What is this mode?" link that opens a dismissible modal with a short 2-3 sentence explainer
- A "More modes (coming soon)" section with three greyed-out, non-clickable cards: Full League Draft, Six Nations, World Cup - locked icon, placeholders only, no functionality

## Settings page (/settings)
- Heading "Difficulty"
- Three selectable cards: Easy (3 redrafts), Medium (1 redraft), Hard (0 redrafts) - redraft count shown clearly on each
- "Start Draft" button carrying the chosen difficulty through to /draft via React state (useState/useReducer - not localStorage)
- No other settings for v1 (no formation, ratings toggle, era slider - those come later)

## Done when
- Home page shows the live 20-0 card, the explainer modal works, and the three coming-soon cards are visibly locked
- Choosing a difficulty on Settings and clicking Start Draft correctly carries that value through to the Draft route
'@
New-ProjectIssue -Title "Issue 1: Home & Settings screens" -Body $body1

# ---------------------------------------------------------------------------
# Issue 3
# ---------------------------------------------------------------------------
$body3 = @'
**Model: Opus - this is the core IP of the game**

Plain English: the actual rugby logic - given two teams' ratings, this decides who wins and produces a realistic scoreline.

Build a rugby union match simulation engine in src/engine/matchSim.js. Pure functions only - no React, no DOM, no randomness without an injectable seeded RNG.

simulateMatch(teamA, teamB, options) where teams have { attack, defence, setPiece, overall } and options includes { homeTeam, seed }.

Per CLAUDE.md: document the engine's inputs/outputs with JSDoc, and add temporary console.log statements at key calculation steps (win probability, try count, bonus point determination) to make the logic visible while building and debugging. These don't need to be production-grade and can be removed once the engine works.

## Requirements
1. Win probability from rating differential via a logistic curve, plus home advantage worth roughly +3 rating points.
2. Realistic scorelines: tries via Poisson (mean driven by attack vs opponent defence, league-average ~3.5 tries/team/match), conversions (~75%, higher with kicking rating), penalties (Poisson, mean ~1.8, inversely related to try count), rare drop goals (~3% of matches).
3. Late-game "game management": if the trailing team finishes within 8 points, ~40% chance the leading team takes a kickable penalty to push the margin past 7 and deny the losing bonus point. Comment this clearly - it is a signature realism feature.
4. Return { scoreA, scoreB, triesA, triesB, winner, bonusPoints }. Bonus rules: 4+ tries = try bonus; lose by 7 or fewer = losing bonus.
5. Vitest tests, written test-first per CLAUDE.md's TDD rule for logic-heavy issues: deterministic with the same seed; an 80-rated team beats a 70-rated team 75-85% of the time over 1000 sims; average total match points between 40-55; plausible bonus point frequencies.

Explain statistical choices in plain English comments.

## Done when
Tests pass and 20 sample scorelines printed to console look like real rugby scores.
'@
New-ProjectIssue -Title "Issue 3: Match simulation engine" -Body $body3

# ---------------------------------------------------------------------------
# Issue 6
# ---------------------------------------------------------------------------
$body6 = @'
**Model: Sonnet. TDD required** - CLAUDE.md categorizes "draft rules" as logic-heavy, so write failing tests first, then implement.

Plain English: the actual rules of the draft, as plain functions with no visuals attached - which players are eligible for a slot, what happens on a redraft, and the running team rating. Building this separately from the UI (Issue 7) means it can be tested properly.

Build pure, testable functions in src/engine/draftLogic.js:
1. getEligiblePlayers(clubId, position, players) - returns players from the given club eligible for the given slot. Handles position flexibility (locks fill L4 or L5; either wing fills LW or RW; etc.).
2. getSortedClubPlayers(clubId, position, players) - returns ALL of the given club's players (not filtered), each annotated with an eligible boolean flag for the current slot. Sort order: every eligible player first (sorted by rating, highest to lowest), then every ineligible player (also sorted by rating, highest to lowest). Eligible players always rank above ineligible ones regardless of individual rating - a 91-rated prop still sits below a 71-rated hooker when the open slot is Hooker. This is what the UI (Issue 7) renders; getEligiblePlayers above stays useful elsewhere (e.g. picking a random eligible player for redraft).
3. A draft-state reducer/model tracking: the 15 slots in fixed order (LP, HK, TP, L4, L5, BF, OF, N8, SH, FH, IC, OC, LW, RW, FB), which are filled, and the current slot.
4. redraftSlot(squad, position, redraftsRemaining) - re-rolls a single already-filled slot, decrementing the redraft count; rejects the action if redraftsRemaining is 0.
5. Difficulty to starting redraft count mapping: Easy 3, Medium 1, Hard 0.
6. calculateTeamOverall(squad) - average rating across the filled XV, used for the live "team overall" meter.

Document all data shapes with JSDoc (player, squad, draft state).

Vitest tests, written test-first:
- eligible-player filtering returns the correct players for a given club/slot, including position-flexible cases
- getSortedClubPlayers places every eligible player above every ineligible player regardless of individual rating, with both groups internally sorted by rating descending, and the eligible flag set correctly on each player
- a full draft completes after exactly 15 valid picks in the defined order
- redraft decrements the count correctly and is blocked at 0
- Hard difficulty starts with 0 redrafts available
- team overall calculation is correct for partial and full squads

## Done when
All tests pass and the logic has no dependency on React or the DOM - it should be usable from a plain Node script as well as the UI.
'@
New-ProjectIssue -Title "Issue 6: Draft logic" -Body $body6

# ---------------------------------------------------------------------------
# Issue 7
# ---------------------------------------------------------------------------
$body7 = @'
**Model: Sonnet. No test-first requirement** - this is UI work; it consumes the tested logic from Issue 6.

Plain English: the actual drafting experience - spinning for a club, picking a player for each of 15 positions, watching the XV fill in on a pitch graphic that stays visible throughout, and what happens once all 15 slots are filled. Uses the functions built in Issue 6 rather than reimplementing any draft rules here.

Build the draft experience, using draftLogic.js for all rules:
1. Animated spinning wheel (10 club colours, ~2.5s ease-out) lands on a random club each round.
2. Show ALL of that club's players for the CURRENT slot (via getSortedClubPlayers), as cards (name, position, rating, intl caps badge): eligible players appear first, sorted by rating highest to lowest, rendered as normal selectable cards. Ineligible players appear below them - also sorted by rating highest to lowest within their own group - rendered visually greyed (reduced opacity, lock icon in place of the selection affordance) and fully inert: not clickable, not focusable, no hover state.
3. Player picks one - it animates into its slot on a persistent rugby pitch graphic, filling in live as each pick locks in.
4. Display the redraft count from the chosen difficulty, and the live "team overall" meter (via calculateTeamOverall).
5. After the 15th pick (same screen, no navigation - state changes in place): two buttons appear - "Simulate Season" and "Redraft" (Redraft completely omitted on Hard). Tapping Redraft makes the pitch interactive - tap any filled position to re-spin just that slot via redraftSlot.
6. "Simulate Season" routes to /results.
7. Add a native beforeunload "leave site?" warning, active only between draft start and Results.

## Done when
A full 15-pick draft completes, the pitch fills in live, the redraft flow works and respects the difficulty-based counter, and the leave-warning fires only during an active draft.
'@
New-ProjectIssue -Title "Issue 7: Draft UI" -Body $body7

# ---------------------------------------------------------------------------
# Issue 8
# NOTE: opening framing reconstructed from PRD specs, not a verbatim pull.
# ---------------------------------------------------------------------------
$body8 = @'
**Model: Sonnet**

NOTE: this issue's framing was reconstructed from the page-flow PRD rather than pulled verbatim from the original prompt. The structure (a-h below) is accurate; double check the wording suits before treating it as final.

Plain English: after the draft, this plays a quick animated reveal of the season, shows a full-screen "you went unbeaten" moment if it happened, then lands on one scrollable page with everything about the season - summary, your XV, league table, fixtures, and the playoffs.

1. Auto-play montage: after "Simulate Season" is tapped, animate through the user's 18 results round-by-round (roughly 3-5s total), flashing scorelines (e.g. "R1 Bath 24-17 YOU"). A "Skip" button jumps straight to the full results page at any point.
2. If the season result is 20-0, show a full-screen Perfect Season interstitial first (confetti, animated trophy, "20-0 - UNBEATEN"), dismissed by a single "Continue" tap, before proceeding into the results page below.
3. Results page (single scrollable page, in this order):
   a. Record headline (e.g. "18-2"). Distinct colour/badge treatment if the record is 20-0.
   b. Season summary paragraph - generated by a TEMPLATE engine in src/engine/summary.js (no API calls): templates keyed on outcome tier with slots for best win, worst loss, top scorer, league position, points total. Write 4-5 variants per tier so repeated plays do not read identically.
   c. Your XV - pitch graphic, tappable players showing simulated season stats (tries, points).
   d. Top try scorer and top points scorer (user team and league-wide).
   e. Full league table (W/D/L, PF, PA, try/losing bonuses, points).
   f. Fixtures - collapsible accordion, collapsed by default.
   g. Playoffs - three simple stacked result cards (Semi-Final 1, Semi-Final 2, Final), same visual style as the fixtures list. NOT a bracket graphic.
   h. "Play Again" (to Home) and "Share" buttons.

## Done when
The montage plays and is skippable; a 20-0 run shows the interstitial before the normal results; the full results page scrolls cleanly on mobile with fixtures collapsed by default.
'@
New-ProjectIssue -Title "Issue 8: Results screen & summary" -Body $body8

# ---------------------------------------------------------------------------
# Issue 9
# ---------------------------------------------------------------------------
$body9 = @'
**Model: Sonnet**

Plain English: generates the shareable image that's the game's main marketing mechanism.

Build src/components/ShareCard.jsx: generates a downloadable/shareable PNG (1080x1350, Instagram portrait) via an offscreen canvas:
- game logo + record headline ("20-0" / "18-2 - CHAMPIONS")
- the XV laid out on a mini pitch with names and ratings
- team overall rating and league position
- site URL at the bottom

Use the Web Share API on mobile with a download fallback on desktop. This must look screenshot-worthy - it is the main acquisition channel.

## Done when
The card generates correctly for both a normal and a 20-0 result, and shares/downloads work on both mobile and desktop.
'@
New-ProjectIssue -Title "Issue 9: Share card" -Body $body9

# ---------------------------------------------------------------------------
# Issue 10
# ---------------------------------------------------------------------------
$body10 = @'
**Model: Sonnet**

Plain English: the final pre-launch pass - disclaimer, Buy Me a Coffee, SEO, installability, mobile QA, and performance.

1. Footer disclaimer on every page: "The Rugby Draft is an independent fan-made game. It is not affiliated with, endorsed by, or sponsored by any league, competition, club, player or governing body. Club and player names and historical statistics are used descriptively. Player ratings are an independent interpretation of publicly available data."
2. Buy Me a Coffee button in footer plus a tasteful one-time mention on the results screen.
3. SEO/meta: title, description, Open Graph tags using the share-card image style so links unfurl nicely on social.
4. PWA basics: manifest and icon, installable.
5. Mobile QA pass: every screen at 375px width.
6. Lighthouse performance check; lazy-load the player dataset.

## Done when
The disclaimer appears everywhere, Buy Me a Coffee is in place, social link previews look right, and the site installs as a PWA.
'@
New-ProjectIssue -Title "Issue 10: Polish, legal footer, monetisation" -Body $body10

# ---------------------------------------------------------------------------
# Issue 11
# ---------------------------------------------------------------------------
$body11 = @'
No code prompt - this is a checklist issue.

- [ ] Connect repo to Vercel, confirm auto-deploy
- [ ] Attach therugbydraft.app to the Vercel project (point DNS, wait for propagation)
- [ ] Confirm KPMG outside-interests declaration is complete
- [ ] Soft launch: send to a few rugby friends, watch them play without explaining anything - fix whatever confuses them
- [ ] Launch posts: r/rugbyunion (transparent "I made this" post), rugby Twitter/X, rugby TikTok (screen-record a draft + season reveal)
- [ ] Time launch around a rugby moment
- [ ] Add Vercel Analytics (free)
'@
New-ProjectIssue -Title "Issue 11: Deploy & launch" -Body $body11

Write-Host "Done. Issues 1, 3, 6, 7, 8, 9, 10, 11 created (if no FAILED lines appeared above)." -ForegroundColor Green
Write-Host "Next: close the duplicate Issue 0 (currently #2) with: gh issue close 2" -ForegroundColor Yellow
