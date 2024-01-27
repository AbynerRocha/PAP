import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { MotiView } from 'moti'

type BarChartProps = {
    data: {
      value: number,
      label: string
    }[]
    animated?: boolean
    color?: string
    width: number,
    height: number,
    barWidth?: number, 
    onPress?: (index: number) => void
    labelColor?: string
    labelSize?: number
}

export default function BarChart({ 
  data, 
  animated=false, 
  height, 
  width, 
  barWidth=20,
  color='rgb(30 64 175)', 
  labelColor='rgb(212 212 212)',
  labelSize=10,
  onPress
}: BarChartProps) {
  
  return (
    <View className='flex-row items-center w-72' style={{ height }}>
      <View className='w-full h-full flex-row items-end justify-around'>
        {data.map((value, idx) => {
          const barHeight = value.value * 22

          const style = {
            width: barWidth,
            height: barHeight,
            backgroundColor: color,
            borderTopStartRadius: 5,
            borderTopEndRadius: 5,
            maxHeight: height
          }
          
          return <Pressable key={idx} className='flex-col items-center'>
            <Text>{value.value}</Text>
            {
              animated 
              ? <MotiView
                style={style}
                from={{ height: 0, opacity: 0 }}
                animate={{ height: barHeight, opacity: 1 }}
                transition={{ type: 'timing', duration: 800 }}
              />
              : <View
                style={style}
              />
            }
            <Text className={`text-[${labelColor}] text-[${labelSize}px] mt-1`}>{value.label}</Text>
          </Pressable>
        })}
      </View>
    </View>
  )
}

/*
<View 
      className='flex-row items-end justify-center h-[150px]'
    > 
      <Pressable className='flex-col items-center' onPress={onPress}>
        <Text className='text-slate-500 text-[11px]'>{dataY}</Text>
        <MotiView
          style={{
            width,
            height: (height*22),
            backgroundColor: 'rgb(30 64 175)',
            marginLeft: 10,
            marginRight: 10,
            borderTopStartRadius: 5,
            borderTopEndRadius: 5,
            maxHeight: 150,
          }}
          from={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: (height*22),
            opacity: 1
          }}

          transition={{
            type: 'timing',
            duration: 800
          }}
        />
        <Text className='mx-3 text-slate-400 text-[10px]'>{dayjs(dataX).locale('pt').format('MMM/YY')}</Text>
      </Pressable>
    </View>
*/