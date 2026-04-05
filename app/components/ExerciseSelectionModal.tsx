import { View, Text, Modal, StatusBar, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from '@/.expo/types/router';
import { useWorkoutStore } from '@/store/workout-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ExerciseSelectionModal({ isVisible, onClose }: ExerciseSelectionModalProps) {

    const router = useRouter();
    const {addExerciseToWorkout} = useWorkoutStore();
    const [exercises, setExercises] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
    const [rrefreshing, setRefreshing] = useState(false);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
        <SafeAreaView className=' flex-1 bg-white'>
            <StatusBar barStyle="dark-content"/>

            {/*Header*/}
            <View className='bg-white px-4 pt-4 pb-6 shadow-sm border-b border-gray-100'>
                <View className='flex-row items-center justify-between mb-4'>
                    <Text>
                        Add Exercise
                    </Text>
                    <TouchableOpacity
                    onPress={onClose}
                    className='w-8 h-8 items-center justify-center'>
                    <Ionicons name="close" size = {24} color = "#6B7280"/>
                    </TouchableOpacity>
                </View>
                <Text className='text-gray-600 mb-4'>
                    Tap any exercise to add it to your workout
                </Text>

                {/*Search Bar*/}
                <View className=' flex-row items-center bg-gray-100 rounded-xl px-4 py-3'>
                    <Ionicons name= "search" size= {20} color = "#6B7280"/>
                    <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder = "Search Exercise..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}/>
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons class="close-circle" size={20} color="#6B7280"/>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    </Modal>
  )
}