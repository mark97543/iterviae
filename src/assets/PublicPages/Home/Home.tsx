import './Home.css'
import Welcome from './Parts/WelcomeMessage'
import { useNavigate } from 'react-router-dom'

const Home = () =>{
    const navigate = useNavigate();

    return(
        <div className='home-container'>
            <h1>Iter Viae</h1>
            <h2>The Way of the Road</h2>
            <Welcome/>
            <button className='std-button' onClick={()=>navigate('/login')}>Begin Your Journey</button>
        </div>
    )
}

export default Home