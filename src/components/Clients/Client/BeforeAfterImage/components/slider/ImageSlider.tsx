import ExitFullscreenButton from "../button/ExitFullscreen";
import { FC, useMemo } from "react";
import { ComparisonSlider } from "react-comparison-slider";
import useEditor from "../../../../../../hooks/useEditor";

export interface ImageSliderProps {
  beforeImageUrl: string,
  afterImageUrl: string,
}

const ImageSlider: FC<ImageSliderProps> = ({
  beforeImageUrl,
  afterImageUrl,
}) => {

  const { aspectRatio, wrapperSize, fullscreen } = useEditor()

  const aspectW = parseInt(aspectRatio.split('/')[0])
  const aspectH = parseInt(aspectRatio.split('/')[1])

  const ratio = useMemo(() => aspectW / aspectH, [aspectH, aspectW])

  return (
    <div id="fullScreenWrapper" className="flex justify-center items-center">
      <div id="slider-wrapper" style={{ aspectRatio: aspectRatio, height: wrapperSize?.height, width: wrapperSize?.width }}>
        <ComparisonSlider
          defaultValue={50}
          itemOne={<img src={beforeImageUrl} alt="Before" />}
          itemTwo={<img src={afterImageUrl} alt="After" />}
          handleBefore={<div className="bg-white w-px h-full" />}
          handleAfter={<div className="bg-white w-px h-full" />}
          handle={() => <span className="sliderHandle" />}
          aspectRatio={ratio}
          orientation="horizontal"
        />
        {
          fullscreen && <ExitFullscreenButton />
        }
      </div>
    </div>
  );
}

export default ImageSlider;