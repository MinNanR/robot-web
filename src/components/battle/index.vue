<template>
  <div class="content">
    <div id="charts" style="margin-top: 30px">
      <div id="myChart" style="width: 80vw; height: 600px"></div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      uploadUrl: "",
      chartData: {
        "damage": [
          0,
          0,
          0,
          61518,
          61518,
          61518,
          74332,
          144376,
          226350,
          282450,
          309506,
          309506,
          335899,
          2300231,
          2674693,
          3352544,
          4012304,
          4410970,
          4690454,
          5006751,
          5397497,
          5655284,
          5984248,
          6247485,
          6484645,
          6673273,
          6879304,
          7169313,
          7362616,
          7618658,
          7777847,
          8021131,
          8179990,
          8378341,
          8520233,
          8820098,
          8998854,
          9282008,
          9491405,
          9759499,
          9945530,
          10236267,
          10436167,
          10716726,
          10892307,
          11160995,
          11317492,
          11468309,
          11654314,
          11823560,
          12007850,
          12198217,
          12370239,
          12555516,
          12783508,
          12890934,
          13066820,
          13203627,
          13265498,
          13356542,
          13504961,
          13668495,
          13796562,
          14016616,
          14114083,
          14206477,
          14324750,
          14454367,
          14556743,
          14666243,
          14803541,
          14804615,
          15123589,
          15452588,
          15704481,
          15795102,
          15886609,
          16067190,
          16169002,
          16292058,
          16395213,
          16494273,
          16622069,
          16669340,
          16778395,
          16966919,
          17079943,
          17229459,
          17345205,
          17345205,
          17461066,
          17613962,
          17722702,
          17860310,
          17950735,
          18043810,
          18238589,
          18340415,
          18474453,
          18601159,
          18704884,
          18800302,
          18870527,
          18966359,
          19108841,
          19294829,
          19389268,
          19422258,
          19498836,
          19646300,
          19760121,
          19866093,
          19977420,
          20115359,
          20341329,
          20471979,
          20589990,
          20707848,
          20808261,
          20942458,
          21038638,
          21087170,
          21087170,
          21087170
        ],
        "differ": [
          0,
          0,
          0,
          61518,
          0,
          0,
          12813,
          70044,
          81973,
          56100,
          27055,
          0,
          26392,
          1964332,
          374462,
          677850,
          659759,
          398666,
          279483,
          316297,
          390745,
          257786,
          328963,
          263237,
          237159,
          188628,
          206030,
          290009,
          193302,
          256042,
          159188,
          243283,
          158859,
          198350,
          141892,
          299864,
          178756,
          283153,
          209396,
          268093,
          186030,
          145368,
          199900,
          280559,
          175580,
          268688,
          156496,
          150817,
          186005,
          169245,
          184289,
          190367,
          172021,
          185277,
          227991,
          107426,
          175885,
          136807,
          61871,
          91044,
          148419,
          163533,
          128066,
          220053,
          97467,
          92394,
          118273,
          129616,
          102375,
          109499,
          137298,
          1074,
          318973,
          328999,
          251892,
          90621,
          91506,
          180581
        ]
      }
    };
  },
  methods: {
    drawChart(data) {
      console.log(data)
      // 基于准备好的dom，初始化echarts实例【这里存在一个问题，请看到最后】
      let chart = this.$echarts.init(document.getElementById("myChart"));
      // 指定图表的配置项和数据
      let option = {
        legend: {
          data: ["总伤害（M)", "DPS（M）"],
          inactiveColor: "#777",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            animation: false,
            type: "cross",
            lineStyle: {
              color: "#376df4",
              width: 2,
              opacity: 1,
            },
          },
        },
        xAxis: {
          type: "category",
          data: data.timeList,
          axisLine: { lineStyle: { color: "#8392A5" } },
        },
        yAxis: [{
          type: "value",
          scale: true,
          axisLine: { lineStyle: { color: "#8392A5" } },
          splitLine: { show: false },
        }, {
          type: "value",
          scale: true,
          axisLine: { lineStyle: { color: "#8392A5" } },
          splitLine: { show: false },
        }],
        grid: {
          bottom: 80,
        },
        dataZoom: [
          {
            type: "inside",
            start: 90,
            end: 100,
          },
          {
            textStyle: {
              color: "#8392A5",
            },
            handleIcon:
              "path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            dataBackground: {
              areaStyle: {
                color: "#8392A5",
              },
              lineStyle: {
                opacity: 0.8,
                color: "#8392A5",
              },
            },
            brushSelect: true,
            start: 90,
            end: 100,
          },
          {
            type: "inside",
          },
        ],
        series: [
          {
            type: "line",
            name: "总伤害（M)",
            data: data.damage,
            smooth: true,
            showSymbol: false,
            // itemStyle: {
            //   color: "#FD1050",
            //   color0: "#0CF49B",
            //   borderColor: "#FD1050",
            //   borderColor0: "#0CF49B",
            // },
            yAxisIndex: 0
          },
          {
            name: "DPS（M）",
            type: "line",
            data: data.differ,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
            yAxisIndex: 1
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option);
      document.getElementById("myChart").removeAttribute("_echarts_instance_");
    },
    getData() {
      this.request.post("/miao-api/battle/getBattleData", { path: 'F:\\Minnan\\miao-manage\\loopdata\\Illium\\sec_data.json' }).then((response) => {
        let data = response.data;
        this.drawChart(data);
      });
    }
  },


  created() {
    this.$nextTick(() => {
      this.getData()
    })
  },
  mounted() {

  }
}

</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding-bottom: 10px;
}

/* 
.el-input {
  width: 300px;
} */

.infinite-list {
  height: 70vh;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background: var(--el-color-primary-light-9);
  margin: 5px;
  /* color: var(--el-color-primary); */
  cursor: pointer;
}


.infinite-list .infinite-list-item+.list-item {
  margin-top: 10px;
}
</style>