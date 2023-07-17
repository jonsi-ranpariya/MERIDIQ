import DynamicQuestionnaires from "./DynamicQuestionnaires";
import StandardQuestionnaires from "./StandardQuestionnaires";

export interface RegPortalQuestionnerProps {

}

const RegPortalQuestionner: React.FC<RegPortalQuestionnerProps> = () => {
  return (
    <div className="space-y-6">
      <StandardQuestionnaires />
      <DynamicQuestionnaires />
    </div>
  );
}

export default RegPortalQuestionner;