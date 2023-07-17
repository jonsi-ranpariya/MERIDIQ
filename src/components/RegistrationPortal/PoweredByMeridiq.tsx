import AnchorLink from "@components/link/AnchorLink";
import strings from "@lang/Lang";

export interface PoweredByMeridiqProps {

}

const PoweredByMeridiq: React.FC<PoweredByMeridiqProps> = () => {
  return (
    <p className="text-center text-sm">{strings.formatString(strings.poweredBy, <AnchorLink target="_blank" rel="noopener noreferrer" href="https://meridiq.com">{strings.MERIDIQ}</AnchorLink>)}</p>
  );
}

export default PoweredByMeridiq;