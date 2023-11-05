import { View, Text, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { LineChart } from "react-native-chart-kit-chz"
import { ExerciseRecordUser } from '../../@types/Workout'
import dayjs from 'dayjs'
import Button from '../../components/Button'
import { Entypo } from '@expo/vector-icons';

dayjs().locale('pt-PT')

export default function Charts() {
  
  const screenWidth = Dimensions.get('window').width
  const now = new Date()
  const [exerciseData, setExerciseData] = useState<ExerciseRecordUser>({
    PR: 120,
    weightData: [
      {
        date: dayjs(now).add(-5, 'month').toDate(),
        weight: 5
      },
      {
        date: dayjs(now).add(-4, 'month').toDate(),
        weight: 7.5
      },
      {
        date: dayjs(now).add(-3, 'month').toDate(),
        weight: 10
      },
      {
        date: dayjs(now).add(-2, 'month').toDate(),
        weight: 10
      },
      {
        date: dayjs(now).add(-1, 'month').toDate(),
        weight: 12.5
      },
      {
        date: new Date(),
        weight: 10
      },
    ]
  })

  return (
    <View className='bg-neutral-50 h-full w-full'>
      <Text className='text-center font-semibold text-neutral-950 text-lg'>Supino Reto com Halter</Text>
      <LineChart
        data={{
          labels: exerciseData.weightData.map((d) => dayjs(d.date).format('DD/MM')), // Bottom Labels
          datasets: [
            {
              data: exerciseData.weightData.map((d) => d.weight), // Data for Chart 
              amount: exerciseData.weightData.map((d) => d.weight), //Amount show on the ToolTip
              color: "#004579", // Chart Line Color
              currency: "KG", //Currency to show before amount , 
              id: 1, //ID
            },
          ],
        }}
        onPointPress={(d: any) => {
        }}
        selectedDotColor="blue"
        width={screenWidth}
        height={200}
        chartConfig={{
          decimalPlaces: 1,
          color: `#004579`,
          fontFamily: "",
        }}
        bezier
        style={{
          marginVertical: 30,
        }}
      />
      <View className='flex-row items-center justify-around'>
        <Button
          className='mx-6'
          size='sm'
        >
          <Entypo name="chevron-left" size={25} color="white" />
        </Button>
        <Button
          className='mx-6'
          size='sm'
        >
          <Entypo name="chevron-right" size={25} color="white" />
        </Button>
      </View>
    </View>
  )
}

/*
<VictoryScatter
    style={{ data: { fill: "#c43a31" } }}
    size={9}
    labels={() => null}
    events={[{
      target: "data",
      eventHandlers: {
        onClick: () => {
          return [
            {
              target: "data",
              mutation: (props) => {
                const fill = props.style && props.style.fill;
                return fill === "black" ? null : { style: { fill: "black" } };
              }
            }, {
              target: "labels",
              mutation: (props) => {
                return props.text === "clicked" ?
                  null : { text: "clicked" };
              }
            }
          ];
        }
      }
    }]}
    data={sampleData}
  />
*/