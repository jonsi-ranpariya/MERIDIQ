import Button from "@components/form/Button";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import strings from "../../lang/Lang";

export interface FullPageErrorProps {
    code?: number
    message: string
}

const FullPageError: React.FC<FullPageErrorProps> = ({
    code, message
}) => {
    const { user } = useAuth();

    return (
        <div className="w-screen h-screen fixed top-0 bottom-0 left-0 right-0 bg-white dark:bg-black grid place-items-center" style={{ zIndex: 999 }}>
            <div className="text-center flex flex-col items-center">
                <h2 className="text-8xl font-black mb-10 ">{strings.Oops}!</h2>
                <p className="text-2xl uppercase font-medium dark:text-gray-400 mb-4">{code || 500} | {message}</p>
                <Link to={user?.user_role === 'master_admin' ? '/admin' : '/'} replace>
                    <Button>{strings.GoToHome}</Button>
                </Link>
            </div>
        </div>
    );
}

export default FullPageError;