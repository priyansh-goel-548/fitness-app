import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { getWorkoutsQuery } from './history';
import workout from '@/sanity/schemaTypes/workout';
import { formatDuration } from '@/lib/utils';


export default function TabOneScreen() {
  const { user } = useUser();
  const router = useRouter();
  const[workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try{
      const results = await client.fetch(getWorkoutsQuery, {userId: user.id});
      setWorkouts(results);
    } catch (error) {
      console.error("Error fetching workouts: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  //Calculate stats
  const totalWorkouts = workouts.length;
  const lastWorkout = workouts[0];
  const totalDuration = workouts.reduce(
    (sum, workout) => (workout.duration || 0), 0
 );

 const averageDuration =
      totalWorkouts > 0 ? Math.round(totalDuration/ totalWorkouts) : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if(date.toDateString() === today.toDateString()){
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()){
      return 'Yesterday';
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      });
    }
  };

  const getTotalSets = (workout: GetWorkoutQueryResult[number]) => {
    return (
      workout.exercise?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  if(loading){
    return (
      <SafeAreaView className = "flex-1 bg-gray-50">
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size= "large" color= "#3B82F6"/>
          <Text className='text-gray-600 mt-4'> Loading yoour stats...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <ScrollView
      className='flex-1'
      refreshControl={
        <RefreshControl refreshing = {refreshing} onRefresh={onRefresh}/>
      }>
        {/*Header*/}
        <View className='px-6 pt-8 pb-6'>
          <Text className='text-lg text-gray-600'>Welcome back,</Text>
          <Text className='text-3xl font-bold text-gray-900'>{user?.firstName || "Athlete"}</Text>
        </View>

        {/*Stats Overview*/}
        <View className='px-6 mb-6'>
          <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
            <Text className='text-lg fony-semibold text-gray-900 mb-4'>
              Your Stats
            </Text>
            <View className='flex-row justify-between'>
              <View className='items-center flex-1'>
                <Text className='text-2xl font-bold text-blue-600'>
                  {totalWorkouts}
                </Text>
                <Text className='text-sm text-gray-600 text-center'>
                  Total{"\n"}Workouts
                </Text>
              </View>
              <View className='items-center flex-1'>
                <Text className='text-2xl font-bold text-green-600'>
                  {formatDuration(totalDuration)}
                </Text>
                <Text  className='text-sm text-gray-600 text-center'>Total{"\n"}Time</Text>
              </View>
              <View className='items-center flex-1'>
                <Text className='text-2xl font-bold text-purple-600'>
                  {averageDuration > 0 ? formatDuration(averageDuration) : "0m"}
                </Text>
                <Text className='text-sm text-gray-600 text-center'>Average{"\n"}Duration</Text>
              </View>
            </View>
          </View>
        </View>

        {/*Quick Actions */}
        <View className='px-6 mb-6'>
          <Text className='text-lg font-semibold text-gray-900 mb-4'>
            Quick Actions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
