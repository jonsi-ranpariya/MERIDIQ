import useTheme from '@hooks/useTheme';
import { ToastContainer as RealToastContainer, cssTransition } from 'react-toastify';


export interface ToastContainerProps {

}

const ToastContainer: React.FC<ToastContainerProps> = () => {
  const { isDark } = useTheme()

  const Slide = cssTransition({
    enter: "slide-in-bottom",
    exit: "slide-out-left",
  });

  return (
    <RealToastContainer
      position="bottom-left"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      // limit={}
      transition={Slide}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDark ? "dark" : "colored"}
    />
  );
}

export default ToastContainer;