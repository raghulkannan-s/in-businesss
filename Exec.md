# Cricket App — Page‑Wise Execution Plan (P‑1…P‑11)

## Folder Structure

```
app/
  navigation/
    RootNavigator.tsx
  screens/
    Auth/
      Login.tsx       (P-1)
      Register.tsx    (P-1B)
      Forgot.tsx      (P-1A)
    Eligibility.tsx   (P-2)
    SportsHall.tsx    (P-3)
    Cricket/
      Menu.tsx        (P-4)
      OldMatch.tsx    (P-5A)
      NewMatch/
        TeamA.tsx     (P-5B-left)
        TeamB.tsx     (P-5B-right)
        Toss.tsx      (P-6)
        Setup.tsx     (P-7)
        Scoreboard.tsx(P-8)
        End.tsx       (P-11)
      Teams.tsx       (P-5C)
      History.tsx     (P-5D)
  components/
    TextInput.tsx, Button.tsx, Card.tsx, Header.tsx, ListItem.tsx
  state/
    auth.ts, match.ts, teams.ts
  lib/
    excel.ts, storage.ts, validators.ts
  assets/
    logo.png, trophy.png
  api/
    client.ts (axios)
```

---

## Data Models (minimal)

```ts
// User
{ id: string, name: string, phone: string, email?: string, address?: string, passwordHash: string }

// Player (belongs to a Team label for the match setup only)
{ id: string, name: string }

// Team (ephemeral for a match)
{ id: string, name: string, players: Player[] }

// Match
{ id: string, date: string, teamA: Team, teamB: Team,
  tossWonBy: 'A'|'B', optedTo: 'BAT'|'BOWL', overs: number,
  innings: [Innings, Innings?], result?: string }

// Innings
{ batting: 'A'|'B', bowling: 'A'|'B',
  score: number, wickets: number, oversBowled: number,
  batsmen: BatsmanStat[], bowlers: BowlerStat[],
  balls: BallEvent[] }

// BatsmanStat
{ playerId: string, name: string, runs: number, balls: number, s1: number, s2: number, s3: number, s4: number, s6: number, out?: string }

// BowlerStat
{ playerId: string, name: string, overs: number, runs: number, wickets: number, wides: number, noballs: number, economy: number }

// BallEvent
{ over: number, ball: number, type: 'LEGAL'|'WIDE'|'NOBALL'|'BYE'|'L-BYE'|'WICKET', runs: number, strikerId?: string, bowlerId?: string, dismissal?: 'BOWLED'|'CAUGHT'|'RUN OUT'|'LBW' }

// Eligibility Entry (simple)
{ customerId: string, points: number, eligible: boolean }
```

---

## Global State Shape (Zustand)

```ts
auth: { user?: User, login(), register(), logout() }
match: {
  current?: Match,
  createTeams(namesA: string[], namesB: string[], teamAName: string, teamBName: string),
  setToss(winner: 'A'|'B', optedTo: 'BAT'|'BOWL', overs: number),
  setLineup(strikerId: string, nonStrikerId: string, bowlerId: string),
  addBall(event: BallEvent), undoBall(),
  endInnings(), endMatch(result: string),
  save(), load(id: string)
}
teams: { savedTeams: Team[], saveTeam(team: Team), list(), remove(id: string) }
```

---

## Navigation Map

* **Stack:** Auth → Tabs.
* **Tabs:** Home(P‑3), Cricket(P‑4), Eligibility(P‑2), Profile/Logout.
* **Cricket Stack:** Menu(P‑4) → Old(P‑5A) | New(P‑5B→P‑6→P‑7→P‑8→P‑11) | Teams(P‑5C) | History(P‑5D).

---

## API (optional; skip if local only)

* `POST /auth/register` {name, phone, password}
* `POST /auth/login` {phone, password}
* `GET /matches` → list
* `POST /matches` → save
* `GET /matches/:id` → detail
* `DELETE /matches/:id`
* `POST /export/scoreboard` → returns .xlsx (or generate on-device if lib allows)

---

# PAGE‑WISE TASKS WITH ACCEPTANCE CRITERIA

## P‑1 Login

**Tasks**

1. Build form (phone, password) + logo.
2. Validate non‑empty, phone numeric.
3. Submit → `auth.login` → store token/user.
4. Links: Signup(P‑1B), Forgot(P‑1A).
   **Acceptance**: Wrong creds → error toast. Success → navigates to Tabs.

## P‑1A Forgot Password

**Tasks**

1. Single input (phone).
2. Button: “Send reset code” → show toast (stub).
   **Acceptance**: Shows confirmation; no crash; back to Login.

## P‑1B Register

**Tasks**

1. Inputs: name, email (opt), phone, address (opt), password, confirm.
2. Basic validation; register → success toast; navigate Login.
   **Acceptance**: Duplicate phone blocked or mocked; stored user exists.

## P‑2 Eligibility

**Tasks**

1. Input: Customer ID; Button: Check.
2. Logic: even last digit → Eligible (points=60), odd → Not Eligible (points=35). (Stub)
3. Display result card.
   **Acceptance**: Deterministic result; works offline.

## P‑3 Sports Hall

**Tasks**

1. Static list of 6 product cards (image, title, price placeholder).
2. Card press → toast “Coming soon”.
   **Acceptance**: Scroll smooth; no network needed.

## P‑4 Cricket Menu

**Tasks**

1. Four buttons: Old Match (P‑5A), New Match (P‑5B), Teams (P‑5C), History (P‑5D).
2. Header + small caption.
   **Acceptance**: Navigation works for all.

## P‑5A Old Match

**Tasks**

1. List stored matches from AsyncStorage.
2. Each item: date, A vs B, scores (if available), button: “Export Excel”.
3. Secondary: Overall Rank Excel, Subdivision Rank Excel (use mock ranking dataset).
   **Acceptance**: Tapping export creates .xlsx file and shows success path; at least one sample row always available (fallback static generation).

## P‑5B New Match → Team Entry (Left/Right)

**Tasks**

1. Screen A (Team A): Team name + 15 text inputs; Save.
2. Screen B (Team B): same; Save.
3. Persist to `match.current.teamA/teamB`.
4. CTA: “Proceed to Toss (P‑6)”.
   **Acceptance**: Can enter fewer than 15; cannot proceed if both team names empty.

## P‑6 Toss

**Tasks**

1. Show Team A/B names.
2. Radio: Toss won by A/B.
3. Radio: Opted to Bat/Bowl.
4. Input: Overs (5–50) with validation.
5. CTA: “Set Line‑up (P‑7)”.
   **Acceptance**: Stores `tossWonBy`, `optedTo`, `overs` in state.

## P‑7 Setup (Striker/Non‑Striker/Bowler)

**Tasks**

1. Dropdowns prefilled from teams.
2. “Auto” buttons pick first two batsmen for batting side, first bowler for bowling side.
3. Edit allowed.
4. CTA: “Start Match (P‑8)”.
   **Acceptance**: You can’t select same player for striker & non‑striker; selections persist.

## P‑8 Scoreboard (Innings)

**Tasks**

1. Header: `A, 1st innings 0‑0 (0.0)` dynamic.
2. Batting table: Name, R, B, 1,2,3,4,6, SR (recomputed).
3. Bowling table: Name, O, R, W, E (recomputed).
4. Over tracker (6 balls): row of circles updating per ball.
5. Action buttons: `0,1,2,3,4,6`, `Wide`, `Nb`, `Byes`, `Lb`, `Wicket`.
6. `Undo` last event.
7. `End Innings` → switch sides, reset tracker, compute partial result.
8. `End Match` → goto P‑11.
   **Acceptance**: All actions update totals correctly; undo reverses last event; cannot exceed 6 legal balls per over; wides/nbs don’t count as legal ball but add runs; wickets increment and mark current striker “out” with chosen dismissal.

## P‑11 End (Congratulations)

**Tasks**

1. Trophy image, winning text (e.g., “Team A won by 10 runs / 3 wickets”).
2. CTA: `Save Scoreboard` → serialize `match.current` to storage and add to History.
   **Acceptance**: After saving, returns to P‑4 or shows “View in History”.

## P‑5C Teams (Saved Teams)

**Tasks**

1. List saved reusable teams (not per‑match).
2. Fields: Name, players count, optional W/L counters.
3. Actions: Save new team from clipboard (import from latest Team A/B), delete.
   **Acceptance**: Can save, list, remove without affecting History.

## P‑5D History

**Tasks**

1. Reverse‑chronological list of matches.
2. Row: `A vs B` | `20/0 (2.0)` etc. | “A won by 10 runs”.
3. Actions: Open Scoreboard (readonly P‑8), Delete.
   **Acceptance**: Delete updates storage; open renders full details.

---

# Implementation Checklists (per module)

## State & Storage

* [ ] Define Zustand stores (`auth`, `match`, `teams`).
* [ ] Implement `storage.ts` wrappers (getItem, setItem, list keys, remove).
* [ ] Keys: `users`, `matches`, `teams`.

## Components

* [ ] `Header` with title & back.
* [ ] `TextInput` with label + error.
* [ ] `Button` (primary/ghost).
* [ ] `ListItem` (title, subtitle, chevron, actions).

## Excel Export (`lib/excel.ts`)

* [ ] Function `exportScoreboard(match: Match)` → builds sheets:

  * Sheet1: Summary (teams, result, overs, total).
  * Sheet2: Batting A / Bowling B.
  * Sheet3: Batting B / Bowling A.
* [ ] Function `exportRankingOverall(rows)` and `exportRankingSubdivision(rows)` (mock rows).
* [ ] Return file path; show toast.

## Validations

* [ ] Phone numeric, password length ≥ 4.
* [ ] Overs 5–50 integer.
* [ ] Disallow duplicate player names in same team (warn only).

## Calculations

* [ ] Batting SR = (runs / balls) \* 100 (two decimals).
* [ ] Bowling Economy = runs / overs (two decimals).
* [ ] Legal ball increments: only on `LEGAL` or standard run outcomes (0,1,2,3,4,6). Wides/Nb add runs but not ball count.

---

# Test Script (demo‑ready)

1. Register dummy user → Login.
2. Eligibility: check ID `1234` → Eligible.
3. Sports Hall scroll.
4. Cricket → New Match → enter Team A/B names + 5 players each.
5. Toss: A wins, opts Bat, overs 5.
6. Setup: Auto select.
7. Score 1 over with mix (1,2,4,Wide,Wicket,Nb) → verify totals and over count.
8. End Innings → swap; bowl 1 over for B; End Match.
9. Save Scoreboard → go History; open; export Excel.
10. Old Match → export Overall Rank/Subdivision Rank.

---

# Deliverables Checklist (what you must hand over)

* [ ] Expo project zip/APK.
* [ ] Short README with install/run.
* [ ] Sample Excel outputs (3 files) pre‑generated as fallback.
* [ ] 2‑minute demo script (above) + screenshots (P‑1..P‑11).

---

## Stretch (only if time remains)

* [ ] Real‑time with Socket.IO (emit `ball:add` events).
* [ ] Role guard (Admin/Moderator/Player).
* [ ] IN‑PCC policy page (Tamil text pasted, checkbox “OK”).
* [ ] Simple ranking based on SR/Economy from latest 3 matches.

---

**Non‑negotiable rule:** If a task isn’t needed for the payment demo, skip or stub it. Ship first, perfect later.
