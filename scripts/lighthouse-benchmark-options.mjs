export const supportedLighthouseOptions = {
  preset: ['desktop'],
  cachePolicy: ['cold'],
  networkThrottling: ['simulate'],
  cpuThrottling: {
    '1x': 1,
    '2x': 2,
    '4x': 4,
  },
}

export const lighthouseConfigurationErrors = (lighthouse) => {
  const errors = []
  for (const field of ['preset', 'cachePolicy', 'networkThrottling']) {
    if (!supportedLighthouseOptions[field].includes(lighthouse[field])) {
      errors.push(`${field} must be one of: ${supportedLighthouseOptions[field].join(', ')}`)
    }
  }
  if (!(lighthouse.cpuThrottling in supportedLighthouseOptions.cpuThrottling)) {
    errors.push(`cpuThrottling must be one of: ${Object.keys(supportedLighthouseOptions.cpuThrottling).join(', ')}`)
  }
  return errors
}

export const lighthouseFlags = (lighthouse, profileDirectory) => [
  `--preset=${lighthouse.preset}`,
  `--throttling-method=${lighthouse.networkThrottling}`,
  `--throttling.cpuSlowdownMultiplier=${supportedLighthouseOptions.cpuThrottling[lighthouse.cpuThrottling]}`,
  `--chrome-flags="--user-data-dir=${profileDirectory}"`,
]
