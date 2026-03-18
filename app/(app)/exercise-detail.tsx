import { View, Text, StatusBar, TouchableOpacity, ScrollView, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Exercise } from '@/sanity/sanity.types'
import { client, urlFor } from '@/src/lib/sanity/client'
import { defineQuery } from "groq"

const singleExerciseQuery = defineQuery(
    `*[_type == "exercise" && _id == $id][0]`
)

export default function ExerciseDetail() {
    const router = useRouter();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [aiGuidance, setAiGuidance] = useState<string>("");
    const [aiLoading, setAiLoading] = useState(false);
    const {id} = useLocalSearchParams<{
        id: string;
    }>();

    useEffect(() => {
        const fetchExercise = async () => {
            if(!id) return;

            try{
                const exerciseData = await client.fetch(singleExerciseQuery, { id });
                setExercise(exerciseData);
            }catch (error){
                console.error("Error fetching exercise:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [id]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle="light-content" backgroundColor="#000"/>

      {/*Header with close button*/}
      <View className = "absolute top-12 left-0 right-0 z-10 px-4">
        <TouchableOpacity
        onPress={()=> router.back()}
        className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
        >
            <Ionicons name="close" size = {24} color = "white"/>
        </TouchableOpacity>
      </View>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator= {false}>

            {/* Hero Image*/}
            <View className='h-80 bg-white relative'>
                {exercise?.image?.asset?._ref ? (
                    <Image 
                        source = {{uri: urlFor(exercise.image.asset._ref).url()}}
                        className="w-full h-full"
                        resizeMode="contain"/>
                ) : (
                    <View className='w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center'>
                        <Ionicons name = "fitness" size={80} color="white"/>
                    </View>
                )}
                {/* Gradient Overlay*/}
                <View className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent'/>
            </View>
      </ScrollView>
    </SafeAreaView>
  );
}