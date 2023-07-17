export interface ErrorProps {
  error?: string | false
}

const Error: React.FC<ErrorProps> = ({
  error,
}) => {
  if (!error) return <></>;
  return <p className="text-xs text-red-500 mt-0.5 first-letter:capitalize">{error}</p>;
}

export default Error;