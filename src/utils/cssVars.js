export const getCssVariable = name => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)
