
import adminRoutes from "@configs/adminRoutes";
import routes from "@configs/routes";
import useAuth from "@hooks/useAuth";
import React from "react";
import { NavLink } from "react-router-dom";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";

export interface MaterialBreadcrumbsProps {
}

const MaterialBreadcrumbs: React.FC<MaterialBreadcrumbsProps> = ({ ...props }) => {

    const { user } = useAuth()
    const isMasterAdmin = user?.user_role === "master_admin"
    const breadcrumbsList = useReactRouterBreadcrumbs(isMasterAdmin ? adminRoutes() : routes());

    const breadcrumbs = breadcrumbsList.filter((bread, index) => {
        if (!bread.match.route) return false;
        if (isMasterAdmin) {
            return [0, 1].includes(index) ? false : true;
        }
        return index === 0 ? false : true;
    })
    // console.log(breadcrumbsList);

    // Don't render a single breadcrumb.
    if (!breadcrumbs || breadcrumbs.length < 1) {
        return <></>;
    }

    return (
        <div className="flex items-center text-sm font-normal">
            {breadcrumbs.map((bread, index) => {
                const isLast = index === (breadcrumbs.length - 1);
                if (isLast) {
                    return <span className="text-primary dark:text-primaryLight font-semibold" key={`bread_${index}`}>{bread.breadcrumb}</span>
                }
                return (
                    <span key={`bread_${index}`} className="flex items-center space-x-2 mr-2">
                        <NavLink to={bread.match.pathname}>{bread.breadcrumb}</NavLink>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.20302 9.87537C3.07414 9.74644 3.00173 9.57161 3.00173 9.38931C3.00173 9.20701 3.07414 9.03217 3.20302 8.90324L6.60615 5.50012L3.20302 2.09699C3.07779 1.96733 3.00849 1.79367 3.01006 1.61341C3.01163 1.43315 3.08393 1.26071 3.2114 1.13324C3.33886 1.00578 3.5113 0.933473 3.69156 0.931906C3.87182 0.93034 4.04548 0.999636 4.17515 1.12487L8.06433 5.01406C8.19322 5.14298 8.26562 5.31782 8.26562 5.50012C8.26562 5.68242 8.19322 5.85726 8.06433 5.98618L4.17515 9.87537C4.04622 10.0043 3.87138 10.0767 3.68908 10.0767C3.50678 10.0767 3.33195 10.0043 3.20302 9.87537V9.87537Z" fill="currentColor" />
                        </svg>
                    </span>
                )
            })}
        </div>
    )

}

export default MaterialBreadcrumbs;