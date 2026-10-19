# Original sound direction and implementation

The garden uses short, warm synthesized chimes rather than casino alarms or copied game sounds. The palette is original: rising notes for geese and bridges, soft descending notes for setbacks and rest, a four-note resolution for victory, and restrained triangle-wave taps for dice and steps. There are no external sound assets, downloads, dependencies, or background music.

`src/audio.ts` exports `createAudio()` and the `AudioCue` type. Its controller provides `enabled`, `setEnabled(boolean): Promise<boolean>`, `unlock(): Promise<boolean>`, `play(cue)`, `stop()`, and `dispose()`.

Sound defaults to off. Only the explicit saved `ocago:sound=on` preference restores opt-in. Creating the controller does not create an AudioContext. Call `setEnabled(true)` or `unlock()` from a user gesture to create/resume the context. Their result indicates actual playback availability; `enabled` retains the user's preference when a platform temporarily denies playback. `play()` is synchronous and silently skips unavailable or suspended audio. A generic user-gesture listener can invoke `unlock()` to recover from browser suspension without autoplay. Handle the preference toggle in the UI with a visible label and `aria-pressed`.

Integration: roll at dice anticipation; step alongside each movement animation; goose/bridge/rest/setback at the corresponding landing effect; victory when the victory presentation starts. Restart calls `stop()`, mute stops all scheduled and active oscillators, and teardown calls `dispose()`. Do not play a setback cue for the finish square. No audio cue is necessary to understand game state.

Envelopes have a short attack and fade; per-voice peak gain is 0.016 with a 12-voice cap. Clicks and steps are rate-limited. Oscillators schedule on the audio clock and disconnect on completion; there are no JavaScript timers. These limits are implementation facts, not measured loudness certification.

Validation: TypeScript checking is run for this module. Audible balance, speaker/headphone perception, and browser/device gesture policies require human listening and device checks; no listening test is claimed. Frontend integration and end-to-end validation are owned by the coordinator.
