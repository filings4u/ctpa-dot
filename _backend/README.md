# screenings4u DOT C/TPA — Single-API Isolated Runtime

Portal code: `ctpa_dot`

Dedicated Edge Function: `ctpa-dot`

Routes:
- `/session` — authenticated access/context
- `/` — authenticated portal actions/data
- `/distribution` — public portal distribution/config

The C/TPA portal does not require `ctpa-dot-session`, `ctpa-dot-actions`, `ctpa-dot-distribution`, `dot-session-context`, `dot-portal-actions`, `dot-distribution-runtime`, or `workforce-ctpa-*` as separate runtime functions. Existing page modules can keep their legacy operation names; local `config.js` maps those requests into this portal's single API.
