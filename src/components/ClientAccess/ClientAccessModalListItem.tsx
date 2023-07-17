import Avatar from "@components/avatar/Avatar";
import api from "@configs/api";
import { User } from "@interface/model/user";
import strings from "@lang/Lang";
import Switch from "@partials/MaterialSwitch";
import { useEffect, useMemo, useState } from "react";
import { generateUserFullName } from "../../helper";

export interface ClientAccessModalListItemProps {
  user: User
  selected?: boolean
  onChange: (userId: number) => Promise<void>
}

const ClientAccessModalListItem: React.FC<ClientAccessModalListItemProps> = ({
  user,
  selected = false,
  onChange: propOnChange,
}) => {

  const isSuperUser = useMemo(() => user.email === user.company?.email, [user])
  const [enabled, setEnabled] = useState(isSuperUser ? true : selected)

  useEffect(() => {
    setEnabled(isSuperUser ? true : selected)
  }, [isSuperUser, selected])

  const [loading, setLoading] = useState(false)

  const onChange = async () => {
    setEnabled(val => !val)
    setLoading(true)
    await propOnChange(user.id)
    setLoading(false)
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-2 flex-grow">
        <Avatar
          className={`h-12 w-12 ${user.deleted_at ? "opacity-30" : ''}`}
          src={user?.profile_photo ? api.storageUrl(user?.profile_photo) : undefined}
          alt={`${generateUserFullName(user)} ${strings.ProfilePicture}`}
        />
        <p className="font-medium text-left mr-2">{generateUserFullName(user)}</p>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={isSuperUser || loading}
        loading={loading}
      />
    </div>
  );
}

export default ClientAccessModalListItem;