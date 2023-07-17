import Card from "@components/card";
import CompanyUserConvertSuperUserModal from "@components/CompanySettings/Users/CompanyUserConvertSuperUserModal";
import CompanyUserListItem from "@components/CompanySettings/Users/CompanyUserListItem";
import AddButton from "@components/form/AddButton";
import Select from "@components/form/Select";
import Heading from "@components/heading/Heading";
import api from "@configs/api";
import { CompanyUserResponse } from "@interface/common";
import { User } from "@interface/model/user";
import strings from "@lang/Lang";
import ModalSuspense from "@partials/Loadings/ModalLoading";
import { SectionLoading } from "@partials/Loadings/SectionLoading";
import Table from "@partials/Table/PageTable";
import { lazy, useState } from "react";
import useSWR from "swr";

const CompanyUserDeleteModal = lazy(() => import("@components/CompanySettings/Users/CompanyUserDeleteModal"))
const CompanyUserModal = lazy(() => import("@components/CompanySettings/Users/CompanyUserModal"))
const CompanyUserStatusModal = lazy(() => import("@components/CompanySettings/Users/CompanyUserStatusModal"))

export interface TeamProps {

}


const listFilter = [
  {
    text: strings.All,
    key: 'all',
    filter: 'withTrashed',
    filterType: '=',
    filterValue: 'true',
  },
  {
    text: strings.Active,
    key: 'active',
    filter: 'deleted_at',
    filterType: '=',
    filterValue: null,
  },
  {
    text: strings.InActive,
    key: 'inactive',
    filter: 'onlyTrashed',
    filterType: '!=',
    filterValue: "true",
  }
];

const Team: React.FC<TeamProps> = () => {

  const [openModal, setOpenModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeOpen, setActiveOpen] = useState(false);
  const [superUserOpen, setSuperUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>();

  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data, mutate, error } = useSWR<CompanyUserResponse, Error>(api.userAllFilter({ filter: filter }))

  const loading = !data && !error

  return (
    <>
      <ModalSuspense>
        {openModal &&
          <CompanyUserModal
            openModal={openModal}
            handleClose={() => setOpenModal(false)}
            mutate={mutate}
            selectedUser={selectedUser}
          />
        }
        {deleteOpen &&
          <CompanyUserDeleteModal
            open={deleteOpen}
            handleClose={() => setDeleteOpen(false)}
            mutate={mutate}
            selectedUser={selectedUser}
          />
        }
        {activeOpen &&
          <CompanyUserStatusModal
            open={activeOpen}
            handleClose={() => setActiveOpen(false)}
            mutate={mutate}
            selectedUser={selectedUser}
          />
        }
        {superUserOpen &&
          <CompanyUserConvertSuperUserModal
            open={superUserOpen}
            handleClose={() => { setSuperUserOpen(false); setSelectedUser(undefined) }}
            mutate={async () => { await mutate() }}
            selectedUser={selectedUser}
          />
        }
      </ModalSuspense>
      <div className="flex justify-between mb-4 items-center">
        <Heading text={strings.team} variant="bigTitle" />
        <div className="flex space-x-2 ">
          <div className="w-36">
            <Select
              value={filter}
              onChange={(ev) => setFilter(ev as 'all')}
              displayValue={(val) => listFilter.find(v => v.key === val)?.text}
            >
              {listFilter.map((filter) => (
                <Select.Option value={filter.key} key={`list_filter_${filter.key}`}>{filter.text}</Select.Option>
              ))}
            </Select>
          </div>
          <AddButton
            onClick={() => {
              setSelectedUser(undefined);
              setOpenModal(true);
            }}
          />
        </div>
      </div>
      <Card>
        {
          loading ? <SectionLoading /> :
            <Table>
              <Table.Head>
                <Table.Th>{strings.Name}</Table.Th>
                <Table.Th></Table.Th>
              </Table.Head>
              <Table.Body>
                {data?.data.map((user) => (
                  <CompanyUserListItem
                    key={user.id}
                    user={user}
                    onEditClick={() => {
                      setSelectedUser(user);
                      setOpenModal(true);
                    }}
                    onDeleteClick={(user) => {
                      setSelectedUser(user);
                      setDeleteOpen(true);
                    }}
                    onRestoreClick={(user) => {
                      setSelectedUser(user);
                      setActiveOpen(true);
                    }}
                    onSuperUserClick={(user) => {
                      setSelectedUser(user);
                      setSuperUserOpen(true);
                    }}
                  />
                ))}
              </Table.Body>
            </Table>
        }
      </Card>
    </>
  );
}

export default Team;

