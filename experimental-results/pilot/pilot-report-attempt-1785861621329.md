# Pilot report

- Status: **PILOT_FAILED**
- Started: 2026-08-04T16:37:36.524Z
- Finished: 2026-08-04T16:39:28.728Z
- Commit SHA: 890fb5c1cf02be370fc0107eece38002920e607d
- Working tree before pilot: M scripts/check-benchmark-environment.mjs
 M scripts/run-build-benchmark.mjs
 M scripts/run-full-experiment.mjs
 M scripts/run-functional-benchmark.mjs
 M scripts/run-lighthouse-benchmark.mjs
 M scripts/summarize-build-results.mjs
 M scripts/summarize-experimental-results.mjs
- Node.js: v22.23.2
- Lighthouse configuration: {"preset":"desktop","cachePolicy":"cold","networkThrottling":"simulate","cpuThrottling":"1x"}
- Preflight: PASS
- Build CSV rows: 2
- Lighthouse CSV rows: 0
- Lighthouse JSON reports: 0
- Lighthouse HTML reports: 0
- Temporary Chrome profiles remaining: 0
- Manual review: FT-11 Loading, FT-12 Error, FT-14 Responsive.
- Pilot results are isolated and must not be used to rank frameworks.
- Failure: Command failed: node scripts/run-lighthouse-benchmark.mjs --pilot
