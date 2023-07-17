import Card from '@components/card';
import Button from '@components/form/Button';
import * as React from 'react';
import Heading from '../../components/heading/Heading';
import dashboardImage from '../../images/bg/dashboard.svg';
import strings from '../../lang/Lang';

export interface StartProps {

}


const urls = [
  "https://meridiq.com/quick-guide/",
  "https://online.meridiq.com",
  "https://meridiq.com/documentation/",
]
const urls_sv = [
  "https://meridiq.com/sv/snabbguide/",
  "https://online.meridiq.com",
  "https://meridiq.com/sv/dokumentation/",
]

const Dashboard: React.FC<StartProps> = () => {

  const isEnglish = strings.getLanguage() === "en"
  const links = isEnglish ? urls : urls_sv

  return (
    <div className="">
      <Heading text={strings.dashboard} variant='headingTitle' />
      <div className="text-center py-2">
        <Heading variant='headingTitle' text={`${strings.Welcome_to} ${strings.MERIDIQ}`} />
        <p className='max-w-2xl mt-4 mx-auto text-gray-500'>{strings.dashboard_description}</p>
      </div>
      <img src={dashboardImage} alt="" className='mt-10 hidden md:block px-8 mx-auto' />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <DashboardCard
          icon={undefined}
          title={strings.onboardingVideos}
          buttonText={strings.watchVideos}
          onClick={() => window.open(links[0])}
        />
        <DashboardCard
          icon={undefined}
          title={strings.bookAnOnboardingMeeting}
          buttonText={strings.book}
          onClick={() => window.open(links[1])}
        />
        <DashboardCard
          icon={undefined}
          title={strings.learnMoreAboutMeridiq}
          buttonText={strings.learnMore}
          onClick={() => window.open(links[2])}
        />
      </div>
    </div>
  );
}

export interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  buttonText: string
  onClick?: () => void
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  buttonText,
  onClick,
}) => {
  return (
    <Card className='py-6 justify-center items-center flex flex-col'>
      <p className='font-semibold text-dimGray dark:text-gray-300 text-center mb-4'>
        <span>{icon}</span>
        <span>{title}</span>
      </p>
      <Button
        variant="ghost"
        size="small"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Card>
  );
}

export default Dashboard;