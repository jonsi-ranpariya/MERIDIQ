import ExitFullscreenIcon from "../icons/ExitFullscreen";
import { FC } from "react";
import Button from "./Button";
import { closeFullscreen } from "../../helpers/image";
import strings from "../../../../../../lang/Lang";

export interface ExitFullscreenProps {

}

const ExitFullscreenButton: FC<ExitFullscreenProps> = () => {
  return (
    <div className="absolute right-2 top-2 z-50">
      <Button onClick={closeFullscreen}>
        <span className="hidden sm:inline-block">{strings.exit}</span>
        <span className="inline sm:hidden text-lg"><ExitFullscreenIcon /></span>
      </Button>
    </div>
  );
}

export default ExitFullscreenButton;