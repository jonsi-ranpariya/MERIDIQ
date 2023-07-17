import ExitFullscreenButton from "../button/ExitFullscreen";

import { FC } from "react";
import useEditor from "../../../../../../hooks/useEditor";

export interface SideBySideProps {
  beforeImageUrl: string,
  afterImageUrl: string,
}

const SideBySide: FC<SideBySideProps> = ({
  beforeImageUrl,
  afterImageUrl,
}) => {
  const { aspectRatio, wrapperSize, fullscreen } = useEditor()

  return (
    <div id="fullScreenWrapper" className="flex justify-center items-center" style={{ height: wrapperSize?.height }}>
      <div id="slider-wrapper" className="flex min-w-0 w-full" style={{}}>
        <img src={beforeImageUrl} draggable="false" className="w-1/2" alt="Before" style={{ aspectRatio: aspectRatio }} />
        <img src={afterImageUrl} draggable="false" className="w-1/2" alt="After" style={{ aspectRatio: aspectRatio }} />
        {fullscreen && <ExitFullscreenButton />}
      </div>
    </div>
  );
}

export default SideBySide;