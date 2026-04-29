import { useAuth } from '../../../context/AuthContext';
import { useResponsive } from '../../../hooks/useResponsive.ts';
import { useDirectus } from '../../../context/DirectusContext';
import DesktopWrapper from './Parts/Desktop/DesktopWrapper';
import './Main.css';
import MobileLayout from './Parts/Mobile/MobileLayout';





const Dashboard = () => {
    const { user } = useAuth();
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const { isLoading } = useDirectus();


    if (!user) return null; // Component should not render if not authenticated; ProtectedRoute will catch it

    return (
        <div className={`dashboard-container ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading Trip Data...</p>
                </div>
            )}

            {isDesktop ? (<DesktopWrapper />)
                :(isTablet ? (<>Tablet Mode</>) 
                :(isMobile ?(<><MobileLayout /></>)
                :(<>Error</>
            )))}

        </div>
    );
};

export default Dashboard;