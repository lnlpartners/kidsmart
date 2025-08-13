import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Upload from "./Upload";

import Children from "./Children";

import Practice from "./Practice";

import Progress from "./Progress";

import AssignmentDetails from "./AssignmentDetails";

import AssignmentsList from "./AssignmentsList";

import Settings from "./Settings";

import Profile from "./Profile";

import SubscriptionTiers from "./SubscriptionTiers";

import FindTutor from "./FindTutor";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Upload: Upload,
    
    Children: Children,
    
    Practice: Practice,
    
    Progress: Progress,
    
    AssignmentDetails: AssignmentDetails,
    
    AssignmentsList: AssignmentsList,
    
    Settings: Settings,
    
    Profile: Profile,
    
    SubscriptionTiers: SubscriptionTiers,
    
    FindTutor: FindTutor,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Upload" element={<Upload />} />
                
                <Route path="/Children" element={<Children />} />
                
                <Route path="/Practice" element={<Practice />} />
                
                <Route path="/Progress" element={<Progress />} />
                
                <Route path="/AssignmentDetails" element={<AssignmentDetails />} />
                
                <Route path="/AssignmentsList" element={<AssignmentsList />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/SubscriptionTiers" element={<SubscriptionTiers />} />
                
                <Route path="/FindTutor" element={<FindTutor />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}