import * as React from 'react';
import strings from '../../lang/Lang';
import PageTitle from '../../partials/Title/PageTitle';
import CompanyDetails from './CompanyDetails';
import CompanyUsers from './Users/CompanyUsers';

export interface CompanySettingsProps {

}

const CompanySettings: React.FC<CompanySettingsProps> = () => {

    return (
        <div className="container mx-auto">
            <PageTitle size="big">
                {strings.CompanySettings}
            </PageTitle>
            <CompanyDetails />
            <CompanyUsers />
        </div>
    );
}

export default CompanySettings;