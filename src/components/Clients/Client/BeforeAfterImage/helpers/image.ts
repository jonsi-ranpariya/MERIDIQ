export function calculateAspectRatioFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number) {

  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

export function openFullscreen(elem: HTMLDivElement) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    // @ts-ignore
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    // @ts-ignore
    elem.webkitRequestFullscreen();
    // @ts-ignore
  } else if (elem.msRequestFullscreen) { /* IE11 */
    // @ts-ignore
    elem.msRequestFullscreen();
  }
}

export function isiOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}


export function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore
    document.webkitExitFullscreen();
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen();
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    // @ts-ignore
    document.msExitFullscreen();
  }
}

export function resizeWrapper(
  ref: React.MutableRefObject<undefined>,
  image: File, setWrapperSize: React.Dispatch<React.SetStateAction<{
    height: number;
    width: number;
  }>>
) {

  var url = URL.createObjectURL(image);
  var img = new Image();

  // @ts-ignore
  const rootEl = ref.current?.getRootElement() as HTMLDivElement;

  img.onload = function () {

    const wrapper = document.getElementById('editor_wrapper') as HTMLDivElement;

    const calSize = calculateAspectRatioFit(img.width, img.height, wrapper.clientWidth, img.height)

    const canvasWrapper = document.getElementsByClassName('tui-image-editor-canvas-container')[0] as HTMLDivElement;
    const canvasLower = document.getElementsByClassName('lower-canvas')[0] as HTMLDivElement;
    const canvasUpper = document.getElementsByClassName('upper-canvas ')[0] as HTMLDivElement;

    if (rootEl) {
      rootEl.style.height = `${calSize.height}px`;
      rootEl.style.maxHeight = `${calSize.height}px`;
      setWrapperSize({ width: calSize.width, height: calSize.height });
    }

    if (canvasWrapper) {
      canvasWrapper.style.height = `${calSize.height}px`;
      canvasWrapper.style.width = `${calSize.width}px`;
      canvasWrapper.style.maxHeight = `${calSize.height}px`;
      canvasWrapper.style.maxWidth = `${calSize.width}px`;

      canvasLower.style.maxHeight = `${calSize.height}px`;
      canvasLower.style.maxWidth = `${calSize.width}px`;
      canvasUpper.style.maxHeight = `${calSize.height}px`;
      canvasUpper.style.maxWidth = `${calSize.width}px`;
    }

    URL.revokeObjectURL(img.src);
  };

  img.src = url;
}