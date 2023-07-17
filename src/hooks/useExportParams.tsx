export const getExportParams = (node: HTMLDivElement, scale: number) => {

  const style = {
    transform: 'scale(' + scale + ')',
    transformOrigin: 'top left',
    width: node?.offsetWidth + "px",
    height: node?.offsetHeight + "px"
  }

  const param = {
    height: (node?.offsetHeight ?? 0) * scale,
    width: (node?.offsetWidth ?? 0) * scale,
    quality: 1,
    style
  }

  return param
}