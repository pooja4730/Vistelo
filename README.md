# Vistelo — Your Smarter Museum Journey

Academic prototype for the Group 7 CSMVS visitor study.

## Included
- Interactive visitor planner
- Survey-driven KPI dashboard
- Interactive charts
- Visitor issues and nearby-interest analysis
- CSMVS imagery sourced from Wikimedia Commons
- Privacy and Terms pages
- Favicon
- No respondent email addresses are included in the published data layer

## Run locally
Use any static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy
This is a static site and can be deployed to Vercel, Netlify or GitHub Pages. For a custom domain, register `vistelo.com` or `vistelo.io` with a domain registrar and connect the DNS records to the hosting provider.

## Data note
The dashboard is based on the supplied CSMVS survey CSV. Recommendations are survey-informed and are not live crowd forecasts.

## Image sources
Venue imagery is loaded from Wikimedia Commons Special:FilePath URLs. The site links to the relevant Commons category in the footer for attribution/reference.
