import React from 'react'
import { Platform, StatusBar, Text, TouchableOpacity, View, Alert} from 'react-native'
import { useStopwatch } from 'react-timer-hook';
import { useWorkoutStore } from '@/store/workout-store';
import { useFocusEffect, useRouter } from '@/.expo/types/router';

function ActiveWorkout() {

  const {
    workoutExercises,
    setWorkoutExercises,
    weightUnit,
    setWeightUnit,
    resetWorkout,
   } = useWorkoutStore();

   const router = useRouter();

   // Stopwatch state and functions
  const { seconds, minutes, hours, totalSeconds, reset } = useStopwatch({ autoStart: true });

//Reset timer when workout exercises are reset
useFocusEffect(
  React.useCallback(() => {
    //Only reset if there are no exercises, (indicates a fresh start after ending the workout)
    if (workoutExercises.length === 0) {
      reset();
    }
  }, [workoutExercises.length, reset])
);

  const getWorkoutDuration = () => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const cancelworkout = () => {
    Alert.alert(
      "Cancel Workout",
      "Are you sure you want to cancel this workout? All progress will be lost.",
      [
        { text: "No", style: "cancel" },
        { text: "End Workout",
          onPress: () => {
            resetWorkout();
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View className='flex-1'>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937"/>

        {/*Top Safe Area */}
        <View className='bg-gray-800'
        style={{
          paddingTop: Platform.OS === 'android' ? 55 :StatusBar.currentHeight || 0,
        }}>

          {/*Header */}

          <View className = "bg-gray-800 px-6 py-4">
            <View className='flex-row items-center justify-between'>
              <View>
                <Text className='text-white text-xl font-semibold'>Active Workout</Text>
                <Text className='text-gray-300'>
                  {getWorkoutDuration()}
                </Text>
              </View>
              <View className='flex-row items-center space-x-3 gap-2'>
                {/* Weight unit toggle */}
                <View className='flex-row bg-gray-700 rounded-lg p-1'>
                  <TouchableOpacity
                  onPress={() => setWeightUnit("lbs")}
                  className={`px-3 py-1 rounded ${weightUnit === "lbs" ? "bg-blue-600" : ""}`}>
                    <Text className={`text-sm font-medium ${weightUnit === "lbs" ? "text-white" : "text-gray-300"}`}>
                      lbs
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={() => setWeightUnit("kg")}
                  className={`px-3 py-1 rounded ${weightUnit === "kg" ? "bg-blue-600" : ""}`}>
                    <Text className={`text-sm font-medium ${weightUnit === "kg" ? "text-white" : "text-gray-300"}`}>
                      kg
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                onPress={cancelworkout}
                className='bg-red-600 px-4 py-2 rounded-lg'>
                  <Text className="text-white font-medium">
                    End workout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          
        </View>
    </View>
  )
}
export default ActiveWorkout
