import InfoCard from "@components/form/InfoCard";


export interface ServerErrorProps {
    error: boolean | string | undefined,
    className?: string
}

const ServerError: React.FC<ServerErrorProps> = ({ error = false, className = 'mb-4' }) => {
    if (!error) return <></>

    return (
        <InfoCard message={error} />
    )
}

export default ServerError;