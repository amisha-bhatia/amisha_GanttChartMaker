import TimelineDbData from "./components/TimelineDbData";
import './App.css';

const handleClose = () => {
  window.open("", "_self").close();
};

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>SMTライン 稼働状況グラフ </h2>
      <button id="close-btn" onClick={handleClose}>
        閉じる
      </button>
      <TimelineDbData />
    </div>
  );
}

export default App;
