import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'exercise',
    title: 'Exercise',
    type: 'document',
    icon: () => '🏋️‍♂️',
    fields: [
        defineField({
            name: 'name',
            title: 'Exercise Name',
            description: 'The name of the exercise that will be displayed to users',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'A detailed description of how to perform the exercise',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'difficulty',
            title: 'Difficulty',
            description: 'The difficulty level of the exercise',
            type: 'string',
            options: {
                list: [
                    {title: 'Beginner', value: 'beginner'},
                    {title: 'Intermediate', value: 'intermediate'},
                    {title: 'Advanced', value: 'advanced'},
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            description: 'Optional image representing the exercise',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            description: 'Optional URL to a video demonstrating the exercise',
            type: 'string',
        }),
        defineField({
            name: 'isActive',
            title: 'Is Active',
            description: 'Indicates if the exercise is currently active and should be displayed in the app',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            subtitles: 'difficulty',
        },
    },
})