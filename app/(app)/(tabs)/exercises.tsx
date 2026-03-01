import React, { useEffect, useState } from 'react'
import { SafeAreaView} from 'react-native-safe-area-context'
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View, } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import { defineQuery } from 'groq'
import { client } from '@/src/lib/sanity/client'
import ExerciseCard from '@/app/components/ExerciseCard'
import { Exercise } from '@/sanity/sanity.types';
import exercise from '@/sanity/schemaTypes/exercise';

export const exercisesQuery = defineQuery(`*[_type == "exercise"]{
  _id,
  title,
  description
}`)

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const fetchExercises = async () => {
    try {
      //fetch data from sanity

      const exercises = await client.fetch(exercisesQuery);
      setExercises(exercises)
      setFilteredExercises(exercises)
    } catch (error) {
      console.error('Error fetching exercises:', error)
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // useEffect(() => {
  //   const filtered = exercises.filter((exercise: Exercise) => 
  //     exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredExercises(filtered);
  // }, [searchQuery, exercises])

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      {/*Header section*/}
      < View className='px-6 py-4 bg-white border-b border-gray-200'>
        <Text className='text-2xl font-bold text-gray-900'>Exercises Library</Text>
        <Text className='text-gray-600 mt-1'>Browse and track your workouts</Text>

        {/*Search bar*/}
        <View className='flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4 border'>
          <Ionicons name="search" size={20} color="#6B7280"/>
          <TextInput
            className='flex-1 ml-3 text-gray-800'
            placeholder='Search exercises...'
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#6B7280"/>
              </TouchableOpacity>
            )}
        </View>
      </View>

      {/*Exercises list section*/}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({item}) => (
          <ExerciseCard item = {item}
          onPress={() => router.push(`/exercise-detail/${item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3BB2F6"]} //Android 
            tintColor="#3BB2F6" //iOS
            title="Pull to refresh exercises" //ios
            titleColor="#6B7280" //ios
            />
        }
        ListEmptyComponent={() => (
          <View className='items-center bg-white rounded-2xl p-8'>
            <Ionicons name="fitness-outline" size={64} color="#9CA3AF"/>
            <Text className='text-gray-900 mt-4 text-xl font-semibold'>{searchQuery? "No exercises found": "Loading Exercises"}</Text>
            <Text className='text-gray-600 text-center mt-2'>
              {searchQuery ? `We couldn't find any exercises matching "${searchQuery}". Please try a different search term.` : "Please wait while we load the exercises for you."}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
