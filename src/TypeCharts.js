import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { color } from 'chart.js/helpers';
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import './TypeCharts.css';

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

const ComparisonGraphs = (props) => {

    var data = props.message;
    const [strengthChartData, setStrengthChartData] = useState({});
    const [improvChartData, setImprovChartData] = useState({});   
    const [oCommChartData, setOCommChartData] = useState({}); 

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
            const topics_strengths = data.filter((row) => row['Type'] === 'Strength').map((row) => row['Topics']);
            // const comments_strengths = data.filter((row) => row['Type'] === 'Strength').map((row) => row['Comments']);

            if (topics_strengths.length > 0) {
              const uniqueValues = [...new Set(topics_strengths)];
              const counts = uniqueValues.map((value) =>
              topics_strengths.filter((v) => v === value).length
              );
        
              setStrengthChartData({
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

            const topics_improv = data.filter((row) => row['Type'] === 'Improvement').map((row) => row['Topics']);
      
            if (topics_improv.length > 0) {
                const uniqueValues_1 = [...new Set(topics_improv)];
                const counts_1 = uniqueValues_1.map((value) =>
                topics_improv.filter((v) => v === value).length
                );
          
                setImprovChartData({
                  labels: uniqueValues_1,
                  datasets: [
                    {
                      data: counts_1,
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

              const topics_OComm = data.filter((row) => row['Type'] === 'Other Comments').map((row) => row['Topics']);

              if (topics_OComm.length > 0) {
                const uniqueValues_2 = [...new Set(topics_OComm)];
                const counts_2 = uniqueValues_2.map((value) =>
                topics_OComm.filter((v) => v === value).length
                );
          
                setOCommChartData({
                  labels: uniqueValues_2,
                  datasets: [
                    {
                      data: counts_2,
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

    },[data]);

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
              size: 7
          }
          },
        },
      };  

    return (
        <div>

            <h2 className="text-color-topic">Topic Hierarchy By Type</h2> 

            <div className="topicsByStrengthContainer">    
            {strengthChartData.labels && strengthChartData.datasets && (
            <Pie
                data={strengthChartData}
                options = {options}
            />
            )}
            </div>

            <div className="topicsByImprovContainer">    
            {improvChartData.labels && improvChartData.datasets && (
            <Pie
                data={improvChartData}
                options = {options}
            />
            )}

            </div>


            <div className="topicsByOCommContainer">    
            {oCommChartData.labels && oCommChartData.datasets && (
            <Pie
                data={oCommChartData}
                options = {options}
            />
            )}

            </div>
        
        </div>
      );
}

export default ComparisonGraphs;