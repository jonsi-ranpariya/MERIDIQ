import Card from "@components/card";
import CustomTabs from "@components/form/CustomTabs";
import Heading from "@components/heading/Heading";
import useLocalStorage from "@hooks/useLocalStorage";
import strings from "@lang/Lang";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LazyTemplates = React.lazy(() => import('@components/Templates/Templates'))
const LazyTreatments = React.lazy(() => import('@components/Treatments/Treatments'))

export interface AllTemplatesProps {

}
const settingsRoutes = [
  '/templates/treatments',
  '/templates/text',
  '/templates/image',
]

const AllTemplates: React.FC<AllTemplatesProps> = () => {

  const { getStoredValue: tab, setStorageValue: setTab } = useLocalStorage<number | null>('treatment_tab_index', 0);
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (pathname === settingsRoutes[0]) setTab(0)
    if (pathname === settingsRoutes[1]) setTab(1)
    if (pathname === settingsRoutes[2]) setTab(2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const tabs = [
    { text: strings.Treatments, Component: <LazyTreatments /> },
    { text: strings.Text, Component: <LazyTreatments type="text" /> },
    { text: strings.Image, Component: <LazyTemplates /> }
  ]

  function onTabChange(index: number) {
    if (tab === null || tab === index) setTab(tab !== null ? null : index)
    navigate(settingsRoutes[index])
  }

  return (
    <>
      <Heading text={strings.Templates} variant="headingTitle" className="mb-4" />
      <Card className="p-2">
        <CustomTabs
          tabs={tabs}
          onChange={onTabChange}
          selectedIndex={tab}
        />
      </Card>
    </>
  );
}

export default AllTemplates;