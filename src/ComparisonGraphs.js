import { useEffect, useState } from "react";
import { Line,PolarArea } from 'react-chartjs-2';
import {Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title,RadialLinearScale,
  ArcElement,} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import './ComparisonGraphs.css';

Chart.register(PointElement,LineController, LineElement,LinearScale, Title,RadialLinearScale,ArcElement,);
Chart.register(ChartDataLabels);


const ComparisonGraphs = (props) => {

  var data = props.message;
  const [showMenu1,setShowMenu1] = useState(false);
  const [showMenu2,setShowMenu2] = useState(false);
  const [selectedValue1,setSelectedValue1] = useState(null);
  const [selectedValue2,setSelectedValue2] = useState(null);
  const [ChartLabelData,setChartLabelData] = useState(null);
  const [ChartData,setChartData] = useState(null);
  const [typeChart,setTypeChart] = useState("");
  const [dataAvailable,setDataAvailable] = useState(false);
  const [valueofdata,setValueOfData] = useState('');

  


    const Icon = () => {
      return (
        <svg height="20" width="20" viewBox="0 0 20 20">
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
      );
    };

    useEffect(() => {
      const handler = () => setShowMenu1(false);

      window.addEventListener("click", handler);
      return () => {
        window.removeEventListener("click",handler);
      }
    });

    useEffect(() => {
      const handler = () => setShowMenu2(false);

      window.addEventListener("click", handler);
      return () => {
        window.removeEventListener("click",handler);
      }
    });

    const handleInputClick1 = (e) => {
      e.stopPropagation();
      setShowMenu1(!showMenu1);
    };

    const handleInputClick2 = (e) => {
      e.stopPropagation();
      setShowMenu2(!showMenu2);
    };

    
      const getDisplay_dropdown1 = () => {
        if(selectedValue1)
          return selectedValue1.label;
        return "Select...";  
      };

      const getDisplay_dropdown2 = () => {
        if(selectedValue2)
          return selectedValue2.label;
        return "Select...";  
      };

      const onItemClick1 = (option) => {
        setSelectedValue1(option);
      }
      const onItemClick2 = (option) => {
        setSelectedValue2(option);
      }

      const isSelected1 = (option) => {
        if(!selectedValue1)
          return false;
        return selectedValue1.value === option.value;  
      }

      const isSelected2 = (option) => {
        if(!selectedValue2)
          return false;
        return selectedValue2.value === option.value;  
      }

    
      const options_menu1 = [
        {value:"# of Comments", label:"# of Comments"},
        {value:"Sentiments", label:"Sentiments"},
      ];

      const options_menu2 = [
        {value:"Category", label:"Category of Comments"},
        {value:"Year", label:"Year"},
        {value:"Type_Class", label:"Grad vs Under_Grad"},
        {value:"Course", label:"Course"},
      ];

      const getDataWithEmptyPoint = (data) => {
        const modifiedData = [null, ...data];
        return modifiedData;
      };

      const handleButtonClick = () => {
        if (data.length > 0) {
          var val="";

          if(selectedValue1.value === "# of Comments")
          {
            setTypeChart("Line");
          }

          if(selectedValue2.value === "Category")
          {
            val = "Type";
          }
          else if(selectedValue2.value === "Year")
          {
            val = "Year";
          }  
          else if(selectedValue2.value === "Type_Class")  
            val = "Grad vs Under_Grad";
          else
            val = "Course";   

          var extractedColumnData = data.filter((row) => row[val]);

          if (extractedColumnData.length > 0) {
            extractedColumnData = data.map((row) => row[val]);
            const uniqueValues = [...new Set(extractedColumnData)];
            const counts = uniqueValues.map((value) =>
            extractedColumnData.filter((v) => v === value).length
            );
            
              setChartLabelData(getDataWithEmptyPoint(uniqueValues));
              setChartData(getDataWithEmptyPoint(counts));
              setDataAvailable(true);
          }
          else
          {
            setDataAvailable(false);
            setValueOfData(val);
          }

      }
    };
  
      const data_lineChart = {
        labels: ChartLabelData,
        datasets: [
          {
            data: ChartData,
            pointBackgroundColor: 'red', // Change data point color
            borderColor: 'white', // Change line color
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10,
            datalabels:
            {
              color:'white',
              anchor:'middle',
              align:'middle',
              formatter: function(value){
                return value;
            },

          }  
          },      
        ],
      };
  
      const options = {
        responsive: true,
        plugins: {
          legend: {
            display:false,
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          y: {
            ticks:
            {
              color:'white',
            },
            grid:
            {
              drawOnChartArea: false, 
              color:'black',
            },
            border:
            {
              color:'white',
            }
          },
          x: {
            ticks:
            {
              color:'white',
            },
            grid:
            {
              drawOnChartArea: false, 
              color:'black',
            },
            border:{
              color:'white',
            }
          },
        },

      };

      const data_polarChart = {
        labels: ChartLabelData,
        datasets: [
          {
            data: ChartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)', 
            'rgba(54, 162, 235, 1)', 
            'rgba(255, 206, 86, 1)',
          ],
            borderWidth: 1,
            datalabels:
            {
              color:'white',
              anchor:'middle',
              align:'middle',
              formatter: function(value){
                return value;
            },
          }  
          },      
        ],
      };

      const polarOptions = {
        responsive: true,
        plugins: {
          legend: {
            display:false,
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          r: {
            grid: {
              color: 'black'
            },
            ticks: {
              color: 'white'
            }
          }
        },
        datalabels: {
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex];
          },
        },
      };

     

    return (
        <div className='graphs_container'>

        <h2 className="text-color-graphs">Evaluate Results By Graph</h2>

{/* DropDown Menu-1 */}
          <div className="dropdown1-container">
        <div onClick={handleInputClick1} className="dropdown-input">
          <div className="dropdown-selected-value">{getDisplay_dropdown1()}</div>
          <div className="dropdown-tools">
            <div className="dropdown-tool">
              <Icon />
            </div>
          </div>
          </div>

        {showMenu1 && (
          <div className="dropdown-menu">
            {options_menu1.map((option) => (
              <div 
              onClick={ () => onItemClick1(option)}
              key={option.value} className={`dropdown-item ${isSelected1(option) && "selected"}`}>
                {option.label}
                </div>
                
            ))}

        </div>)}
      </div>


      {/* DropDown Menu-2 */}
      <div className="dropdown2-container">
        <div onClick={handleInputClick2} className="dropdown2-input">
          <div className="dropdown-selected-value">{getDisplay_dropdown2()}</div>
          <div className="dropdown-tools">
            <div className="dropdown-tool">
              <Icon />
            </div>
          </div>
          </div>

        {showMenu2 && (
          <div className="dropdown-menu">
            {options_menu2.map((option) => (
              <div 
              onClick={ () => onItemClick2(option)}
              key={option.value} className={`dropdown-item ${isSelected2(option) && "selected"}`}>
                {option.label}
                </div>
                
            ))}

        </div>)}
      </div>

      <button onClick={handleButtonClick} className="styleButton_apply">Apply</button>

      <div className="lineChartStyle">
        {typeChart === "Line" && dataAvailable &&<Line data={data_lineChart} options={options} />}
      </div>
      {!dataAvailable && !(valueofdata.length === 0) &&<h2 className="data-notavailable-style">Please enter a column with name: {valueofdata}</h2>}
      <div className="polarChartStyle">  
        {typeChart === "Polar" && <PolarArea data={data_polarChart}  />}
      </div>
      </div>
      );
}

export default ComparisonGraphs;