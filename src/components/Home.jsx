import Alert from './Alert'
import Artworks from './Artworks'
import CreateNFT from './CreateNFT'
import Footer from './Footer'
import Loading from './Loading'
import ShowNFT from './ShowNFT'
import UpdateNFT from './UpdateNFT'
import Header from './Header'
import Hero from './Hero'
import { useParams } from 'react-router-dom'

const Home = () => {
    const { idNFT } = useParams();
    
    return (
        <>
            <div className="gradient-bg-hero">
                <Header />
                <Hero />
            </div>
            <Artworks idNFT={idNFT} />
            <CreateNFT />
            <UpdateNFT />
            <ShowNFT />
            <Alert />
            <Loading />
        </>
    )
}

export default Home;