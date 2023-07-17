import bg from "../../images/bg/login_bg.svg";
import doctor from "../../images/bg/login_doctor.png";

export interface LoginSideImageProps {

}

const LoginSideImage: React.FC<LoginSideImageProps> = () => {
  return (
    <div className="w-full h-full relative">
      <img src={bg} alt="" className="absolute h-full w-full object-cover" />
      <img src={doctor} alt="" className="absolute h-full w-10/12 inset-0 pb-12 object-contain mx-auto" style={{ transform: "rotateY(180deg)" }} />
    </div>
  );
}

export default LoginSideImage;