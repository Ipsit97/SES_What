import { useState, useEffect, useRef} from 'react';
import Papa from 'papaparse';
import Select, { components } from "react-select";
import logo from './Logo_UCI.png';
import anteater_logo from './anteater.png';
import ChartDataLabels from "chartjs-plugin-datalabels";
import GlobalSentiment from './GlobalSentiment.js';
import ComparisonGraphs from './ComparisonGraphs';
import TypeCharts from './TypeCharts.js';

import './App.css';
import TopicsChart from './TopicsChart';


const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);
  

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    backgroundColor: bg,
    color: "inherit",

  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};

const allOptions = [
  { value: "Year", label: "Year" },
  { value: "Course", label: "Course" },
  { value: "Category", label: "Category" },
  { value: "Gender", label: "Gender" }
];



function App() {

  const [data, setData] = useState([]);
  // const [showMenu1,setShowMenu1] = useState(false);
  // const [selectedValue1,setSelectedValue1] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  //additon
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
    const [menu_class, setMenuClass] = useState("menu hidden")
    const [isMenuClicked, setIsMenuClicked] = useState(false)

    const [showYearList, setShowYearList] = useState(false);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});

    // toggle burger menu change
    const updateMenu = () => {
      if(!isMenuClicked) {
          setBurgerClass("burger-bar clicked")
          setMenuClass("menu visible")
      }
      else {
          setBurgerClass("burger-bar unclicked")
          setMenuClass("menu hidden")
      }
      setIsMenuClicked(!isMenuClicked)
  }

const handleYearButtonClick = () => {
  setShowYearList(!showYearList);
};

const handleCategoryButtonClick = () => {
  setShowCategoryList(!showCategoryList);
};

const handleCheckboxChange = (event, itemId) => {
  setCheckedItems((prevCheckedItems) => ({
    ...prevCheckedItems,
    [itemId]: event.target.checked,
  }));
};

//done


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

  const Icon = () => {
    return (
      <svg height="20" width="20" viewBox="0 0 20 20">
        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
      </svg>
    );
  };

  // useEffect(() => {
  //   const handler = () => setShowMenu1(false);

  //   window.addEventListener("click", handler);
  //   return () => {
  //     window.removeEventListener("click",handler);
  //   }
  // });

  // const handleInputClick1 = (e) => {
  //   e.stopPropagation();
  //   setShowMenu1(!showMenu1);
  // };

  // const getDisplay_dropdown1 = () => {
  //   if(selectedValue1)
  //     return selectedValue1.label;
  //   return "Sentiments";  
  // };

  // const onItemClick1 = (option) => {
  //   setSelectedValue1(option);
  // }

  // const isSelected1 = (option) => {
  //   if(!selectedValue1)
  //     return false;
  //   return selectedValue1.value === option.value;  
  // }

  // const options_menu1 = [
  //   {value:"# of Comments", label:"# of Comments"},
  //   {value:"Sentiments", label:"Sentiments"},
  // ];

  const handleButtonClick = () => {

      const filteredResults = data.filter((row) => row['Year'] === '2019').filter((row) => row['Type'] === 'Strength');
      setData(filteredResults);
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


    {/* <div>
    <Select className='dropDown-style'
        defaultValue={[]}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        onChange={(options) => {
          if (Array.isArray(options)) {
            setSelectedOptions(options.map((opt) => opt.value));
          }
        }}
        options={allOptions}
        components={{
          Option: InputOption
        }}
      />
    </div>
        <div>
        <button onClick={handleButtonClick} className="styleButton">Apply</button>
        </div> */}

      
{/* ADDITION */}

<div style={{position:'absolute'}}>
            <nav>
                <div className="burger-menu" onClick={updateMenu}>
                    <div className={burger_class} ></div>
                    <div className={burger_class} ></div>
                    <div className={burger_class} ></div>
                </div>
            </nav>

            <div className={menu_class}></div>

    </div>
    </div>
    <p className='style-text_heading'>WELCOME TO SES_WHAT?</p>

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










