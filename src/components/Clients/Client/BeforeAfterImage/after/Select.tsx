import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEditor from "../../../../../hooks/useEditor";
import strings from "../../../../../lang/Lang";
import BackToClientDashboard from "../../sections/BackToClientDashboard";
import Select from "../components/select/Select";

export interface SelectProps {

}

const AfterSelect: FC<SelectProps> = () => {

  const { afterImage, setAfterImage } = useEditor();
  const { clientId }: { clientId?: string } = useParams();

  const navigate = useNavigate()

  return (
    <div className="">
      <BackToClientDashboard />
      <Select text={strings.upload_after_image} setImage={setAfterImage} image={afterImage} onNext={() => navigate(`/clients/${clientId}/before-after/after/editor`)} />
    </div>
  );
}

export default AfterSelect;