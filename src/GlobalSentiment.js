import { Chart as ChartJS,Tooltip, Legend, BarElement, CategoryScale,LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import './GlobalSentiment.css';
import { useEffect, useState } from "react";

ChartJS.register(Tooltip, Legend,BarElement, CategoryScale,LinearScale);
ChartJS.register(ChartDataLabels);

const GlobalSentiment = (props) => {

  var data = props.message;
  const [barData, setBarData] = useState([]);

  useEffect(() => {

    var sentiments = [];

    if (data.length > 0) {
      const extractedColumnData = data.map((row) => row['Sentiment']);

      if (extractedColumnData.length > 0) 
      {
        var p=0,n=0,neu=0;
    
          for(var i =0;i<extractedColumnData.length;i++)
          {
            if(extractedColumnData[i] === 'positive')
              p++;
            else if(extractedColumnData[i] === 'negative')
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
      }
      setBarData(sentiments);
}
},[data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display:false,
      },
      tooltip:
      {
        enabled:false,
      },
    },
    scales:{
      x:{
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
      y:{
        ticks:
        {
          color:'white'
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
    },
  };

  const labels = ['Positve','Neutral','Negative'];

const data1 = {
  labels,
  datasets: [
    {
      data: barData,
      backgroundColor: [
        '#00FF00',
        '#FAFA33',
        '#FF4433',
      ],
      datalabels:
      {
        color:'white',
        anchor:'end',
        align:'top',
        formatter: function(value){
          return value + '%';
      },
      font: {
        weight: 'bold',
        size: 15,
    }
    }
  }
  ],
};


  return (
    <div className="container">
       <h2 className="text-color">Global Sentiment Index</h2> 
       <div className="barChartStyle">
        <Bar data={data1} options={options}/>
       </div>
      {/* <CustomSegmentLabels/> */}
    </div>
  );
  };
  
  export default GlobalSentiment;
  




