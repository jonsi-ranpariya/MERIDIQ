import Heading from "@components/heading/Heading";
import strings from "../../lang/Lang";
import MyProfileInfo from "./MyProfileInfo";

export interface MyProfileProps {

}

const MyProfile: React.FC<MyProfileProps> = () => {

    return (
        <>
            <Heading text={strings.my_profile} variant="bigTitle" className="mb-4" />
            <div className="grid grid-flow-row xl:grid-cols-2">
                <MyProfileInfo />
            </div>
        </>
    );
}

export default MyProfile;