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
  tablet: 'tablet',
  desktop: 'desktop'
}

export function getDeviceType() {
  const screenWidth = window.innerWidth
  const {extraSmall, small, medium} = maxWidthBreakPoints
  
  if (screenWidth <= extraSmall) {
    return devices.mobile
  }

  if (screenWidth <= small) {
    return devices.tablet
  }

  return devices.desktop
}
