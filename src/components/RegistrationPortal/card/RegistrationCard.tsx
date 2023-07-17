import Card from "@components/card"
import Heading from "@components/heading/Heading";
import { ReactNode } from "react";
import PoweredByMeridiq from "../PoweredByMeridiq";

export interface RegistrationCardProps {
  children: ReactNode
  title?: string
  fullWidth?: boolean
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  children,
  title,
  fullWidth
}) => {
  return (
    <Card className="pt-6 max-w-4xl mx-auto md:my-12 space-y-8">
      {
        title &&
        <div className="pt-4 pb-3 sm:px-0 md:px-3">
          <Heading text={title} variant="bigTitle" />
        </div>
      }
      <div className={`${!fullWidth && 'max-w-xl'} px-0 md:px-3 mx-auto`}>
        {children}
      </div>
      <div className="pb-3">
        <PoweredByMeridiq />
      </div>
    </Card>
  );
}

export default RegistrationCard;