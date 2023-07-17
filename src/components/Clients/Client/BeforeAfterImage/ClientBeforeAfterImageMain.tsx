import MasterHoC from "@components/Master";
import { FC } from "react";
import { EditingProvider } from "../../../../provider/EditingProvider";

export interface ClientBeforeAfterImageMainProps {

}

const ClientBeforeAfterImageMain: FC<ClientBeforeAfterImageMainProps> = () => {
  return (
    <EditingProvider>
      <MasterHoC />
    </EditingProvider>
  );
}

export default ClientBeforeAfterImageMain;