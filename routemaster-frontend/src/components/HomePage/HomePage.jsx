import Info from "./Info.jsx";
import Header from "./Header.jsx";
import CompaniesInfo from "./CompaniesInfo.jsx";

const HomePage = () => {
    const data = {
        companyName: 'SkyNet',
        mc: "519941",
        dot: 'DOT',
        POT: "POT"
    }
    return (
        <div className='flex flex-col'>
            <Header />
            <div className=''>
                <Info className='w-1/4'/>
                <CompaniesInfo data={data} className='w-1/4'/>
            </div>
        </div>
    );
};

export default HomePage;