import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEditor from "../../../../../hooks/useEditor";
import BackToClientDashboard from "../../sections/BackToClientDashboard";
import Movable from "../components/moveable/movable";

export interface EditorProps {

}

const AfterEditor: FC<EditorProps> = () => {

  const { beforeImage, afterImage, setAfterImage } = useEditor();
  const { clientId }: { clientId?: string } = useParams()
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 pt-20 px-4 md:relative md:px-0 md:pt-0">
      <BackToClientDashboard />
      {(afterImage && beforeImage) &&
        <Movable
          beforeImage={beforeImage}
          image={afterImage}
          setImage={setAfterImage}
          onNext={() => navigate(`/clients/${clientId}/before-after/download`)}
          onBack={() => navigate(`/clients/${clientId}/before-after/after/select`)}
        />
      }
    </div>
  );
}

export default AfterEditor;