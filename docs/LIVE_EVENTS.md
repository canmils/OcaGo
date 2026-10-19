# Optional journeys and events proposal

Status: future design backlog only. Do not implement during the current polish/audio slice. “Event” here means an optional themed activity; a live service, real-time calendar and online infrastructure are not prerequisites.

## Principles
Keep classic La Oca one tap away. Reuse the documented single-die rules and finite penalties; do not conceal altered probabilities, bot advantages or reward multipliers. State any rule variation before entry, and keep ordinary La Oca as the default. No countdown pressure, push notifications, forced daily logins, purchasable attempts or disappearing earned items.

An archive of replayable journeys gives the feeling of a changing world without fake scarcity. Theme selection can be a static curated menu in a future local build. A date must never gate play. Any later editorial schedule is presentation, not an eligibility deadline.

## Candidate 1: Ruta de los puentes
A garden-crossing postcard theme celebrates square 6 and its jump to 12. Board geometry, numbers and every rule stay unchanged. Before entry, a one-sentence tip explains the bridge. After a completed match, award a local commemorative postcard once for that journey, regardless of winner or bridge landing. An optional journal note records whether the human visited the bridge; luck does not withhold the main memento.

Acceptance: entry previews exact rules and cosmetic reward; returning to classic loses no progress; completing twice never duplicates the postcard; restart is not completion; bridge behavior remains covered by existing rules tests; all decorated tiles remain legible. Presentation must not misleadingly highlight bridge square 12 as another active jump.

## Candidate 2: El jardín al atardecer
A calm garden landscape uses a warm background, optional ambient sound and restrained victory presentation. This is a cosmetic journey, not a difficulty mode. Reduced-motion and muted players receive all goals and rewards. The optional goal is to complete one match; its memento is a sunset journal illustration rather than an exclusive gameplay advantage.

Acceptance: audio begins only after user interaction and respects the global mute preference; sound carries no exclusive information; palette passes the project's contrast checks; token identities remain visible; existing saved matches retain their rules and selected presentation after reload. The journey stays playable from the archive.

## Candidate 3: La ruta compartida — seeded exhibition
Later than the first two. An authored seed lets friends independently play the same local exhibition using identical starting rules and a deterministic random stream. This is a shareable puzzle-like curiosity, not verified online competition. Display a friendly seed/code and full rules version; avoid a leaderboard or claim that local results are trusted.

Acceptance: same seed, rules version and participant order produce the same sequence of resolved turns, independent of animation, audio, inspection and pause actions. Reload resumes the next random value rather than resetting the stream. Unsupported versions show a useful message and preserve classic play. A new match with the same seed explicitly says it repeats the exhibition. Seeded mode never changes ordinary random-match behavior. Claim reproducibility only after deterministic engine and browser tests pass.

The present rules have no strategic choices, so this should not be marketed as a skill challenge. Playtest whether repetition is interesting before investing in sharing UI. If not, remove this candidate rather than adding artificial rewards.

## Shared acceptance criteria
- Opt-in menu states theme, objective, exact guaranteed memento and whether rules differ before play. Current candidates never change rules.
- One active local match at a time: entering a journey offers resume or explicit replacement of the current match, never silently discards it.
- All completed journeys remain replayable. Missed dates have no consequence. Mementos are cosmetic, non-tradable and never required to play another journey.
- Goals and result receipts work with keyboard, narrow screens, reduced motion, muted audio and accessible text labels. No objective requires hearing or a timed reaction.
- Interrupted matches resume consistently, and duplicated completion handling never awards a second memento. Unknown journey IDs fall back safely without corrupting progress.
- Keep a small explicit catalog with stable IDs and rules versions. Do not add a general-purpose event framework, remote configuration or scheduling service before two activities prove useful.

## What needs an authoritative service later
Cross-device rewards, shared group totals, public standings, synchronized schedules and online friends matches need server validation and explicit operating/privacy decisions. Browser clocks and local saves cannot establish globally fair eligibility. No such service is approved or required for the current work.

## Recommended order
Finish and playtest the core polished match first. Next test the small progression track in PROGRESSION.md. Only then try one cosmetic journey using existing art and audio systems. Evaluate comprehension, interruption and desire to replay through voluntary sessions; do not infer retention gains from a design document. Scope a live service only if those results and a concrete social goal justify it.
