
import * as React from 'react';
import MainCard, { CardProps } from "@components/card/index"

export interface PagePaperProps extends CardProps {
}

const Card: React.FC<PagePaperProps> = ({ ...props }) => {
    return <MainCard  {...props} />
}

export default Card; 