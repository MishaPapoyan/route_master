import avatar from '../../../public/image.png';

function Info() {
    return (
        <main className='flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 p-6 md:p-10 bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl shadow-xl'>
            <section className="w-full md:w-5/12">
                <img
                    className="w-full rounded-2xl object-cover shadow-lg transform hover:scale-105 transition duration-500"
                    src={avatar}
                    alt="DispatchPro in action"
                />
            </section>

            <section className="w-full md:w-7/12 space-y-6 text-gray-100">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Your <span className="text-amber-400">All-In-One</span> Dispatch Solution
                </h2>

                <div className="space-y-4 text-lg leading-relaxed">
                    <p>
                        DispatchPro isn't just software — it's your 24/7 partner in the fast-paced world of freight logistics.
                        Designed by veteran dispatchers who understand your daily challenges, our platform helps you streamline
                        your entire workflow from morning to night.
                    </p>

                    <p>
                        Wake up to a clear overview of your available drivers and pending loads. Make calls with all the information
                        at your fingertips — no more scrambling through paperwork. Secure loads with confidence using our real-time
                        market analytics. Track every dollar earned and every expense incurred with financial clarity you've never
                        experienced before.
                    </p>

                    <p className="border-l-4 border-amber-400 pl-4 italic">
                        "The days of lost paperwork and forgotten commitments are over. With DispatchPro,
                        every interaction, every agreement, and every financial transaction is captured
                        perfectly — the first time."
                    </p>

                    <p>
                        Our system remembers what you can't — every driver you've worked with, their preferences and special
                        requirements. Every load you've booked, with complete documentation instantly available. Every payment
                        due and received, with automated reminders and reconciliation.
                    </p>

                    <p className="font-semibold text-white">
                        The result? More loads booked in less time. Happier drivers who want to work with you.
                        And most importantly — more profit in your pocket at the end of each week.
                    </p>
                </div>

            </section>
        </main>
    )
}

export default Info
