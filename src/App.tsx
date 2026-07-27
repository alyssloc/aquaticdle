import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Aquaticdle from "./components/Aquaticdle";
import InfoPopup from "./components/Info"
import Archive from "./components/Archive"

const ArchiveGameWrapper = () => {
    const { date } = useParams();
    return <Aquaticdle archiveDate={date} />;
};

export default function App() {
    return (
        <Router>
            <InfoPopup />
            <Routes>
                <Route path="/" element={<Aquaticdle />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/archive/:date" element={<ArchiveGameWrapper />} />
            </Routes>
        </Router>
    );
}