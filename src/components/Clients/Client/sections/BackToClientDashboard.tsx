import strings from "@lang/Lang";
import { Link, useParams } from "react-router-dom";

export interface BackToClientDashboardProps {

}

const BackToClientDashboard: React.FC<BackToClientDashboardProps> = () => {
  const { clientId }: { clientId?: string } = useParams();

  return (
    <div className="flex mb-2">
      <Link to={`/clients/${clientId}`}>
        <p className="text-primary dark:text-primaryLight text-sm font-medium">{"<"} {strings.backToClientDashboard}</p>
      </Link>
    </div>
  );
}

export default BackToClientDashboard;