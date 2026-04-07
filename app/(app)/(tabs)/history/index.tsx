import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { client } from "@/src/lib/sanity/client";
import { defineQuery } from "groq";
import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { formatDuration } from "../../../lib/utils";
import { Ionicons } from "@expo/vector-icons";
import exercise from "@/sanity/schemaTypes/exercise";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const getWorkoutsQuery = defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
  _id,
  date,
  duration,
  exercises[}{
  exercises->{
  _id,
  name,
  },
  sets[]{
  weight,
  reps,
  weightUnit,
  _type,
  _key
  },
  _type,
  _key
  }
}`);

export default function HistoryPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<getWorkoutsQuery>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refresh} = useLocalSearchParams();
  const router = useRouter();

  const fetchWorkouts = async () => {
    if(!user?.id) return;

    try{
      const results = await client.fetch(getWorkoutsQuery, {userId: user.id});
      setWorkouts(results);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {      
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  useEffect(() => {
    if(refresh === "true"){
      fetchWorkouts();
      //clear the refresh param after fetching from the url
      router.replace("/(app)/(tabs)/history?refresh=false");
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    };

    const formatWorkoutDuration = (seconds?: number) => {
      if(!seconds) return "Duration not rercorded";
      return formatDuration(seconds);
    };

    // const getTotalSets = (workout: getWorkoutsQuery[number]) => {
    //   return workout.exercises?.reduce((total, exercise) => total + (exercise.sets?.length || 0), 0) || 0;
    // };

    const getExerciseNames = (workout: getWorkoutsQuery[number]) => {
      return (workout.exercises?.map((ex) => ex.exercises?.name).filter(Boolean) || []);    
    };

    if(loading){
      return (
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="px-6 py-4 bg-white border-b border-gray-200">
            <Text className="text-2xl font-bold text-gray-900">
              Workout History
            </Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color = "#3B82F6"/>
            <Text>Loading your workouts... </Text>
          </View>
        </SafeAreaView>
      );
    }
   
    return (
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar barStyle="dark-content" backgroundColor="white"/>
            {/* Header */}
            <View className="px-6 py-4 bg-white border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900">
                    Workout History
                </Text>
                <Text className="text-gray-600 mt-1">
                    {workouts.length} workout{workouts.length !== 1 ? "s" : ""} completed
                </Text>
            </View>

            {/* Workout List */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 24 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
                {workouts.length === 0 ? (
                  <View className="bg-white rounded-2xl p-8 items-center">
                    <Ionicons name="barbell-outline" size={64} color="#9CA3AF" />
                    <Text className="text-xl font-semibold text-gray-900 mt-4">
                      No workouts recorded yet. Start your fitness journey today!
                    </Text>
                    <Text className="text-gray-600 text-center mt-2">
                      Track your progress and achieve your fitness goals.
                    </Text>
                  </View>
                ) : (
                  <View className="space-y-4 gap-4">
                    {workouts.map((workout: getWorkoutsQuery[number]) => (
                      <TouchableOpacity key={workout._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                      activeOpacity={0.7}
                      onPress={() => {
                        router.push({
                          pathname: "./workout-record",
                          params: { workoutId: workout._id, },
                        });
                      }}
                      >
                        {/* Workout header*/}
                        <View className="flex-row items-center justify-between mb-4">
                          <View>
                            <Text className="text-lg font-semibold text-gray-900">
                              {formatDate(workout.date || "")}
                            </Text>
                            <View className="flex-row items-center mt-1">
                              <Ionicons name="time-outline" size={16} color="#6B7280" />
                              <Text className="text-gray-600 ml-2">
                                {formatWorkoutDuration(workout.duration)}
                              </Text>
                            </View>
                          </View>
                          <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
                            <Ionicons name= "fitness-outline" size={24} color="#3B82F6" />
                          </View>
                        </View>

                        {/*Workout Stats*/}
                        <View className="flex-row items-center justify-betweenmb-4">
                          <View className="flex-row items-center">
                            <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                              <Text className="text-sm font-medium text-gray-700">
                                {workout.exercises?.length || 0} exercises
                              </Text>
                            </View>
                            <View className="bg-gray-100 rounded-lg px-3 py-2">
                              <Text className="text-sm font-medium text-gray-700">
                                {getTotalSets(workout)} sets
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/*Workout list */}
                        {workout.exercises && workout.exercises.length > 0 && (
                          <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                              Exercises:
                            </Text>
                            <View className="flex-row flex-wrap">
                              {getExerciseNames(workout)
                              .slice(0, 3)
                              .map((name, index) => (
                                <View key={index} className="bg-blue-50 rounded-lg  px-3 py-1 mr-2 mb-2">
                                  <Text className="text-sm text-blue-700 font-medium">{name}</Text>
                                </View>
                              ))}
                              {getExerciseNames(workout).length > 3 && (
                                <View className="bg-gray-100 rounded-lg  px-3 py-1 mr-2mb-2 ">
                                  <Text className="text-sm text-gray-600 font-medium">+{getExerciseNames(workout).length - 3} more 
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                         )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}