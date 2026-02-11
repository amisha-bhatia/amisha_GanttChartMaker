import TimelineDbData from "./components/TimelineDbData";
import './App.css';


function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>SMTライン 稼働状況グラフ </h2>
      <TimelineDbData />
    </div>
  );
}

export default App;
