import LogoEdificio from '/src/assets/images/logos/LogoEdificio.svg';
import { Link } from 'react-router-dom'

const LogoComponent = () => {
    return (
        <div className='flex flex-row items-center justify-start'>
            <Link to={"/"}>
                <img src={LogoEdificio} loading="lazy" className="ml-4 w-36" alt="Edificios Murano" />
            </Link>
            <span className='text-dark text-lg font-semibold leading-5 tracking-tighter'>EDIFICIOS MURANO</span>
        </div>
    )
}

export default LogoComponent