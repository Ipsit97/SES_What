import { useState, useEffect, useRef} from 'react';
import Papa from 'papaparse';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { color } from 'chart.js/helpers';
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ReactSpeedometer from "react-d3-speedometer"
// import Divider from "@material-ui/core/Divider";
// import Divider from "@mui/material"

import GlobalSentiment from './GlobalSentiment.js';
import ComparisonGraphs from './ComparisonGraphs';
import TypeCharts from './TypeCharts.js';


import './App.css';
import TopicsChart from './TopicsChart';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);




function App() {

  const [data, setData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [subtopicData, setSubTopicData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState([]);
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  const [subTopicChartData, setSubTopicChartData] = useState({});
  const [showSubTopicChart, setShowSubTopicChart] = useState(false);
  const [SubTopicSelected, setSubTopicSelected] = useState("");
  const [hasTableData, sethasTableData] = useState(false);
  const [showSubTopicColumn, setShowSubTopicColumn] = useState(false);
  const [speedometerValue, setSpeedometerValue] = useState(0);
  const [positiveVal, setPositiveVal] = useState(0);
  const [negativeVal, setNegativeVal] = useState(0);
  const [neutralVal, setNeutralVal] = useState(0);
  const [PositiveAni, setPositiveAni] = useState(false);
  const [NegativeAni, setNegativeAni] = useState(false);
  const [NeutralAni, setNeutralAni] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const maxJumpCount = 5;


  // parse CSV data & store it in the component state

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        setData(results.data);
      }
    });
  };

    useEffect(() => {
      const interval = setInterval(startJumpAnimation, 2000);
      return () => clearInterval(interval);
    }, []);
  
    const startJumpAnimation = () => {
      setJumpCount(0);
      jumpAnimation();
    };
  
    const jumpAnimation = () => {
      setJumpCount((prevJumpCount) => prevJumpCount + 1);
  
      if (jumpCount < maxJumpCount) {
        setTimeout(jumpAnimation, 500);
      }
    };

  



  return (
    <div className="App">

    <input type="file" accept=".csv" onChange={handleFileUpload} />

{/* Global Sentiment */}
    <div>
    <GlobalSentiment message={data}/>
    </div>


{/* Plot Graphs */}
<div>
    <ComparisonGraphs/>
    </div>    


  {/* outer component */}
 
<div className='outer-component'>

  <div>
    <TopicsChart message={data}/>
  </div>
      
  </div>  

  <div className='graphs-component'>

  <div>
    <TypeCharts message={data}/>
  </div>
      
  </div> 












    <br /><br />

</div>

  );
}

export default App;










