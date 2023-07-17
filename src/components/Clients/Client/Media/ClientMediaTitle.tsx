export interface ClientMediaTitleProps {
  title: string
}

const ClientMediaTitle: React.FC<ClientMediaTitleProps> = ({
  title,
}) => {
  return (
    <h3 className="text-base font-medium mb-2 text-gray-600 dark:text-gray-300">{title}</h3>
  );
}

export default ClientMediaTitle;