import { useState, useEffect, useRef} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { color } from 'chart.js/helpers';
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import './CommentsTable.css';
import './TopicsChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);


const gradientColors = [
    "rgba(255, 99, 132, 1)",
    "rgb(138, 135, 135)",
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

  function createGradientColors(count, startR, startG, startB) {
    const gradientColors = [];
  
    for (let i = 0; i < count; i++) {
      const factor = i / (count - 1);
      const r = Math.round(startR * (1 - factor));
      const g = Math.round(startG * (1 - factor));
      const b = Math.round(startB * (1 - factor));
      const color = `rgb(${r}, ${g}, ${b})`;
      gradientColors.push(color);
    }
  
    return gradientColors;
  } 

  

const TopicsChart = (props) => {

    var data = props.message;
    var selectedTopicComments = [];
    var selectedTopicSubs = [];
    var selectedSubTopicComments = [];
    const [totalComments, setTotalComments] = useState(0);
    const [chartData, setChartData] = useState({});  
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedComments, setSelectedComments] = useState([]);
    const [selectedSubTopics, setSelectedSubTopics] = useState([]);
    const [subTopicChartData, setSubTopicChartData] = useState({});
    const [filteredResultsForTable, setFilteredResultsForTable] = useState([]);
    const [showSubTopicChart, setShowSubTopicChart] = useState(false);
    const [storeTableData, setstoreTableData] = useState([]);
    const [selectedTopicSentiments, setSelectedTopicSentiments] = useState([]);
    const [sentimentsVal, setSentimentsVal] = useState([0,0,0]);

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

    const handleSubTopicSectionClick = (event, elements) => {
      if (elements && elements.length > 0) {
         
        const index = elements[0].index;
        const subTopic = subTopicChartData.labels[index];

        if(subTopic == selectedTopic)
        {
          setShowSubTopicChart(false);
          setTotalComments(data.length);
        }
        else
        {
          var sentiments = [];
          setSelectedTopic(subTopic);

          console.log(storeTableData);

          selectedComments.map((comments, index) => {

            if(selectedSubTopics[index] === subTopic)
              selectedSubTopicComments.push(comments);
        });

          if (selectedSubTopicComments.join(',') !== storeTableData.join(',')) {
            setstoreTableData(selectedSubTopicComments);
          }
          setCurrentPage(1);

          var selectedSubTopicSentiments = [];
          selectedTopicSentiments.map((sentiment, index) => {

            // selectedSubTopicComments.push(comments)
            if(selectedSubTopics[index] === subTopic)
            selectedSubTopicSentiments.push(sentiment);
        });


          var p=0,n=0,neu=0;
    
          for(var i =0;i<selectedSubTopicSentiments.length;i++)
          {
            if(selectedSubTopicSentiments[i] === 'positive')
              p++;
            else if(selectedSubTopicSentiments[i] === 'negative')
              n++;
            else
              neu++;    
          }
    
          var positive = ((p/(p+n+neu))*100).toFixed(0);
          var neutral = ((neu/(p+n+neu))*100).toFixed(0);
          var negative = 100-(parseInt(positive)+parseInt(neutral));
          sentiments.push(positive);
          sentiments.push(neutral);
          sentiments.push(negative);

          setSentimentsVal(sentiments);
        }
      }
      };  

    const handleSectionClick = (event, elements) => {
        if (elements && elements.length > 0) {
          
          console.log(elements[0].index);
          const index = elements[0].index;
          const topic = chartData.labels[index];

          if(topic === selectedTopic)
          {
    
            const filteredResults = data.filter((row) => row['Topics'] === topic)
            var comments = filteredResults.map((item) => item.Comments);
            setSelectedComments(comments);
                  
            const subtopics = data.filter((row) => row['Topics'] === topic).map((row) => row['SubTopics']);
      
            if (subtopics.length > 0) {
              const uniqueSubTopicsValues = [...new Set(subtopics)];
              const countsSubTopics = uniqueSubTopicsValues.map((value) =>
              subtopics.filter((v) => v === value).length
              );

            const sortedIndices = countsSubTopics.map((value, index) => index)
            .sort((a, b) => countsSubTopics[a] - countsSubTopics[b]);
  
            const sortedArray_labels = sortedIndices.map((index) => uniqueSubTopicsValues[index]);
            var sorted_counts = countsSubTopics.sort((a,b) => a-b);  
      
      
            setSubTopicChartData({
              labels: sortedArray_labels,
              datasets: [
                {
                  data: sorted_counts, 
                  backgroundColor:createGradientColors(sortedArray_labels.length,247,235,95),
                  datalabels:
                  {
                    rotation : function(ctx) {
                      const valuesBefore = ctx.dataset.data.slice(0, ctx.dataIndex).reduce((a, b) => a + b, 0);
                      const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                      const rotation = ((valuesBefore + ctx.dataset.data[ctx.dataIndex] /2) /sum *360);
                      return rotation < 180 ? rotation-90 : rotation+90;
                    },
                  }    
                }
              ]
            });
            setShowSubTopicChart(true);
            setTotalComments(comments.length);
          }
          setSelectedTopic("");
        }
        else
        {
          var sentiments = [];
          const filteredResults = data.filter((row) => row['Topics'] === topic)
          selectedTopicComments = filteredResults.map((item) => item.Comments);
          selectedTopicSubs = filteredResults.map((item) => item.SubTopics);


          if (selectedTopicComments.join(',') !== storeTableData.join(',')) {
            setstoreTableData(selectedTopicComments);
          }

          if (selectedTopicSubs.join(',') !== selectedSubTopics.join(',')) {
            setSelectedSubTopics(selectedTopicSubs);
          }

          setFilteredResultsForTable('');
          setFilteredResultsForTable(filteredResults);
          // if (filteredResults.join(',') !== filteredResultsForTable.join(',')) {
          //   setFilteredResultsForTable(filteredResults);
          // }
          setCurrentPage(1);
          setSelectedTopic(topic);
          setSelectedComments(storeTableData);
          
          // console.log(selectedTopicComments);

          //sentiment
          var selectedSentiments = filteredResults.map((item) => item.Sentiment);
          if (selectedSentiments.join(',') !== selectedTopicSentiments.join(',')) {
            setSelectedTopicSentiments(selectedSentiments);
          }

          var p=0,n=0,neu=0;
    
          for(var i =0;i<selectedSentiments.length;i++)
          {
            if(selectedSentiments[i] === 'positive')
              p++;
            else if(selectedSentiments[i] === 'negative')
              n++;
            else
              neu++;    
          }
    
          var positive = ((p/(p+n+neu))*100).toFixed(0);
          var neutral = ((neu/(p+n+neu))*100).toFixed(0);
          var negative = 100-(parseInt(positive)+parseInt(neutral));
          sentiments.push(positive);
          sentiments.push(neutral);
          sentiments.push(negative);

          setSentimentsVal(sentiments);
        }          

      }};  

    useEffect(() => {
        if (data.length > 0) {
          const extractedColumnData = data.map((row) => row['Topics']);

          if (extractedColumnData.length > 0) {
            const uniqueValues = [...new Set(extractedColumnData)];
            const counts = uniqueValues.map((value) =>
            extractedColumnData.filter((v) => v === value).length
            );

            const sortedIndices = counts.map((value, index) => index)
            .sort((a, b) => counts[a] - counts[b]);

            const sortedArray_labels = sortedIndices.map((index) => uniqueValues[index]);
            var sorted_counts = counts.sort((a,b) => a-b);
      
            setChartData({
              labels: sortedArray_labels,
              datasets: [
                {
                  data: sorted_counts,
                  // backgroundColor: function(context) {
                    
                  //   const colorIndex = context.dataIndex % gradientColors.length;
                  //   let c = gradientColors[colorIndex];
                
                  //     const mid = color(c).desaturate(0.4).darken(0.3).rgbString();
                  //     const start = color(c).lighten(0.5).rotate(270).rgbString();
                  //     const end = color(c).lighten(0.1).rgbString();
                  //     return getGradient(context, start, mid, end);
                  // },
                  backgroundColor:createGradientColors(sortedArray_labels.length,247,235,95),
                  datalabels:
                  {
                    rotation: function(ctx) {
                      const valuesBefore = ctx.dataset.data.slice(0, ctx.dataIndex).reduce((a, b) => a + b, 0);
                      const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                      const rotation = ((valuesBefore + ctx.dataset.data[ctx.dataIndex] /2) /sum *360);
                      return rotation < 180 ? rotation-90 : rotation+90;
                    },
                    
                  }    
                }
      ]
            });
            setTotalComments(data.length);
          }
    
        }
      }, [data]);
    

    const options = {
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            color: '#ffffff',
            display: true,
            formatter: function (value, context) {
              return context.chart.data.labels[context.dataIndex];
            },
            anchor : 'center',
            align : 'center',
            font: {
              weight: 'bold',
              size: 9.5
          }
          },
          
        },
        onClick: handleSectionClick,
      };  

    const optionsSubChart = {
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
    
          },
          datalabels: {
            color: '#ffffff',
            display: true,
            formatter: function (value, context) {
              return context.chart.data.labels[context.dataIndex];
            },
            anchor : 'center',
            align : 'center',
            font: {
              weight: 'bold',
              size: 9.5
          }
          }
        },
        onClick: handleSubTopicSectionClick,
      };  

      const sentimentOptions = {
        cutout: 40,
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            display: false,
            anchor : 'center',
            align : 'center',
          },
        },
      };    


    const backgroundCircle = {
        id: "backgroundCircle",
        beforeDatasetDraw(chart,args,pluginOptions){
            const {ctx} = chart;
            ctx.save();

            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;

            const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
            const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
            const width = outerRadius-innerRadius;
            const angle = Math.PI /100;

            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.strokeStyle = 'grey';
            ctx.arc(xCoor,yCoor,outerRadius-width/2,0,angle*360,false);
            ctx.stroke();
        }
    }  

    

    const positiveSentimentData = {
        datasets: [
          {
            data: [sentimentsVal[0],100-sentimentsVal[0]],
            // data: [10,30],
            backgroundColor: [
              '#00FF00',
              '#28282B',
            ],
            borderColor: [
              '#AAFF00',
              '#28282B',
            ],
            borderWidth: 1,
          },
        ],
      };

    const negativeSentimentData = {
        datasets: [
          {
            data: [sentimentsVal[2],100-sentimentsVal[2]],
            // data: [10,30],
            backgroundColor: [
              '#FF4433',
              '#28282B',
            ],
            borderColor: [
              '#FF4433',
              '#28282B',
            ],
            borderWidth: 1,
          },
        ],
      };

    const neutralSentimentData = {
        datasets: [
          {
            data: [sentimentsVal[1],100-sentimentsVal[1]],
            // data: [10,30],
            backgroundColor: [
              '#FAFA33',
              '#28282B',
            ],
            borderColor: [
              '#FAFA33',
              '#28282B',
            ],
            borderWidth: 1,
          },
        ],
      };

    
    const addPositiveTextCenter = {
    id : 'textCenter',
    beforeDatasetsDraw(chart,args,pluginOptions){
      const {ctx,data} = chart;
      ctx.save();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#00FF00';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(' '+data.datasets[0].data[0]+ '% ',chart.getDatasetMeta(0).data[0].x,chart.getDatasetMeta(0).data[0].y); 
    }
  }

  const addNegativeTextCenter = {
    id : 'textCenter',
    beforeDatasetsDraw(chart,args,pluginOptions){
      const {ctx,data} = chart;
      ctx.save();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#FF4433';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(' '+data.datasets[0].data[0]+ '% ',chart.getDatasetMeta(0).data[0].x,chart.getDatasetMeta(0).data[0].y); 
    }
  }

  const addNeutralTextCenter = {
    id : 'textCenter',
    beforeDatasetsDraw(chart,args,pluginOptions){
      const {ctx,data} = chart;
      ctx.save();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#FAFA33';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(' '+data.datasets[0].data[0]+ '% ',chart.getDatasetMeta(0).data[0].x,chart.getDatasetMeta(0).data[0].y); 
    }
  }


  useEffect(() => {
    // Simulated data fetch
    const fetchData = () => {
      // Assuming you have an array of data

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = storeTableData.slice(startIndex, endIndex);

      setTableData(paginatedData);
      console.log(tableData);
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

  const getRowColor = (value) => {
    if (value === 'positive') {
      return '#0BDA51';
    } else if (value === 'negative') {
      return 'rgb(151, 8, 8)';
    } else if (value === 'neutral') {
      return '#F6BE00';
    } else {
      return 'white';
    }
  };

  const getSentiment = (comment) => {

    var sentiment = ' ';
    sentiment = filteredResultsForTable.filter((row) => row.Comments === comment).map((row) => row.Sentiment);
    return sentiment;

  }

  const addTextCenter = {
    id:'textCenter',
    beforeDatasetDraw(chart,args,pluginOptions) {
      const {ctx,data} = chart;

      ctx.save();
      ctx.font = 'bolder 20px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Number of Comments: ${totalComments} `,chart.getDatasetMeta(0).data[0].x,chart.getDatasetMeta(0).data[0].y);
    }
  }

  


    return (
        <div>
        {!showSubTopicChart && <h2 className="text-color-topic">Topics</h2>} 
        {showSubTopicChart && <h2 className="text-color-topic">SubTopics</h2>} 
        <div className="topicsContainer">    
        {chartData.labels && chartData.datasets && !showSubTopicChart &&(
          <Doughnut
            data={chartData}
            options = {options}
            plugins = {[addTextCenter]}
          />
        )}

      {showSubTopicChart && <Doughnut data={subTopicChartData} options = {optionsSubChart} plugins = {[addTextCenter]}/>}
        </div>
        <div className="vertDivider"></div>

        {!showSubTopicChart &&<h2 className="text-color-sentinment">Sentiments For Topic</h2>}
        {showSubTopicChart &&<h2 className="text-color-sentinment">Sentiments For SubTopic</h2>}   
        <div className='sentimentStyle'>   
        <div className='positiveSentiment'>    
        <Doughnut
       data = {positiveSentimentData}
       plugins = {[backgroundCircle,addPositiveTextCenter]}  
       options={sentimentOptions}
       />
       </div>  

       <div className='negativeSentiment'>    
       <Doughnut
       data = {negativeSentimentData}
       plugins = {[backgroundCircle,addNegativeTextCenter]}  
       options={sentimentOptions}
       />
       </div>  

       <div className='neutralSentiment'>    
       <Doughnut
       data = {neutralSentimentData}
       plugins = {[backgroundCircle,addNeutralTextCenter]}  
       options={sentimentOptions}
       />
       </div>  

       </div>

       <div className="hortDivider"></div>

       <div>

       
       {!showSubTopicChart &&<h3 className='text-color-table'>Comments For Topic:</h3>}
       {!showSubTopicChart &&<p className='style_topic_name'>{selectedTopic}</p>}       
       {showSubTopicChart &&<h3 className='text-color-table'>Comments For SubTopic:</h3>}
       {showSubTopicChart && <p className='style_subtopic_name'>{selectedTopic}</p>}
       {/* <h3 className='text-color-table'>Selected Topic: {selectedTopic}</h3> */}


        {/* {hasTableData && <table className="comments-table__table">
        <thead>
          <tr>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {storeTableData.map((comments,index) => (
              <tr key={index}>
              <td>
                {comments}
              </td>
            </tr>

))}
        </tbody>
      </table>} */}
             {/* <Table data={storeTableData} rowsPerPage={4} /> */}

        
        <div className='tableStyle'>
        <table className="styled-table">
        <thead>
          <tr>
            {/* <th>Selected Topic : {selectedTopic} </th> */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((comments,i) => (
            <tr key={i}>
              <td style={{fontWeight:'bold',
              color: getRowColor(getSentiment(comments)[0])}}>{comments}</td>
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
     

        </div>
    );
};

export default TopicsChart;