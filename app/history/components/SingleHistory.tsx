type ReservationProps = {
	reservation: {
		id: number
		purpose: string
		proposedMessage: string
		question: string
		status: string
		interestedProperty: number
		lesseeID: number
		propertyName: string
		lastModified: string
	}
}

export default function SingleHistory({ reservation }: ReservationProps) {

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);

		const options: Intl.DateTimeFormatOptions = {
			day: '2-digit',
			month: 'short', // Use 'long' for full month name
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false, // 24-hour format
		};

		const formattedDate = date.toLocaleString('en-GB', options);

		// Replace the comma between the date and time
		return formattedDate.replace(',', '');
	};

	return (
		<div className="flex w-full flex-col items-start bg-white">
			<div className="flex w-full h-[3.5rem] px-[0.5rem] items-start">
				<div className="flex w-[42rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
					<div className="flex items-center gap-[0.625rem] self-stretch">
						<p className="text-slate-600 text-sm font-medium leading-[1.25rem]">
							{reservation.propertyName}
						</p>
						<p className="text-slate-400 text-xs font-thin leading-[1rem] underline decoration-solid decoration-[1.5%] underline-offset-auto">
							cancel
						</p>
					</div>
				</div>
				<div className="flex w-[17rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
					<div className="flex w-[16rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
						<p className="text-slate-600 text-sm font-medium leading-[1.25rem]">
							{/* 29 Oct 2024 22:45 */}
							{formatDate(reservation.lastModified)}
						</p>
					</div>
				</div>
				<div className="flex w-[7rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
					<div className="flex justify-between items-center self-stretch">
						<div className="flex py-[0.375rem] px-[0.5rem] flex-col justify-center items-center gap-[0.625rem] flex-[1_0_0] rounded-full bg-yellow-100 cursor-default">
							<div className="flex justify-center items-center gap-[0.625rem]">
								<p className="text-yellow-500 text-xs font-medium leading-[1rem]">
									{reservation.status}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-[7rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
					<div className="flex justify-between items-center self-stretch">
						<button className="flex py-[0.375rem] px-[0.5rem] flex-col justify-center items-center gap-[0.625rem] rounded-md border border-[#1E3A8A] hover:border-blue-900 hover:bg-blue-50">
							<div className="flex justify-center items-center gap-[0.625rem]">
								<p className="text-blue-900 text-xs font-medium leading-[1rem]">
									View detail
								</p>
							</div>
						</button>
					</div>
				</div>
				<div className="flex py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
					<div className="flex justify-between items-center self-stretch">
						<button className="flex py-[0.375rem] px-[0.5rem] flex-col justify-center items-center gap-[0.625rem] rounded-md border border-[#1E3A8A] hover:border-blue-900 hover:bg-blue-50">
							<div className="flex justify-center items-center gap-[0.625rem]">
								<p className="text-[#1E3A8A] text-xs font-medium leading-[1rem]">
									View Property
								</p>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start gap-[0.625rem] self-stretch">
				<div className="w-full h-[0.0625rem] bg-slate-200">
				</div>
			</div>
		</div>
	)

}