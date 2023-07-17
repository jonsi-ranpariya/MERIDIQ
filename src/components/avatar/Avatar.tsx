/* eslint-disable jsx-a11y/alt-text */
import image from "../../images/user/avatar.svg";

export interface AvatarProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({
  className: propClassName,
  src = undefined,
  ...props
}) => {

  const className = `rounded-full aspect-square object-cover bg-primary/10 ${propClassName}`

  return (
    <object key={src} data={src} className={className}>
      <img className={className} src={image} {...props} />
    </object>
  );
}

export default Avatar;