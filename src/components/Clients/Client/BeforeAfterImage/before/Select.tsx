import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEditor from "../../../../../hooks/useEditor";
import strings from "../../../../../lang/Lang";
import BackToClientDashboard from "../../sections/BackToClientDashboard";
import Select from "../components/select/Select";

export interface SelectProps {

}

const BeforeSelect: FC<SelectProps> = () => {

  const { beforeImage, setBeforeImage } = useEditor();
  const { clientId }: { clientId?: string } = useParams();

  const navigate = useNavigate()

  return (
    <div>
      <BackToClientDashboard />
      <Select text={strings.upload_before_image} setImage={setBeforeImage} image={beforeImage} onNext={() => navigate(`/clients/${clientId}/before-after/before/editor`)} />
    </div>
  );
}

export default BeforeSelect;