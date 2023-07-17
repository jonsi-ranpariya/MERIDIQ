export interface PageTargetBlankLinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    children: React.ReactChild
}

const PageTargetBlankLink: React.FC<PageTargetBlankLinkProps> = ({ children, ...props }) => {
    return (
        <a className="text-gray-900 dark:text-gray-100 hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    );
}

export default PageTargetBlankLink;