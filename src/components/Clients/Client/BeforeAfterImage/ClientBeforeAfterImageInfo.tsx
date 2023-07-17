import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import image from '../../../../images/before-after/before_after.jpg';
import strings from "../../../../lang/Lang";
import Button from '@components/form/Button';
import Card from "../../../../partials/Paper/PagePaper";
import BackToClientDashboard from "../sections/BackToClientDashboard";


export interface ClientBeforeAfterImageInfoProps {

}

const ClientBeforeAfterImageInfo: FC<ClientBeforeAfterImageInfoProps> = () => {
  const navigate = useNavigate()
  const { clientId }: { clientId?: string } = useParams()
  return (
    <div className="overflow-y-auto">
      <BackToClientDashboard />
      <Card>
        <div className='px-4 py-2 h-auto text-center'>
          <h2 className="text-2xl font-bold mt-2">{strings.before_after_intro_title}</h2>
          <p className="max-w-xl mx-auto mb-4">{strings.before_after_intro_sub_title}</p>
          <img className="rounded inline" src={image} alt="" style={{ maxHeight: '60vh' }} />
          <div className="mt-6 mb-4 flex justify-center">
            <Button className="" onClick={() => navigate(`/clients/${clientId}/before-after/before/select`)}>
              {strings.start}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ClientBeforeAfterImageInfo;