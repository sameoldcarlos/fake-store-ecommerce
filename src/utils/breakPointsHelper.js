// Reference: https://getbootstrap.com/docs/5.0/layout/breakpoints/#max-width
const maxWidthBreakPoints = {
  extraSmall: 575.98,
  small: 767.98,
  medium: 991.98,
  large: 1199.98,
  extraLarge: 1399.98
}

export const devices = {
  mobile: 'mobile',
  highResMobile: 'highResMobile',
  tablet: 'tablet',
  lowResDesktop: 'lowResDesktop',
  desktop: 'desktop'
}

export function getDeviceType() {
  const screenWidth = window.innerWidth
  const {extraSmall, small, medium, large} = maxWidthBreakPoints
  
  if (screenWidth <= extraSmall) {
    return devices.mobile
  }

  if (screenWidth <= small) {
    return devices.highResMobile
  }

  if (screenWidth <= medium) {
    return devices.tablet
  }

  if (screenWidth <= large) {
    return devices.lowResDesktop
  }

  return devices.desktop
}
