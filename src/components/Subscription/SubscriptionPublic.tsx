import Button from '@components/form/Button';
import Heading from "@components/heading/Heading";
import useTranslation from '@hooks/useTranslation';
import ClientsIcon from '@icons/Clients';
import UserIcon from '@icons/User';
import * as React from "react";
import { useSearchParams } from 'react-router-dom';
import strings from "../../lang/Lang";
import CheckCircleIcon from "../../partials/Icons/CheckCircle";

const employees = Array.from(Array(15).keys())

const SubscriptionPublic: React.FC = () => {

	const [sliderValue, setSliderValue] = React.useState<number>(0);
	const [searchParams] = useSearchParams();

	const [lang, setLang] = useTranslation()

	const initialValue = searchParams.get('initialValue');
	const requestLang = searchParams.get('lang');

	React.useEffect(() => {

		if (requestLang && ["en", "sv"].includes(requestLang)) {
			setLang(requestLang as "en")
		}

		if (initialValue && parseInt(initialValue) <= 15) {
			setSliderValue(parseInt(initialValue));
		}

		document.documentElement.classList.remove('dark')
		document.body.classList.remove('bg-purpleGray')

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const url = `${process.env.PUBLIC_URL || ''}/sign-up?lang=${lang}`;

	return (
		<div className={`${'max-w-3xl container my-6 px-6'} `}>
			<div className="p-4 bg-white shadow-lg rounded-xl text-dimGray dark:text-white px-6">
				<div className="py-4">
					<p className="text-sm">{strings.numberOfEmployees}</p>
					<div className="relative py-5 flex items-center">
						<input
							type="range"
							min="0"
							max={employees.length}
							onChange={(e) => {
								setSliderValue(parseInt(e.currentTarget.value));
							}}
							value={sliderValue}
							step="1"
							className="w-full h-2 bg-primary/25 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 peer"
						/>
						<span className="peer-hover:opacity-100 z-10 transition-opacity opacity-0 absolute items-center h-2 justify-between pointer-events-none rounded-lg" style={{ width: `calc(${((sliderValue) / (employees.length)) * 100}% - ${sliderValue}px)` }}>
							<div className="absolute -right-6 bottom-5 font-medium bg-primary h-8 w-8 rounded-full rounded-br-none rotate-45 flex justify-center items-center text-white">
								<span className="-rotate-45 text-lg">{sliderValue || "1"}</span>
							</div>
						</span>
						<span className="absolute flex w-full items-center justify-between pointer-events-none px-2.5">
							{[...employees, 16].map(index => <span key={index} className="h-2 w-0.5 bg-primary first-of-type:bg-transparent first-of-type:w-0 last-of-type:bg-transparent last-of-type:w-0" />)}
						</span>
						<span className="absolute flex w-full items-center justify-between pointer-events-none overflow-hidden rounded-lg">
							<span className="bg-primary h-2" style={{ width: `${((sliderValue) / (employees.length)) * 100}%` }} />
						</span>
						<span className="peer-hover:opacity-0 opacity-100 absolute items-center h-2 justify-between pointer-events-none rounded-lg" style={{ width: `calc(${((sliderValue) / (employees.length)) * 100}% - ${sliderValue}px)` }}>
							<div className="absolute -right-6 top-3 font-medium h-8 w-8 rounded-full rounded-tl-none rotate-45 flex justify-center items-center text-primary">
								<span className="-rotate-45 text-xl">{sliderValue || "1"}</span>
							</div>
						</span>
					</div>
					<div className="pt-6 pb-2">
						<Heading
							variant="bigTitle"
							text={`${sliderValue * (lang === 'en' ? 26 : 249)}${lang === 'en' ? '$' : 'kr'}`}
						/>
						<p className="text-sm mt-0.5">{strings.monthly_subscription} ({strings.excl_VAT})</p>
					</div>
					<div className="py-6">
						<p className="uppercase mb-1">{strings.youGet} :</p>
						<div className="flex items-center">
							<IconCountText text={strings.users} count={sliderValue || 1} icon={<UserIcon />} />
							<p className="px-4 text-3xl text-center">+</p>
							<IconCountText text={strings.Clients} count={sliderValue * 500 || 20} icon={<ClientsIcon />} />
						</div>
					</div>
					<div className="pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
						<CheckWithText text={`${strings.Up_to} ${sliderValue || 1} ${strings.Users}`} />
						<CheckWithText text={`${strings.Up_to} ${sliderValue * 500 || 20} ${strings.Clients}`} />
						<CheckWithText text={`${strings.UnlimitedStorage}`} />
						<CheckWithText text={`${strings.CustomerSupport}`} />
					</div>
					<Button
						fullWidth
						size="big"
						type="submit"
						onClick={() => window.open(url)}
					>
						{strings.Register}
					</Button>
				</div>
			</div>
		</div>
	);
};

export interface CheckWithTextProps {
	text: string
}

const CheckWithText: React.FC<CheckWithTextProps> = ({
	text
}) => {
	return (
		<div className="flex items-center space-x-2">
			<CheckCircleIcon className='text-primary text-2xl' />
			<p>{text}</p>
		</div>
	);

}


export interface IconCountTextProps {
	text: string
	count: number | string
	icon: React.ReactNode
}

const IconCountText: React.FC<IconCountTextProps> = ({
	text, count, icon
}) => {
	return (
		<div className="items-center w-full flex space-x-3">
			<span className="bg-primary/[12%] p-3 block rounded-full text-primary text-3xl">
				{icon}
			</span>
			<span>
				<Heading text={count} variant="bigTitle" />
				<p className="-mt-1">{text}</p>
			</span>
		</div>
	);
}

export default SubscriptionPublic;
