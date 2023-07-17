import { Tab, Transition } from "@headlessui/react";
import SectionSuspense from "@partials/Loadings/SectionLoading";
import { ReactNode } from "react";

export interface TabType {
  text: string;
  tabCount?: number
  isSign?: boolean
  Component: ReactNode;
}

export interface CustomTabsProps {
  tabs: TabType[]
  selectedIndex?: number | null
  onChange: (index: number) => void
  removeSidePadding?: boolean
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  selectedIndex,
  onChange,
  removeSidePadding = false,
}) => {
  return (
    <>
      <div className="hidden md:block">
        <Tab.Group selectedIndex={selectedIndex ?? 0} onChange={onChange}>
          <Tab.List className="space-x-2 w-full border-b dark:border-gray-700 flex overflow-auto">
            {tabs.map(({ text, tabCount, isSign }, index) => (
              <Tab as="div" key={`tab_btn_${index}`} className={({ selected }) => `  ${selected ? 'bg-primary text-white  ' : 'bg-lightBlue dark:bg-primary/10'} relative min-w-[12rem] outline-none block transition-all font-medium `}>
                {({ selected }) => (
                  <button onClick={() => onChange(index)} className="text-center w-full py-3 px-6">
                    <div className="flex justify-center gap-2">
                      <p className="whitespace-nowrap">{text}</p>
                      {!!tabCount && <span className={`text-xs font-medium p-1 rounded-xl flex justify-center w-6 ${selected && isSign ? "bg-red-500" : "text-primary dark:text-primaryLight bg-white dark:bg-dimGray"}`}>{tabCount}</span>}
                    </div>
                    <span className={`absolute rounded-t w-full bg-primary  left-0 bottom-0 transition-all ${selected ? 'h-0.5' : 'h-0'}`} />
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <SectionSuspense>
            <Tab.Panels className={`${!removeSidePadding && "p-2 md:p-4"} pt-2 md:pt-4`}>
              {tabs.map(({ Component }, index) => (
                <Tab.Panel key={`tab_${index}`} className="outline-none">{Component}</Tab.Panel>
              ))}
            </Tab.Panels>
          </SectionSuspense>
        </Tab.Group>
      </div>
      <div className="block md:hidden space-y-2">
        {tabs.map((val, index) => {
          return (
            <div key={`disclosure_${index}`} className="relative">
              <button
                className={`${selectedIndex === index ? "bg-primary/[15%] dark:bg-primaryLight/10" : ""}  w-full text-primary dark:text-primaryLight z-10 relative rounded-md py-2 px-3`}
                onClick={() => onChange(index)}
              >
                <div className="flex w-full justify-between items-center">
                  <p className="font-medium">{val.text}</p>
                  <div className={`icon text-xl mr-1 transition-all ${selectedIndex === index ? 'rotate-0' : 'rotate-180'}`}>
                    <svg className={`w-2.5`} viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.76117 5.71436L5 2.26941L1.23883 5.71436L0 4.57968L5 6.96182e-05L10 4.57968L8.76117 5.71436Z" />
                    </svg>
                  </div>
                </div>
              </button>

              <SectionSuspense>
                <Transition
                  show={selectedIndex === index}
                  className={`ease-out transition-all z-0 relative ${!removeSidePadding && "px-2"} mt-4 mb-4`}
                  enter="duration-300 origin-top"
                  enterFrom="opacity-0 -translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="duration-[0ms]"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-4"
                >
                  {val.Component}
                </Transition>
              </SectionSuspense>

            </div>
          )
        })}
      </div>
    </>
  );
}

export default CustomTabs;