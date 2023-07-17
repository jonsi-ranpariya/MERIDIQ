import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEditor from "../../../../../hooks/useEditor";
import BackToClientDashboard from "../../sections/BackToClientDashboard";
import Movable from "../components/moveable/movable";

export interface EditorProps {

}

const BeforeEditor: FC<EditorProps> = () => {

  const navigate = useNavigate();
  const { beforeImage, setBeforeImage } = useEditor();
  const { clientId }: { clientId?: string } = useParams();

  return (
    <div className="fixed inset-0 pt-20 px-4 md:relative md:px-0 md:pt-0">
      <BackToClientDashboard />
      {beforeImage &&
        <Movable
          image={beforeImage}
          setImage={setBeforeImage}
          onNext={() => navigate(`/clients/${clientId}/before-after/after/select`)}
          onBack={() => navigate(`/clients/${clientId}/before-after/before/select`)}
        />
      }
    </div>
  );
}

export default BeforeEditor;