import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'workout',
    title: 'Workout',
    type: 'document',
    icon: () => '🏋️‍♀️',
    fields: [
        defineField({
            name: 'userId',
            title: 'User ID',
            type: 'string',
            description: 'Clerk user ID',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Date',
            description: 'The date and time when the workout was performed',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'durationSeconds',
            title: 'Duration (seconds)',
            description: 'The total duration of the workout in seconds',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'exercises',
            title: 'Exercises',
            description: 'The list of exercises performed in this workout',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'exercise',
                            title: 'Exercise',
                            description: 'Reference to the exercise performed',
                            type: 'reference',
                            to: [{type: 'exercise'}],
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'reps',
                            title: 'Reps',
                            description: 'The number of repetitions performed for this exercise',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(0),
                        }),
                        defineField({
                            name: 'weight',
                            title: 'Weight',
                            description: 'The weight used for this exercise (if applicable)',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(0),
                        }),
                        defineField({
                            name: 'weightUnit',
                            title: 'Weight Unit',
                            description: 'The unit of weight used (e.g., lbs or kg)',
                            type: 'string',
                            options: {
                                list: ['lbs', 'kg'],
                            layout: 'radio',
                            },
                            initialValue: 'lbs',
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: {
                            exercise: 'exercise.name',
                            reps: 'reps',
                            weight: 'weight',
                            unit: 'weightUnit',
                        },
                        prepare(selection) {
                            const {exercise, reps, weight, unit} = selection
                            return {
                                title: exercise,
                                subtitle: `${reps} reps × ${weight} ${unit}`,
                            }
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            userId: 'userId',
            date: 'date',
            exerciseCount: 'exercises.length',
        },
        prepare(selection) {
            const {userId, date, exerciseCount} = selection
            return {
                title: `Workout - ${new Date(date).toLocaleDateString()}`,
                subtitle: `${exerciseCount || 0} exercises • User: ${userId?.slice(0, 8)}...`,
            }
        },
    },
})