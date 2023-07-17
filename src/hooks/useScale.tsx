import { useMemo } from "react";
import { useWindowSize } from "./useWindowSize"

export const useScale = () => {
  const size = useWindowSize()

  const scale = useMemo(() => {
    let mScale = 2;
    if (size.width && size.width < 1000) mScale = 3;
    if (size.width && size.width < 600) mScale = 4;
    return mScale;
  }, [size.width])

  return scale;
}