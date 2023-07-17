import strings from "@lang/Lang";

export interface NoDataTextProps {

}

const NoDataText: React.FC<NoDataTextProps> = () => {
  return (
    <p className='text-gray-600 dark:text-gray-400'>{strings.no_data}</p>
  )
}

export default NoDataText;