import * as React from 'react';
import strings from "../../lang/Lang";
import SearchIcon from '../Icons/Search';

export interface SearchTextFieldProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
}

const SearchTextField: React.FC<SearchTextFieldProps> = (props) => {
    return (
        <div className="relative flex items-center">
            <span className="absolute hidden md:block left-2">
                <SearchIcon className="text-2xl text-mediumGray" />
            </span>
            <input
                type="text"
                placeholder={strings.Search}
                className="pl-3 md:pl-10 w-full pr-3 py-2 bg-white placeholder:text-mediumGray focus-within:bg-white focus-within:shadow outline-none rounded-lg"
                {...props}
            />
        </div>
    );
}

export default SearchTextField;