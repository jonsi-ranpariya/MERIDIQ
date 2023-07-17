import LoadingIcon from "@icons/Loading";
import strings from "@lang/Lang";
import { Suspense } from "react";

export interface SectionLoadingProps {

}

export const SectionLoading: React.FC<SectionLoadingProps> = () => {
  return (
    <div className='w-full flex justify-center py-8 lg:py-12 items-center space-x-2'>
      <LoadingIcon className='text-primary text-xl' />
      <p className='text-mediumGray'>{strings.Loading}...</p>
    </div>
  );
}

export interface SectionSuspenseProps {
  children: React.ReactNode
}

const SectionSuspense: React.FC<SectionSuspenseProps> = ({
  children
}) => {
  return (
    <Suspense fallback={<SectionLoading />}>
      {children}
    </Suspense>
  );
}

export default SectionSuspense;