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

const TopicsChart = (props) => {

    var data = props.message;
    var selectedTopicComments = [];;
    var selectedTopicSubs = [];
    var selectedSubTopicComments = [];
    const [chartData, setChartData] = useState({});  
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedComments, setSelectedComments] = useState([]);
    const [selectedSubTopics, setSelectedSubTopics] = useState([]);
    const [subTopicChartData, setSubTopicChartData] = useState({});
    const [showSubTopicChart, setShowSubTopicChart] = useState(false);
    const [showPositiveChart, setShowPositiveChart] = useState(false);
    const [showNegativeChart, setShowNegativeChart] = useState(false);
    const [showNeutralChart, setShowNeutralChart] = useState(false);
    const [SubTopicSelected, setSubTopicSelected] = useState("");
    const [hasTableData, sethasTableData] = useState(false);
    const [storeTableData, setstoreTableData] = useState([]);
    const [selectedTopicSentiments, setSelectedTopicSentiments] = useState([]);
    const [selectedCommentsSubTopics, setSelectedCommentsSubTopics] = useState([]);
    const [showSubTopicColumn, setShowSubTopicColumn] = useState(false);
    const [positiveVal, setPositiveVal] = useState(0);
    const [negativeVal, setNegativeVal] = useState(0);
    const [neutralVal, setNeutralVal] = useState(0);

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


      const handleTopicsOnHoverEvent = (e, activeElements, chart) => {
        if (activeElements[0]) {
          let ctx = activeElements[0].element.$context;
          let topic = chart.data.labels[ctx.dataIndex];
          const filteredResults = data.filter((row) => row['Topics'] === topic)
          selectedTopicComments = filteredResults.map((item) => item.Comments);
          selectedTopicSubs = filteredResults.map((item) => item.SubTopics);

          if (selectedTopicComments.join(',') !== storeTableData.join(',')) {
            setstoreTableData(selectedTopicComments);
          }

          if (selectedTopicSubs.join(',') !== selectedSubTopics.join(',')) {
            setSelectedSubTopics(selectedTopicSubs);
          }

          sethasTableData(true);
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
    
          setPositiveVal(((p/(p+n+neu))*100).toFixed(2));
          setNegativeVal(((n/(p+n+neu))*100).toFixed(2));
          setNeutralVal(((neu/(p+n+neu))*100).toFixed(2));
          setShowPositiveChart(true);
          setShowNegativeChart(true);
          setShowNeutralChart(true);
        }
      };


    const handleOnHoverEvent = (e, activeElements, chart) => {
        if (activeElements[0]) {
          let ctx = activeElements[0].element.$context;
          let label = chart.data.labels[ctx.dataIndex];
          setSubTopicSelected(label);
          setSelectedTopic(label);

          console.log(storeTableData);

          selectedComments.map((comments, index) => {

            // selectedSubTopicComments.push(comments)
            if(selectedSubTopics[index] === label)
              selectedSubTopicComments.push(comments);
        });

          // const subtopics = storeTableData.filter((row) =>  === topic);
          
          // if (selectedSubTopicComments.join(',') !== selectedCommentsSubTopics.join(',')) {
          //   setSelectedCommentsSubTopics(selectedSubTopicComments);
          // }

          if (selectedSubTopicComments.join(',') !== storeTableData.join(',')) {
            setstoreTableData(selectedSubTopicComments);
          }
          setCurrentPage(1);

          var selectedSubTopicSentiments = [];
          selectedTopicSentiments.map((sentiment, index) => {

            // selectedSubTopicComments.push(comments)
            if(selectedSubTopics[index] === label)
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
    
          setPositiveVal(((p/(p+n+neu))*100).toFixed(2));
          setNegativeVal(((n/(p+n+neu))*100).toFixed(2));
          setNeutralVal(((neu/(p+n+neu))*100).toFixed(2));
          setShowPositiveChart(true);
          setShowNegativeChart(true);
          setShowNeutralChart(true);
        }
          
      };

    const handleSubTopicSectionClick = (event, elements) => {
        sethasTableData(false);
        setShowSubTopicChart(false);
        setShowSubTopicColumn(false);
      };  

    const handleSectionClick = (event, elements) => {
        if (elements && elements.length > 0) {
          console.log(elements[0].index);
          const index = elements[0].index;
          const topic = chartData.labels[index];
          // setSelectedTopic(topic)
    
          const filteredResults = data.filter((row) => row['Topics'] === topic)
          setSelectedComments(filteredResults.map((item) => item.Comments));
          // setSelectedSubTopics(filteredResults.map((item) => item.SubTopics));
          
    
          const subtopics = data.filter((row) => row['Topics'] === topic).map((row) => row['SubTopics']);
          
    
    
          if (subtopics.length > 0 && subtopics[0] != 'N/A') {
            const uniqueSubTopicsValues = [...new Set(subtopics)];
            const countsSubTopics = uniqueSubTopicsValues.map((value) =>
            subtopics.filter((v) => v === value).length
            );
    
    
          setSubTopicChartData({
            labels: uniqueSubTopicsValues,
            datasets: [
              {
                data: countsSubTopics,
                backgroundColor: function(context) {
                  
                  const colorIndex = context.dataIndex % subTopicGradientColors.length;
                  let c = subTopicGradientColors[colorIndex];
              
                    const mid = color(c).desaturate(0.4).darken(0.3).rgbString();
                    const start = color(c).lighten(0.5).rotate(270).rgbString();
                    const end = color(c).lighten(0.1).rgbString();
                    return getGradient(context, start, mid, end);
                }, 
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
          setShowSubTopicColumn(true);
        }
        sethasTableData(true);
      }};  

    useEffect(() => {
        if (data.length > 0) {
          const extractedColumnData = data.map((row) => row['Topics']);

          if (extractedColumnData.length > 0) {
            const uniqueValues = [...new Set(extractedColumnData)];
            const counts = uniqueValues.map((value) =>
            extractedColumnData.filter((v) => v === value).length
            );
      
            setChartData({
              labels: uniqueValues,
              datasets: [
                {
                  data: counts,
                  backgroundColor: function(context) {
                    
                    const colorIndex = context.dataIndex % gradientColors.length;
                    let c = gradientColors[colorIndex];
                
                      const mid = color(c).desaturate(0.4).darken(0.3).rgbString();
                      const start = color(c).lighten(0.5).rotate(270).rgbString();
                      const end = color(c).lighten(0.1).rgbString();
                      return getGradient(context, start, mid, end);
                  },
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
        onHover : handleTopicsOnHoverEvent,
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
        onHover : handleOnHoverEvent
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
            data: [positiveVal,100-positiveVal],
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
            data: [negativeVal,100-negativeVal],
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
            data: [neutralVal,100-neutralVal],
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
      setTotalPages(Math.ceil(storeTableData.length / itemsPerPage));
    };

    fetchData();
  }, [currentPage,storeTableData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  


    return (
        <div>
        <h2 className="text-color-topic">Topic Hierarchy</h2> 
        <div className="topicsContainer">    
        {chartData.labels && chartData.datasets && !showSubTopicChart &&(
          <Doughnut
            data={chartData}
            options = {options}
            // plugins = {[addTextCenter]}
          />
        )}

      {showSubTopicChart && <Doughnut data={subTopicChartData} options = {optionsSubChart} />}
        </div>
        <div className="vertDivider"></div>

        <h2 className="text-color-sentinment">Sentiments By Topic</h2>  
        <div className='sentimentStyle'>   
        <div className='positiveSentiment'>    
       {showPositiveChart && <Doughnut
       data = {positiveSentimentData}
       plugins = {[backgroundCircle,addPositiveTextCenter]}  
       options={sentimentOptions}
       />}
       </div>  

       <div className='negativeSentiment'>    
       {showNegativeChart && <Doughnut
       data = {negativeSentimentData}
       plugins = {[backgroundCircle,addNegativeTextCenter]}  
       options={sentimentOptions}
       />}
       </div>  

       <div className='neutralSentiment'>    
       {showNeutralChart && <Doughnut
       data = {neutralSentimentData}
       plugins = {[backgroundCircle,addNeutralTextCenter]}  
       options={sentimentOptions}
       />}
       </div>  

       </div>

       <div className="hortDivider"></div>

       <div>

       
       <h3 className='text-color-table'>Comments By Topic</h3>
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
            <th>Selected Topic : {selectedTopic} </th>
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
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className = "active" onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>
      </div>

       </div>
     

        </div>
    );
};

export default TopicsChart;