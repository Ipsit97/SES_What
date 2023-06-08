import { Chart as ChartJS,Tooltip, Legend, BarElement, CategoryScale,LinearScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import './TypeCharts.css';


ChartJS.register(Tooltip, Legend,BarElement, CategoryScale,LinearScale);
ChartJS.register(ChartDataLabels);

const gradientColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  const subTopicGradientColors = [
    "rgba(76, 63, 223, 0.8)",
    "rgba(230, 219, 66, 0.8)",
    "rgba(46, 200, 81, 0.8)",
    "rgba(255, 206, 86, 1)",
    "rgba(233, 117, 11, 0.8)",
  ];

const TypeCharts = (props) => {

    var data = props.message; 
    var selectedTypeComments = [];
    const [labels, setLabels] = useState([]); 
    const [strengthData, setStrengthData] = useState([]);
    const [improvementData, setImprovementData] = useState([]);
    const [commentData, setCommentsData] = useState([]);
    const [storeTableData, setstoreTableData] = useState([]);
    const [selectedCommentsByType, setSelectedCommentsByType] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedIndex, setSelectedIndex] = useState("");    
    const type = ['Improvement','Other Comments','Strength'];

    //Table
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [tableData, setTableData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);    


    function getGradient(context, c1, c2, c3)
    {
      const chartArea = context.chart.chartArea;
      if (!chartArea) {
        return;
      }
      
      var gradient;
      const {ctx, chartArea : {top,bottom, left, right} }= context.chart;
      gradient = ctx.createLinearGradient(left,top,right,bottom);
      gradient.addColorStop(0, c1);
      gradient.addColorStop(0.5, c2);
      gradient.addColorStop(1, c3);
      return gradient;
    }

    useEffect(() => {

        if (data.length > 0) {

            const extractedTopicData = data.map((row) => row['Topics']);
            if (extractedTopicData.length > 0) {
              var counts_strength=[]
              var counts_improvement=[]
              var counts_oComments=[]
              var total_counts = []

              const uniqueValues = [...new Set(extractedTopicData)];

              for(var i=0;i<uniqueValues.length;i++)
              {
                counts_strength.push(data.filter((row) => row['Topics'] === uniqueValues[i]).filter((row) => row['Type'] === 'Strength').length);
                counts_improvement.push(data.filter((row) => row['Topics'] === uniqueValues[i]).filter((row) => row['Type'] === 'Improvement').length);
                counts_oComments.push(data.filter((row) => row['Topics'] === uniqueValues[i]).filter((row) => row['Type'] === 'Other Comments').length);
                total_counts.push(counts_strength[i]+counts_improvement[i]+counts_oComments[i]);
              }

              const sortedIndices = total_counts.map((value, index) => index)
              .sort((a, b) => total_counts[a] - total_counts[b]);
  
              const sortedArray_strength = sortedIndices.map((index) => counts_strength[index]);
              const sortedArray_improv = sortedIndices.map((index) => counts_improvement[index]);
              const sortedArray_oComments = sortedIndices.map((index) => counts_oComments[index]);
              const sortedArray_labels = sortedIndices.map((index) => uniqueValues[index]);

              
              console.log(counts_strength);
              console.log(counts_improvement);
              console.log(counts_oComments);

              setStrengthData(sortedArray_strength);
              setImprovementData(sortedArray_improv);
              setCommentsData(sortedArray_oComments);
              setLabels(sortedArray_labels);

            }
          }


    },[data]);

    const data1 = {
      labels : labels,
      datasets: [
        {
          label:'Improvements',
          data: improvementData,
          backgroundColor:'#fd5e53',
          borderColor: '#dc143c',
          borderWidth: 2,
        },
        {
          label:'General',
          data: commentData,
          backgroundColor:'#DBA800',
          borderColor: '#a0522d',
          borderWidth: 2,
        },
        {
          label:'Strengths',
          data: strengthData,
          backgroundColor: '#32CD32',
          borderColor: '#355E3B',
          borderWidth: 2,
        },
      ],
    };    

    const options = {
        plugins: {
          tooltip: {
            enabled: true,
          },
          legend: {
            display: true,
            position:'right',
            align:'top',
            labels: {
              // Define text for the legend
              generateLabels: function (chart) {
                return chart.data.datasets.map((dataset) => {
                  return {
                    text: dataset.label,
                    fillStyle: dataset.backgroundColor,
                    hidden: false,
                    lineCap: 'butt',
                    fontColor:'white',
                    boxWidth: 1,
                  };
                });
              },
          },
        },
          datalabels: {
            display: false,
            font: {
              weight: 'bold',
              size: 7
          }
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks:
            {
              color:'white',
            },
            grid:
            {
              drawOnChartArea: false, 
            },
            border:
            {
              color:'white',
            }
          },
          y: {
            stacked: true,
            ticks:
            {
              color:'white',
            },
            grid:
            {
              drawOnChartArea: false, 
            },
            border:
            {
              color:'white',
            }
          }
        },
        maintainAspectRatio: false,
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const hoveredElement = elements[0];
            const datasetIndex = hoveredElement.datasetIndex;
            const index = hoveredElement.index;
    
            // Access x and y axis values
            const topicVal = data1.labels[index];

            const filteredResults = data.filter((row) => row['Topics'] === topicVal)
            const filteredResultsbyType = filteredResults.filter((row) => row['Type'] === type[datasetIndex]);
            selectedTypeComments = filteredResultsbyType.map((item) => item.Comments);

            if (selectedTypeComments.join(',') !== storeTableData.join(',')) {
              setstoreTableData(selectedTypeComments);
            }

            setSelectedCommentsByType(storeTableData);
            setSelectedTopic(topicVal);
            setSelectedIndex(datasetIndex);
          }
        },
      }; 
      
    useEffect(() => {
        // Simulated data fetch
        const fetchData = () => {
          // Assuming you have an array of data
    
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = storeTableData.slice(startIndex, endIndex);
    
          setTableData(paginatedData);
          setTotalPages(Math.ceil(storeTableData.length / itemsPerPage));
        };
    
        fetchData();
      }, [currentPage,storeTableData]);
    
      const handlePageChange = (page) => {
        setCurrentPage(page);
      };

      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      const getPageNumbersToShow = () => {
        const maxPageButtons = 3; // Number of page buttons to display at a time
        const pageNumbers = [];
    
        if (totalPages <= maxPageButtons) {
          // Display all page buttons if the total number of pages is less than or equal to the maxPageButtons
          for (let page = 1; page <= totalPages; page++) {
            pageNumbers.push(page);
          }
        } else {
          // Calculate the starting and ending page numbers to display
          let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
          let endPage = startPage + maxPageButtons - 1;
    
          if (endPage > totalPages) {
            // Adjust the starting and ending page numbers if the calculated range exceeds the total number of pages
            startPage = totalPages - maxPageButtons + 1;
            endPage = totalPages;
          }
    
          // Add the page numbers to the array
          for (let page = startPage; page <= endPage; page++) {
            pageNumbers.push(page);
          }
        }
    
        return pageNumbers;
      };

      
      

    return (
        <div>

            <h2 className="text-color-topic">Topics</h2> 

            <div className="topicsByTypeContainer">    
            <Bar
                data={data1}
                options={options}
            />
            </div>

            <div className="vertDivider"></div>

            <h2 className="text-color-type">Comments For Type:</h2> <p className='style_topic_type'>{selectedTopic}</p>

            <div className='tableStyle'>
        <table className="styled-type-table">
        <thead>
          <tr>
            <th>{type[selectedIndex]}</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((comments,i) => (
            <tr key={i}>
              <td>{comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="paginationStyle">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="arrow-button">
        <span className="arrow">&lt;</span> {/* Left arrow */}
        </button>
        {getPageNumbersToShow().map((page) => (
          <button
            key={page}
            className={page === currentPage ? 'active' : ''}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="arrow-button">
        <span className="arrow"> &gt;</span>  {/* Right arrow */}
        </button>
      </div>
      </div>
      </div>

        
      );
}

export default TypeCharts;