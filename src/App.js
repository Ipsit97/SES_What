import { useState, useEffect, useRef} from 'react';
import Papa from 'papaparse';
import Select, { components } from "react-select";
import logo from './Logo_UCI.png';
import anteater_logo from './anteater.png';
import ChartDataLabels from "chartjs-plugin-datalabels";
import GlobalSentiment from './GlobalSentiment.js';
import ComparisonGraphs from './ComparisonGraphs';
import TypeCharts from './TypeCharts.js';
import './NavBar.css';

import './App.css';
import TopicsChart from './TopicsChart';


function App() {

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  //additon
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
  const [menu_class, setMenuClass] = useState("menu hidden")
  const [isMenuClicked, setIsMenuClicked] = useState(false)
  const [filterData, setFilterData] = useState({})
  const [selectedDictionary, setSelectedDictionary] = useState({});
  const [expandedKey, setExpandedKey] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);

    // toggle burger menu change
    const updateMenu = () => {
      if(!isMenuClicked) 
      {
          setBurgerClass("burger-bar clicked")
          setMenuClass("menu visible")

          // Add items to the list
          const extractedData = [];
          const columnsToExclude = ["Comments","OriginalC","Topics","SubTopics","Sentiment"];

          data.forEach((row) => {
            const extractedRow = {};
            Object.keys(row).forEach((key) => {
              if (!columnsToExclude.includes(key)) {
                extractedRow[key] = row[key];
              }
            });

            extractedData.push(extractedRow);
          });
          const columns = Object.keys(extractedData[0]);
          console.log(columns);
          
          var dictForFilter = {};

          for(var i =0;i<columns.length;i++)
          {
            const extractedColumnData = data.map((row) => row[columns[i]]);

            if (extractedColumnData.length > 0) {
              const uniqueValues = [...new Set(extractedColumnData)];
              if(uniqueValues.length < 10)
              {
                dictForFilter[columns[i]] = uniqueValues;
              }
          }
        }

        setFilterData(dictForFilter);
      }
      else 
      {
          setBurgerClass("burger-bar unclicked")
          setMenuClass("menu hidden")
      }
      setIsMenuClicked(!isMenuClicked)
  }



  // parse CSV data & store it in the component state

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        setData(results.data);
        setOriginalData(results.data);
      }
    });
  };

  const Icon = () => {
    return (
      <svg height="20" width="20" viewBox="0 0 20 20">
        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
      </svg>
    );
  };

  // const handleButtonClick = () => {

  //     const filteredResults = data.filter((row) => row['Year'] === '2019').filter((row) => row['Type'] === 'Strength');
  //     setData(filteredResults);
  //   };

  const handleButtonClick =() => {

    var extractedColumnData = data;

    if(Object.keys(selectedDictionary).length === 0)
    {
      setData(originalData);
    }
    else
    {
      Object.entries(selectedDictionary).map(([key, values]) => 
      (
        extractedColumnData = extractedColumnData.filter((row) => row[key] === values)
      ))
     setData(extractedColumnData);
    }
  }; 

  const handleKeyClick = (key) => {
    if (key === expandedKey) {
      setExpandedKey(null);
    } else {
      setExpandedKey(key);
    }
  };

const handleCheckboxChange = (value) => {
  const updatedSelectedValues = [...selectedValues];
  const keyWithValue = Object.entries(filterData).findIndex(([key, values]) => values.includes(value));
  if (keyWithValue !== -1) {
    const key = Object.keys(filterData)[keyWithValue];
    if (updatedSelectedValues.includes(value)) {
      updatedSelectedValues.splice(updatedSelectedValues.indexOf(value), 1);
      setSelectedValues(updatedSelectedValues);
      delete selectedDictionary[key];
      console.log(`Checkbox with value '${value}' from key '${key}' is unchecked.`);
    } else {
      updatedSelectedValues.push(value);
      setSelectedValues(updatedSelectedValues);
      setSelectedDictionary((prevState) => ({
        ...prevState,
        [key]: value
      }));
      console.log(`Checkbox with value '${value}' from key '${key}' is checked.`);
    }
  }
};


  return (
    <div className="App">

    <div className='topBar'>
      <div className='logo-style'>
      <img src={logo} alt="Logo" className='UCI_logo'/>
      </div>

    <div className='anteater-logo-style'>
    <img src={anteater_logo} alt="Logo" className='anteater_logo'/>
    </div>

    </div>

    <div className='border-style'>

    {/* Adding Hamburger   */}
    <div style={{width: '100%', height: '100vh'}}>
            <nav>
                <div className="burger-menu" onClick={updateMenu}>
                    <div className={burger_class} ></div>
                    <div className={burger_class} ></div>
                    <div className={burger_class} ></div>
                </div>
            </nav>

            <div className={menu_class}>

      <h2 className="filters-style">Select filters:</h2>
      <div className="dictionary-container">
      {Object.entries(filterData).map(([key, values]) => (
        <div key={key}>
          <h3 onClick={() => handleKeyClick(key)} className="value-heading">{key}</h3>
          {expandedKey === key && (
            <ul className="value-list">
              {values.map((value, index) => (
                <li key={index} className="value-item">
                    <label>

                    <input
                      type="checkbox"
                      checked={selectedValues.includes(value)}
                      onChange={() => handleCheckboxChange(value)}
                    />
                    <span className="value-subitem">{value}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <hr className="value-group-divider" />
        </div>
      ))}
    </div>


    <button onClick={handleButtonClick} className="style-button-apply">Apply</button>


            </div>
        </div>

    {/* <!------> */}

    <p className='style-text_heading'>MINING STUDENT EVALUATIONS</p>
    </div>

    <input type="file" accept=".csv" onChange={handleFileUpload} />



{/* Global Sentiment */}
    <div>
    <GlobalSentiment message={data}/>
    </div>


{/* Plot Graphs */}
<div style={{zIndex:1}}>
    <ComparisonGraphs message={data}/>
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










