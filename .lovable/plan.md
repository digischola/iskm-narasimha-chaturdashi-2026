

## Fix: FAQ food timing + full page timing audit

### Audit Results

| Location | Line | Current | Correct | Status |
|----------|------|---------|---------|--------|
| Hero meta | 112 | 6:30 PM – 10:00 PM | ✅ | OK |
| WhatsApp message | 198 | 6:30 PM – 10:00 PM | ✅ | OK |
| Schedule timeline | 520–523 | Prasādam at 8:30 PM | ✅ | OK |
| FAQ – food | 609 | **8:45 PM** | 8:30 PM | ❌ FIX |
| FAQ – duration | 612 | 6:30 PM to 10:00 PM | ✅ | OK |
| **Location section** | **645** | **6:30 PM – 9:45 PM** | **6:30 PM – 10:00 PM** | **❌ FIX** |
| Google Calendar URL (hero) | ~216 | ends 140000Z (10 PM SGT) | ✅ | OK |

### Changes — `src/App.tsx`

1. **Line 609** — FAQ food answer: change `8:45 PM` → `8:30 PM`
2. **Line 645** — Location/venue section: change `9:45 PM` → `10:00 PM`

Two remaining discrepancies, both one-line fixes.

