import Modal from './Modal'
import Camera, { CameraProps } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export interface IShowCameraModelProps extends CameraProps {
    openModel?: boolean,
    handleClose?: () => void,
}

export function ShowCameraModel({ openModel = false, handleClose = () => {}, ...props }: IShowCameraModelProps) {
    return (
        <Modal
            open={openModel}
            title={"Take A Photo"}
            handleClose={handleClose}
        >
            <div className="p-4 text-error text-left break-all">
                <Camera
                    {...props}
                />
            </div>
        </Modal>
    );
}
